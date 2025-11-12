"use client";


import { useState, useEffect, useMemo } from "react";
import AddExpenseModal from "./AddExpenseModal";
import EditExpenseModal from "./EditExpenseModal";
import AddBudgetModal from "./AddBudgetModal";
import EditBudgetModal from "./EditBudgetModal";
import BarChartComponent from "./BarChartComponent";
import { BudgetBar } from "./BudgetBar";
import SummaryComponents from "./SummaryComponents";


const API = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"; 


// current month helper
function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toISO = (d) => d.toISOString().slice(0, 10);
  return { start: toISO(start), end: toISO(end) };
}

// format money helper
function fmtCurrency(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}


export default function Dashboard() {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [expenses, setExpenses] = useState([]);
 const [refresh, setRefresh] = useState(false);
 const [userId, setUserId] = useState(null);
 const [isEditModalOpen, setIsEditModalOpen] = useState(false);
 const [isEBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

 const [selectedExpense, setSelectedExpense] = useState(null);

 const [budgets, setBudgets] = useState(null); // store fetched data
 const [selectedBudget, setSelectedBudget] = useState(null);
 const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = useState(false);
 // month range (current month)
const [{ start, end }] = useState(getCurrentMonthRange());

//  current month list + summary
const [monthExpenses, setMonthExpenses] = useState([]);

// label: "November 2025"
const monthLabel = useMemo(() => {
  const d = new Date(start + "T00:00:00");
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}, [start]);


 useEffect(() => {
    const id =
      (typeof window !== "undefined" && localStorage.getItem("userId")) ||
      "6899c10f-f3e4-4101-b7fe-c72cbe0e07ba"; // fallback user
    setUserId(id); // store it in state
  }, []);

 const handleExpenseAdded = () => setRefresh(!refresh);
 const handleExpenseUpdated = () => setRefresh(!refresh);
  const handleBudgetAdded = () => setRefresh(!refresh);


 useEffect(() => {
   const userId = "6899c10f-f3e4-4101-b7fe-c72cbe0e07ba";
   if (!userId) return;
   fetch(`http://localhost:8080/api/expense/user/${userId}?all=true`)
     .then((res) => res.json())
     .then((data) => setExpenses(data))
     .catch((err) => console.error("Error fetching expenses:", err));
 }, [refresh, userId]);


 useEffect(() => {
  const userId = "6899c10f-f3e4-4101-b7fe-c72cbe0e07ba";
  const month = "2025-11";

  fetch(`http://localhost:8080/api/budget/user/${userId}/${month}`) // YYYY-MM
    .then((response) => response.json())
    .then((data) => setBudgets(data))
    .catch((err) => console.error("Error fetching budgets:", err));
}, [refresh, userId,]);

 useEffect(() => {
  if (!Array.isArray(expenses)) return;
  const inRange = (isoDate) => {
    const x = new Date(isoDate);
    return x >= new Date(start) && x <= new Date(end);
  };
  setMonthExpenses(expenses.filter((e) => e && e.date && inRange(e.date)));
}, [expenses, start, end]);


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
       <div className="flex justify-end items-end gap-3 mb-8">
       <button
         onClick={() => setIsModalOpen(true)}
         className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-5 py-2 rounded-lg shadow-md"
       >
         + Add Expense
       </button>      
       <button
         onClick={() => setIsBudgetModalOpen(true)}
         className="bg-[#bcecac] hover:bg-[#a5d79c] font-medium px-5 py-2 rounded-lg shadow-md"
       >
         + Add Budget
       </button>
       </div>
     </div>

     {/* Showing which month is default */}
<p className="text-gray-600 mb-4">
  Showing <span className="font-medium">{monthLabel}</span> by default
</p>

  <SummaryComponents expenses={expenses} start={start} end={end} monthLabel={monthLabel} />


     {/* bar chart */}
     {userId && <BarChartComponent userId={userId} refreshKey={refresh} />}

     {/* <div className="flex justify-between gap-3 max-w-6xl mx-auto"> */}
     <div className="flex justify-between gap-6 w-full">
    {/* current month expenses table  */}
<div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl mx-auto mb-8">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold text-gray-800">
      Expenses in {monthLabel}
    </h2>
  </div>

  {monthExpenses.length === 0 ? (
    <p className="text-gray-500">No expenses found for {monthLabel}.</p>
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
     <div className="flex-[2] bg-white rounded-2xl shadow-md p-6 min-w-[300px] ">
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


      <div className="flex-[1] space-y-4 min-w-[300px]">
      <h2 className="flex justify-center text-xl font-semibold text-gray-800 mb-4">
         Budgets For The Month
       </h2>
       {budgets && budgets.length > 0 ? (   // if budgets exist, map through and show BudgetBar components
          budgets.map((budget) => (
            <BudgetBar
              key={budget.category}          // unique key for React
              category={budget.category}     // category name
              spent={budget.currentAmount}   // amount spent in this category
              budget={budget.maxAmount}      // budget for this category
              onEdit={(category) => {        // edit handler
                const b = budgets.find(b => b.category === category);
                setSelectedBudget(b);
                setIsEditBudgetModalOpen(true);
              }}
              onDelete={async (category) => {  // delete handler
                if (!confirm("Are you sure you want to delete this budget?")) return;
                await fetch(
                  `http://localhost:8080/api/budget/user/${userId}/${budget.month}/${category}`,
                  { method: "DELETE" }
                );
                setRefresh(prev => !prev);
              }}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">No budgets set yet for this month.</p>
        )}

        </div>
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

    <AddBudgetModal
       isOpen={isEBudgetModalOpen}
       onClose={() => setIsBudgetModalOpen(false)}
       onBudgetAdded={handleBudgetAdded}
     />
 
      <EditBudgetModal
        isOpen={isEditBudgetModalOpen}
        onClose={() => setIsEditBudgetModalOpen(false)}
        budget={selectedBudget}
        onBudgetUpdated={handleBudgetAdded} 
      />

    </main>
 );
}