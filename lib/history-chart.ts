import type { EChartsOption } from "echarts";
import type { CryptoHistoryPoint } from "@/types/crypto";

export function historyOption(
  history: CryptoHistoryPoint[],
  values = history.map((p) => p.price),
  name = "Price (USD)",
): EChartsOption {
  return {
    useUTC: true,
    color: ["#55dfc3"],
    tooltip: {
      trigger: "axis",
      backgroundColor: "#162333",
      borderColor: "#334155",
      textStyle: { color: "#edf2f8" },
      axisPointer: {
        label: {
          formatter: (params) =>
            `${new Date(Number(params.value)).toISOString().replace("T", " ").slice(0, 19)} UTC`,
        },
      },
    },
    grid: { left: 65, right: 20, top: 25, bottom: 55 },
    xAxis: {
      type: "time",
      axisLine: { lineStyle: { color: "#293748" } },
      axisLabel: {
        color: "#99a9bd",
        hideOverlap: true,
        formatter: (value: number) =>
          new Date(value).toISOString().slice(5, 16).replace("T", "\n"),
      },
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
        data: history.map((point, i) => [
          Date.parse(point.timestamp),
          values[i],
        ]),
        showSymbol: history.length === 1,
        symbolSize: 7,
        smooth: false,
        connectNulls: false,
        lineStyle: { width: 2 },
        areaStyle: { color: "#55dfc30c" },
      },
    ],
  };
}
