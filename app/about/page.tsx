import Link from "next/link";
import { ArrowUpRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { SectionHeader } from "@/components/ui";

export const metadata = {
  title: "About Elvis",
  description:
    "Elvis Candia Ochoa — physics graduate and AI master's student building data solutions with Python, SQL, and PostgreSQL.",
};
const cvPath = "/cv/elvis-candia-ochoa-cv.pdf";
const profiles = [
  { label: "GitHub", href: "https://github.com/ElvisCO1", icon: Github },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/elvis-c-22b220290/",
    icon: Linkedin,
  },
  { label: "Email", href: "mailto:elvis.candia1@gmail.com", icon: Mail },
];
const skillGroups = [
  { title: "Programming", tools: ["Python", "SQL"] },
  {
    title: "Data analysis",
    tools: ["Pandas", "NumPy", "Excel", "Power Query", "Power BI"],
  },
  { title: "Databases", tools: ["PostgreSQL", "MySQL", "SQLite"] },
  {
    title: "Data engineering",
    tools: ["Apache Airflow", "MinIO", "ETL/ELT", "JSON", "Parquet"],
  },
  { title: "APIs & deployment", tools: ["FastAPI", "Docker", "Linux", "Git"] },
  {
    title: "Statistics & machine learning",
    tools: ["SciPy", "Scikit-learn", "Matplotlib"],
  },
  {
    title: "Web development in QhapaqData",
    tools: ["Next.js", "TypeScript", "Tailwind CSS", "Apache ECharts"],
  },
];

function ProfileLinks() {
  return profiles.map(({ label, href, icon: Icon }) => (
    <a key={label} href={href} className="button">
      <Icon size={16} aria-hidden="true" />
      {label}
    </a>
  ));
}
function DownloadCV() {
  return (
    <a href={cvPath} download className="button button-primary">
      <Download size={16} aria-hidden="true" />
      Download CV — Spanish PDF
    </a>
  );
}

export default function About() {
  return (
    <>
      <SectionHeader
        eyebrow="THE PERSON BEHIND THE DATA"
        title="Elvis Candia Ochoa"
        description="Bachelor’s degree in Physics · Master’s student in Artificial Intelligence"
      />
      <p className="description">
        I build data solutions with Python and SQL, from ingestion and storage
        to analysis and visualization.
      </p>
      <div className="mt-6 mb-9 flex flex-wrap gap-3">
        <ProfileLinks />
        <DownloadCV />
      </div>
      <div className="grid items-start gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0 space-y-6">
          <section
            className="panel content-panel"
            aria-labelledby="about-heading"
          >
            <h2 id="about-heading">Connecting scientific thinking with data</h2>
            <p className="muted">
              My background in physics shapes how I work with data: asking
              questions, validating results, and interpreting evidence. I’m
              currently pursuing a master’s degree in Artificial Intelligence at
              Universidad Nacional Mayor de San Marcos.
            </p>
            <p className="muted mt-4">
              Through QhapaqData, I develop and integrate automated pipelines,
              historical databases, APIs, and interactive visualizations.
            </p>
          </section>
          <section
            className="panel content-panel"
            aria-labelledby="project-heading"
          >
            <p className="eyebrow mb-4">FEATURED PROJECT</p>
            <h2 id="project-heading">
              QhapaqData — Data Engineering & Analytics Platform
            </h2>
            <p className="muted">
              A platform that connects cryptocurrency data from CoinGecko to a
              public analytics interface. It includes automated ingestion,
              historical storage, API queries, and interactive charts.
            </p>
            <ol
              aria-label="Data pipeline"
              className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-3"
            >
              {[
                "CoinGecko",
                "Airflow",
                "MinIO",
                "PostgreSQL",
                "FastAPI",
                "Next.js",
              ].map((step, index) => (
                <li key={step} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className="muted" aria-hidden="true">
                      →
                    </span>
                  )}
                  <span className="tag">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="button button-primary" href="/crypto">
                Explore Crypto Analytics{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
              <a
                className="button"
                href="https://github.com/ElvisCO1/qhapaqdata-portfolio"
              >
                View source code <Github size={16} aria-hidden="true" />
              </a>
            </div>
          </section>
          <section
            className="panel content-panel"
            aria-labelledby="experience-heading"
          >
            <h2 id="experience-heading">Practical data experience</h2>
            <p className="muted">
              My experience in metrology laboratories includes processing and
              validating technical data, maintaining traceability, and
              automating tasks with Excel, Power Query, and VBA. This work has
              strengthened my focus on data consistency and quality.
            </p>
            <p className="muted mt-4">
              My complete employment history is available in my CV.
            </p>
          </section>
          <section
            className="panel content-panel"
            aria-labelledby="education-heading"
          >
            <h2 id="education-heading">Education</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold">
                  Universidad Nacional Mayor de San Marcos
                </h3>
                <p className="mt-2">Master’s in Artificial Intelligence</p>
                <p className="muted text-sm">May 2026–present · In progress</p>
                <p className="mt-4">Bachelor’s degree in Physics</p>
                <p className="muted text-sm">2016–2022</p>
              </div>
              <div>
                <h3 className="font-semibold">
                  Universidad Nacional de Córdoba
                </h3>
                <p className="mt-2">Diploma in Data Science</p>
                <p className="muted text-sm">Completed · 213 academic hours</p>
              </div>
            </div>
          </section>
        </div>
        <div className="min-w-0 space-y-6">
          <section
            className="panel content-panel"
            aria-labelledby="skills-heading"
          >
            <h2 id="skills-heading">Technical skills</h2>
            <div className="space-y-6">
              {skillGroups.map(({ title, tools }) => (
                <div key={title}>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2" aria-label={title}>
                    {tools.map((tool) => (
                      <li className="tag" key={tool}>
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
          <section
            id="cv"
            className="panel content-panel scroll-mt-28"
            aria-labelledby="cv-heading"
          >
            <h2 id="cv-heading">Contact & CV</h2>
            <p className="muted mb-5">
              To learn more about my background, download my CV or visit my
              professional profiles.
            </p>
            <DownloadCV />
            <p className="muted text-xs mt-3">PDF · 2 pages · Spanish</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ProfileLinks />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
