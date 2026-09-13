import type { AcademicLink, AcademicWeek } from "@/types/msc";
import { AcademicMarkdown } from "./markdown";

function ResourceLinks({
  title,
  links,
}: {
  title: string;
  links?: AcademicLink[];
}) {
  if (!links?.length) return null;
  return (
    <section>
      <h3 className="font-semibold mb-3">{title}</h3>
      <ul className="flex flex-wrap gap-3">
        {links.map((link, i) => (
          <li key={`${link.url}-${i}`}>
            <a className="button" href={link.url}>
              {link.label} <span aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
export function WeekAccordion({ weeks }: { weeks: AcademicWeek[] }) {
  return (
    <div className="space-y-4">
      {weeks.map((week) => (
        <details
          key={week.week}
          id={`week-${week.week}`}
          className="panel scroll-mt-28 msc-week"
        >
          <summary>
            <span className="font-semibold">
              Week {week.week}
              {week.title ? ` — ${week.title}` : ""}
            </span>
            <span className="tag">
              {week.status === "complete" ? "Complete" : "In progress"}
            </span>
          </summary>
          <div className="msc-week-content">
            {week.topic && (
              <section>
                <h3 className="font-semibold mb-3">Topic</h3>
                <AcademicMarkdown>{week.topic}</AcademicMarkdown>
              </section>
            )}
            {!!week.concepts?.length && (
              <section>
                <h3 className="font-semibold mb-3">Concepts</h3>
                <ul className="list-disc pl-5 muted space-y-2">
                  {week.concepts.map((concept) => (
                    <li key={concept}>{concept}</li>
                  ))}
                </ul>
              </section>
            )}
            {week.lab && (
              <section>
                <h3 className="font-semibold mb-3">Lab / Notebook</h3>
                <AcademicMarkdown>{week.lab}</AcademicMarkdown>
              </section>
            )}
            <ResourceLinks title="Notebooks" links={week.notebooks} />
            <ResourceLinks title="Code" links={week.code} />
            {week.body && <AcademicMarkdown>{week.body}</AcademicMarkdown>}
            <ResourceLinks title="Resources" links={week.resources} />
            {week.takeaways && (
              <section>
                <h3 className="font-semibold mb-3">Takeaways</h3>
                <AcademicMarkdown>{week.takeaways}</AcademicMarkdown>
              </section>
            )}
            {week.projectConnection && (
              <section>
                <h3 className="font-semibold mb-3">Project connection</h3>
                <AcademicMarkdown>{week.projectConnection}</AcademicMarkdown>
              </section>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
