import { test, expect } from "@playwright/test";
import {
  fetchLatestCoins,
  mapLatestCoins,
  LATEST_COINS_URL,
} from "@/lib/latest-coins";
import type { LatestCoinResponse } from "@/types/crypto";

const bitcoin: LatestCoinResponse = {
  coin_id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  market_cap_rank: 1,
  current_price: 79945,
  market_cap: 1605472312584,
  total_volume: 18902156360,
  price_change_percentage_24h: -0.23355,
  extraction_time: "2026-09-06T22:50:02.724546+00:00",
};

test("maps real field names, timestamps, and signs without fabricating values", () => {
  expect(mapLatestCoins([bitcoin])).toEqual([
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      rank: 1,
      price: 79945,
      marketCap: 1605472312584,
      volume24h: 18902156360,
      change24h: -0.23355,
      updatedAt: bitcoin.extraction_time,
    },
  ]);
  expect(
    mapLatestCoins([
      { ...bitcoin, current_price: 0, price_change_percentage_24h: 0 },
    ])[0].price,
  ).toBe(0);
});

test("keeps the top 100 by rank and accepts an empty snapshot", () => {
  expect(
    mapLatestCoins([{ ...bitcoin, price_change_percentage_24h: null }])[0]
      .change24h,
  ).toBeNull();
  const coins = Array.from({ length: 105 }, (_, i) => ({
    ...bitcoin,
    coin_id: `coin-${i}`,
    market_cap_rank: 105 - i,
  }));
  const result = mapLatestCoins(coins);
  expect(result).toHaveLength(100);
  expect(result[0].rank).toBe(1);
  expect(result[99].rank).toBe(100);
  expect(mapLatestCoins([])).toEqual([]);
});

test("rejects malformed responses, duplicates, invalid timestamps, and missing values", () => {
  for (const value of [
    null,
    {},
    { data: [bitcoin] },
    [null],
    [bitcoin, bitcoin],
    [{ ...bitcoin, current_price: null }],
    [{ ...bitcoin, total_volume: "100" }],
    [{ ...bitcoin, market_cap: Infinity }],
    [{ ...bitcoin, extraction_time: "invalid" }],
    [{ ...bitcoin, extraction_time: "2026-09-06T12:00:00" }],
  ]) {
    expect(() => mapLatestCoins(value)).toThrow();
  }
});

test("fetches uncached JSON and propagates HTTP, JSON, and timeout failures", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (input, init) => {
      expect(input).toBe(LATEST_COINS_URL);
      expect(init?.cache).toBe("no-store");
      expect(init?.signal).toBeTruthy();
      return Response.json([bitcoin]);
    };
    expect((await fetchLatestCoins())[0].id).toBe("bitcoin");
    globalThis.fetch = async () => Response.json([]);
    expect(await fetchLatestCoins()).toEqual([]);
    globalThis.fetch = async () => new Response("Unavailable", { status: 503 });
    await expect(fetchLatestCoins()).rejects.toThrow("503");
    globalThis.fetch = async () => new Response("invalid json");
    await expect(fetchLatestCoins()).rejects.toThrow();
    globalThis.fetch = async () => {
      throw new DOMException("Timed out", "TimeoutError");
    };
    await expect(fetchLatestCoins()).rejects.toThrow("Timed out");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
