# QhapaqData

A professional portfolio and cryptocurrency analytics frontend for Elvis Candia Ochoa. English interface, responsive dark theme, and explicitly labeled mock data.

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
- 100 illustrative assets, searchable by name/symbol, numeric sorting, scrollable table, clickable rows, and accessible coin links.
- Every asset has interactive price ranges (1D, 5D, 1M, 6M, 1Y), working analysis tabs, descriptive statistics, and drawdown visualization.
- Responsive navigation, keyboard-operated tabs, loading, error, empty, and 404 states.
- Correlation, models, cross-asset analytics, and educational simulations are clearly marked as future work.

## Structure and data

`app/` contains routes; `components/` contains shared interface and chart components; `types/` defines data contracts; `data/mock-crypto.ts` contains deterministic fixtures; `lib/crypto.ts` is the server data boundary for future API integration. Client-side range selection currently uses the pure mock history generator.

Prices, rankings, and returns are synthetic and do not represent current markets. The fixed snapshot is September 1, 2026 at 12:00 UTC. The 24-hour snapshot change is independent of the synthetic historical curve. Intraday observations are spaced at 15 minutes; other ranges use daily observations. Statistics use simple percentage returns and population variance. No values are annualized.

No FastAPI service, homeserver connection, database, authentication, or live requests are implemented. Fonts and asset monograms are local; no remote image service is required.

## Content to supply

Add the real PDF CV, verified GitHub/LinkedIn URLs, educational institutions and dates, and work history. The CV button is disabled until a real document is supplied. The master's qualification is shown as in progress, consistent with the brief's current-studies section.

## Deployment

Import this repository into Vercel as a Next.js project. Build command: `npm run build`. No environment variables are needed for this frontend version. Deployment and domain configuration have not been performed.

Setup references: [Next.js installation](https://nextjs.org/docs/app/getting-started/installation) and [Tailwind with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs).
