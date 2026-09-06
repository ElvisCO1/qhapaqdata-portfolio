import Link from "next/link";
import { getAssets } from "@/lib/crypto";
import { money, percent } from "@/lib/format";
import { DemoNote, SectionHeader } from "@/components/ui";
import { Explorer } from "@/components/crypto/explorer";
export const metadata = { title: "Crypto Market" };
export default async function CryptoPage() {
  const assets = await getAssets();
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
    { label: "Largest market cap", asset: assets[0] },
  ];
  return (
    <>
      <SectionHeader
        eyebrow="THE MARKET OBSERVATORY"
        title="Crypto Market"
        description="Explore the market through data. Discover assets, investigate patterns, and go beyond the price."
      />
      <DemoNote />
      <p className="muted text-xs">
        Planned live integration: market data updated every 5 minutes. This demo
        does not refresh.
      </p>
      <div className="metric-grid">
        {highlights.map(({ label, asset }) => (
          <Link
            key={label}
            href={`/crypto/${asset.id}`}
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
              {percent(asset.change24h)} <span className="muted">/ 24h</span>
            </p>
          </Link>
        ))}
      </div>
      <Explorer assets={assets} />
    </>
  );
}
