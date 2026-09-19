import Link from "next/link";
import { getAssets, getHistory } from "@/lib/crypto";
import { money, percent, changeColor } from "@/lib/format";
import { CoinLogo } from "@/components/crypto/coin-logo";
import { MarketHistory } from "./market-history";

const utc = (timestamp: string) =>
  `${new Date(timestamp).toISOString().replace("T", " ").slice(0, 19)} UTC`;

export function MarketPreviewLoading() {
  return (
    <div className="panel hero-visual min-w-0" role="status" aria-busy="true">
      <p className="mono text-xs">MARKET OBSERVATORY</p>
      <div className="min-h-[350px] grid place-items-center muted text-sm">
        Loading Bitcoin market data…
      </div>
    </div>
  );
}

export async function MarketPreview() {
  // One request per endpoint per render; no polling or additional client fetches.
  // Keep either section usable when the other endpoint is unavailable.
  const [latest, historical] = await Promise.allSettled([
    getAssets(),
    getHistory("bitcoin", "1M"),
  ]);
  const assets = latest.status === "fulfilled" ? latest.value : null;
  const bitcoin = assets?.find((asset) => asset.id === "bitcoin");
  const history = historical.status === "fulfilled" ? historical.value : null;

  return (
    <div
      className="panel hero-visual min-w-0"
      data-testid="home-market-preview"
    >
      <div className="chart-heading">
        <p className="mono text-xs">MARKET OBSERVATORY</p>
        <span className="text-accent text-xs">Recorded market data</span>
      </div>
      <div className="mt-7 flex flex-wrap justify-between items-end gap-3">
        <div>
          <Link href="/crypto/bitcoin" prefetch={false} className="coin-cell">
            <CoinLogo coinId="bitcoin" symbol="BTC" />
            <span className="muted text-xs">Bitcoin / BTC ↗</span>
          </Link>
          {bitcoin && (
            <p className="mono text-3xl mt-2">{money(bitcoin.price)}</p>
          )}
        </div>
        {bitcoin && (
          <span className={`${changeColor(bitcoin.change24h)} text-xs`}>
            {percent(bitcoin.change24h)} <span className="muted">/ 24h</span>
          </span>
        )}
      </div>
      {bitcoin ? (
        <p className="muted text-xs mt-3">
          Last updated:{" "}
          <time dateTime={bitcoin.updatedAt}>{utc(bitcoin.updatedAt)}</time>
        </p>
      ) : (
        <p className="muted text-sm mt-3" role="status">
          {assets === null
            ? "Latest market data is temporarily unavailable. Reload to try again."
            : "No Bitcoin snapshot is available yet."}
        </p>
      )}
      {history?.length ? (
        <>
          <MarketHistory history={history} />
          <p className="muted text-xs" data-testid="home-history-coverage">
            {history.length.toLocaleString("en-US")} recorded observations ·
            Last 30 days requested.
            <br />
            Available: {utc(history[0].timestamp)} –{" "}
            {utc(history[history.length - 1].timestamp)}.
          </p>
        </>
      ) : (
        <p
          className="muted text-sm min-h-[220px] grid content-center"
          role="status"
        >
          {history === null
            ? "Price history is temporarily unavailable. Reload to try again."
            : "No recorded Bitcoin history is available for the last 30 days."}
        </p>
      )}
      <div className="hero-stats">
        <div>
          <strong>{assets === null ? "—" : assets.length}</strong>
          <p>TRACKED ASSETS</p>
        </div>
        <div>
          <strong>~5 MIN</strong>
          <p>INGESTION INTERVAL</p>
        </div>
        <div>
          <strong>01</strong>
          <p>DATA PLATFORM</p>
        </div>
      </div>
      <p className="muted text-xs mt-4">
        Automated ingestion by Apache Airflow. Reload to fetch the latest
        available data.
      </p>
    </div>
  );
}
