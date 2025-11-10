"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const userId = "6899c10f-f3e4-4101-b7fe-c72cbe0e07ba"; 

  //fetch user’s current groups
  useEffect(() => {
    fetch(`http://localhost:8080/api/groups/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGroups(data);
        else if (data?.content && Array.isArray(data.content)) setGroups(data.content);
        else setGroups([]);
      })
      .catch((err) => {
        console.error("Error fetching groups:", err);
        setGroups([]);
      });
  }, []);

  //Group creation
  const handleCreateGroup = async () => {
    //no blank group names
    if (!newGroupName.trim()) return alert("Please enter a group name.");

    try {
      setIsCreating(true);
      const res = await fetch("http://localhost:8080/api/groups/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        //send group name and ID to backend
        body: JSON.stringify({
          name: newGroupName,
          ownerId: userId,
        }),
      });

      //update state if successful
      if (res.ok) {
        const createdGroup = await res.json();
        setGroups((prev) => [...prev, createdGroup]);
        setNewGroupName("");
      } else {
        console.error("Failed to create group");
      }
    } catch (err) {
      console.error("Error creating group:", err);
    } finally {
      setIsCreating(false);
    }
  };

  //Inviting users to group
  const handleInvite = async (groupId) => {
    const emailInput = document.getElementById(`invite-${groupId}`);
    const email = emailInput.value.trim();
    if (!email) return alert("Please enter an email.");
  
    try {
      //send invite to backend
      const res = await fetch("http://localhost:8080/api/groups/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, groupId }),
      });
      //show alert based on success
      if (res.ok) {
        alert("User invited successfully!");
        emailInput.value = "";
      } else {
        const errText = await res.text();
        alert(`Failed to invite user: ${errText}`);
      }
    } catch (err) {
      console.error("Failed to invite user:", err);
      alert("Failed to invite user.");
    }
  };
  

  return (
    <main className="min-h-screen bg-pink-50 p-10">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Groups</h1>

      {/* Create Group Section */}
      <div className="mb-10 flex gap-3 items-center">
        <input
          type="text"
          placeholder="Enter group name..."
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-64"
        />
        <button
          onClick={handleCreateGroup}
          disabled={isCreating}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-60"
        >
          {isCreating ? "Creating..." : "+ Create Group"}
        </button>
      </div>

      {/* display group list */}
      {groups.length === 0 ? (
        <p className="text-gray-500">No groups found.</p>
      ) : (
        <div className="grid gap-4">
{groups.map((g) => (
    <Link key={g.id} href={`/groups/${g.id}?name=${encodeURIComponent(g.name)}`}>
  <div className="bg-white shadow-md rounded-xl p-4 w-96 hover:scale-[1.02] hover:shadow-lg transition-transform cursor-pointer">
    <h3 className="text-lg font-semibold">{g.name}</h3>
    <p className="text-sm text-gray-600 mb-3"></p>
  </div>
</Link>

))}

        </div>
      )}
    </main>
  );
}
