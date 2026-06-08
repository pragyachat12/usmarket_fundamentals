const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations';

/**
 * Fetch a FRED series and return { labels, values } for the last n months.
 * @param {string} seriesId - FRED series ID (e.g. 'FEDFUNDS')
 * @param {string} apiKey
 * @param {number} n - number of months to return
 */
export async function fetchFredSeries(seriesId, apiKey, n = 24) {
  const end = new Date().toISOString().slice(0, 10);
  const start = new Date(Date.now() - n * 35 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);

  const url =
    `${FRED_BASE}?series_id=${seriesId}` +
    `&api_key=${apiKey}` +
    `&file_type=json` +
    `&observation_start=${start}` +
    `&observation_end=${end}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`FRED HTTP ${res.status} for ${seriesId}`);

  const json = await res.json();
  if (json.error_message) throw new Error(json.error_message);

  const obs = json.observations.filter((o) => o.value !== '.');
  const labels = obs.map((o) => o.date.slice(0, 7));
  const values = obs.map((o) => parseFloat(o.value));

  return { labels: labels.slice(-n), values: values.slice(-n) };
}

/**
 * Compute YoY % change from a raw CPI level series (needs n+12 months of data).
 */
export function computeCpiYoY({ labels, values }) {
  const yoyLabels = [];
  const yoyValues = [];
  for (let i = 12; i < values.length; i++) {
    const yoy = ((values[i] - values[i - 12]) / values[i - 12]) * 100;
    yoyLabels.push(labels[i]);
    yoyValues.push(parseFloat(yoy.toFixed(2)));
  }
  return { labels: yoyLabels.slice(-24), values: yoyValues.slice(-24) };
}
