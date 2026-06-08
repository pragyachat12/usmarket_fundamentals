/**
 * Set a metric card's value, delta text, and delta color class.
 */
export function setMetric(idPrefix, valueStr, deltaStr, deltaClass = 'delta-flat') {
  const valEl = document.getElementById(`${idPrefix}-val`);
  const deltaEl = document.getElementById(`${idPrefix}-delta`);
  if (valEl) valEl.textContent = valueStr;
  if (deltaEl) {
    deltaEl.textContent = deltaStr;
    deltaEl.className = `metric-delta ${deltaClass}`;
  }
}

/**
 * Determine delta CSS class based on direction and whether up is bad.
 * @param {number} current
 * @param {number} previous
 * @param {boolean} invertPositive - true if going up is bad (e.g. inflation, unemployment)
 */
export function deltaClass(current, previous, invertPositive = false) {
  if (current == null || previous == null) return 'delta-flat';
  const isUp = current > previous;
  if (isUp) return invertPositive ? 'delta-down' : 'delta-up';
  return invertPositive ? 'delta-up' : 'delta-down';
}

/**
 * Format a signed delta string, e.g. "+0.25%" or "-0.10%".
 */
export function formatDelta(current, previous, decimals = 2, suffix = '%') {
  if (current == null || previous == null) return '—';
  const diff = current - previous;
  const sign = diff > 0 ? '+' : '';
  return `${sign}${diff.toFixed(decimals)}${suffix} vs prev`;
}

/**
 * Return VIX regime label and description.
 */
export function vixRegime(vix) {
  if (vix < 12) return { label: 'Complacent', sub: '< 12 — very low fear', cls: 'delta-up' };
  if (vix < 20) return { label: 'Calm', sub: '12–20 — normal vol', cls: 'delta-up' };
  if (vix < 30) return { label: 'Elevated', sub: '20–30 — caution', cls: 'delta-flat' };
  return { label: 'Fear', sub: '> 30 — risk-off', cls: 'delta-down' };
}
