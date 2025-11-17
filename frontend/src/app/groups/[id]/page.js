"use client";
import { useSearchParams, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";

export default function GroupDetailsPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const { user } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);

  const [groupMembers, setGroupMembers] = useState([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

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
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
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
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGroupMembers(data);
      }
    } catch (err) {
      console.error("Error fetching group members:", err);
    } finally {
      setIsLoadingMembers(false);
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

  //helper function to avoid rewriting code
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

      {/* Expenses Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Expenses ({expenses.length})</h2>

        {isLoadingExpenses ? (
          <p className="text-gray-500">Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500">No expenses yet.</p>
        ) : (
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
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  return (
                    <tr key={expense.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border font-medium">{expense.description}</td>
                      <td className="px-4 py-2 border">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-4 py-2 border">{expense.paidBy?.firstname || "Unknown"}</td>
                      <td className="px-4 py-2 border text-right font-semibold">{help(expense.total)}</td>
                      <td className="px-4 py-2 border">
                        {expense.shares?.map((share) => {
                          const isCurrentUserShare = share.user?.id === user?.id;
                          return (
                            <div key={share.id} className="flex items-center gap-2 text-xs">
                              <span className="text-gray-600">
                                {share.user?.firstname || "Unknown"}: {help(share.debt)}
                              </span>
                              {isCurrentUserShare && !share.settled && (
                                <button
                                  onClick={() => handleSettleShare(share.id)}
                                  className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-0.5 rounded"
                                >
                                  Pay
                                </button>
                              )}
                              {share.settled && <span className="text-xs text-green-600 font-medium">✓</span>}
                            </div>
                          );
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
