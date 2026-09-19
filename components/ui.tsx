import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="description">{description}</p>
    </header>
  );
}
export function MetricCard({
  label,
  value,
  note,
}: {
  label: string;
  value: ReactNode;
  note?: string;
}) {
  return (
    <div className="panel metric">
      <p className="muted text-sm">{label}</p>
      <div className="metric-value">{value}</div>
      {note && <p className="muted text-xs">{note}</p>}
    </div>
  );
}
export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="panel empty-state">
      <span className="eyebrow">QHAPAQDATA / WORK IN PROGRESS</span>
      <h2>{title}</h2>
      <p className="muted">{children}</p>
    </div>
  );
}
export function DemoNote() {
  return (
    <div className="demo-note">
      <span className="status-dot" />
      Demo dataset
      <span className="muted">
        • Simulated prices and rankings · Snapshot: Sep 1, 2026, 12:00 UTC
      </span>
    </div>
  );
}
export function Pipeline() {
  return (
    <div className="pipeline" aria-label="Data pipeline architecture">
      {[
        "CoinGecko",
        "Airflow",
        "MinIO",
        "PostgreSQL",
        "FastAPI",
        "Next.js",
      ].map((item, i) => (
        <div key={item}>
          <span className="mono muted text-xs">0{i + 1}</span>
          <strong>{item}</strong>
          <span className="text-xs muted">
            {
              [
                "Source",
                "Orchestrate",
                "Store",
                "Query",
                "Data API",
                "Visualization",
              ][i]
            }
          </span>
        </div>
      ))}
    </div>
  );
}
export function ProjectCard() {
  return (
    <Link href="/projects" className="panel project-card">
      <div>
        <span className="eyebrow">FEATURED PROJECT / 01</span>
        <h2>
          From raw data
          <br />
          to meaningful insight.
        </h2>
        <p className="muted">QhapaqData Crypto Analytics Platform</p>
        <p className="muted mt-3">
          A working cryptocurrency pipeline connecting automated ingestion,
          historical storage, and a public analytics interface.
        </p>
        <p className="muted text-xs mt-4">
          Scheduled ingestion by Apache Airflow approximately every 5 minutes.
        </p>
        <span className="text-accent mt-6 inline-flex items-center gap-2">
          Explore the project <ArrowUpRight size={16} />
        </span>
      </div>
      <div className="min-w-0">
        <Pipeline />
        <dl className="mt-5 space-y-3 text-xs muted">
          <div>
            <dt className="font-semibold text-white">Self-hosted backend</dt>
            <dd className="mt-1">
              Physical home server · Ubuntu Server 24.04 · Docker Compose
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-white">
              Deployment & connectivity
            </dt>
            <dd className="mt-1">
              Vercel — frontend hosting · Cloudflare — DNS & public API access ·
              Tailscale — private administration
            </dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
