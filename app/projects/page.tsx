import Link from "next/link";
import { SectionHeader, Pipeline } from "@/components/ui";
import { HeroChart } from "@/components/charts/hero-chart";
export const metadata = { title: "Projects" };
export default function Projects() {
  return (
    <>
      <SectionHeader
        eyebrow="FROM THEORY TO PRACTICE"
        title="Selected Projects"
        description="Exploring the full journey from data ingestion to analytical interpretation."
      />
      <article className="panel content-panel">
        <div className="chart-heading">
          <span className="eyebrow">01 / DATA ENGINEERING + ANALYTICS</span>
          <span className="tag">Frontend demo</span>
        </div>
        <h2 className="mt-5">QhapaqData Crypto Analytics Platform</h2>
        <p className="muted max-w-3xl">
          The problem: market snapshots need structure, history, and context to
          become useful analytical evidence. QhapaqData connects a data pipeline
          with an interface for exploration and interpretation.
        </p>
        <div className="my-8">
          <Pipeline />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Current implementation</h3>
            <p className="muted">
              A responsive explorer for 100 illustrative assets, interactive
              price histories, and initial statistical summaries. The frontend
              uses mock data; FastAPI integration is planned.
            </p>
            <h3 className="font-semibold mt-6 mb-3">
              Existing data foundation
            </h3>
            <p className="muted">
              The project brief describes Airflow ingestion from CoinGecko,
              Bronze / Silver / Gold storage in MinIO, and PostgreSQL snapshots
              approximately every five minutes.
            </p>
          </div>
          <div className="panel p-4">
            <p className="text-xs muted">
              Interactive demo preview · Simulated Bitcoin history
            </p>
            <HeroChart />
          </div>
        </div>
        <div className="tags">
          {[
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Apache ECharts",
            "Python",
            "Airflow",
            "MinIO",
            "PostgreSQL",
          ].map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
        <Link href="/crypto" className="button button-primary mt-7">
          Open interactive demo ↗
        </Link>
        <p className="muted text-xs mt-4">
          Repository link and validated analytical results will be added when
          available.
        </p>
      </article>
    </>
  );
}
