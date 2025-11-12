"use client";
import { useSearchParams, useParams } from "next/navigation";
import { useState } from "react";

export default function GroupDetailsPage() {
  const { id } = useParams(); //extracts group ID from page.js
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  //Local state for email input, button loading state, and message display
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [message, setMessage] = useState(null); // holds success/error message
  const [messageType, setMessageType] = useState("success"); // "success" | "error"

  //invite button
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
     //Call backend to invite the user to this group
      const res = await fetch("http://localhost:8080/api/groups/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, groupId: id }), //send group ID + user email
      });

      if (res.ok) {
        //shows success message and clears the field
        setMessageType("success");
        setMessage("User invited successfully!");
        setEmail("");
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
      setTimeout(() => setMessage(null), 3000); // hide after 3s
    }
  };

  return (
    <main className="min-h-screen bg-pink-50 p-10">
      {/* Group Name */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{name || "Group"}</h1>

      {/* Expenses Placeholder */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Expenses</h2>
        <p className="text-gray-500">Expenses displayed here</p>
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

        {/* Inline message */}
        {message && (
          <div
            className={`text-sm px-3 py-2 rounded-md transition-opacity duration-500 ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
