"use client";


import { useState, useEffect, useMemo } from "react";
import AddExpenseModal from "./AddExpenseModal";
import EditExpenseModal from "./EditExpenseModal";
import BarChartComponent from "./BarChartComponent";
import TotalAndCategory from "./TotalAndCategory";
import { getCurrentMonthRange, monthStringToRange, fmtCurrency } from "./MonthSelector";


const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"; 


export default function Dashboard() {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [expenses, setExpenses] = useState([]);
 const [refresh, setRefresh] = useState(false);
 const [userId, setUserId] = useState(null);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [selectedExpense, setSelectedExpense] = useState(null);
 // user select month like nov
const [selectedMonth, setSelectedMonth] = useState("");


 // month range (current month)
const [{ start, end }] = useState(getCurrentMonthRange());

//  current month list + summary
const [monthExpenses, setMonthExpenses] = useState([]);

//  which range to show as selected month or current month
const { viewStart, viewEnd } = useMemo(() => {
  if (selectedMonth) {
    const { start: s, end: e } = monthStringToRange(selectedMonth);
    return { viewStart: s, viewEnd: e };
  }
  return { viewStart: start, viewEnd: end };
}, [selectedMonth, start, end]);

const viewLabel = useMemo(() => {
  const d = new Date(viewStart + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}, [viewStart]);



 useEffect(() => {
    const id =
      (typeof window !== "undefined" && localStorage.getItem("userId")) ||
      "6899c10f-f3e4-4101-b7fe-c72cbe0e07ba"; // fallback user
    setUserId(id); // store it in state
  }, []);

 const handleExpenseAdded = () => setRefresh(!refresh);
 const handleExpenseUpdated = () => setRefresh(!refresh);


 useEffect(() => {
   const userId = "6899c10f-f3e4-4101-b7fe-c72cbe0e07ba";
   if (!userId) return;
   fetch(`http://localhost:8080/api/expense/user/${userId}?all=true`)
     .then((res) => res.json())
     .then((data) => setExpenses(data))
     .catch((err) => console.error("Error fetching expenses:", err));
 }, [refresh, userId]);

 useEffect(() => {
  if (!Array.isArray(expenses)) return;
  const inRange = (isoDate) => {
    const x = new Date(isoDate);
   return x >= new Date(viewStart) && x <= new Date(viewEnd);
  };
  setMonthExpenses(expenses.filter((e) => e && e.date && inRange(e.date)));
}, [expenses, viewStart, viewEnd]);


 const handleDeleteClick = async (expenseId) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/expense/${expenseId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRefresh(!refresh);
      } else {
        console.error("Failed to delete expense");
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
    }
  };

  const handleEditClick = (expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };



 return (
   <main className="min-h-screen bg-pink-50 p-10">
     {/* Header */}
     <div className="flex justify-between items-center mb-8">
       <h1 className="text-3xl font-bold text-gray-800">My Expenses</h1>
       <button
         onClick={() => setIsModalOpen(true)}
         className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-5 py-2 rounded-lg shadow-md"
       >
         + Add Expense
       </button>
     </div>

{/* Month picker */}
<div className="flex items-center gap-3 mb-4">
  <label className="text-sm text-gray-600">Choose month:</label>
  <input
  type="month"
  value={selectedMonth || viewStart.slice(0, 7)}  // <-- "YYYY-MM"
  onChange={(e) => setSelectedMonth(e.target.value)}
  className="border rounded-md px-2 py-1"
/>

  <button
    type="button"
    onClick={() => setSelectedMonth("")}
    className="text-sm text-pink-600 hover:underline"
    title="Reset to current month"
  >
    This month
  </button>
</div>


     {/* Showing which month is default */}
<p className="text-gray-600 mb-4">
  Showing <span className="font-medium">{viewLabel}</span>
</p>

   {/* Total Spending + category */}
  <TotalAndCategory expenses={expenses} start={viewStart} end={viewEnd} monthLabel={viewLabel} />

     {/* bar chart */}
     {userId && <BarChartComponent userId={userId} refreshKey={refresh} />}

    {/* current month expenses table  */}
<div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl mx-auto mb-8">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold text-gray-800">
      Expenses in {viewLabel}
    </h2>
  </div>

  {monthExpenses.length === 0 ? (
    <p className="text-gray-500">No expenses found for {viewLabel}.</p>
  ) : (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="border-b text-gray-800">
          <th className="pb-2">Description</th>
          <th className="pb-2">Amount</th>
          <th className="pb-2">Category</th>
          <th className="pb-2">Date</th>
        </tr>
      </thead>
      <tbody>
        {monthExpenses.map((exp) => (
          <tr key={exp.id} className="border-b hover:bg-pink-50">
            <td className="py-2">{exp.description}</td>
            <td className="py-2">{fmtCurrency(exp.amount)}</td>
            <td className="py-2">{exp.category}</td>
            <td className="py-2">{exp.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


     {/*temporary recent expenses section */}
     <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl mx-auto">
       <h2 className="text-xl font-semibold text-gray-800 mb-4">
         Recent Expenses
       </h2>


       {expenses.length === 0 ? (
         <p className="text-gray-500">
         </p>
       ) : (
         <table className="w-full border-collapse text-left">
           <thead>
             <tr className="border-b text-gray-800">
               <th className="pb-2">Description</th>
               <th className="pb-2">Amount</th>
               <th className="pb-2">Category</th>
               <th className="pb-2">Date</th>
            <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className="border-b hover:bg-pink-50">
                  <td className="py-2">{exp.description}</td>
                  <td className="py-2">${exp.amount.toFixed(2)}</td>
                  <td className="py-2">{exp.category}</td>
                  <td className="py-2">{exp.date}</td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleEditClick(exp)}
                      className="text-[#9BC5DD] hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(exp.id)}
                      className="text-[#cb8a90] hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

     {/* Modal (pop up) */}
     <AddExpenseModal
       isOpen={isModalOpen}
       onClose={() => setIsModalOpen(false)}
       onExpenseAdded={handleExpenseAdded}
     />

   <EditExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        expense={selectedExpense}
        onExpenseUpdated={handleExpenseUpdated}
      />
    </main>
 );
}