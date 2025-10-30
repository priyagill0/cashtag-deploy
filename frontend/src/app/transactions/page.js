"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const EXPENSES_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expense/user/${process.env.NEXT_PUBLIC_USER_ID}`;

export default function TransactionsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(EXPENSES_URL, { cache: "no-store" });

      if (!res.ok) {
        console.error("Failed to fetch expenses:", res.status);
        setRows([]);
        return;
      }

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    // Auto-refresh every 8 seconds + reload when tab refocuses
    const t = setInterval(load, 8000);
    const onFocus = () => load();
    const onVisible = () => document.visibilityState === "visible" && load();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(t);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const total = useMemo(
    () => rows.reduce((s, r) => s + Number(r.amount || 0), 0),
    [rows]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa] p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl p-8 shadow-md">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#28799B]">
            Expense History
          </h1>
          <p className="text-gray-500 pt-2">
            Review all your past transactions
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#9BC5DD]/30">
              <tr>
                <Th>Date</Th>
                <Th>Description</Th>
                <Th>Category</Th>
                <Th className="text-right w-32">Amount ($)</Th>
              </tr>
            </thead>
            <tbody className="divide-y bg-white">
              {loading && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              )}
              {rows.map((e) => (
                <tr key={e.id} className="hover:bg-[#f0f8fc] transition">
                  <Td>
                    {new Date((e.date || "") + "T00:00:00").toLocaleDateString()}
                  </Td>
                  <Td>{e.description || "—"}</Td>
                  <Td>
                    <Badge>{e.category}</Badge>
                  </Td>
                  <Td className="text-right font-semibold text-[#28799B]">
                    ${Number(e.amount).toFixed(2)}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right text-gray-600 mt-4">
          <span className="font-semibold">Total:</span> ${total.toFixed(2)}
        </div>

        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-block text-[#28799B] font-bold hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th
      className={`px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider text-[#28799B] ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>{children}</td>;
}

function Badge({ children }) {
  return (
    <span className="inline-flex rounded-full bg-[#9BC5DD]/40 px-2.5 py-0.5 text-xs font-medium text-[#28799B]">
      {children}
    </span>
  );
}
