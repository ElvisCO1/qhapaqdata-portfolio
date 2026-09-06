import Link from "next/link";
import {
  ArrowUpRight,
  ChartNoAxesCombined,
  BrainCircuit,
  Database,
} from "lucide-react";
import { HeroChart } from "@/components/charts/hero-chart";
import { ProjectCard } from "@/components/ui";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">DATA ANALYTICS · DATA SCIENCE · AI</p>
          <h1>
            Data, connected
            <br />
            to <span>insight.</span>
          </h1>
          <p className="hero-copy">
            Building data-driven systems from ingestion to insight. Exploring
            the intersection of data, statistics, and artificial intelligence.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/crypto">
              Explore Crypto Analytics <ArrowUpRight size={16} />
            </Link>
            <Link className="button" href="/projects">
              View Projects
            </Link>
          </div>
          <div className="hero-person">
            <span className="avatar">EC</span>
            <div>
              <p className="font-semibold">Elvis Candia Ochoa</p>
              <p className="muted mt-1">
                Physicist · MSc in Artificial Intelligence, in progress
              </p>
            </div>
          </div>
        </div>
        <div className="panel hero-visual">
          <div className="chart-heading">
            <p className="mono text-xs">MARKET OBSERVATORY</p>
            <span className="text-accent text-xs">
              <span className="status-dot mr-2" />
              Demo preview
            </span>
          </div>
          <div className="mt-7 flex justify-between items-end">
            <div>
              <p className="muted text-xs">Bitcoin / BTC</p>
              <p className="mono text-3xl mt-2">
                $79,619<span className="muted text-lg">.00</span>
              </p>
            </div>
            <span className="negative text-xs">
              −0.19% <span className="muted">/ 24h</span>
            </span>
          </div>
          <HeroChart />
          <div className="hero-stats">
            <div>
              <strong>100</strong>
              <p>DEMO ASSETS</p>
            </div>
            <div>
              <strong>30D</strong>
              <p>ILLUSTRATIVE HISTORY</p>
            </div>
            <div>
              <strong>01</strong>
              <p>DATA PLATFORM</p>
            </div>
          </div>
        </div>
      </section>
      <div className="section-label">
        <h2 className="section-title">A complete data perspective</h2>
        <span className="mono muted text-xs">EXPLORE THE TOOLKIT</span>
      </div>
      <div className="competencies">
        {[
          {
            title: "Data Analytics",
            icon: ChartNoAxesCombined,
            text: "Turning complex datasets into clear, actionable understanding.",
            tags: ["Python", "SQL", "Pandas", "Statistics"],
          },
          {
            title: "Machine Learning",
            icon: BrainCircuit,
            text: "Exploring patterns, evaluating models, and asking better questions.",
            tags: ["Scikit-learn", "Regression", "Classification"],
          },
          {
            title: "Data Engineering",
            icon: Database,
            text: "Connecting reliable pipelines from raw sources to analytical datasets.",
            tags: ["Airflow", "PostgreSQL", "MinIO", "Docker"],
          },
        ].map(({ title, icon: Icon, text, tags }) => (
          <article key={title} className="panel competency">
            <Icon className="text-accent" size={25} />
            <h3>{title}</h3>
            <p className="muted">{text}</p>
            <div className="tags">
              {tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <div className="section-label">
        <h2 className="section-title">Built to explore. Built to explain.</h2>
        <Link className="text-accent text-xs" href="/projects">
          All projects ↗
        </Link>
      </div>
      <ProjectCard />
    </>
  );
}
