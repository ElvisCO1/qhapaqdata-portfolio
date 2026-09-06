import { SectionHeader, EmptyState } from "@/components/ui";
export const metadata = { title: "Statistics Lab" };
export default function Statistics() {
  return (
    <>
      <SectionHeader
        eyebrow="LEARN THROUGH EXPLORATION"
        title="Statistics Lab"
        description="An educational laboratory for learning, visualizing, and simulating statistical concepts."
      />
      <div className="competencies">
        {[
          [
            "01",
            "Understand distributions",
            "Explore probability, descriptive statistics, and the shape of data.",
          ],
          [
            "02",
            "See sampling in action",
            "Investigate the Law of Large Numbers and the Central Limit Theorem.",
          ],
          [
            "03",
            "Reason with uncertainty",
            "Explore confidence intervals, hypothesis testing, and Monte Carlo simulation.",
          ],
        ].map(([number, title, text]) => (
          <article className="panel competency" key={number}>
            <span className="eyebrow">LAB / {number}</span>
            <h3>{title}</h3>
            <p className="muted">{text}</p>
            <span className="tag inline-block mt-5">Planned</span>
          </article>
        ))}
      </div>
      <div className="mt-7">
        <EmptyState title="Interactive experiments are coming">
          Future controls will include distribution, sample size, mean, and
          standard deviation. This lab teaches concepts; asset pages apply
          statistics to market histories.
        </EmptyState>
      </div>
    </>
  );
}
