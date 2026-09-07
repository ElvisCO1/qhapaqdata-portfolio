export interface CryptoAsset {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  image?: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number | null;
  updatedAt: string;
}
export interface CryptoHistoryPoint {
  timestamp: string;
  price: number;
  marketCap?: number;
  volume?: number;
}
export type Period = "1D" | "5D" | "1M" | "6M" | "1Y";

export interface LatestCoinResponse {
  coin_id: string;
  symbol: string;
  name: string;
  market_cap_rank: number;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
  extraction_time: string;
}
export type LatestCoinsResponse = LatestCoinResponse[];

export type HistoricalCoinResponse = Omit<
  LatestCoinResponse,
  "market_cap_rank"
>;
export type HistoricalCoinsResponse = HistoricalCoinResponse[];
