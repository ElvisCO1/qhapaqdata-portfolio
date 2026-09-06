export function summarize(prices: number[]) {
  const returns = prices
    .slice(1)
    .map((price, i) => (price / prices[i] - 1) * 100);
  const sorted = [...returns].sort((a, b) => a - b);
  const mean = returns.reduce((sum, value) => sum + value, 0) / returns.length;
  const variance =
    returns.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    returns.length;
  const quantile = (p: number) => {
    const index = (sorted.length - 1) * p;
    const lo = Math.floor(index);
    return sorted[lo] + (sorted[Math.ceil(index)] - sorted[lo]) * (index - lo);
  };
  let peak = prices[0];
  const drawdowns = prices.map((price) => {
    peak = Math.max(peak, price);
    return (price / peak - 1) * 100;
  });
  return {
    returns,
    mean,
    median: quantile(0.5),
    variance,
    std: Math.sqrt(variance),
    q1: quantile(0.25),
    q3: quantile(0.75),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    drawdowns,
    maxDrawdown: drawdowns.reduce(
      (minimum, value) => Math.min(minimum, value),
      0,
    ),
  };
}
