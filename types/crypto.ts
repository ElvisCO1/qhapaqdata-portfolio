export interface CryptoAsset {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  image?: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  updatedAt: string;
}
export interface CryptoHistoryPoint {
  timestamp: string;
  price: number;
  marketCap?: number;
  volume?: number;
}
export type Period = "1D" | "5D" | "1M" | "6M" | "1Y";
