import Link from "next/link";
import { notFound } from "next/navigation";
import { academicTerms, findAcademicCourse } from "@/data/msc";
import { getAcademicWeeks } from "@/lib/msc-content";
import { EmptyState, SectionHeader } from "@/components/ui";
import { WeekAccordion } from "@/components/msc/week-accordion";

type CourseParams = { semester: string; course: string };
export const dynamicParams = false;
export function generateStaticParams(): CourseParams[] {
  return academicTerms.flatMap((term) =>
    term.courses.map((course) => ({
      semester: term.slug,
      course: course.slug,
    })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<CourseParams>;
}) {
  const { semester, course } = await params;
  const entry = findAcademicCourse(semester, course);
  return { title: entry ? `${entry.course.title} — MSc` : "Course not found" };
}
export default async function CoursePage({
  params,
}: {
  params: Promise<CourseParams>;
}) {
  const { semester, course } = await params;
  const entry = findAcademicCourse(semester, course);
  if (!entry) notFound();
  const weeks = await getAcademicWeeks(semester, course);
  return (
    <>
      <Link href="/msc" className="muted text-xs">
        ← Back to MSc
      </Link>
      <SectionHeader
        eyebrow={`${entry.term.title}${entry.term.period ? ` · ${entry.term.period}` : ""}`}
        title={entry.course.title}
        description={entry.course.description}
      />
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="tag">In progress</span>
        {entry.course.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="section-label">
        <h2 className="section-title">Weekly learning</h2>
        <span className="muted text-xs">
          {weeks.length} published {weeks.length === 1 ? "week" : "weeks"}
        </span>
      </div>
      {weeks.length ? (
        <WeekAccordion weeks={weeks} />
      ) : (
        <EmptyState title="Weekly content coming soon">
          This course is in progress. Notes, mathematical concepts, laboratories
          and notebook links will be added as the semester develops.
        </EmptyState>
      )}
    </>
  );
}
