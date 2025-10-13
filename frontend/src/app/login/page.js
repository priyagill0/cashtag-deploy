"use client";

import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      if (!res.ok) throw new Error("Failed to create user");

      const result = await res.json();
      setMessage(`✅ User created: ${result.username}`);
      setUsername("");
      setEmail("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error sending data");
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Register User</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Submit
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </main>
  );
}
