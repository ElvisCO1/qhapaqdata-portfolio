import { test, expect } from "@playwright/test";
import { fetchHistory, mapHistory, PERIOD_DAYS } from "@/lib/history";
import { historyOption } from "@/lib/history-chart";
import type { HistoricalCoinResponse } from "@/types/crypto";

const record: HistoricalCoinResponse = {
  coin_id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  current_price: 100,
  market_cap: 1000,
  total_volume: 50,
  price_change_percentage_24h: 1,
  extraction_time: "2026-09-06T12:00:00+00:00",
};
const points = mapHistory(
  [
    record,
    {
      ...record,
      current_price: 110,
      extraction_time: "2026-09-06T12:05:00+00:00",
    },
  ],
  "bitcoin",
);

test("history mapping preserves real points and gaps, sorted by timestamp", () => {
  const records = [
    {
      ...record,
      current_price: 120,
      extraction_time: "2026-09-06T15:00:00+00:00",
    },
    record,
  ];
  const result = mapHistory(records, "bitcoin");
  expect(result.map((point) => point.price)).toEqual([100, 120]);
  expect(result.map((point) => point.timestamp)).toEqual([
    record.extraction_time,
    records[0].extraction_time,
  ]);
  expect(result[0]).toMatchObject({ marketCap: 1000, volume: 50 });
  expect(mapHistory([], "bitcoin")).toEqual([]);
  expect(mapHistory([record], "bitcoin")).toHaveLength(1);
  const option = historyOption(result);
  expect(option.useUTC).toBe(true);
  expect(option.xAxis).toMatchObject({ type: "time" });
  expect(option.series).toMatchObject([
    {
      data: [
        [Date.parse(record.extraction_time), 100],
        [Date.parse(records[0].extraction_time), 120],
      ],
      smooth: false,
    },
  ]);
});

test("history rejects invalid records instead of filling missing prices", () => {
  for (const response of [
    {},
    [null],
    [{ ...record, current_price: null }],
    [{ ...record, current_price: Infinity }],
    [{ ...record, coin_id: "ethereum" }],
    [{ ...record, extraction_time: "invalid" }],
  ]) {
    expect(() => mapHistory(response, "bitcoin")).toThrow();
  }
});

test("all periods query the dynamic coin and preserve partial history", async () => {
  const original = globalThis.fetch;
  const calls: string[] = [];
  try {
    globalThis.fetch = async (url, init) => {
      calls.push(String(url));
      expect(init?.cache).toBe("no-store");
      return Response.json([{ ...record, coin_id: "ethereum" }]);
    };
    for (const days of Object.values(PERIOD_DAYS))
      expect(await fetchHistory("ethereum", days)).toHaveLength(1);
    expect(calls).toEqual(
      [1, 5, 30, 180, 365].map(
        (days) =>
          `https://api.qhapaqdata.com/api/coins/ethereum/history?days=${days}`,
      ),
    );
    globalThis.fetch = async () => new Response("Error", { status: 500 });
    await expect(fetchHistory("bitcoin", 1)).rejects.toThrow("500");
    globalThis.fetch = async () => {
      throw new DOMException("Timeout", "TimeoutError");
    };
    await expect(fetchHistory("bitcoin", 1)).rejects.toThrow("Timeout");
    await expect(fetchHistory("bitcoin", 0)).rejects.toThrow(
      "Invalid history request",
    );
  } finally {
    globalThis.fetch = original;
  }
});

test("all five controls load the real API for Bitcoin and Ethereum", async ({
  page,
}) => {
  test.setTimeout(90000);
  for (const coin of ["bitcoin", "ethereum"]) {
    await page.goto(`/crypto/${coin}`);
    await expect(page.getByTestId("history-coverage")).toBeVisible({
      timeout: 20000,
    });
    for (const [label, days] of Object.entries(PERIOD_DAYS)) {
      const responsePromise = page.waitForResponse((response) =>
        response.url().endsWith(`/api/coins/${coin}/history?days=${days}`),
      );
      await page.getByRole("button", { name: label, exact: true }).click();
      const response = await responsePromise;
      expect(response.ok()).toBe(true);
      const history = await response.json();
      expect(history.length).toBeGreaterThan(0);
      await expect(page.getByTestId("history-coverage")).toContainText(
        `${history.length} recorded observations`,
      );
      await expect(page.locator(".chart svg").first()).toBeVisible();
      await expect(
        page.getByRole("button", { name: label, exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
    }
  }
});

test("history loading, error, retry, empty and single-point states", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let mode = "loading";
  await page.route("**/api/coins/bitcoin/history?*", async (route) => {
    if (mode === "loading") {
      await gate;
      await route.fulfill({ status: 502, json: { error: "Unavailable" } });
    } else await route.fulfill({ json: mode === "empty" ? [] : [points[0]] });
  });
  await page.goto("/crypto/bitcoin");
  await expect(page.getByText("Loading price history…")).toBeVisible();
  await expect(page.getByText(/Last updated:/)).toBeVisible();
  release();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Historical data is temporarily unavailable" }),
  ).toBeVisible();
  mode = "empty";
  await page.getByRole("button", { name: "Retry history" }).click();
  await expect(
    page.getByText("No historical data for this period"),
  ).toBeVisible();
  await expect(page.getByText("Period high", { exact: true })).toHaveCount(0);
  mode = "single";
  await page.getByRole("button", { name: "1D", exact: true }).click();
  await expect(page.getByTestId("history-coverage")).toContainText(
    "1 recorded observations",
  );
  await expect(page.locator(".chart svg").first()).toBeVisible();
  await page.getByRole("tab", { name: "Statistics", exact: true }).click();
  await expect(
    page.getByText(/At least two positive price observations/),
  ).toBeVisible();
  await expect(page.getByText(/NaN|Infinity/)).toHaveCount(0);
});

test("a slow previous range cannot overwrite the selected range", async ({
  page,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/coins/bitcoin/history?*", async (route) => {
    if (route.request().url().endsWith("days=1")) {
      await gate;
      await route.fulfill({ json: [points[0]] }).catch(() => {});
    } else await route.fulfill({ json: points });
  });
  await page.goto("/crypto/bitcoin");
  await expect(page.getByTestId("history-coverage")).toBeVisible();
  const slowRequest = page.waitForRequest(
    "**/api/coins/bitcoin/history?days=1",
  );
  await page.getByRole("button", { name: "1D", exact: true }).click();
  await slowRequest;
  await page.getByRole("button", { name: "5D", exact: true }).click();
  await expect(page.getByTestId("history-coverage")).toContainText(
    "2 recorded observations",
  );
  release();
  await expect(
    page.getByRole("button", { name: "5D", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("history-coverage")).toContainText(
    "2 recorded observations",
  );
});
