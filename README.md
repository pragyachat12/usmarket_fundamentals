# US Market Fundamentals Dashboard

An interactive dashboard tracking key US macroeconomic and equity market indicators, built with Vite + vanilla JS.

**Live data via:**
- [FRED API](https://fred.stlouisfed.org/) (Federal Reserve Economic Data) — macro indicators
- Yahoo Finance (via CORS proxy) — S&P 500, VIX

---

## Indicators

**Macro layer**
- Fed Funds Rate (`FEDFUNDS`)
- CPI YoY Inflation (`CPIAUCSL`)
- Unemployment Rate (`UNRATE`)
- 10Y Treasury Yield (`DGS10`)

**Equity layer**
- S&P 500 index level
- VIX (CBOE Volatility Index)
- Real Rate (10Y − CPI, derived)
- VIX Regime classification (Complacent / Calm / Elevated / Fear)

---

## Setup

```bash
git clone https://github.com/YOUR_USERNAME/market-fundamentals-dashboard.git
cd market-fundamentals-dashboard
npm install
```

**Add your FRED API key** (free at [fred.stlouisfed.org](https://fred.stlouisfed.org/docs/api/api_key.html)):

```bash
cp .env.example .env
# edit .env and paste your key
```

```
VITE_FRED_API_KEY=your_key_here
```

```bash
npm run dev
```

Alternatively, paste your key directly in the UI input field at runtime (no `.env` needed).

---

## Deploy to GitHub Pages

```bash
npm run build
```

Then push the `dist/` folder, or use the [GitHub Pages + Vite guide](https://vitejs.dev/guide/static-deploy.html#github-pages).

Make sure `vite.config.js` has `base` set to your repo name:

```js
base: '/market-fundamentals-dashboard/',
```

---

