# QhapaqData — Project Brief for Codex

## 1. Project Goal

Build **QhapaqData**, a professional portfolio and data-science web platform focused on:

- Data Analytics
- Data Science
- Artificial Intelligence
- Cryptocurrency analytics
- Applied statistics
- Machine Learning
- Personal projects and CV

The site should feel like a **technical portfolio + live analytics platform**, not like a crypto trading website.

The main audience is:

- Recruiters
- Data Analyst hiring managers
- Data Scientist hiring managers
- Technical reviewers
- Academic reviewers

The website should be primarily in **English**.

---

## 2. Main Technology Stack

### Frontend

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Apache ECharts**
- React components through Next.js
- Responsive design

### Source Control and Deployment

- **Git**
- **GitHub**
- **Vercel**

Vercel will host the public frontend.

### Backend — Later Phase

The backend will run on a personal homeserver.

- **FastAPI**
- **Python**
- **PostgreSQL**
- **Docker**
- **Docker Compose**

### Existing Data Platform

Already running on the homeserver:

- Apache Airflow
- MinIO
- PostgreSQL
- Docker
- Tailscale

Current data flow:

```text
CoinGecko
   ↓
Apache Airflow
   ↓
MinIO
Bronze / Silver / Gold
   ↓
PostgreSQL
   ↓
FastAPI      [future]
   ↓
QhapaqData
```

Current cryptocurrency snapshots are generated approximately every **5 minutes**.

---

## 3. Architecture

```text
                          INTERNET

                        qhapaqdata.com
                              │
                              ▼
                            Vercel
                              │
                           Next.js
                              │
                              │ HTTPS
                              ▼
                    api.qhapaqdata.com
                              │
                           FastAPI
                              │
                         PostgreSQL
                              ▲
                              │
                           Airflow
                         ↙         ↘
                   CoinGecko       MinIO
```

For the first development phase, use mock/static data in the frontend.

Do NOT require FastAPI or the homeserver to build the initial UI.

---

## 4. Design Direction

Use a modern, professional, technical visual style.

Preferred style:

- Dark navy background
- Dark blue / slate panels
- White primary text
- Muted gray secondary text
- Turquoise accent
- Green for positive market changes
- Red for negative market changes
- Minimal visual noise
- Clear spacing
- Professional typography
- Avoid excessive gradients
- Avoid a generic corporate template
- Avoid making it look like a trading or exchange website

The design should work well on:

- Desktop
- Laptop
- Tablet
- Mobile

---

## 5. Global Navigation

Main navigation:

```text
QhapaqData

Home | Crypto | Analytics | Statistics | ML | Projects | About
```

Optional right-side actions:

```text
GitHub
CV
```

---

# 6. Pages

## 6.1 Home

Route:

```text
/
```

Purpose:

Introduce the portfolio quickly and guide recruiters to the most important sections.

Hero section:

```text
QhapaqData

Data Analytics · Data Science · Artificial Intelligence

Elvis Candia Ochoa

Physicist | MSc in Artificial Intelligence

Building data-driven systems from ingestion to insight.

[Explore Crypto Analytics]
[View Projects]
[View CV]
```

Core competency blocks:

### Data Analytics

- Python
- SQL
- Pandas
- Statistics
- Data visualization
- Analytical interpretation

### Machine Learning

- Regression
- Classification
- Clustering
- Model validation
- Scikit-learn

### Data Engineering

- Airflow
- PostgreSQL
- MinIO
- Docker
- APIs
- Data pipelines

Add a **Featured Project** section highlighting:

```text
QhapaqData Crypto Analytics Platform
```

Architecture preview:

```text
CoinGecko → Airflow → MinIO → PostgreSQL → FastAPI → Web
```

---

# 6.2 Crypto Market

Route:

```text
/crypto
```

Purpose:

Display the Top 100 cryptocurrencies and allow users to enter a detailed page for each asset.

Header:

```text
Crypto Market

Live Cryptocurrency Analytics

Market data updated every 5 minutes.

Last update: [timestamp]
```

Do NOT call it strict real-time data.

Use wording such as:

```text
Market data updated every 5 minutes
```

or:

```text
Near real-time cryptocurrency analytics
```

### Highlight Section

Create cards for:

```text
Top Gainers
Top Losers
Highest Volume
Largest Market Cap
```

