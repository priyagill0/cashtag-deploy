"use client";

import { useState, useEffect } from "react";
import AddExpenseModal from "./AddExpenseModal";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const handleExpenseAdded = () => setRefresh(!refresh);

  useEffect(() => {
    const userId = "6899c10f-f3e4-4101-b7fe-c72cbe0e07ba"; 
    fetch(`http://localhost:8080/api/expense/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error("Error fetching expenses:", err));
  }, [refresh]);

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
              <tr className="border-b text-gray-600">
                <th className="pb-2">Description</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className="border-b hover:bg-pink-50">
                  <td className="py-2">{exp.description}</td>
                  <td className="py-2">${exp.amount.toFixed(2)}</td>
                  <td className="py-2">{exp.category}</td>
                  <td className="py-2">{exp.date}</td>
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
    </main>
  );
}
