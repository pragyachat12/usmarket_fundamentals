function sampleDates(n) {
  const dates = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    dates.push(d.toISOString().slice(0, 7));
  }
  return dates;
}

export const SAMPLE_DATA = {
  ffr: {
    labels: sampleDates(24),
    values: [5.33,5.33,5.33,5.33,5.33,5.33,5.33,5.33,5.08,4.83,4.58,4.33,
             4.33,4.33,4.33,4.33,4.33,4.33,4.33,4.33,4.33,4.33,4.33,4.33],
  },
  cpi: {
    labels: sampleDates(24),
    values: [3.1,3.2,3.5,3.4,3.3,3.0,2.9,2.6,2.4,2.7,2.9,2.9,
             3.0,2.8,2.7,2.6,2.5,2.5,2.6,2.5,2.4,2.4,2.3,2.3],
  },
  unemp: {
    labels: sampleDates(24),
    values: [3.7,3.9,3.8,3.9,4.0,4.1,4.3,4.2,4.1,4.2,4.1,4.0,
             4.0,4.1,4.2,4.2,4.2,4.1,4.0,4.0,4.1,4.2,4.2,4.1],
  },
  t10y: 4.32,
  sp: 5487,
  sp_delta: '+0.8%',
  vix: 16.4,
  vix_delta: '-1.2',
};
