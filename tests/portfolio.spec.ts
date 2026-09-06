import { test, expect } from "@playwright/test";
import { assets as mockAssets } from "@/data/mock-crypto";
test("explorer searches, sorts, handles empty results, and opens an asset", async ({
  page,
}) => {
  await page.goto("/crypto");
  await expect(page.locator("tbody tr")).toHaveCount(100);
  await expect(page.getByText(/Last updated:/)).toBeVisible();
  await expect(page.getByText(/Illustrative Top 100|Demo dataset/)).toHaveCount(
    0,
  );
  await page.getByRole("button", { name: "Price", exact: false }).click();
  const prices = await page
    .locator("tbody tr td:nth-child(3)")
    .allTextContents();
  const values = prices.map((p) => Number(p.replace(/[^0-9.]/g, "")));
  expect(values).toEqual([...values].sort((a, b) => b - a));
  const search = page.getByRole("searchbox", {
    name: "Search cryptocurrencies",
  });
  await search.fill("nothing-matches");
  await expect(page.getByText("No assets found")).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(100);
  await search.fill("btc");
  const matches = await page
    .locator("tbody tr td:nth-child(2)")
    .allTextContents();
  expect(matches.length).toBeGreaterThan(0);
  expect(matches.every((text) => text.toLowerCase().includes("btc"))).toBe(
    true,
  );
  await page
    .locator("tbody tr")
    .filter({ has: page.locator('a[href="/crypto/bitcoin"]') })
    .locator("td:nth-child(3)")
    .click();
  await expect(page).toHaveURL(/crypto\/bitcoin$/);
  await expect(
    page.getByRole("heading", { name: "Bitcoin", exact: true }),
  ).toBeVisible();
});
test("price ranges, analytical tabs, and chart rendering work", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/crypto/bitcoin");
  await expect(page.locator(".chart svg").first()).toBeVisible();
  await expect(
    page.getByText(
      /Illustrative history only|Simulated data|Fixed demo snapshot/,
    ),
  ).toHaveCount(0);
  await expect(page.getByText(/Last updated:/)).toBeVisible();
  await page.getByRole("button", { name: "1Y", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "1Y", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("history-coverage")).toBeVisible({
    timeout: 20000,
  });
  await page.getByRole("tab", { name: "Statistics", exact: true }).click();
  await expect(
    page.getByText("Standard deviation", { exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Risk", exact: true }).click();
  await expect(
    page.getByText("Maximum drawdown", { exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Correlation", exact: true }).click();
  await expect(page.getByText("Cross-asset analysis is next")).toBeVisible();
  await page.getByRole("tab", { name: "Models", exact: true }).click();
  await expect(page.getByText("Models, with evidence")).toBeVisible();
  await page.getByRole("tab", { name: "Models", exact: true }).press("Home");
  await expect(page.getByRole("tab", { name: "Overview" })).toBeFocused();
  expect(errors).toEqual([]);
});
test("all routes fit the viewport and navigation works", async ({
  page,
}, testInfo) => {
  for (const route of [
    "/",
    "/crypto",
    "/analytics",
    "/statistics",
    "/ml",
    "/projects",
    "/about",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  if (testInfo.project.name === "mobile")
    await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Crypto", exact: true })
    .click();
  await expect(page).toHaveURL(/\/crypto$/);
  await page.goto("/");
  await expect(page.locator(".chart svg")).toBeVisible();
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
  const response = await page.goto("/crypto/not-a-coin");
  // Next.js can stream the loading boundary before resolving notFound().
  expect([200, 404]).toContain(response?.status());
  await expect(
    page.getByRole("heading", { name: "This page is outside the dataset." }),
  ).toBeVisible();
});

test("real assets outside the demo list can request history", async ({
  page,
}) => {
  await page.goto("/crypto");
  await expect(page.locator("tbody tr")).toHaveCount(100);
  const links = await page
    .locator("tbody a")
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href")!));
  const mockLinks = new Set(mockAssets.map((asset) => `/crypto/${asset.id}`));
  const newAsset = links.find((link) => !mockLinks.has(link));
  test.skip(
    !newAsset,
    "All current API assets already have illustrative fixtures",
  );
  await page.locator(`tbody a[href="${newAsset}"]`).click();
  await expect(page.getByText(/Last updated:/)).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Price history" }),
  ).toBeVisible();
  await expect(
    page
      .getByTestId("history-coverage")
      .or(page.getByText("No historical data for this period")),
  ).toBeVisible({ timeout: 20000 });
});
