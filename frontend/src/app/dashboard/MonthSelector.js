
export function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toISO = (d) => d.toISOString().slice(0, 10);
  return { start: toISO(start), end: toISO(end) };
}

export function monthStringToRange(ym) {
  const [y, m] = ym.split("-").map(Number);
  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 0);
  const toISO = (d) => d.toISOString().slice(0, 10);
  return { start: toISO(startDate), end: toISO(endDate) };
}

export function fmtCurrency(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}
