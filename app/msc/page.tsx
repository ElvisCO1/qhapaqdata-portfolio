import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui";
import { academicTerms } from "@/data/msc";

export const metadata = {
  title: "MSc in Artificial Intelligence",
  description:
    "Graduate coursework, laboratories and applied AI research at Universidad Nacional Mayor de San Marcos.",
};
export default function MscPage() {
  return (
    <>
      <SectionHeader
        eyebrow="ACADEMIC LEARNING JOURNAL"
        title="MSc in Artificial Intelligence"
        description="Graduate coursework, laboratories and applied AI research."
      />
      <section className="panel content-panel">
        <div className="chart-heading">
          <div>
            <h2>Universidad Nacional Mayor de San Marcos</h2>
            <p className="muted">Master’s Degree in Artificial Intelligence</p>
            <p className="muted text-sm mt-2">
              Academic coursework and applied research.
            </p>
          </div>
          <span className="tag">In progress</span>
        </div>
      </section>
      {academicTerms.map((term) => (
        <section key={term.slug} aria-labelledby={`term-${term.slug}`}>
          <div className="section-label">
            <h2 id={`term-${term.slug}`} className="section-title">
              {term.title}
              {term.period ? ` · ${term.period}` : ""}
            </h2>
            <span className="mono muted text-xs">
              {term.courses.length} COURSES
            </span>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {term.courses.map((course) => (
              <Link
                key={course.slug}
                href={`/msc/${term.slug}/${course.slug}`}
                className="panel competency msc-course-card"
              >
                <span className="eyebrow">COURSEWORK · IN PROGRESS</span>
                <h3 className="flex items-start justify-between gap-3">
                  {course.title}
                  <ArrowUpRight
                    size={18}
                    className="text-accent shrink-0"
                    aria-hidden="true"
                  />
                </h3>
                <p className="muted">{course.description}</p>
                <div className="tags">
                  {course.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
