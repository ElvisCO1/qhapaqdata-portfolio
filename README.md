# QhapaqData

A professional portfolio and cryptocurrency analytics frontend for Elvis Candia Ochoa. English interface, responsive dark theme, real market snapshots and asset history, with separately labeled demo previews on Home and Projects.

## Run locally

Requires Node.js 20.9+ and npm.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The Playwright suite uses locally installed Microsoft Edge and a production build. Run `npm run build` first. On other systems, install Chromium with `npx playwright install chromium`, remove `channel: "msedge"` in `playwright.config.ts`, and change the web server command to `npm run start -- --hostname 127.0.0.1`.

## Version 1

- Next.js App Router, strict TypeScript, Tailwind CSS 4, Apache ECharts.
- Home, Crypto, asset detail, Analytics, Statistics, ML, Projects, and About routes.
- Up to 100 real assets from the latest API snapshot, searchable by name/symbol, numeric sorting, scrollable table, clickable rows/cards, and accessible coin links.
- Every asset detail page requests real history for 1D, 5D, 1M, 6M, and 1Y, with loading, retryable error, and empty states. Analytical tabs derive descriptive statistics and drawdown from the returned observations.
- Responsive navigation, keyboard-operated tabs, loading, error, empty, and 404 states.
- Correlation, models, cross-asset analytics, and educational simulations are clearly marked as future work.

## Structure and data

`app/` contains routes; `components/` contains shared interface and chart components; `types/` defines data contracts. `lib/latest-coins.ts` fetches and validates `https://api.qhapaqdata.com/api/coins/latest`; `lib/crypto.ts` exposes the server data boundary with request-local deduplication. API snake_case fields map to the existing camelCase `CryptoAsset` model, with uppercase display symbols. Assets are sorted by rank and limited to 100. Invalid, missing, duplicate, or non-finite fields produce an error rather than fabricated values.

Crypto market prices, ranks, market caps, volumes, 24-hour changes, and highlight cards use the real API snapshot. `Last updated` displays the actual `extraction_time` in UTC (the newest timestamp for the market page, the individual timestamp for details). Fetches run server-side with `cache: "no-store"` and a 10-second timeout. Reloading the page requests fresh data; there is no background polling. An empty response displays an empty state; network/HTTP/schema failures display a retryable error, without silently falling back to mock data. Builds do not need to call the API.

History is fetched when the detail page opens or its range changes. The browser calls the same-origin Next.js route `/api/coins/{coin_id}/history?days={days}`, which reads the public FastAPI endpoint `https://api.qhapaqdata.com/api/coins/{coin_id}/history?days={days}` with no caching and a 15-second timeout. The route validates and maps `extraction_time` to `timestamp`, `current_price` to `price`, `market_cap` to `marketCap`, and `total_volume` to `volume`, then sorts chronologically. The chart uses a true UTC time axis and the original recorded prices. Range mapping: 1D = 1, 5D = 5, 1M = 30, 6M = 180, 1Y = 365 days.

No observations are generated, interpolated, resampled, or padded. The interface reports the returned observation count and actual coverage even when it is shorter than the requested period. Switching ranges cancels the previous browser request and hides its metrics; stale responses cannot overwrite a new selection. Empty/error responses never fall back to fixtures. A single observation is shown as a point; returns and risk require at least two positive prices. Statistics use consecutive-snapshot percentage returns and population variance without annualization, since actual intervals may vary or contain gaps.

`data/mock-crypto.ts` remains only for Home and Projects previews, including their illustrative Bitcoin chart and fixed demo snapshot. No Crypto market or detail component consumes these fixtures. Correlation and model tabs remain future work.

The existing public FastAPI endpoint is consumed read-only. No FastAPI backend, database, homeserver settings, authentication, or Vercel configuration has been changed. Fonts and asset monograms remain local.

The browser tests require a running application with access to the public API. Adapter tests use controlled responses for field mapping, empty data, malformed payloads, HTTP failures, and timeouts. History tests cover all range mappings, dynamic asset IDs, UTC chart points, partial coverage, loading/error/retry/empty/single-point states, and stale requests.

## Content to supply

Add the real PDF CV, verified GitHub/LinkedIn URLs, educational institutions and dates, and work history. The CV button is disabled until a real document is supplied. The master's qualification is shown as in progress, consistent with the brief's current-studies section.

## Deployment

Import this repository into Vercel as a Next.js project. Build command: `npm run build`. No environment variables are needed for this frontend version. Deployment and domain configuration have not been performed.

Setup references: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation) and [Tailwind with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
