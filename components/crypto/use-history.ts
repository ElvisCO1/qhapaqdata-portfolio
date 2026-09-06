"use client";
import { useEffect, useState } from "react";
import type { CryptoHistoryPoint, Period } from "@/types/crypto";
import { PERIOD_DAYS } from "@/lib/history";

type HistoryState =
  | { key: string; status: "ready"; points: CryptoHistoryPoint[] }
  | { key: string; status: "error" };
const noPoints: CryptoHistoryPoint[] = [];

export function useHistory(coinId: string, period: Period) {
  const [result, setResult] = useState<HistoryState | null>(null);
  const [attempt, setAttempt] = useState(0);
  const key = `${coinId}:${period}:${attempt}`;
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 20000);
    async function load() {
      try {
        const response = await fetch(
          `/api/coins/${encodeURIComponent(coinId)}/history?days=${PERIOD_DAYS[period]}`,
          { cache: "no-store", signal: controller.signal },
        );
        if (!response.ok) throw new Error("History request failed");
        const points: CryptoHistoryPoint[] = await response.json();
        if (active) setResult({ key, status: "ready", points });
      } catch {
        if (active) setResult({ key, status: "error" });
      } finally {
        clearTimeout(timeout);
      }
    }
    void load();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [coinId, period, key]);
  const current = result?.key === key ? result : null;
  return {
    status: current?.status ?? "loading",
    history: current?.status === "ready" ? current.points : noPoints,
    retry: () => setAttempt((value) => value + 1),
  };
}
