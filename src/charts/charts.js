import Chart from 'chart.js/auto';

const chartInstances = {};

const TICK_STYLE = {
  font: { size: 10, family: "'DM Mono', monospace" },
  color: '#888780',
};

/**
 * Build or rebuild a line chart on a canvas element.
 * @param {string} canvasId
 * @param {string[]} labels
 * @param {number[]} data
 * @param {string} color - hex color for the line
 * @param {number|null} annotationValue - optional horizontal reference line
 */
export function buildLineChart(canvasId, labels, data, color, annotationValue = null) {
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }

  const ctx = document.getElementById(canvasId).getContext('2d');

  const datasets = [
    {
      label: 'Value',
      data,
      borderColor: color,
      backgroundColor: color + '22',
      fill: true,
      tension: 0.35,
      pointRadius: 0,
      pointHoverRadius: 4,
      borderWidth: 2,
    },
  ];

  if (annotationValue !== null) {
    datasets.push({
      label: '2% target',
      data: Array(labels.length).fill(annotationValue),
      borderColor: '#888780',
      borderDash: [4, 4],
      borderWidth: 1.5,
      pointRadius: 0,
      fill: false,
    });
  }

  chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y.toFixed(2)}%`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            ...TICK_STYLE,
            maxRotation: 0,
            autoSkip: true,
            maxTicksLimit: 6,
          },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          ticks: {
            ...TICK_STYLE,
            callback: (v) => v.toFixed(1) + '%',
          },
          grid: { color: 'rgba(136,135,128,0.12)' },
          border: { display: false },
        },
      },
    },
  });
}
