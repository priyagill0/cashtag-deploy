"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function ReportsPage() {
  const { user, loading } = useAuth("/login");
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );
  const [report, setReport] = useState(null);
  const [trend, setTrend] = useState([]);


  useEffect(() => {
    if (!user?.id) return;
  
    fetch(`${API}/api/expense/user/${user.id}/monthly-report?month=${month}`)
      .then((res) => res.json())
      .then((data) => setReport(data))
      .catch((err) => console.error("Report fetch error:", err));
  
    fetch(`${API}/api/expense/user/${user.id}/trend`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = Object.entries(data).map(([month, total]) => ({
          month,
          total
        }));
        setTrend(formatted);
      })
      .catch((err) => console.error("Trend fetch error:", err));
  }, [user?.id, month]);
  

  function formatMonth(ym) {
    if (!ym) return "";
    const [year, month] = ym.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }
  
  

  if (loading) return <p>Loading...</p>;

  return (
    <main className="min-h-screen bg-pink-50 p-10">
      <h1 className="text-3xl font-bold mb-6">Monthly Spending Report</h1>

      {/* Month picker */}  
      <div className="flex gap-3 mb-6 items-center">
        <span className="text-gray-700">Select Month:</span>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

      {!report ? (
        <p className="text-gray-600">Loading report...</p>

        
      ) : (
        <div className="space-y-6">

          
{/* Summary Squares */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  
  {/* Total Spending */}
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
    <p className="text-sm text-gray-500">Total Spending</p>
    <p className="text-2xl font-bold mt-1">${report.totalSpending.toFixed(2)}</p>
  </div>

  {/* Daily Average */}
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
    <p className="text-sm text-gray-500">Daily Average</p>
    <p className="text-2xl font-bold mt-1">
      ${(
        report.totalSpending /
        new Date(report.startDate).getDate() // clever trick: startDate = first day of month
      ).toFixed(2)}
    </p>
  </div>

  {/* Percent Change */}
  {/* Change From Last Month */}
<div className="bg-white p-6 rounded-2xl shadow-md">
  <p className="text-sm text-gray-500">Change From Last Month</p>

  {/* Percentage */}
  <p
    className={
      report.percentChangeFromLastMonth >= 0
        ? "text-red-600 text-2xl font-bold mt-1"
        : "text-green-600 text-2xl font-bold mt-1"
    }
  >
    {report.percentChangeFromLastMonth !== null
  ? report.percentChangeFromLastMonth.toFixed(2) + "%"
  : "No data"}

  </p>

  {/* Dollar difference message */}
  {(() => {
    const diff = report.totalSpending - report.lastMonthTotalSpending;
    const absDiff = Math.abs(diff).toFixed(2);

    return (
      <p className="text-sm text-gray-600 mt-1">
        {diff > 0
          ? `You spent $${absDiff} more than last month.`
          : diff < 0
          ? `You spent $${absDiff} less than last month.`
          : "Your spending is the same as last month."}
      </p>
    );
  })()}
</div>


</div>


{/* BIGGEST CATEGORY CARD */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
    <p className="text-sm text-gray-500">Biggest Category</p>
    <p className="text-xl font-semibold mt-1">
      {report.biggestExpenseCategory}
    </p>
    <p className="text-gray-700">
      ${report.biggestExpenseAmount.toFixed(2)}
    </p>
  </div>

  

  {/* OPTIONAL: Add placeholders for symmetry */}

  {/* Highest Single Expense */}
<div className="bg-white p-6 rounded-2xl shadow-md">
  <p className="text-sm text-gray-500">Highest Single Expense</p>

  {report.highestTransaction ? (
  <>
    <p className="text-xl font-semibold mt-1">
      ${report.highestTransaction.amount.toFixed(2)}
    </p>
    <p className="text-gray-700 mt-1">
      {report.highestTransaction.category}
    </p>
  </>
) : (
  <p>No expenses this month.</p>
)}

</div>

 
</div>




          {/* Category Breakdown */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h3 className="text-lg font-semibold mb-3">
              Spending by Category
            </h3>

            {Object.keys(report.spendingByCategory).length === 0 ? (
              <p>No category spending this month.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b text-gray-600">
                  <tr>
                    <th className="py-2 text-left">Category</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(report.spendingByCategory).map(
                    ([cat, amt]) => (
                      <tr key={cat} className="border-b">
                        <td className="py-2">{cat}</td>
                        <td className="py-2 text-right font-medium">
                          ${amt.toFixed(2)}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            )}
          </div>

            {/* Trend Chart */}
<div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
  <h3 className="text-lg font-semibold mb-4">6-Month Spending Trend</h3>

  {trend.length > 0 ? (
    <LineChart width={600} height={300} data={trend}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="total" stroke="#ec4899" strokeWidth={2} />
    </LineChart>
  ) : (
    <p className="text-gray-500">Loading trend...</p>
  )}
</div>
        </div>
      )}
    </main>
  );
}
