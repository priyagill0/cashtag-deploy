"use client";

import { useMemo } from "react";

function fmtCurrency(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toISO = (d) => d.toISOString().slice(0, 10);
  return { start: toISO(start), end: toISO(end) };
}

export default function SummaryPanel({ expenses = [] }) {
  const { start, end, monthLabel, total, byCategory, count } = useMemo(() => {
    const { start, end } = getCurrentMonthRange();
    const d = new Date(start + "T00:00:00");
    const monthLabel = d.toLocaleDateString(undefined, { month: "long", year: "numeric" });

    const inRange = (isoDate) => {
      const x = new Date(isoDate);
      return x >= new Date(start) && x <= new Date(end);
    };

    const filtered = Array.isArray(expenses)
      ? expenses.filter((e) => e && e.date && inRange(e.date))
      : [];

    const total = filtered.reduce((s, e) => s + Number(e.amount || 0), 0);
    const byCategory = {};
    for (const e of filtered) {
      const key = e.category || "UNCATEGORIZED";
      byCategory[key] = (byCategory[key] || 0) + Number(e.amount || 0);
    }

    return { start, end, monthLabel, total, byCategory, count: filtered.length };
  }, [expenses]);

  return (
    <>


      <section className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="text-sm text-gray-500">Total Spending in {monthLabel}</div>
          <div className="text-3xl font-semibold mt-1">{fmtCurrency(total)}</div>
          <div className="text-xs text-gray-400 mt-1">{count} transactions</div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 md:col-span-2">
          <div className="text-sm text-gray-500 mb-2">Spending by Category in {monthLabel}</div>
          {Object.keys(byCategory || {}).length === 0 ? (
            <div className="text-gray-500">No spending in {monthLabel} yet.</div>
          ) : (
            <div className="max-h-48 overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-600">
                  <tr>
                    <th className="text-left py-1">Category</th>
                    <th className="text-right py-1">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(byCategory)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, amt]) => (
                      <tr key={cat} className="border-t">
                        <td className="py-1">{cat}</td>
                        <td className="py-1 text-right font-medium">{fmtCurrency(amt)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
