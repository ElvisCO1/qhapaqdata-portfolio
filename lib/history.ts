import type {
  CryptoHistoryPoint,
  HistoricalCoinResponse,
  Period,
} from "@/types/crypto";

export const PERIOD_DAYS: Record<Period, number> = {
  "1D": 1,
  "5D": 5,
  "1M": 30,
  "6M": 180,
  "1Y": 365,
};

export function mapHistory(
  response: unknown,
  coinId: string,
): CryptoHistoryPoint[] {
  if (!Array.isArray(response)) throw new Error("Invalid history response");
  const records = response as unknown[];
  return records
    .map((record) => {
      if (!record || typeof record !== "object")
        throw new Error("Invalid history record");
      const point = record as HistoricalCoinResponse;
      if (
        point.coin_id !== coinId ||
        typeof point.extraction_time !== "string" ||
        !/(?:Z|[+-]\d{2}:\d{2})$/i.test(point.extraction_time) ||
        !Number.isFinite(Date.parse(point.extraction_time)) ||
        typeof point.current_price !== "number" ||
        !Number.isFinite(point.current_price) ||
        point.current_price < 0 ||
        typeof point.market_cap !== "number" ||
        !Number.isFinite(point.market_cap) ||
        point.market_cap < 0 ||
        typeof point.total_volume !== "number" ||
        !Number.isFinite(point.total_volume) ||
        point.total_volume < 0
      ) {
        throw new Error("Invalid history record");
      }
      return {
        timestamp: point.extraction_time,
        price: point.current_price,
        marketCap: point.market_cap,
        volume: point.total_volume,
      };
    })
    .sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
}

export async function fetchHistory(
  coinId: string,
  days: number,
  signal?: AbortSignal,
): Promise<CryptoHistoryPoint[]> {
  if (
    !coinId ||
    coinId === "." ||
    coinId === ".." ||
    !Object.values(PERIOD_DAYS).includes(days)
  )
    throw new Error("Invalid history request");
  const url = `https://api.qhapaqdata.com/api/coins/${encodeURIComponent(coinId)}/history?days=${days}`;
  const timeout = AbortSignal.timeout(15000);
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (!response.ok)
    throw new Error(`History request failed (${response.status})`);
  return mapHistory(await response.json(), coinId);
}
