import { test, expect } from "@playwright/test";
import { parseAcademicWeek, getAcademicWeeks } from "@/lib/msc-content";
import { academicTerms } from "@/data/msc";

test("drafts stay off the website and partial weeks accept optional sections", () => {
  expect(
    parseAcademicWeek("---\nweek: 1\npublished: false\n---\nDraft", "draft.md"),
  ).toBeNull();
  expect(parseAcademicWeek("---\nweek: 1\n---\nDraft", "draft.md")).toBeNull();
  const week = parseAcademicWeek(
    "---\nweek: 2\npublished: true\nnotebooks:\n  - label: Open in Colab\n    url: https://colab.research.google.com/drive/example\n---\n## Notes\n\n$y = wx + b$",
    "week-02.md",
  );
  expect(week).toMatchObject({
    week: 2,
    status: "in-progress",
    notebooks: [{ label: "Open in Colab" }],
  });
  expect(week?.topic).toBeUndefined();
  expect(week?.body).toContain("$y = wx + b$");
});

test("invalid published metadata and unsafe resource links fail with a filename", () => {
  for (const meta of [
    "week: -1",
    "week: 1\nstatus: invented",
    "week: 1\nconcepts: text",
    "week: 1\ncode:\n  - label: Unsafe\n    url: javascript:alert(1)",
  ]) {
    expect(() =>
      parseAcademicWeek(`---\npublished: true\n${meta}\n---\n`, "invalid.md"),
    ).toThrow("invalid.md");
  }
});

test("unknown course paths cannot read content outside the catalog", async () => {
  expect(await getAcademicWeeks("..", "_templates")).toEqual([]);
});

test("MSc navigation, four courses, empty states and responsive layouts", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of testInfo.project.name === "desktop"
    ? [1440, 1024, 768]
    : [390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/msc");
    await expect(
      page.getByRole("heading", { name: "MSc in Artificial Intelligence" }),
    ).toBeVisible();
    const nav = page.getByRole("navigation", { name: "Main navigation" });
    if (width < 761)
      await page.getByRole("button", { name: "Open navigation" }).click();
    const labels = await nav.getByRole("link").allTextContents();
    expect(labels.indexOf("MSc")).toBe(labels.indexOf("Projects") + 1);
    expect(labels.indexOf("About")).toBe(labels.indexOf("MSc") + 1);
    await expect(
      nav.getByRole("link", { name: "MSc", exact: true }),
    ).toHaveAttribute("aria-current", "page");
    if (width < 761)
      await page.getByRole("button", { name: "Close navigation" }).click();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    for (const course of academicTerms[0].courses) {
      await page
        .getByRole("link", {
          name: new RegExp(course.title.replace(/[&]/g, ".")),
        })
        .click();
      await expect(
        page.getByRole("heading", { name: course.title, exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Weekly content coming soon" }),
      ).toBeVisible();
      await expect(page.locator("details")).toHaveCount(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.getByRole("link", { name: "Back to MSc" }).click();
    }
  }
  const response = await page.goto("/msc/2026-ii/not-a-course");
  expect(response?.status()).toBe(404);
  expect(errors).toEqual([]);
});
