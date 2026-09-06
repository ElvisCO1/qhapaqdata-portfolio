import Link from "next/link";
import { SectionHeader } from "@/components/ui";
export const metadata = { title: "About Elvis" };
export default function About() {
  return (
    <>
      <SectionHeader
        eyebrow="THE PERSON BEHIND THE DATA"
        title="Elvis Candia Ochoa"
        description="Physicist · MSc in Artificial Intelligence, in progress"
      />
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-6">
        <section className="panel content-panel">
          <h2>Connecting scientific thinking with data</h2>
          <p className="muted">
            My work brings together physics, data analytics, and artificial
            intelligence. QhapaqData is a place to explore that intersection
            through data pipelines, statistical analysis, and machine learning
            projects.
          </p>
          <h2 className="mt-8">Education</h2>
          <p>Physics</p>
          <p className="muted">Academic background in physics.</p>
          <p className="mt-4">MSc in Artificial Intelligence</p>
          <p className="muted">
            Current studies. Institutions and dates to be added.
          </p>
          <h2 className="mt-8">Project experience</h2>
          <Link href="/projects" className="text-accent">
            QhapaqData Crypto Analytics Platform ↗
          </Link>
          <p className="muted mt-2">
            A portfolio project spanning data ingestion, storage, visualization,
            and applied statistics.
          </p>
        </section>
        <div>
          <section className="panel content-panel">
            <h2>Technical toolkit</h2>
            <div className="tags">
              {[
                "Python",
                "SQL",
                "Pandas",
                "Statistics",
                "Scikit-learn",
                "Airflow",
                "PostgreSQL",
                "MinIO",
                "Docker",
                "APIs",
              ].map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </section>
          <section id="cv" className="panel content-panel mt-6 scroll-mt-28">
            <h2>Curriculum vitae</h2>
            <p className="muted text-sm">
              The downloadable CV and verified GitHub and LinkedIn profiles will
              be added here.
            </p>
            <button className="button mt-5" disabled>
              Download CV · Coming soon
            </button>
          </section>
        </div>
      </div>
    </>
  );
}
