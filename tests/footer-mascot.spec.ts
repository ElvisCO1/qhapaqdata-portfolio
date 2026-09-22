import { test, expect } from "@playwright/test";

test("footer mascot waves, blinks, supports keyboard and pauses outside the viewport", async ({
  page,
}) => {
  test.setTimeout(45000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/about");
  const mascot = page.getByTestId("footer-mascot");
  await mascot.evaluate((element) => {
    element.setAttribute("data-seen", "");
    new MutationObserver(() => {
      element.setAttribute(
        "data-seen",
        `${element.getAttribute("data-seen")},${element.getAttribute("data-frame")}`,
      );
    }).observe(element, { attributes: true, attributeFilter: ["data-frame"] });
  });
  await mascot.scrollIntoViewIfNeeded();
  await mascot
    .locator("img")
    .evaluate(async (image: HTMLImageElement) => image.decode());
  await expect(mascot).toHaveAttribute("data-seen", /1,2,3,2,1,0/);
  await expect(mascot).toHaveAttribute("data-seen", /4,5,4,0/, {
    timeout: 12000,
  });
  await mascot.evaluate((element) => element.setAttribute("data-seen", ""));
  const wave = mascot.getByRole("button", {
    name: "Make the QhapaqData condor wave",
  });
  await wave.focus();
  await wave.press("Enter");
  await expect(mascot).toHaveAttribute("data-seen", /1,2,3,2,1,0/);
  await mascot
    .getByRole("button", { name: "Pause animation", exact: true })
    .click();
  await expect(mascot.locator("button").first()).toBeDisabled();
  await expect(mascot).toHaveAttribute("data-frame", "0");
  await mascot
    .getByRole("button", { name: "Resume animation", exact: true })
    .click();
  await wave.click();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(mascot).toHaveAttribute("data-frame", "0");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await wave.click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(mascot).toHaveAttribute("data-frame", "0");
  const bounds = await mascot.boundingBox();
  const main = await page.locator("main").boundingBox();
  expect(bounds!.y).toBeGreaterThanOrEqual(main!.y + main!.height);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("reduced motion keeps the condor static and image failure leaves the footer usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/msc");
  const mascot = page.getByTestId("footer-mascot");
  await mascot.scrollIntoViewIfNeeded();
  await mascot
    .locator("img")
    .evaluate(async (image: HTMLImageElement) => image.decode());
  await expect(mascot.locator("button").first()).toBeDisabled();
  await expect(mascot).toHaveAttribute("data-frame", "0");
  await expect(
    mascot.getByRole("button", { name: "Pause animation", exact: true }),
  ).toHaveCount(0);
  await page.route("**/_next/image*", (route) =>
    route.request().url().includes("condor-sprite")
      ? route.abort()
      : route.continue(),
  );
  await page.reload();
  await page.locator("footer").scrollIntoViewIfNeeded();
  await expect(mascot).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "About the creator" }),
  ).toBeVisible();
});
