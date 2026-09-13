import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import { findAcademicCourse } from "@/data/msc";
import type { AcademicLink, AcademicWeek } from "@/types/msc";

export function parseAcademicWeek(
  source: string,
  filename: string,
): AcademicWeek | null {
  const match = source
    .replace(/^\uFEFF/, "")
    .match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match)
    throw new Error(
      `${filename}: expected YAML front matter between --- lines`,
    );
  const metadata: unknown = parse(match[1]);
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata))
    throw new Error(`${filename}: invalid metadata`);
  const meta = metadata as Record<string, unknown>;
  if (meta.published === false || meta.published === undefined) return null;
  if (meta.published !== true)
    throw new Error(`${filename}: published must be true or false`);
  if (!Number.isInteger(meta.week) || Number(meta.week) < 1)
    throw new Error(`${filename}: week must be a positive integer`);
  const status = meta.status ?? "in-progress";
  if (status !== "in-progress" && status !== "complete")
    throw new Error(`${filename}: invalid status`);
  function optionalText(key: string) {
    const value = meta[key];
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value !== "string")
      throw new Error(`${filename}: ${key} must be text`);
    return value.trim() || undefined;
  }
  function links(key: string): AcademicLink[] | undefined {
    const value = meta[key];
    if (value === undefined || value === null) return undefined;
    if (!Array.isArray(value))
      throw new Error(`${filename}: ${key} must be a list`);
    return value.map((item) => {
      if (
        !item ||
        typeof item !== "object" ||
        typeof item.label !== "string" ||
        !item.label.trim() ||
        typeof item.url !== "string"
      )
        throw new Error(`${filename}: each ${key} link needs a label and URL`);
      const url = item.url.trim();
      const internal =
        url.startsWith("/") && !url.startsWith("//") && !url.includes("\\");
      let external = false;
      try {
        external = ["https:", "http:"].includes(new URL(url).protocol);
      } catch {
        /* May be an internal URL. */
      }
      if (!internal && !external)
        throw new Error(
          `${filename}: ${key} URL must use HTTP(S) or start with /`,
        );
      return { label: item.label.trim(), url };
    });
  }
  const concepts = meta.concepts;
  if (
    concepts !== undefined &&
    (!Array.isArray(concepts) ||
      concepts.some((item) => typeof item !== "string"))
  )
    throw new Error(`${filename}: concepts must be a list of text`);
  return {
    week: Number(meta.week),
    title: optionalText("title"),
    status,
    topic: optionalText("topic"),
    concepts: (concepts as string[] | undefined)
      ?.map((item) => item.trim())
      .filter(Boolean),
    lab: optionalText("lab"),
    notebooks: links("notebooks"),
    code: links("code"),
    resources: links("resources"),
    takeaways: optionalText("takeaways"),
    projectConnection: optionalText("projectConnection"),
    body: match[2].trim(),
  };
}

export async function getAcademicWeeks(
  termSlug: string,
  courseSlug: string,
): Promise<AcademicWeek[]> {
  // Only catalog entries become filesystem paths; never use arbitrary URL segments.
  if (!findAcademicCourse(termSlug, courseSlug)) return [];
  const directory = path.join(
    process.cwd(),
    "content",
    "msc",
    termSlug,
    courseSlug,
  );
  let files: string[];
  try {
    files = await readdir(directory);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  const weeks = (
    await Promise.all(
      files
        .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
        .map(async (file) =>
          parseAcademicWeek(
            await readFile(path.join(directory, file), "utf8"),
            `${termSlug}/${courseSlug}/${file}`,
          ),
        ),
    )
  ).filter((week): week is AcademicWeek => week !== null);
  if (new Set(weeks.map((week) => week.week)).size !== weeks.length)
    throw new Error(
      `${termSlug}/${courseSlug}: duplicate published week numbers`,
    );
  return weeks.sort((a, b) => a.week - b.week);
}
