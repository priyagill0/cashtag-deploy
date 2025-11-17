"use client";
import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";

export default function GroupDetailsPage() {
  const { id } = useParams(); //extracts group ID from page.js
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  //Local state for email input, button loading state, and message display
  const { user } = useAuth();

  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [message, setMessage] = useState(null); // holds success/error message
  const [messageType, setMessageType] = useState("success"); // "success" | "error"

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);

  const [groupMembers, setGroupMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // State for editing
  const [editingExpense, setEditingExpense] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [viewMode] = useState("table");  //originally was going

  //fetch user's current groups
  useEffect(() => {
    if (id && user?.id) {
      fetchExpenses();
      fetchGroupMembers();
    }
  }, [id, user?.id]);

  const fetchExpenses = async () => {
    try {
      setIsLoadingExpenses(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/group-expense/group/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
      console.log("🔍 Fetched expenses:", data);
      console.log("📊 Number of expenses:", data.length);
        setExpenses(data);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  const fetchGroupMembers = async () => {
    try {
      setIsLoadingMembers(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/groups/${id}/members`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Group members data:", data);
        setGroupMembers(data);
      }
    } catch (err) {
      console.error("Error fetching group members:", err);
    } finally {
      setIsLoadingMembers(false);
    }
  };

  //Inviting users to group
  const handleInvite = async () => {
   //validates that input is an email
    if (!email.trim()) {
      setMessageType("error");
      setMessage("Please enter an email address.");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      setIsInviting(true);
      const token = localStorage.getItem("token");
      //Call backend to invite the user to this group
      const res = await fetch("http://localhost:8080/api/groups/invite", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email, groupId: id }),  //send group ID + user email
      });

      if (res.ok) {
        //shows success message and clears the field
        setMessageType("success");
        setMessage("User invited successfully!");
        setEmail("");
        fetchGroupMembers();
      } else {
        //if failed to invite user
        const errText = await res.text();
        setMessageType("error");
        setMessage(`Failed to invite user: ${errText}`);
      }
    } catch (err) {
      //catch network errors
      console.error("Error inviting user:", err);
      setMessageType("error");
      setMessage("Something went wrong while inviting the user.");
    } finally {
      setIsInviting(false);
      setTimeout(() => setMessage(null), 3000);  // hide after 3s
    }
  };


  const handleSettleShare = async (shareId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/group-expense/share/${shareId}/settle`, {
        method: "PUT",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        // Refresh expenses if any new payments come in 
        setMessageType("success");
        setMessage("Payment marked as settled!");
        setTimeout(() => setMessage(null), 3000);
        fetchExpenses();
      } else {
        const text = await res.text();
        setMessageType("error");
        setMessage(`Error: ${text}`);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Failed to make payment");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  //should be able to edit 
  const handleExpenseUpdate = async (expenseId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/group-expense/${expenseId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (res.ok) {
        const updatedExpense = await res.json();
        
        // Refresh expenses list using if statement
        setExpenses(prev => prev.map(exp => {
          if (exp.id === updatedExpense.id) {
            return updatedExpense;
          } else {
            return exp;
          }
        }));

        setMessageType("success");
        setMessage("Expense updated successfully!");
        setTimeout(() => setMessage(null), 3000);
        
        // Close edit modal
        setIsEditModalOpen(false);
        setEditingExpense(null);
      } else {
        const text = await res.text();
        setMessageType("error");
        setMessage(`Failed to update expense: ${text}`);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Error updating expense.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // should be able to delete it
  const handleDeleteExpense = async (expenseId) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/group-expense/${expenseId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setMessageType("success");
        setMessage("Expense deleted successfully!");
        setTimeout(() => setMessage(null), 3000);
        fetchExpenses();
      } else {
        const text = await res.text();
        setMessageType("error");
        setMessage(`Failed to delete: ${text}`);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessageType("error");
      setMessage("Error deleting expense.");
      setTimeout(() => setMessage(null), 3000);
    }
  };

  
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setIsEditModalOpen(true);
  };

  const handleExpenseAdded = () => {
    fetchExpenses();
    setMessageType("success");
    setMessage("Expense added successfully!");
    setTimeout(() => setMessage(null), 3000);
  };

  // Helper function to avoid repeating the same code 
  const help = (n) => {
    const x = Number(n);
    if (!isFinite(x)) return "—";
    return `$${x.toFixed(2)}`;
  };

  return (
    <main className="min-h-screen bg-pink-50 p-10">
        {/* Group Name */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{name || "Group"}</h1>

      {/* Message Display */}
      {message && (
        <div
          className={`mb-4 text-sm px-4 py-3 rounded-md transition-opacity duration-500 ${
            messageType === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* Group Members Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Group Members ({groupMembers.length})</h2>
        {isLoadingMembers ? (
          <p className="text-gray-500">Loading members...</p>
        ) : groupMembers.length === 0 ? (
          <p className="text-gray-500">No members yet.</p>
        ) : (
          <div className="space-y-2">
            {groupMembers.map((member) => {
              const memberUser = member.user || member;
              const memberName = memberUser?.name || memberUser?.username || "Unknown";
              const memberEmail = memberUser?.email || "No email";
              const memberId = member.id || memberUser?.id;
              const isCurrentUser = memberUser?.id === user?.id;

              return (
                <div key={memberId} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {memberName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {memberName}
                      {isCurrentUser && <span className="text-xs text-pink-500 ml-2">(You)</span>}
                    </p>
                    <p className="text-sm text-gray-500">{memberEmail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    {/* Expenses Section  */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Expenses ({expenses.length})</h2>
          </div>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add Expense
          </button>
        </div>

        {isLoadingExpenses ? (
          <p className="text-gray-500">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500">No expenses yet. Add to get started</p>
        ) : viewMode === "table" ? (
          //  view
          <div className="overflow-x-auto border rounded-2xl">
            <table className="min-w-full border-collapse text-sm">
              <thead className="bg-gray-100 text-gray-800 font-semibold">
                <tr>
                  <th className="px-4 py-2 border text-left">Date</th>
                  <th className="px-4 py-2 border text-left">Description</th>
                  <th className="px-4 py-2 border text-left">Category</th>
                  <th className="px-4 py-2 border text-left">Paid By</th>
                  <th className="px-4 py-2 border text-right">Total</th>
                  <th className="px-4 py-2 border text-left">Debts</th>
                  <th className="px-4 py-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  const isPaidByCurrentUser = expense.paidBy?.id === user?.id;

                  return (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-gray-700">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border text-gray-700 font-medium">
                        {expense.description}
                      </td>
                      <td className="px-4 py-2 border">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 py-2 border text-gray-700">
                        {isPaidByCurrentUser ? (
                          <span className="text-green-600 font-medium">You</span>
                        ) : (
                          expense.paidBy?.firstname || "Unknown"
                        )}
                      </td>
                      <td className="px-4 py-2 border text-right font-semibold">
                        {help(expense.total)}
                      </td>
                      <td className="px-4 py-2 border">
                        {/* Show debts breakdown */}
                        {expense.shares && expense.shares.length > 0 && (
                          <div className="space-y-1">
                            {expense.shares.map((share) => {
                              const isCurrentUserShare = share.user?.id === user?.id;
                              const shareName = share.user?.firstname || share.user?.username || "Unknown";

                              return (
                                <div key={share.id} className="flex items-center gap-2 text-xs">
                                  <span className="text-gray-600">
                                    {shareName}: {help(share.debt)}
                                  </span>
                                  
                                  {/* Show Pay button only if current user is in debt and it's not settled */}
                                  {isCurrentUserShare && !share.settled && (
                                    <button
                                      onClick={() => handleSettleShare(share.id)}
                                      className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-0.5 rounded"
                                    >
                                      Pay
                                    </button>
                                  )}
                                  
                                  {/* give a label for settled */}
                                  {share.settled && (
                                    <span className="text-xs text-green-600 font-medium">✓</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 border text-center">
                        {isPaidByCurrentUser && (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditClick(expense)}
                              className="text-xs text-blue-500 hover:text-blue-800 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-xs text-pink-600 hover:text-red-800 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          //  view
          <div className="space-y-2">
            {expenses.map((expense) => {
              // Check if current user paid for this expense
              const isPaidByCurrentUser = expense.paidBy?.id === user?.id;
              
              return (
                <div
                  key={expense.id}
                  className="flex flex-col p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  {/* Expense section */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(expense.date).toLocaleDateString()}
                        {expense.category && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {expense.category}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">${expense.total?.toFixed(2) || "0.00"}</p>
                      <p className="text-xs text-gray-500">
                        Paid by {expense.paidBy?.firstname || expense.paidBy?.name || expense.paidBy?.username || `User ${expense.paidByUserId?.slice(0, 8)}...` || "Unknown"}
                      </p>
                    </div>
                  </div>

                  {/* Shares Breakdown */}
                  {expense.shares && expense.shares.length > 0 && (
                    <div className="mt-3 ml-4 space-y-1">
                      {expense.shares.map((share) => {
                       
                        const isCurrentUserShare = share.user?.id === user?.id;
                        const shareName = share.user?.firstname || share.user?.username || "Unknown";

                        return (
                          <div
                            key={share.id}
                            className="flex justify-between items-center text-sm"
                          >
                            <span className="text-gray-600">
                              {shareName} owes ${share.debt?.toFixed(2) || "0.00"}
                            </span>

                            {/* Show Pay button only if current user is in debt and it's not settled */}
                            {isCurrentUserShare && !share.settled && (
                              <button
                                onClick={() => handleSettleShare(share.id)}
                                className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                              >
                                This is Paid
                              </button>
                            )}
                            
                            {/* give a label for settled */}
                            {share.settled && (
                              <span className="text-xs text-green-600 font-medium">✓ Settled</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Edit&Delete buttons (only for expense creator) */}
                  {isPaidByCurrentUser && (
                    <div className="flex gap-2 mt-3 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => handleEditClick(expense)}
                        className="text-xs text-blue-400 hover:text-blue-800 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense.id)}
                        className="text-xs text-pink-400 hover:text-red-800 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invite Section */}
      <div className="bg-white rounded-lg shadow-md p-4 w-96 relative">
        <h2 className="text-lg font-semibold mb-2">Invite Members</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="email"
            placeholder="Enter email to invite"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleInvite()}
            className="border border-gray-300 rounded-lg p-2 flex-1"
          />
          <button
            onClick={handleInvite}
            disabled={isInviting}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {isInviting ? "Inviting..." : "Invite"}
          </button>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AddGroupExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        groupId={id}
        currentUserId={user?.id}
        groupMembers={groupMembers}
        onExpenseAdded={handleExpenseAdded}
      />

      {/* Edit Expense Modal */}
      {editingExpense && (
        <AddGroupExpenseModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingExpense(null);
          }}
          groupId={id}
          currentUserId={user?.id}
          groupMembers={groupMembers}
          onExpenseAdded={fetchExpenses}
          existingExpense={editingExpense}
          onExpenseUpdate={handleExpenseUpdate}
        />
      )}
    </main>
  );
}

// Combined Modal for Add/Edit
function AddGroupExpenseModal({ 
  isOpen, 
  onClose, 
  groupId, 
  groupMembers, 
  currentUserId, 
  onExpenseAdded,
  existingExpense = null,
  onExpenseUpdate = null
}) 
  {
  // Check if user is editing
  const isEdit = !!existingExpense;
  
  const [description, setDescription] = useState("");
  const [total, setTotal] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [shares, setShares] = useState([]);
  const [splitType, setSplitType] = useState("equal");

  // NEW: Populate form with existing expense data if editing
  useEffect(() => {
    if (isEdit && existingExpense) {
      setDescription(existingExpense.description);
      setTotal(existingExpense.total.toString());
      setDate(existingExpense.date);
      setCategory(existingExpense.category);
      
      // Set existing shares
      if (existingExpense.shares) {
        setShares(existingExpense.shares.map(s => ({
          userId: s.user?.id || s.userId,
          debt: s.debt
        })));
        setSplitType("manual"); // Assume manual if editing
      }
    } else {
      // Reset form for add mode
      setDescription("");
      setTotal("");
      setDate(new Date().toISOString().split('T')[0]);
      setCategory("");
      setSplitType("equal");
      setShares([]);
    }
  }, [isEdit, existingExpense, isOpen]);

  // Fetch categories 
  useEffect(() => {
    if (!isOpen) return;
    fetch("http://localhost:8080/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, [isOpen]);

  // split options, equal or manually select
  useEffect(() => {
    if (!groupMembers.length || isEdit) return;
    const split = total && splitType === "equal"
      ? parseFloat(total) / groupMembers.length
      : 0;

    setShares(groupMembers.map(m => ({
      userId: m.user?.id || m.id,
      debt: parseFloat(split.toFixed(2))
    })));
  }, [groupMembers, total, splitType, isEdit]);

  const handleShareChange = (userId, value) => {
    setShares(prev => prev.map(s => s.userId === userId ? { ...s, debt: parseFloat(value) || 0 } : s));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return alert("Select a category");

    const totalShares = shares.reduce((sum, s) => sum + (s.debt || 0), 0);
    if (Math.abs(totalShares - parseFloat(total)) > 0.01) {
      return alert(`Total split ($${totalShares}) must equal expense ($${total})`);
    }

    const dataStruct = {
      description,
      total: parseFloat(total),
      date,
      category: category.toUpperCase(),
      paidByUserId: currentUserId,
      shares
    };

    if (isEdit) {
      // Update existing expense
      await onExpenseUpdate(existingExpense.id, dataStruct);
      onClose();
    } else {
      // Add new expense
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:8080/api/group-expense/group/${groupId}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(dataStruct)
        });

        if (res.ok) {
          setDescription(""); 
          setTotal(""); 
          setCategory(""); 
          setSplitType("equal");
          onExpenseAdded(); 
          onClose();
        } 
        else {
          const text = await res.text();
          alert(`Error: ${text}`);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to add expense");
      }
    }
  };

  if (!isOpen) return null;

  const totalSplit = shares.reduce((sum, s) => sum + (s.debt || 0), 0);
  const isBalanced = Math.abs(totalSplit - parseFloat(total || 0)) < 0.01;

  return (
    <div className="fixed inset-0 bg-pink flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* title updates */}
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Edit Expense" : "Add Group Expense"}
        </h2>

        {/* Form for adding/editing an expense */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="text" 
          placeholder="Description" 
          value={description} onChange={e => setDescription(e.target.value)} 
          className="border p-2 rounded w-full" required />

          <input type="number" 
          placeholder="Total" step="0.01" 
          value={total} onChange={e => setTotal(e.target.value)}
           className="border p-2 rounded w-full" required />
          <select value={category} 
          onChange={e => setCategory(e.target.value)} 
          className="border p-2 rounded w-full" required>
            <option value="">Select Category</option>
            {categories.map((cat, i) => <option key={i} value={cat}>{cat.charAt(0).toUpperCase()+cat.slice(1).toLowerCase()}</option>)}
          </select>

          <input type="date" value={date}
           onChange={e => setDate(e.target.value)} 
           className="border p-2 rounded w-full" required />

          {/* Split cost */}
          <div>
            <h3 className="font-semibold mb-2">Split Between Members</h3>

            {/* Equal or custom (hide in edit mode) */}
            {!isEdit && (
              <div className="flex gap-2 mb-2">
                <label>
                  <input
                    type="radio"
                    value="equal"
                    checked={splitType === "equal"}
                    onChange={() => setSplitType("equal")}
                  /> Equal Split
                </label>
                <label>
                  <input
                    type="radio"
                    value="manual"
                    checked={splitType === "manual"}
                    onChange={() => setSplitType("manual")}
                  /> Custom Split
                </label>
              </div>
            )}

            {/* debts */}
            {shares.map((s, idx) => {
              const member = groupMembers.find(m => (m.user?.id || m.id) === s.userId);
              const memberUser = member?.user || member;
              return (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{memberUser?.firstname || memberUser?.name || "Unknown"}</span>
                  <input
                    type="number"
                    step="0.01"
                    value={s.debt ?? 0}
                    onChange={e => handleShareChange(s.userId, e.target.value)}
                    disabled={!isEdit && splitType === "equal"} // only editable if custom or edit mode
                    className="border p-1 rounded w-24 text-right disabled:bg-gray-100"
                  />
                </div>
              );
            })}
          </div>

          {/* Balance message */}
          {total && (
            <div className="mt-2 text-sm">
              <span className={isBalanced ? "text-green-600" : "text-red-600"}>
                Total: ${totalSplit.toFixed(2)} / ${parseFloat(total).toFixed(2)}
                {!isBalanced && " Not balanced"}
                </span>
                </div>
                )}
                <div className="flex justify-end gap-3 mt-4">
        <button 
          type="button" 
          onClick={onClose} 
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={!isBalanced}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {/*Button text changes based on mode */}
          {isEdit ? "Update Expense" : "Add Expense"}
        </button>
      </div>
    </form>
  </div>
</div>
  )
  }

