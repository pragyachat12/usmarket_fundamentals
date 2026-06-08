import { fetchFredSeries, computeCpiYoY } from './api/fred.js';
import { fetchYahooQuote } from './api/yahoo.js';
import { buildLineChart } from './charts/charts.js';
import { setMetric, deltaClass, formatDelta, vixRegime } from './components/metrics.js';
import { SAMPLE_DATA } from './components/sampleData.js';

// --- DOM refs ---
const fredKeyInput = document.getElementById('fred-key');
const loadBtn = document.getElementById('load-btn');
const refreshBtn = document.getElementById('refresh-btn');
const statusBadge = document.getElementById('status-badge');
const lastUpdated = document.getElementById('last-updated');
const errorBar = document.getElementById('error-bar');
const dataModeLabel = document.getElementById('data-mode-label');

// --- Status helpers ---
function setStatus(mode) {
  statusBadge.className = 'status-badge ' + mode;
  if (mode === 'live') {
    statusBadge.textContent = 'live data';
    dataModeLabel.textContent = 'live data via FRED + Yahoo Finance';
  } else if (mode === 'loading') {
    statusBadge.textContent = 'loading…';
    dataModeLabel.textContent = 'fetching…';
  } else {
    statusBadge.textContent = 'sample data';
    dataModeLabel.textContent = 'showing sample data — paste FRED key for live data';
  }
}

function showError(msg) {
  errorBar.textContent = msg;
  errorBar.style.display = 'block';
  setTimeout(() => (errorBar.style.display = 'none'), 7000);
}

// --- Render ---
function render(d, isLive) {
  const ffrNow = d.ffr.values.at(-1);
  const ffrPrev = d.ffr.values.at(-2);
  const cpiNow = d.cpi.values.at(-1);
  const cpiPrev = d.cpi.values.at(-2);
  const unempNow = d.unemp.values.at(-1);
  const unempPrev = d.unemp.values.at(-2);
  const realRate = (d.t10y - cpiNow).toFixed(2);

  // Macro metrics
  setMetric('ffr', ffrNow.toFixed(2) + '%', formatDelta(ffrNow, ffrPrev), deltaClass(ffrNow, ffrPrev));
  setMetric('cpi', cpiNow.toFixed(1) + '%', formatDelta(cpiNow, cpiPrev), deltaClass(cpiNow, cpiPrev, true));
  setMetric('unemp', unempNow.toFixed(1) + '%', formatDelta(unempNow, unempPrev), deltaClass(unempNow, unempPrev, true));
  setMetric('t10y', d.t10y.toFixed(2) + '%', 'nominal 10Y yield', 'delta-flat');

  // Equity metrics
  const spDelta = isLive && d.sp_delta ? d.sp_delta : (d.sp_delta || '—');
  setMetric('sp', d.sp.toLocaleString(), spDelta, 'delta-flat');
  setMetric('vix', d.vix.toFixed(1), isLive ? (d.vix_delta || '—') : d.vix_delta || '—',
    d.vix > 20 ? 'delta-down' : 'delta-up');
  document.getElementById('real-val').textContent =
    (realRate > 0 ? '+' : '') + realRate + '%';

  const rv = vixRegime(d.vix);
  document.getElementById('regime-val').textContent = rv.label;
  const regimeSub = document.getElementById('regime-sub');
  regimeSub.textContent = rv.sub;
  regimeSub.className = 'metric-delta ' + rv.cls;

  // Charts
  buildLineChart('ffr-chart', d.ffr.labels, d.ffr.values, '#185FA5');
  buildLineChart('cpi-chart', d.cpi.labels, d.cpi.values, '#993C1D', 2.0);
  buildLineChart('unemp-chart', d.unemp.labels, d.unemp.values, '#0F6E56');

  lastUpdated.textContent = 'updated ' + new Date().toLocaleTimeString();
  setStatus(isLive ? 'live' : 'sample');
}

// --- Load live data ---
async function loadAll() {
  const key = (fredKeyInput.value.trim() || import.meta.env.VITE_FRED_API_KEY || '').trim();

  if (!key) {
    render(SAMPLE_DATA, false);
    return;
  }

  setStatus('loading');
  try {
    const [ffr, cpiRaw, unemp, t10yRaw] = await Promise.all([
      fetchFredSeries('FEDFUNDS', key, 24),
      fetchFredSeries('CPIAUCSL', key, 36), // extra months for YoY calc
      fetchFredSeries('UNRATE', key, 24),
      fetchFredSeries('DGS10', key, 2),
    ]);

    const cpi = computeCpiYoY(cpiRaw);
    const t10y = t10yRaw.values.at(-1);

    let sp = SAMPLE_DATA.sp;
    let sp_delta = SAMPLE_DATA.sp_delta;
    let vix = SAMPLE_DATA.vix;
    let vix_delta = SAMPLE_DATA.vix_delta;

    try {
      const [spData, vixData] = await Promise.all([
        fetchYahooQuote('%5EGSPC'),
        fetchYahooQuote('%5EVIX'),
      ]);
      sp = Math.round(spData.value);
      sp_delta = spData.deltaPercent != null
        ? (spData.deltaPercent > 0 ? '+' : '') + spData.deltaPercent + '%'
        : '—';
      vix = parseFloat(vixData.value.toFixed(1));
      vix_delta = vixData.deltaPercent != null
        ? (vixData.deltaPercent > 0 ? '+' : '') + vixData.deltaPercent
        : '—';
    } catch (yahooErr) {
      console.warn('Yahoo Finance fetch failed, using sample equity data:', yahooErr.message);
    }

    render({ ffr, cpi, unemp, t10y, sp, sp_delta, vix, vix_delta }, true);
  } catch (err) {
    showError('Error: ' + err.message + ' — check your FRED API key');
    setStatus('sample');
    render(SAMPLE_DATA, false);
  }
}

// --- Event listeners ---
loadBtn.addEventListener('click', loadAll);
refreshBtn.addEventListener('click', loadAll);
fredKeyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') loadAll();
});

// --- Init ---
render(SAMPLE_DATA, false);
