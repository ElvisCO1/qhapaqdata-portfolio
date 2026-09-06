"use client";
import { Chart, lineOption } from "./chart";
import { assets, mockHistory } from "@/data/mock-crypto";
const history = mockHistory(assets[0], "1M");
const option = lineOption(
  history.map((p) => p.timestamp.slice(5, 10)),
  history.map((p) => p.price),
);
export function HeroChart() {
  return (
    <Chart
      option={option}
      label="Illustrative Bitcoin price over 30 days, ending at 79,619 US dollars"
      height={220}
    />
  );
}
