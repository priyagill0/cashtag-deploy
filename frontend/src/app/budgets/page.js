"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function BudgetsPage() {
  const { user, loading: authLoading } = useAuth("/login");

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // filters
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("month,desc");
  const [categories, setCategories] = useState([]);
  const [monthFilter, setMonthFilter] = useState(""); 

  // fetch all budgets for this user
  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) return;

    const fetchBudgets = async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`${API}/api/budget/user/${user.id}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`${res.status} ${res.statusText} -> ${txt}`);
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setRows(data);
        } else {
          setRows([]);
        }
      } catch (e) {
        setErr(e.message || String(e));
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [authLoading, user]);

  // load categories for filter
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${API}/api/categories`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (e) {
        console.error("Category load error:", e);
      }
    };
    loadCategories();
  }, []);

  // currency format
  const fmt = (n) => {
    const x = Number(n);
    if (!isFinite(x)) return "-";
    return `$${x.toFixed(2)}`;
  };

  // filter budgets
  const filteredSortedRows = (() => {
    let filtered = rows;

    if (category) {
      filtered = filtered.filter((b) => String(b.category) === category);
    }

    if (monthFilter) {
      filtered = filtered.filter((b) => {
        const budgetMonth = String(b.month || "").slice(0, 7); 
        return budgetMonth === monthFilter;
      });
    }

    // sort budgets
    const sorted = [...filtered].sort((a, b) => {
      switch (sort) {
        case "month,asc":
          return String(a.month).localeCompare(String(b.month));
        case "month,desc":
          return String(b.month).localeCompare(String(a.month));
        case "budget,desc":
          return (b.maxAmount || 0) - (a.maxAmount || 0);
        case "budget,asc":
          return (a.maxAmount || 0) - (b.maxAmount || 0);
        default:
          return 0;
      }
    });

    return sorted;
  })();

  return (
    <main className="min-h-screen bg-pink-50 flex items-start sm:items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white text-black rounded-3xl shadow-2xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-[#28799B] mb-6">
          Budget History
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          {/* Month filter */}
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="border rounded px-3 py-2 text-black"
          />

          {/* Category filter */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-3 py-2 text-black"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-3 py-2 text-black"
          >
            <option value="month,desc">Newest first</option>
            <option value="month,asc">Oldest first</option>
            <option value="budget,desc">Budget high to low</option>
            <option value="budget,asc">Budget low to high</option>
          </select>
        </div>

        {/* Error */}
        {err && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm">
            <div className="font-semibold">Couldn’t load budgets</div>
            <div className="opacity-80 break-all">{err}</div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="animate-pulse text-gray-600 mb-2 text-center">
            Loading…
          </div>
        )}

        {/* No budgets */}
        {!loading && filteredSortedRows.length === 0 && !err && (
          <div className="text-gray-600 text-center">No budgets found.</div>
        )}

        {/* Budget table */}
        {!loading && filteredSortedRows.length > 0 && !err && (
          <div className="overflow-x-auto border rounded-2xl">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-100 text-gray-800 font-semibold">
                <tr>
                  <th className="px-4 py-2 border text-left">Month</th>
                  <th className="px-4 py-2 border text-left">Category</th>
                  <th className="px-4 py-2 border text-right">Budget</th>
                  <th className="px-4 py-2 border text-right">Amount Spent</th>
                </tr>
              </thead>
              <tbody>
                {filteredSortedRows.map((b) => (
                  <tr
                    key={b.id ?? `${b.userId}-${b.month}-${b.category}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 border text-gray-700">
                      {b.month}
                    </td>
                    <td className="px-4 py-2 border text-gray-700">
                      {String(b.category || "–")}
                    </td>
                    <td className="px-4 py-2 border text-right">
                      {fmt(b.maxAmount)}
                    </td>
                    <td className="px-4 py-2 border text-right">
                      {fmt(b.currentAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 text-center">
          Showing {filteredSortedRows.length} of {rows.length} budgets • API: {API}
        </div>
      </div>
    </main>
  );
}