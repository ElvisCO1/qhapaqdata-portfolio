import { cache } from "react";
import { fetchHistory, PERIOD_DAYS } from "@/lib/history";
import { fetchLatestCoins } from "@/lib/latest-coins";
import type { Period } from "@/types/crypto";
// Request-local deduplication only: each new page request fetches the latest snapshot.
export const getAssets = cache(fetchLatestCoins);
export async function getAsset(id: string) {
  return (await getAssets()).find((asset) => asset.id === id);
}
export async function getHistory(id: string, period: Period) {
  return fetchHistory(id, PERIOD_DAYS[period]);
}
