"use client";
import { useState, useEffect } from "react";

export default function EditExpenseModal({ isOpen, onClose, expense, onExpenseUpdated }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Populate form when modal opens and expense is set
  useEffect(() => {
    if (isOpen && expense) {
      setTitle(expense.description);
      setAmount(expense.amount);
      setCategory(expense.category);
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories`)
        .then((res) => res.json())
        .then((data) => setCategories(data))
        .catch((err) => console.error("Error fetching categories", err));
    }
  }, [isOpen, expense]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!expense) return;

    const updatedExpense = {
      ...expense,
      description: title,
      amount: parseFloat(amount),
      category: category.toUpperCase(),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/expense/${expense.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedExpense),
      });

      if (res.ok) {
        onExpenseUpdated();
        onClose();
      } else {
        const errorText = await res.text();
        console.error("Error updating expense:", errorText);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Expense</h2>

        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
          {/* Expense Title */}
          <input
            type="text"
            placeholder="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
          />

          {/* Amount */}
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded"
          />

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </option>
            ))}
          </select>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
