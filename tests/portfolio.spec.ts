import { test, expect } from "@playwright/test";
test("explorer searches, sorts, handles empty results, and opens an asset", async ({
  page,
}) => {
  await page.goto("/crypto");
  await expect(page.locator("tbody tr")).toHaveCount(100);
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
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await page.locator("tbody tr td:nth-child(3)").click();
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
  await page.getByRole("button", { name: "1Y", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "1Y", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("366", { exact: true })).toBeVisible();
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
  expect(response?.status()).toBe(404);
});
