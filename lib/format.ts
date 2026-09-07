export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
export const compact = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
export const percent = (value: number | null) =>
  value === null ? "N/A" : `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
export const changeColor = (value: number | null) =>
  value === null ? "muted" : value >= 0 ? "positive" : "negative";
