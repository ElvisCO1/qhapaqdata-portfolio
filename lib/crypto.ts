import { assets, mockHistory } from "@/data/mock-crypto";
import type { Period } from "@/types/crypto";
// Data boundary: replace these functions with the future API adapter.
export async function getAssets() {
  return assets;
}
export async function getAsset(id: string) {
  return assets.find((asset) => asset.id === id);
}
export async function getHistory(id: string, period: Period) {
  const asset = await getAsset(id);
  return asset ? mockHistory(asset, period) : [];
}