Later:

```text
Highest Volatility
```

Each card should show:

- Logo
- Coin name
- Symbol
- Price
- Percentage change

### Cryptocurrency Explorer

Create a scrollable Top 100 table.

Columns:

```text
Rank
Coin
Price
24h Change
Market Cap
24h Volume
```

Features:

- Search by coin name
- Search by symbol
- Sort by ranking
- Sort by price
- Sort by 24h change
- Sort by market cap
- Sort by volume
- Scrollable list on desktop
- Responsive layout on mobile
- Entire row should be clickable

Example:

```text
#1 Bitcoin BTC $79,619 -0.19% $1.60T $20.70B
```

Clicking Bitcoin must navigate to:

```text
/crypto/bitcoin
```

Ethereum:

```text
/crypto/ethereum
```

Use Next.js dynamic routes.

---

# 6.3 Cryptocurrency Detail

Dynamic route:

```text
/crypto/[coin]
```

Example:

```text
/crypto/bitcoin
```

The detail view should contain:

```text
Bitcoin BTC
Rank #1

$79,619.00
-0.19% (24h)

Last update: [timestamp]
```

### Main Price Chart

Large interactive chart.

Time-range controls:

```text
1D | 5D | 1M | 6M | 1Y
```

Later these values will be retrieved from PostgreSQL through FastAPI.

### Market Summary Cards

Show:

```text
Market Cap
24h Volume
Ranking
Symbol
```

Potential future cards:

```text
Period High
Period Low
Historical Change
```

### Analytical Tabs

Below the price chart, create:

```text
Overview | Statistics | Risk | Correlation | Models
```

The tabs should update the lower content without navigating away from the coin page.

---

## Overview

Show a concise market summary.

Possible metrics:

- Current price
- Period high
- Period low
- Market cap
- Volume
- Percentage change
- Last update

---

## Statistics

This is an important portfolio section.

Show applied statistics calculated from historical cryptocurrency data.

Metrics:

- Mean return
- Median return
- Standard deviation
- Variance
- Minimum return
- Maximum return
- Q1
- Q3
- IQR
- Skewness
- Kurtosis

Visualizations:

- Return histogram
- Return distribution
- Optional Q-Q plot later
- Outliers

Add short methodological explanations.

Example:

```text
Standard deviation measures the dispersion of returns around their mean.
```

Do not display statistical metrics without context.

---

## Risk

Potential metrics:

- Rolling volatility
- 7-day volatility
- 30-day volatility
- Maximum drawdown
- Value at Risk — later
- Risk/return comparison — later

Visualizations:

- Rolling volatility chart
- Drawdown chart

---

## Correlation

Allow the selected cryptocurrency to be compared against other assets.

Example:

```text
Bitcoin vs Ethereum
Bitcoin vs Solana
```

Metrics:

- Pearson correlation
- Spearman correlation

Visualizations:

- Scatter plot
- Comparative price/return series
- Correlation matrix later

---

## Models

Initially display a placeholder or "Coming soon".

Later this area will integrate academic Machine Learning and Deep Learning projects.

Potential models:

- Regression
- RNN
- LSTM
- GRU

Possible model page content:

```text
Model
Prediction horizon
Actual vs Predicted
RMSE
MAE
Training period
Model version
Limitations
```

Do not imply guaranteed cryptocurrency price prediction.

---

# 6.4 Analytics

Route:

```text
/analytics
```

Purpose:

Cross-asset data analytics using real cryptocurrency data.

Future modules:

- Returns
- Volatility
- Correlations
- Distributions
- Outliers
- Drawdown
- Ranking changes
- Volume analysis

This page should answer analytical questions rather than simply show charts.

Example questions:

- Which assets are currently the most volatile?
- Which cryptocurrencies have the strongest return correlations?
- How does volatility evolve over time?
- Which assets have the largest drawdowns?
- Does trading volume move together with price changes?

---

# 6.5 Statistics Lab

Route:

```text
/statistics
```

Purpose:

Educational and interactive statistics laboratory.

This section is different from the statistical analysis inside `/crypto/[coin]`.

Difference:

```text
/crypto/bitcoin
→ Statistics applied to real Bitcoin data

/statistics
→ Learn, visualize, and simulate statistical concepts
```

Future topics:

