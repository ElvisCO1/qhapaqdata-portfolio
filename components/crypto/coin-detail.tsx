"use client";
import { useMemo, useRef, useState } from "react";
import type { CryptoAsset, Period } from "@/types/crypto";
import { mockHistory } from "@/data/mock-crypto";
import { Chart, lineOption } from "@/components/charts/chart";
import { DemoNote, EmptyState, MetricCard } from "@/components/ui";
import { money, compact, percent } from "@/lib/format";
import { summarize } from "@/lib/statistics";
const tabs = ["Overview", "Statistics", "Risk", "Correlation", "Models"];
const periods: Period[] = ["1D", "5D", "1M", "6M", "1Y"];
export function CoinDetail({ asset }: { asset: CryptoAsset }) {
  const [period, setPeriod] = useState<Period>("1M");
  const [tab, setTab] = useState("Overview");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const history = useMemo(() => mockHistory(asset, period), [asset, period]);
  const values = useMemo(() => history.map((p) => p.price), [history]);
  const labels = useMemo(
    () =>
      history.map((p) =>
        period === "1D" ? p.timestamp.slice(11, 16) : p.timestamp.slice(0, 10),
      ),
    [history, period],
  );
  const option = useMemo(() => lineOption(labels, values), [labels, values]);
  const stats = useMemo(() => summarize(values), [values]);
  const riskOption = useMemo(
    () => lineOption(labels, stats.drawdowns, "Drawdown (%)"),
    [labels, stats],
  );
  return (
    <>
      <div className="section-header">
        <div className="coin-cell mt-7">
          <span className={`coin-icon ${asset.id}`}>{asset.symbol[0]}</span>
          <h1 className="!my-0">{asset.name}</h1>
          <span className="muted">{asset.symbol}</span>
          <span className="tag">Rank #{asset.rank}</span>
        </div>
        <div className="flex items-end gap-4 mt-7">
          <p className="mono text-4xl">{money(asset.price)}</p>
          <p className={asset.change24h >= 0 ? "positive" : "negative"}>
            {percent(asset.change24h)}{" "}
            <span className="muted text-xs">(24h)</span>
          </p>
        </div>
      </div>
      <DemoNote />
      <div className="metric-grid">
        <MetricCard label="Market cap" value={compact(asset.marketCap)} />
        <MetricCard label="24h volume" value={compact(asset.volume24h)} />
        <MetricCard label="Market ranking" value={`#${asset.rank}`} />
        <MetricCard label="Symbol" value={asset.symbol} />
      </div>
      <section className="panel chart-panel">
        <div className="chart-heading">
          <div>
            <h2 className="font-semibold">Price history</h2>
            <p className="muted text-xs mt-2">USD · Simulated data · UTC</p>
          </div>
          <div className="range-buttons" aria-label="Price history period">
            {periods.map((value) => (
              <button
                key={value}
                aria-pressed={period === value}
                onClick={() => setPeriod(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <Chart
          option={option}
          label={`${asset.name} simulated ${period} price history. Period low ${money(Math.min(...values))}, high ${money(Math.max(...values))}.`}
        />
      </section>
      <div className="tabs" role="tablist" aria-label="Asset analysis">
        {tabs.map((name, i) => (
          <button
            key={name}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            id={`tab-${name}`}
            aria-controls="analysis-panel"
            aria-selected={tab === name}
            tabIndex={tab === name ? 0 : -1}
            onClick={() => setTab(name)}
            onKeyDown={(event) => {
              let next = i;
              if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
              else if (event.key === "ArrowLeft")
                next = (i + tabs.length - 1) % tabs.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = tabs.length - 1;
              else return;
              event.preventDefault();
              setTab(tabs[next]);
              tabRefs.current[next]?.focus();
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <section
        id="analysis-panel"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
      >
        {tab === "Overview" && (
          <>
            <div className="metric-grid">
              <MetricCard
                label="Period high"
                value={money(Math.max(...values))}
              />
              <MetricCard
                label="Period low"
                value={money(Math.min(...values))}
              />
              <MetricCard
                label="Period change"
                value={percent((values.at(-1)! / values[0] - 1) * 100)}
              />
              <MetricCard label="Observations" value={history.length} />
            </div>
            <div className="panel content-panel">
              <h2>A closer look at {asset.name}</h2>
              <p className="muted">
                This {period} window illustrates how price history can be
                explored alongside market context. Change the range to update
                the chart and period metrics. The separate 24h change is a mock
                snapshot field, not a return calculated from this synthetic
                series.
              </p>
            </div>
          </>
        )}
        {tab === "Statistics" && (
          <>
            <p className="muted text-sm leading-7">
              Descriptive statistics of simple returns: (current price /
              previous price − 1) × 100. Returns are{" "}
              {period === "1D" ? "15-minute" : "daily"}; dispersion uses the
              population formula and is not annualized. These values describe
              simulated observations.
            </p>
            <div className="metric-grid">
              {[
                ["Mean return", stats.mean],
                ["Median return", stats.median],
                ["Standard deviation", stats.std],
                ["Minimum return", stats.min],
                ["Maximum return", stats.max],
                ["Q1", stats.q1],
                ["Q3", stats.q3],
                ["IQR", stats.q3 - stats.q1],
              ].map(([label, value]) => (
                <MetricCard
                  key={label}
                  label={String(label)}
                  value={`${Number(value).toFixed(3)}%`}
                />
              ))}
            </div>
            <p className="muted text-sm">
              Standard deviation measures dispersion around the mean. IQR is the
              distance between the 25th and 75th percentiles. Distribution plots
              and higher moments are planned for the analytics phase.
            </p>
          </>
        )}
        {tab === "Risk" && (
          <>
            <MetricCard
              label="Maximum drawdown"
              value={`${stats.maxDrawdown.toFixed(2)}%`}
              note="Largest decline from a preceding peak within the selected period."
            />
            <div className="panel chart-panel mt-5">
              <h2 className="font-semibold">Drawdown from running peak</h2>
              <Chart
                option={riskOption}
                label={`${asset.name} simulated drawdown, maximum decline ${stats.maxDrawdown.toFixed(2)} percent`}
              />
              <p className="muted text-xs">
                Calculated from the selected simulated series. Rolling
                volatility is planned for the analytics phase.
              </p>
            </div>
          </>
        )}
        {tab === "Correlation" && (
          <EmptyState title="Cross-asset analysis is next">
            Compare aligned asset returns using Pearson and Spearman
            correlation. This module will be added in the analytics phase.
          </EmptyState>
        )}
        {tab === "Models" && (
          <EmptyState title="Models, with evidence">
            Coming soon: RNN, LSTM, and GRU experiments with temporal
            validation, error metrics, and documented limitations. No model
            predictions are available yet.
          </EmptyState>
        )}
      </section>
    </>
  );
}
