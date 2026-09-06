import Link from "next/link";
import { getAssets } from "@/lib/crypto";
import { money, percent } from "@/lib/format";
import { EmptyState, SectionHeader } from "@/components/ui";
import { LastUpdated } from "@/components/crypto/last-updated";
import { Explorer } from "@/components/crypto/explorer";
export const metadata = { title: "Crypto Market" };
export default async function CryptoPage() {
  const assets = await getAssets();
  const latestTimestamp = assets.reduce<string | null>(
    (latest, asset) =>
      !latest || Date.parse(asset.updatedAt) > Date.parse(latest)
        ? asset.updatedAt
        : latest,
    null,
  );
  const highlights = [
    {
      label: "Top gainer",
      asset: [...assets].sort((a, b) => b.change24h - a.change24h)[0],
    },
    {
      label: "Top loser",
      asset: [...assets].sort((a, b) => a.change24h - b.change24h)[0],
    },
    {
      label: "Highest volume",
      asset: [...assets].sort((a, b) => b.volume24h - a.volume24h)[0],
    },
    {
      label: "Largest market cap",
      asset: [...assets].sort((a, b) => b.marketCap - a.marketCap)[0],
    },
  ];
  return (
    <>
      <SectionHeader
        eyebrow="THE MARKET OBSERVATORY"
        title="Crypto Market"
        description="Explore the market through data. Discover assets, investigate patterns, and go beyond the price."
      />
      {latestTimestamp && <LastUpdated timestamp={latestTimestamp} />}
      <p className="muted text-xs">
        Market snapshots are collected approximately every 5 minutes. Reload
        this page to fetch the latest available snapshot.
      </p>
      {assets.length === 0 ? (
        <EmptyState title="No market data available">
          The latest snapshot contains no assets. Please check again shortly.
        </EmptyState>
      ) : (
        <>
          <div className="metric-grid">
            {highlights.map(({ label, asset }) => (
              <Link
                key={label}
                href={`/crypto/${encodeURIComponent(asset.id)}`}
                prefetch={false}
                className="panel metric"
              >
                <p className="muted text-xs mb-4">{label} ↗</p>
                <div className="coin-cell">
                  <span className={`coin-icon ${asset.id}`} aria-hidden="true">
                    {asset.symbol[0]}
                  </span>
                  <div className="text-sm">
                    {asset.name}
                    <small className="muted">{asset.symbol}</small>
                  </div>
                </div>
                <p className="mono text-xl mt-4">{money(asset.price)}</p>
                <p
                  className={`text-xs mt-2 ${asset.change24h >= 0 ? "positive" : "negative"}`}
                >
                  {percent(asset.change24h)}{" "}
                  <span className="muted">/ 24h</span>
                </p>
              </Link>
            ))}
          </div>
          <Explorer assets={assets} />
        </>
      )}
    </>
  );
}
