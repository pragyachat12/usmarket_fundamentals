// Yahoo Finance via allorigins CORS proxy (no API key needed)
const PROXY = 'https://api.allorigins.win/raw?url=';
const YAHOO = 'https://query1.finance.yahoo.com/v8/finance/chart';

/**
 * Fetch latest price + 1-day delta for a Yahoo Finance symbol.
 * @param {string} symbol - e.g. '%5EGSPC' (S&P 500), '%5EVIX'
 * @returns {{ value: number, deltaPercent: string }}
 */
export async function fetchYahooQuote(symbol) {
  const url = `${YAHOO}/${symbol}?interval=1d&range=5d`;
  const res = await fetch(PROXY + encodeURIComponent(url));
  if (!res.ok) throw new Error(`Yahoo HTTP ${res.status} for ${symbol}`);

  const json = await res.json();
  const result = json?.chart?.result?.[0];
  if (!result) throw new Error(`No data returned for ${symbol}`);

  const closes = result.indicators.quote[0].close.filter(Boolean);
  const last = closes.at(-1);
  const prev = closes.at(-2);
  const deltaPercent =
    prev != null
      ? ((last - prev) / prev * 100).toFixed(2)
      : null;

  return {
    value: last,
    deltaPercent,
  };
}
