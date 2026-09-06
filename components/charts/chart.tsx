"use client";
import { useEffect, useRef, useState } from "react";
import type { EChartsOption } from "echarts";
export function Chart({
  option,
  label,
  height,
}: {
  option: EChartsOption;
  label: string;
  height?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    import("echarts")
      .then((echarts) => {
        if (cancelled || !ref.current) return;
        const chart = echarts.init(ref.current, undefined, { renderer: "svg" });
        chart.setOption({
          ...option,
          animation: !window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches,
        });
        const observer = new ResizeObserver(() => chart.resize());
        observer.observe(ref.current);
        cleanup = () => {
          observer.disconnect();
          chart.dispose();
        };
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [option]);
  return (
    <div className="relative">
      <div
        ref={ref}
        className="chart"
        style={height ? { height } : undefined}
        role="img"
        aria-label={label}
      />
      {status !== "ready" && (
        <p
          className="absolute inset-0 grid place-items-center muted text-sm"
          role="status"
        >
          {status === "loading"
            ? "Loading visualization…"
            : "Unable to load chart. Refresh to try again."}
        </p>
      )}
    </div>
  );
}
export function lineOption(
  labels: string[],
  values: number[],
  name = "Price (USD)",
): EChartsOption {
  return {
    color: ["#55dfc3"],
    tooltip: {
      trigger: "axis",
      backgroundColor: "#162333",
      borderColor: "#334155",
      textStyle: { color: "#edf2f8" },
    },
    grid: { left: 65, right: 20, top: 25, bottom: 55 },
    xAxis: {
      type: "category",
      data: labels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: "#293748" } },
      axisLabel: { color: "#99a9bd", hideOverlap: true },
    },
    yAxis: {
      type: "value",
      scale: true,
      axisLabel: {
        color: "#99a9bd",
        formatter: (value: number) =>
          new Intl.NumberFormat("en-US", { notation: "compact" }).format(value),
      },
      splitLine: { lineStyle: { color: "#223040", type: "dashed" } },
    },
    dataZoom: [
      { type: "inside" },
      {
        type: "slider",
        height: 14,
        bottom: 5,
        borderColor: "#233040",
        fillerColor: "#55dfc320",
        textStyle: { color: "#99a9bd" },
      },
    ],
    series: [
      {
        name,
        type: "line",
        data: values,
        showSymbol: false,
        lineStyle: { width: 2 },
        areaStyle: { color: "#55dfc30c" },
      },
    ],
  };
}