- Descriptive statistics
- Probability
- Probability distributions
- Law of Large Numbers
- Central Limit Theorem
- Confidence intervals
- Hypothesis testing
- Linear regression
- Monte Carlo simulation

Potential interactive controls:

```text
Distribution
Sample size
Mean
Standard deviation
Number of simulations
```

These simulations can initially run directly in the browser.

---

# 6.6 Machine Learning

Route:

```text
/ml
```

Purpose:

Show Machine Learning and Deep Learning work.

Future sections:

- Regression
- Classification
- Clustering
- PCA
- Time-series forecasting
- Deep Learning

Potential academic Deep Learning project:

```text
Cryptocurrency Time-Series Forecasting
RNN vs LSTM vs GRU
```

Possible future workflow:

```text
PostgreSQL historical data
        ↓
Feature engineering
        ↓
Temporal training dataset
        ↓
RNN / LSTM / GRU
        ↓
Model evaluation
        ↓
ONNX export
        ↓
FastAPI inference
        ↓
QhapaqData
```

Training may occur externally on GPU infrastructure such as Colab or Kaggle.

The homeserver should mainly perform inference.

---

# 6.7 Projects

Route:

```text
/projects
```

Display project cards.

Primary project:

```text
QhapaqData Crypto Analytics Platform
```

Show:

- Problem
- Architecture
- Technologies
- Data flow
- Screenshots
- Analytical results
- GitHub repository
- Live demo

Other projects can be added later.

Potential categories:

```text
Data Analytics
Data Science
Machine Learning
Artificial Intelligence
Data Engineering
Research
```

---

# 6.8 About / CV

Route:

```text
/about
```

Purpose:

Professional profile.

Initial content:

```text
Elvis Candia Ochoa

Physicist
MSc in Artificial Intelligence
```

Include:

- Professional summary
- Education
- Relevant experience
- Technical skills
- Current AI master's studies
- Projects
- GitHub
- LinkedIn
- Download CV

Do not make the homepage a full CV.

The CV should be downloadable using a clear button:

```text
Download CV
```

---

# 7. Suggested Next.js Structure

Use App Router.

```text
qhapaqdata/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── crypto/
│   │   ├── page.tsx
│   │   └── [coin]/
│   │       └── page.tsx
│   │
│   ├── analytics/
│   │   └── page.tsx
│   │
│   ├── statistics/
│   │   └── page.tsx
│   │
│   ├── ml/
│   │   └── page.tsx
│   │
│   ├── projects/
│   │   └── page.tsx
│   │
│   └── about/
│       └── page.tsx
│
├── components/
│   ├── layout/
│   ├── crypto/
│   ├── charts/
│   ├── analytics/
│   └── ui/
│
├── data/
│   └── mock-crypto.ts
│
├── lib/
│
├── public/
│
├── types/
│
├── package.json
├── README.md
└── .gitignore
```

---

# 8. Initial Components

Suggested reusable components:

```text
Navbar
Footer
SectionHeader
MetricCard
ProjectCard
CryptoCard
CryptoTable
CryptoSearch
CryptoFilters
PriceChart
StatMetricCard
Tabs
EmptyState
LoadingState
ErrorState
```

---

# 9. Data Types

Initial TypeScript model:

```ts
export interface CryptoAsset {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  image?: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  updatedAt: string;
}
```

Historical data:

```ts
export interface CryptoHistoryPoint {
  timestamp: string;
  price: number;
  marketCap?: number;
  volume?: number;
}
```

Future statistical data:

```ts
export interface CryptoStatistics {
  meanReturn: number;
  medianReturn: number;
  standardDeviation: number;
  variance: number;
  skewness: number;
  kurtosis: number;
  minReturn: number;
  maxReturn: number;
}
```

---

# 10. Future API Contract

Do not implement the production backend during the first UI phase.

Prepare the frontend so mock data can later be replaced by API calls.

Expected future endpoints:

```text
GET /api/coins/latest
GET /api/coins/{coin_id}
GET /api/coins/{coin_id}/history
GET /api/coins/{coin_id}/statistics
GET /api/coins/{coin_id}/risk
GET /api/correlations
GET /api/rankings/volatility
```

Possible query example:

```text
GET /api/coins/bitcoin/history?period=30d
```

---

# 11. Current PostgreSQL Data

The existing pipeline currently stores fields similar to:

