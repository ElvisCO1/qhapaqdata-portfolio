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
          <span className="tag">Live data platform</span>
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
              A responsive explorer for the latest 100 cryptocurrency snapshots
              from the public FastAPI endpoint. Asset pages now explore recorded
              price histories and statistics calculated from available
              observations.
            </p>
            <h3 className="font-semibold mt-6 mb-3">
              Existing data foundation
            </h3>
            <p className="muted">
              Apache Airflow schedules CoinGecko ingestion approximately every
              five minutes. MinIO stores raw and transformed datasets,
              PostgreSQL holds structured market history, and FastAPI exposes
              the data to the website. This ingestion schedule is separate from
              page refreshes.
            </p>
          </div>
          <div className="panel p-4">
            <p className="text-xs muted">
              Interactive demo preview · Simulated Bitcoin history
            </p>
            <HeroChart />
          </div>
        </div>
        <section className="mt-8" aria-labelledby="infrastructure-heading">
          <h3 id="infrastructure-heading" className="font-semibold mb-3">
            Infrastructure & deployment
          </h3>
          <dl className="grid gap-5 md:grid-cols-2 text-sm">
            <div>
              <dt className="font-semibold">Self-hosted services</dt>
              <dd className="muted mt-2">
                A physical home server runs Ubuntu Server 24.04. Docker and
                Docker Compose run and manage the pipeline, storage, and API
                services.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">
                Public delivery & private access
              </dt>
              <dd className="muted mt-2">
                Vercel hosts the Next.js frontend. Cloudflare manages DNS and
                publishes the API through Cloudflare Tunnel. Tailscale provides
                private remote administration.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Development</dt>
              <dd className="muted mt-2">
                Git and GitHub provide version control and source code
                management.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Roadmap</dt>
              <dd className="muted mt-2">
                Cross-asset analytics and machine learning models remain in
                development or planned. They are not presented as validated
                results.
              </dd>
            </div>
          </dl>
        </section>
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
          Explore Crypto Analytics ↗
        </Link>
        <a
          href="https://github.com/ElvisCO1/qhapaqdata-portfolio"
          className="button mt-3 sm:ml-3"
        >
          View frontend source ↗
        </a>
      </article>
    </>
  );
}
