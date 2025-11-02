"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
const USER_ID = process.env.NEXT_PUBLIC_USER_ID || "6899c10f-f3e4-4101-b7fe-c72cbe0e07ba";

export default function TransactionsPage() {
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    number: 0,
    size: 5,          // default rows per page
    totalPages: 1,
  });
  const [totalElements, setTotalElements] = useState(0);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("date,desc");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [categories, setCategories] = useState([]);
  const [sizeChoice, setSizeChoice] = useState("5"); // 5 or 10 or 20 or All expenses on one page

  
  // Load categories from backend enum
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/categories`);
        if (!res.ok) throw new Error("Failed to load categories");
        setCategories(await res.json());
      } catch (e) {
        console.error("Category load error:", e);
      }
    })();
  }, []);

  // Fetch transactions with the pages option
  const fetchPage = async (page = 0, size = pageInfo.size) => {
    try {
      setLoading(true);
      setErr("");

      // If "All" is selected, this is to get everything
      const effectiveSize =
        sizeChoice === "ALL" ? 999999 : Number(size || pageInfo.size);

      const params = new URLSearchParams({
        page: String(page),
        size: String(effectiveSize),
        sort,
      });
      if (q) params.set("q", q);
      if (category) params.set("category", category);

      const url = `${API}/api/expense/user/${USER_ID}?${params.toString()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`${res.status} ${res.statusText} → ${txt}`);
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setRows(data);
        setTotalElements(data.length);
        setPageInfo({ number: 0, size: data.length, totalPages: 1 });
      } else {
        // Spring Page
        setRows(data.content || []);
        setTotalElements(data.totalElements ?? (data.content?.length || 0));

        // If "All", force single page display
        if (sizeChoice === "ALL") {
          setPageInfo({
            number: 0,
            size: data.totalElements ?? effectiveSize,
            totalPages: 1,
          });
        } else {
          setPageInfo({
            number: data.number ?? 0,
            size: data.size ?? effectiveSize,
            totalPages: data.totalPages ?? 1,
          });
        }
      }
    } catch (e) {
      setErr(e.message || String(e));
      setRows([]);
      setTotalElements(0);
      setPageInfo({ number: 0, size: 5, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch to filters/sort/page size choice changes
  useEffect(() => {
    // reset to first page whenever criteria changes
    const newSize = sizeChoice === "ALL" ? pageInfo.size : Number(sizeChoice);
    setPageInfo((p) => ({ ...p, number: 0, size: newSize }));
    fetchPage(0, newSize);
  }, [q, category, sort, sizeChoice]);

  const fmt = (n) => {
    const x = Number(n);
    if (!isFinite(x)) return "—";
    return `$${x.toFixed(2)}`;
  };

  const pagingDisabled = sizeChoice === "ALL";

  return (
    // matched log in page ui
    <main className="min-h-screen bg-black flex items-start sm:items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl bg-white text-black rounded-3xl shadow-2xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-[#28799B] mb-6">
          Transactions
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search description…"
            className="border rounded px-3 py-2 text-black placeholder:text-gray-400"
          />

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

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-3 py-2 text-black"
          >
            <option value="date,desc">Newest first</option>
            <option value="date,asc">Oldest first</option>
            <option value="amount,desc">Amount high to low</option>
            <option value="amount,asc">Amount low to high</option>
          </select>

          {/* Rows per page */}
          <select
            value={sizeChoice}
            onChange={(e) => setSizeChoice(e.target.value)}
            className="border rounded px-3 py-2 text-black"
            title="Rows per page"
          >
            <option value="5">5 / page</option>
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="ALL">All</option>
          </select>
        </div>

        {/* If any Error */}
        {err && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm">
            <div className="font-semibold">Couldn’t load transactions</div>
            <div className="opacity-80 break-all">{err}</div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="animate-pulse text-gray-600 mb-2 text-center">
            Loading…
          </div>
        )}

        {/* Table */}
        {!loading && rows.length > 0 && !err && (
          <div className="overflow-x-auto border rounded-2xl">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-100 text-gray-800 font-semibold">
                <tr>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Category</th>
                  <th className="px-4 py-2 border">Description</th>
                  <th className="px-4 py-2 border text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr
                    key={e.id ?? `${e.date}-${e.description}-${e.amount}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 border text-gray-700">{e.date}</td>
                    <td className="px-4 py-2 border text-gray-700">
                      {String(e.category || "—")}
                    </td>
                    <td className="px-4 py-2 border text-gray-700">
                      {e.description || "—"}
                    </td>
                    <td className="px-4 py-2 border text-right font-medium">
                      {fmt(e.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && rows.length === 0 && !err && (
          <div className="text-gray-600 text-center">No transactions found.</div>
        )}

        {/* Pages */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            disabled={pagingDisabled || pageInfo.number <= 0}
            onClick={() => fetchPage(pageInfo.number - 1, pageInfo.size)}
            className="border rounded px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {pageInfo.number + 1} / {Math.max(pageInfo.totalPages, 1)}
          </span>
          <button
            disabled={pagingDisabled || pageInfo.number + 1 >= pageInfo.totalPages}
            onClick={() => fetchPage(pageInfo.number + 1, pageInfo.size)}
            className="border rounded px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center">
          Showing {rows.length} of {totalElements} items
          {sizeChoice === "ALL" ? " (all on one page)" : ""}
          <span className="ml-2">• API: {API}</span>
        </div>
      </div>
    </main>
  );
}
