"use client";
import { useMemo } from "react";
import { Chart } from "@/components/charts/chart";
import { historyOption } from "@/lib/history-chart";
import type { CryptoHistoryPoint } from "@/types/crypto";

export function MarketHistory({ history }: { history: CryptoHistoryPoint[] }) {
  const option = useMemo(
    () => ({
      ...historyOption(history),
      dataZoom: [],
      grid: { left: 45, right: 12, top: 25, bottom: 35 },
    }),
    [history],
  );
  return (
    <Chart
      option={option}
      label="Bitcoin recorded price history in US dollars, UTC, for the available portion of the last 30 days"
      height={220}
    />
  );
}
