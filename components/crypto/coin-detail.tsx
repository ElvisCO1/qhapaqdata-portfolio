"use client";
import { useMemo, useRef, useState } from "react";
import type { CryptoAsset, Period } from "@/types/crypto";
import { Chart } from "@/components/charts/chart";
import { historyOption } from "@/lib/history-chart";
import { useHistory } from "@/components/crypto/use-history";
import { EmptyState, MetricCard } from "@/components/ui";
import { LastUpdated } from "@/components/crypto/last-updated";
import { money, compact, percent, changeColor } from "@/lib/format";
import { summarize } from "@/lib/statistics";
import { CoinLogo } from "@/components/crypto/coin-logo";
const tabs = ["Overview", "Statistics", "Risk", "Correlation", "Models"];
const periods: Period[] = ["1D", "5D", "1M", "6M", "1Y"];
export function CoinDetail({ asset }: { asset: CryptoAsset }) {
  const [period, setPeriod] = useState<Period>("1M");
  const [tab, setTab] = useState("Overview");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { history, status, retry } = useHistory(asset.id, period);
  const values = useMemo(() => history.map((p) => p.price), [history]);
  const option = useMemo(() => historyOption(history), [history]);
  const stats = useMemo(
    () =>
      values.length >= 2 && values.every((value) => value > 0)
        ? summarize(values)
        : null,
    [values],
  );
  const riskOption = useMemo(
    () => historyOption(history, stats?.drawdowns ?? [], "Drawdown (%)"),
    [history, stats],
  );
  const extrema = useMemo(
    () =>
      values.reduce(
        (result, value) => ({
          min: Math.min(result.min, value),
          max: Math.max(result.max, value),
        }),
        { min: Infinity, max: -Infinity },
      ),
    [values],
  );
  const hasHistory = status === "ready" && history.length > 0;
  return (
    <>
      <div className="section-header">
        <div className="coin-cell mt-7">
          <CoinLogo coinId={asset.id} symbol={asset.symbol} />
          <h1 className="!my-0">{asset.name}</h1>
          <span className="muted">{asset.symbol}</span>
          <span className="tag">Rank #{asset.rank}</span>
        </div>
        <div className="flex items-end gap-4 mt-7">
          <p className="mono text-4xl">{money(asset.price)}</p>
          <p className={changeColor(asset.change24h)}>
            {percent(asset.change24h)}{" "}
            <span className="muted text-xs">(24h)</span>
          </p>
        </div>
      </div>
      <LastUpdated timestamp={asset.updatedAt} />
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
            <p className="muted text-xs mt-2">
              USD · Recorded market snapshots · UTC
            </p>
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
        {status === "loading" && (
          <div
            className="chart grid place-items-center muted text-sm"
            role="status"
          >
            Loading price history…
          </div>
        )}
        {status === "error" && (
          <div className="empty-state" role="alert">
            <h3>Historical data is temporarily unavailable</h3>
            <p className="muted mt-3">
              Please try again or choose another period.
            </p>
            <button className="button mt-5" onClick={retry}>
              Retry history
            </button>
          </div>
        )}
        {status === "ready" && history.length === 0 && (
          <div className="empty-state" role="status">
            <h3>No historical data for this period</h3>
            <p className="muted mt-3">
              Choose a longer period or check again later.
            </p>
          </div>
        )}
        {hasHistory && (
          <>
            <Chart
              option={option}
              label={`${asset.name} ${period} recorded price history, ${history.length} observations. Period low ${money(extrema.min)}, high ${money(extrema.max)}.`}
            />
            <p className="muted text-xs mt-3" data-testid="history-coverage">
              {history.length} recorded observations ·{" "}
              {new Date(history[0].timestamp)
                .toISOString()
                .replace("T", " ")
                .slice(0, 19)}{" "}
              to{" "}
              {new Date(history.at(-1)!.timestamp)
                .toISOString()
                .replace("T", " ")
                .slice(0, 19)}{" "}
              UTC. Showing all available data returned for this period; coverage
              may be shorter than the requested range.
            </p>
          </>
        )}
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
        {tab === "Overview" && hasHistory && (
          <>
            <div className="metric-grid">
              <MetricCard label="Period high" value={money(extrema.max)} />
              <MetricCard label="Period low" value={money(extrema.min)} />
              <MetricCard
                label="Period change"
                value={
                  values[0] > 0 && values.length >= 2
                    ? percent((values.at(-1)! / values[0] - 1) * 100)
                    : "N/A"
                }
              />
              <MetricCard label="Observations" value={history.length} />
            </div>
            <div className="panel content-panel">
              <h2>A closer look at {asset.name}</h2>
              <p className="muted">
                This {period} window illustrates how price history can be
                explored alongside market context. Change the range to update
                the chart and period metrics. The separate 24h change comes from
                latest API snapshot. Period metrics use only the historical
                observations returned for the selected range.
              </p>
            </div>
          </>
        )}
        {tab === "Statistics" && hasHistory && stats && (
          <>
            <p className="muted text-sm leading-7">
              Descriptive statistics of simple returns: (current price /
              previous price − 1) × 100. Returns are between consecutive
              recorded snapshots; intervals may vary or include gaps. Dispersion
              uses the population formula and is not annualized. These values
              describe the available observations, not a resampled daily series.
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
        {tab === "Risk" && hasHistory && stats && (
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
                label={`${asset.name} recorded drawdown, maximum decline ${stats.maxDrawdown.toFixed(2)} percent`}
              />
              <p className="muted text-xs">
                Calculated from the available recorded prices in the selected
                period. Rolling volatility is planned for the analytics phase.
              </p>
            </div>
          </>
        )}
        {["Overview", "Statistics", "Risk"].includes(tab) && !hasHistory && (
          <p className="muted text-sm py-6">
            {status === "loading"
              ? "Historical metrics will appear when the data loads."
              : "Historical metrics are unavailable for this selection."}
          </p>
        )}
        {["Statistics", "Risk"].includes(tab) && hasHistory && !stats && (
          <p className="muted text-sm py-6">
            At least two positive price observations are required to calculate
            returns and risk metrics.
          </p>
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
