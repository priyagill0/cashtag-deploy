"use client";

import { Pie } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

// Fixed colours for each category
const CATEGORY_COLOURS = {
  TRAVEL: "#FFC8CC",
  ENTERTAINMENT: "#9067D6",
  EDUCATION: "#FF8A8F",
  TRANSPORTATION: "#FCECCF",
  MISCELLANEOUS: "#B2F2D9",
  DINING: "#68D7A6",
  SHOPPING: "#7BC9FF",
  HEALTH: "#D8B4FF",
  GROCERIES: "#3A84FF"
};

// legend order
const CATEGORY_ORDER = [
  "TRAVEL",
  "ENTERTAINMENT",
  "TRANSPORTATION",
  "EDUCATION",
  "MISCELLANEOUS",
  "DINING",
  "SHOPPING",
  "HEALTH",
  "GROCERIES"
];

// Use the filtered monthly expenses to build the pie chart for total spending by category for that month
export default function PieChartComponent({ expenses = [], monthLabel }) {
  const router = useRouter();

  // Totals per category
  const totals = {};
  expenses.forEach((e) => {
    if (!e) return;
    const cat = e.category || "UNCATEGORIZED";
    totals[cat] = (totals[cat] || 0) + Number(e.amount || 0);
  });

  const labels = CATEGORY_ORDER.filter((cat) => totals[cat] > 0); // Category labels
  const cat_totals = labels.map((c) => totals[c]); // Total amounts per category

  // If there are no expenses yet for this month
  if (labels.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Spending by Category in {monthLabel}</h2>
        <p className="text-gray-500">No expenses in {monthLabel} yet.</p>
      </div>
    );
  }

  // Total amount spent for that month - used when finding the percentages
  const totalAmount = cat_totals.reduce((sum, v) => sum + v, 0);

  const data = {
    labels,
    datasets: [
      {
        data: cat_totals,
        // Colours for pie chart slices
        backgroundColor: labels.map((cat) => CATEGORY_COLOURS[cat]),
        borderColor: "white",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: "#000",
        font: { weight: "bold", size: 14 },
        formatter: (_, ctx) => {
          const cat_total = ctx.dataset.data[ctx.dataIndex];
          const percent = Math.round((cat_total / totalAmount) * 100);
          // Show perecentage on each slice
          return percent + "%";
        },
      },
      legend: {
        position: "right",
        labels: {
          color: "#000",
          font: { size: 14 },
        },
        // Make legend clickable on hover
        onHover: (event) => {
          if (event?.native?.target) {
            event.native.target.style.cursor = "pointer";
          }
        },

        // Clicking on a legend category takes user to the transaction page with 
        // the corresponding category filter applied
        onClick: (_, item) => {
          const selectedCategory = item.text;
          localStorage.setItem("txCategoryFilter", selectedCategory);
          router.push("/transactions");
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const cat_total = ctx.raw;
            const percent = Math.round((cat_total / totalAmount) * 100);
            return `${percent}%`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-3">
        Spending by Category in {monthLabel}
      </h2>

      <div className="h-80">
        <Pie data={data} options={options} />
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Click a category in the legend to view transactions of that type.
      </p>
    </div>
  );
}