"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { CryptoAsset } from "@/types/crypto";
import { money, compact, percent } from "@/lib/format";
type SortKey = "rank" | "price" | "change24h" | "marketCap" | "volume24h";
const columns: [SortKey, string][] = [
  ["rank", "Rank"],
  ["price", "Price"],
  ["change24h", "24h Change"],
  ["marketCap", "Market Cap"],
  ["volume24h", "24h Volume"],
];
export function Explorer({ assets }: { assets: CryptoAsset[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("rank");
  const [asc, setAsc] = useState(true);
  const rows = useMemo(
    () =>
      assets
        .filter((a) =>
          `${a.name} ${a.symbol}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
        )
        .sort((a, b) => (a[sort] - b[sort]) * (asc ? 1 : -1)),
    [assets, query, sort, asc],
  );
  function header(key: SortKey, label: string) {
    return (
      <th
        key={key}
        scope="col"
        aria-sort={sort === key ? (asc ? "ascending" : "descending") : "none"}
      >
        <button
          onClick={() => {
            setSort(key);
            setAsc(sort === key ? !asc : key === "rank");
          }}
        >
          {label}{" "}
          <span aria-hidden="true">
            {sort === key ? (asc ? "↑" : "↓") : "↕"}
          </span>
        </button>
      </th>
    );
  }
  return (
    <section className="panel">
      <div className="table-toolbar">
        <div>
          <h2 className="font-semibold">Cryptocurrency explorer</h2>
          <p className="muted text-xs mt-2" role="status">
            {rows.length} of {assets.length} assets · Top 100
          </p>
        </div>
        <label className="search-wrap">
          <Search size={16} className="muted" />
          <span className="sr-only">Search cryptocurrencies</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or symbol…"
            type="search"
          />
        </label>
      </div>
      <div
        className="table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Cryptocurrency table"
      >
        <table>
          <thead>
            <tr>
              {header("rank", "Rank")}
              <th scope="col">Coin</th>
              {columns.slice(1).map(([key, label]) => header(key, label))}
            </tr>
          </thead>
          <tbody>
            {rows.map((asset) => (
              <tr
                key={asset.id}
                onClick={(e) => {
                  if (!(e.target as HTMLElement).closest("a"))
                    router.push(`/crypto/${encodeURIComponent(asset.id)}`);
                }}
              >
                <td className="muted">
                  {asset.rank.toString().padStart(2, "0")}
                </td>
                <td>
                  <Link
                    className="coin-cell"
                    href={`/crypto/${encodeURIComponent(asset.id)}`}
                    prefetch={false}
                  >
                    <span
                      aria-hidden="true"
                      className={`coin-icon ${asset.id}`}
                    >
                      {asset.symbol.slice(0, 1)}
                    </span>
                    <span>
                      {asset.name}
                      <small>{asset.symbol}</small>
                    </span>
                  </Link>
                </td>
                <td>{money(asset.price)}</td>
                <td className={asset.change24h >= 0 ? "positive" : "negative"}>
                  {percent(asset.change24h)}
                </td>
                <td>{compact(asset.marketCap)}</td>
                <td>{compact(asset.volume24h)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="empty-state">
            <h3>No assets found</h3>
            <p className="muted mt-3">Try a different coin name or symbol.</p>
            <button className="button mt-5" onClick={() => setQuery("")}>
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
