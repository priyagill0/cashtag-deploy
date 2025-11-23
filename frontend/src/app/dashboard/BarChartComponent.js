"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Tooltip,
 Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useAuth } from "../../hooks/useAuth"; // import your auth hook 

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);


const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
// const TEST_USER_ID = "6899c10f-f3e4-4101-b7fe-c72cbe0e07ba";



export default function BarChartComponent({ refreshKey }) {
 const [chartData, setChartData] = useState({ labels: [], datasets: [] });
 const { user, loading } = useAuth("/login");
 //  const [userId, setUserId] = useState(null);
//  const userId = user?.id;


 useEffect(() => {
  if (!user?.id) return; 

    // Fetch all expenses from backend for this user
   fetch(`${API}/api/expense/user/${user?.id}?all=true`)
     .then((res) => res.json())
     .then((rows) => {
       // Total expenses per month
       const monthlyTotals = {};


       rows.forEach((expense) => {
         const date = new Date(`${expense.date}T00:00:00`);

         if (isNaN(date)) return;


         // Group by month
         const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        
         // Add up all expenses for this month
         monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + expense.amount;
       });


       const months = Object.keys(monthlyTotals).sort();
       const labels = months.map((m) => {
         const [year, month] = m.split("-").map(Number);
         return new Date(year, month - 1).toLocaleDateString(undefined, {
           month: "short",
           year: "numeric",
         });
       });
       const totals = months.map((m) => monthlyTotals[m].toFixed(2));


       setChartData({
         labels,
         datasets: [{
           label: "Total ($)",
           data: totals,
           backgroundColor: "rgb(155, 197, 221)",
         }],
       });
     })
     .catch(() => setChartData({ labels: [], datasets: [] }));
 }, [user?.id, refreshKey]);

 // Dynamic y-axis 
 const maxValue =
    chartData.datasets[0]?.data?.length > 0
      ? Math.max(...chartData.datasets[0].data.map(Number))
      : 0;

 const options = {
   responsive: true,
   maintainAspectRatio: false,
   layout: { padding: { top: 60, right: 8, bottom: 28, left: 8 } },
   plugins: {
     legend: { display: false },
     tooltip: {
        // Show month amount total when hovering over the bars
       callbacks: { label: (ctx) => `$${ctx.parsed.y.toFixed(2)}` },
     },
     datalabels: {
       anchor: "end",
       align: "top",
       color: "#000",
       font: { weight: "bold", size: 12 },
       formatter: (v) => `$${v}`,
     },
   },
   scales: {
      y: {
        beginAtZero: true,
        suggestedMax: maxValue * 1.2, // Ensure that there is space above the bar
        ticks: { callback: (v) => `$${v}` },
      },
    },
 };


 return (
   <section className="bg-white rounded-2xl shadow-md p-6 mb-6 mt-6">
     <h2 className="text-xl font-semibold mb-3">Total Expenses Per Month</h2>
     <div className="h-80">
       <Bar data={chartData} options={options} />
     </div>
   </section>
 );
}

