import Link from "next/link";
import { SectionHeader, EmptyState } from "@/components/ui";
export const metadata = { title: "Analytics" };
export default function Analytics() {
  return (
    <>
      <SectionHeader
        eyebrow="ASK BETTER QUESTIONS"
        title="Cross-asset Analytics"
        description="A space to investigate market behavior through returns, volatility, and relationships between assets."
      />
      <div className="competencies">
        {[
          "Which assets have the largest drawdowns?",
          "Which returns move together?",
          "How does volatility change over time?",
        ].map((q, i) => (
          <article className="panel competency" key={q}>
            <span className="eyebrow">RESEARCH QUESTION / 0{i + 1}</span>
            <h3>{q}</h3>
            <p className="muted">
              Planned for the analytics phase, with aligned historical
              observations and clear methodology.
            </p>
          </article>
        ))}
      </div>
      <div className="mt-7">
        <EmptyState title="Start with an individual asset">
          The initial demo includes price history, descriptive statistics, and
          drawdown analysis on each asset page.
        </EmptyState>
      </div>
      <Link className="button button-primary mt-6" href="/crypto/bitcoin">
        Explore Bitcoin analysis ↗
      </Link>
    </>
  );
}
