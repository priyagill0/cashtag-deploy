"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth"; // import your auth hook

export default function UserBadges() {
  const { user, loading: authLoading } = useAuth("/login"); // get logged-in user
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    // fetch earned badges for the user
    async function fetchBadges() {
      try {
        setLoading(true);
        setError(null);

        if (!user?.id) return; 

        const res = await fetch(`http://localhost:8080/api/badge/user/${user?.id}`);
        if (!res.ok) throw new Error("Failed to fetch earned badges");

        const data = await res.json();
        setEarnedBadges(data);
        console.log("Fetched badges:", data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchBadges();
  }, [user]);

  // Fetch the number of days for user login streak
  useEffect(() => {
    async function fetchUser() {
        if (user) {
            try { fetch(`http://localhost:8080/api/users/${user.id}/streak`)
            .then((res) => res.json())
            .then((data) => {
            console.log("Fetched user streak:", data);
            setCurrentStreak(data); //API just returns the number
        })
        }
            catch (err) {
            console.error("Error fetching user streak:", err);
            }
        }
    }  
    fetchUser()
    }, [user]);


  if (authLoading || loading) return <p>Loading badges...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {earnedBadges.map((earnedBadge) => (
        <div
        key={earnedBadge.badge.id}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1rem",
          width: "150px",
          textAlign: "center"
        }}
      >
        <img
          src={earnedBadge.badge.icon}
          style={{ width: "64px", height: "64px", marginBottom: "0.5rem" }}
        />
        <h1 style={{ fontSize: "1.2rem" }}>{earnedBadge.badge.name}</h1>
      
        {/* For the streak badge show a custom description with the number of days. */}
        {earnedBadge.badge.eventType === "STREAK" ? (
          <p style={{ fontSize: "0.9rem" }}>{currentStreak} day streak!</p>
        ) : (
          <p style={{ fontSize: "0.9rem" }}>{earnedBadge.badge.description}</p>
        )}
      </div>
      
      ))}
    </div>
  );
}
