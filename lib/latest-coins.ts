import type { CryptoAsset, LatestCoinResponse } from "@/types/crypto";

export const LATEST_COINS_URL = "https://api.qhapaqdata.com/api/coins/latest";

function isLatestCoin(value: unknown): value is LatestCoinResponse {
  if (!value || typeof value !== "object") return false;
  const coin = value as Record<string, unknown>;
  const textFields = ["coin_id", "symbol", "name", "extraction_time"];
  const numericFields = [
    "market_cap_rank",
    "current_price",
    "market_cap",
    "total_volume",
  ];
  return (
    textFields.every(
      (key) =>
        typeof coin[key] === "string" &&
        (coin[key] as string).trim().length > 0,
    ) &&
    numericFields.every(
      (key) => typeof coin[key] === "number" && Number.isFinite(coin[key]),
    ) &&
    (coin.price_change_percentage_24h === null ||
      (typeof coin.price_change_percentage_24h === "number" &&
        Number.isFinite(coin.price_change_percentage_24h))) &&
    Number.isInteger(coin.market_cap_rank) &&
    Number(coin.market_cap_rank) > 0 &&
    Number(coin.current_price) >= 0 &&
    Number(coin.market_cap) >= 0 &&
    Number(coin.total_volume) >= 0 &&
    Number.isFinite(Date.parse(String(coin.extraction_time))) &&
    /(?:Z|[+-]\d{2}:\d{2})$/i.test(String(coin.extraction_time))
  );
}

export function mapLatestCoins(response: unknown): CryptoAsset[] {
  if (!Array.isArray(response) || !response.every(isLatestCoin)) {
    throw new Error("Invalid latest-coins response");
  }
  const ids = new Set(response.map((coin) => coin.coin_id));
  if (ids.size !== response.length)
    throw new Error("Duplicate coin IDs in latest-coins response");
  return response
    .map((coin) => ({
      id: coin.coin_id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      rank: coin.market_cap_rank,
      price: coin.current_price,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      change24h: coin.price_change_percentage_24h,
      updatedAt: coin.extraction_time,
    }))
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 100);
}

export async function fetchLatestCoins(): Promise<CryptoAsset[]> {
  const response = await fetch(LATEST_COINS_URL, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok)
    throw new Error(`Latest-coins request failed (${response.status})`);
  return mapLatestCoins(await response.json());
}