```text
extraction_time
coin_id
symbol
name
market_cap_rank
current_price
market_cap
total_volume
price_change_percentage_24h
source_parquet
loaded_at
```

Do not hard-code assumptions beyond these fields until the PostgreSQL schema is verified.

---

# 12. Development Phases

## Phase 1 — Frontend Foundation

Build:

- Next.js project
- TypeScript
- Tailwind CSS
- Global navigation
- Home
- Crypto market
- Crypto detail
- Projects
- About

Use mock data.

---

## Phase 2 — Visualization

Add:

- Apache ECharts
- Price chart
- Return charts
- Volume charts
- Responsive charts

---

## Phase 3 — Analytics UI

Add:

- Statistics tab
- Risk tab
- Correlation tab
- Analytical cards
- Distribution charts

Still allow mock data if backend is not ready.

---

## Phase 4 — Backend Integration

Homeserver:

```text
FastAPI
   ↓
PostgreSQL
```

Replace mock data with API requests.

---

## Phase 5 — Public Backend

Securely expose only the required FastAPI endpoints.

Do NOT expose publicly:

- PostgreSQL
- MinIO admin
- Airflow
- SSH
- `.env`

---

## Phase 6 — Machine Learning / Deep Learning

Integrate trained models.

Potential flow:

```text
External GPU training
        ↓
ONNX model
        ↓
Homeserver
        ↓
FastAPI
        ↓
QhapaqData
```

---

# 13. Git Workflow

Use Git from the beginning.

Recommended flow:

```text
Laptop
  ↓
feature branch
  ↓
commit
  ↓
GitHub
  ↓
Vercel automatic deployment
```

Basic commands:

```bash
git checkout -b feature/crypto-market
git add .
git commit -m "Add crypto market interface"
git push -u origin feature/crypto-market
```

Never commit:

```text
.env
API keys
database passwords
private certificates
credentials
```

Commit:

```text
.env.example
```

---

# 14. Vercel

Vercel hosts only the public frontend initially.

Deployment flow:

```text
Local development
      ↓
Git
      ↓
GitHub
      ↓
Vercel
      ↓
qhapaqdata.com
```

A new `git push` to the production branch should trigger a new deployment automatically.

The domain `qhapaqdata.com` will later be connected to Vercel through its DNS configuration.

---

# 15. First Codex Task

Start by creating the frontend only.

Requirements:

1. Create a Next.js project using TypeScript.
2. Configure Tailwind CSS.
3. Create the global dark-theme layout.
4. Create the navbar.
5. Create routes:
   - `/`
   - `/crypto`
   - `/crypto/[coin]`
   - `/analytics`
   - `/statistics`
   - `/ml`
   - `/projects`
   - `/about`
6. Use mock cryptocurrency data.
7. Implement a scrollable Top 100 cryptocurrency table.
8. Make each cryptocurrency row clickable.
9. Build an initial Bitcoin detail page.
10. Add analytical tabs:
    - Overview
    - Statistics
    - Risk
    - Correlation
    - Models
11. Do not implement FastAPI yet.
12. Do not implement authentication.
13. Do not introduce a database into the frontend.
14. Keep components reusable.
15. Ensure responsive behavior.
16. Keep the source code ready for future API integration.
17. Use Apache ECharts for charts.
18. Add loading and empty states.
19. Keep the interface professional and portfolio-oriented.
20. Do not make the site look like a cryptocurrency exchange.

---

# 16. Success Criteria for Version 1

Version 1 is successful when:

- The website runs locally.
- Navigation works.
- `/crypto` displays a professional scrollable crypto explorer.
- Search and sorting work.
- Clicking Bitcoin opens `/crypto/bitcoin`.
- The Bitcoin page has an interactive historical chart using mock data.
- Overview / Statistics / Risk / Correlation / Models tabs work.
- Projects and About pages exist.
- Mobile layout works.
- The project builds successfully with no TypeScript errors.
- The code is ready to be committed to GitHub and deployed to Vercel.

---

# 17. Important Principle

QhapaqData should demonstrate the complete progression:

```text
Data
  ↓
Engineering
  ↓
Analytics
  ↓
Statistics
  ↓
Machine Learning
  ↓
Interpretation
```

The website is not only a CV.

It is a working demonstration of data and AI skills.
