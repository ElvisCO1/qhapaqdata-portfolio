import { test, expect } from "@playwright/test";

test("desktop mascot is fixed, waves on interaction, drags and remembers position", async ({
  page,
}, info) => {
  test.skip(info.project.name === "mobile", "Desktop-only mascot");
  await page.setViewportSize({ width: 1920, height: 1000 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/about");
  const mascot = page.getByTestId("floating-mascot");
  await expect(mascot).toBeVisible();
  await mascot
    .locator("img")
    .evaluate(async (img: HTMLImageElement) => img.decode());
  const start = (await mascot.boundingBox())!;
  expect(start.x).toBeGreaterThan(
    (await page.locator("main").boundingBox())!.x +
      (await page.locator("main").boundingBox())!.width,
  );
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  expect((await mascot.boundingBox())!.y).toBe(start.y);
  await expect(page.getByText("Pause animation", { exact: true })).toHaveCount(
    0,
  );
  await mascot.evaluate((el) => {
    el.setAttribute("data-seen", "");
    new MutationObserver(() =>
      el.setAttribute(
        "data-seen",
        `${el.getAttribute("data-seen")},${el.getAttribute("data-frame")}`,
      ),
    ).observe(el, { attributes: true, attributeFilter: ["data-frame"] });
  });
  const character = mascot.getByRole("button", {
    name: "Make the QhapaqData condor wave",
  });
  await character.hover();
  await expect(mascot).toHaveAttribute("data-seen", /1,2,3,2,1,0/);
  await mascot.evaluate((el) => el.setAttribute("data-seen", ""));
  await character.focus();
  await character.press("Enter");
  await expect(mascot).toHaveAttribute("data-seen", /1,2,3,2,1,0/);
  await mascot.evaluate((el) => el.setAttribute("data-seen", ""));
  await page.mouse.move(start.x + 48, start.y + 48);
  await page.mouse.down();
  await page.mouse.move(start.x - 152, start.y - 102, { steps: 8 });
  await page.mouse.up();
  const moved = (await mascot.boundingBox())!;
  expect(moved.x).toBeCloseTo(start.x - 200, 0);
  expect(moved.y).toBeCloseTo(start.y - 150, 0);
  await expect(mascot).toHaveAttribute("data-frame", "0");
  await expect(mascot).toHaveAttribute("data-seen", "");
  await page.reload();
  await expect(mascot).toBeVisible();
  expect((await mascot.boundingBox())!.x).toBeCloseTo(moved.x, 0);
  await character.focus();
  await character.press("ArrowLeft");
  expect((await mascot.boundingBox())!.x).toBeCloseTo(moved.x - 20, 0);
  await character.press("Home");
  expect((await mascot.boundingBox())!.x).toBeCloseTo(start.x, 0);
  await page.setViewportSize({ width: 1000, height: 700 });
  await expect(mascot).toHaveCount(0);
  await page.setViewportSize({ width: 1920, height: 1000 });
  await expect(mascot).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "MSc", exact: true })
    .click();
  await expect(mascot).toBeVisible();
  await character.focus();
  await character.press("Escape");
  await expect(mascot).toHaveCount(0);
  await page.reload();
  await expect(mascot).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("mascot is absent on narrow and mobile screens without downloading its image", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("condor-sprite")) requests.push(r.url());
  });
  for (const width of [390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/about");
    await expect(page.getByTestId("floating-mascot")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  expect(requests).toEqual([]);
});

test("reduced motion stays static and the dismiss control works", async ({
  page,
}, info) => {
  test.skip(info.project.name === "mobile", "Desktop-only mascot");
  await page.setViewportSize({ width: 1920, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/about");
  const mascot = page.getByTestId("floating-mascot");
  await expect(mascot).toBeVisible();
  await mascot
    .locator("img")
    .evaluate(async (img: HTMLImageElement) => img.decode());
  const character = mascot.getByRole("button", {
    name: "Make the QhapaqData condor wave",
  });
  await character.hover();
  await character.click();
  await character.press("Enter");
  await expect(mascot).toHaveAttribute("data-frame", "0");
  await mascot
    .getByRole("button", { name: "Hide condor for this session" })
    .click();
  await expect(mascot).toHaveCount(0);
});
