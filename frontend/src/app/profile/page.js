"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../utils/supabase/client";

const API_BASE = "http://localhost:8080/api";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth("/login");

  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

    // keep track of the current full name in Supabase
  const [authFullName, setAuthFullName] = useState("");


  // edit 
  const [isEditing, setIsEditing] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [avatarInput, setAvatarInput] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  const fileInputRef = useRef(null);

  // password change or reset
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");

  // data  loading

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      router.push("/login");
      return;
    }

    // current full_name from Supabase metadata
    const metaFullName = user.user_metadata?.full_name || "";
    setAuthFullName(metaFullName);


        const loadData = async () => {
      try {
        // Profile from backend
        const res = await fetch(`${API_BASE}/users/${user.id}`);

        if (!res.ok) {
          throw new Error("Could not load profile.");
        }

        const profileData = await res.json();
        setProfile(profileData);

        let first = profileData.firstname || "";
        let last = profileData.lastname || "";

        setFirstNameInput(first);
        setLastNameInput(last);

        // avatar: backend first, then Supabase metadata
        setAvatarInput(
          profileData.avatarUrl || user.user_metadata?.avatar_url || ""
        );

        // 2) Badges
        const badgesRes = await fetch(
          `http://localhost:8080/api/badge/user/${user.id}`
        );
        if (badgesRes.ok) {
          const badgesData = await badgesRes.json();
          setBadges(badgesData);
        }
      } catch (e) {
        console.error(e);
        setError(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };


    loadData();
  }, [authLoading, user, router]);

  // edit profile
    const handleToggleEdit = () => {
    if (!profile) return;

    setFirstNameInput(profile.firstname || "");
    setLastNameInput(profile.lastname || "");
    setAvatarInput(
      profile.avatarUrl || user.user_metadata?.avatar_url || ""
    );

    setPwMessage("");
    setCurrentPassword("");
    setNewPassword("");
    setIsEditing(true);
  };


  const handleCancelEdit = () => {
    setIsEditing(false);
    setPwMessage("");
    setCurrentPassword("");
    setNewPassword("");
  };

     const handleSave = async () => {
    if (!user || !profile) return;

    try {
      // 1) Update your backend user row
      const updated = {
        ...profile,
        firstname: firstNameInput,
        lastname: lastNameInput,
        avatarUrl: avatarInput || null,
      };

      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Failed to update profile.");
      const saved = await res.json();
      setProfile(saved);

      // Build a metadata update object WITHOUT wiping old values
      let fullName = `${firstNameInput} ${lastNameInput}`.trim();

      // if both fields are empty, keep the old Supabase name 
      if (!fullName && authFullName) {
        fullName = authFullName;
      }

      const metaUpdate = {};

      if (fullName) {
        metaUpdate.full_name = fullName;
      }
      if (firstNameInput) {
        metaUpdate.first_name = firstNameInput;
      }
      if (lastNameInput) {
        metaUpdate.last_name = lastNameInput;
      }
      if (avatarInput) {
        metaUpdate.avatar_url = avatarInput;
      }

      // only call updateUser if something to update
      if (Object.keys(metaUpdate).length > 0) {
        const { data: updatedUser, error: metaError } =
          await supabase.auth.updateUser({ data: metaUpdate });

        if (metaError) {
          console.warn("Could not update Supabase metadata:", metaError);
        } else if (updatedUser?.user) {
          // keep local copy in sync so it survives reloads
          setAuthFullName(
            updatedUser.user.user_metadata.full_name || fullName || ""
          );
        }
      }

      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert(e.message || "Error saving profile.");
    }
  };





  // picture upload

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setAvatarUploading(true);
      setPwMessage("");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setAvatarInput(publicUrl);
      setPwMessage("Profile picture updated. Don’t forget to Save changes.");
    } catch (err) {
      console.error("Avatar upload error:", err);
      setPwMessage(err.message || "Error uploading avatar.");
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // pw change or forogt

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMessage("");

    if (!newPassword) {
      setPwMessage("Please enter a new password.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      setPwMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setPwMessage(err.message || "Error updating password.");
    }
  };

  const handleForgotPassword = async () => {
    setPwMessage("");

    try {
      const email = profile?.email || user?.email;
      if (!email) {
        setPwMessage("No email found for this account.");
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/reset-password",
      });

      if (error) throw error;

      setPwMessage("Reset link sent to your email.");
    } catch (err) {
      console.error(err);
      setPwMessage(err.message || "Error sending reset link.");
    }
  };


  if (authLoading || loading) {
    return <div className="p-8 text-center">Loading profile…</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!profile) {
    return <div className="p-8 text-center">No profile found.</div>;
  }

  const avatarUrl =
    avatarInput ||
    profile.avatarUrl ||
    user?.user_metadata?.avatar_url ||
    null;

  // Name 
  const displayName =
  (profile.firstname || profile.lastname)
    ? `${profile.firstname || ""} ${profile.lastname || ""}`.trim()
    : user?.email?.split("@")[0] || "User";


  // Initials from displayName so header + sign-out match
  const initials = (displayName || "U")
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const badgesToShow = badges.slice(0, 3);

  // account created: backend createdAt OR Supabase created_at
  const accountCreated = profile.createdAt || user?.created_at || null;

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-xl p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile avatar"
                className="w-20 h-20 rounded-full object-cover border"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-xl font-semibold">
                {initials}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold">My Profile</h1>
              <p className="text-slate-500 text-sm">
                Manage your personal details and see your achievements.
              </p>
            </div>
          </div>

          {/* Top-right button: Edit then Save */}
          {!isEditing ? (
            <button
              onClick={handleToggleEdit}
              className="px-4 py-2 rounded-md border border-slate-300 text-sm hover:bg-slate-50"
            >
              Edit profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-md border border-slate-300 text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-pink-600 text-white text-sm hover:bg-pink-700"
              >
                Save changes
              </button>
            </div>
          )}
        </div>

        {/* Account details and edit form */}
        <section className="space-y-3">
          <h2 className="font-semibold text-lg">Account details</h2>

          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoRow label="Name" value={displayName} />
              <InfoRow label="Email" value={profile.email} />
              <InfoRow
                label="Account created"
                value={
                  accountCreated
                    ? new Date(accountCreated).toLocaleDateString()
                    : "Not set"
                }
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <LabeledInput
                label="First name"
                value={firstNameInput}
                onChange={(e) => setFirstNameInput(e.target.value)}
              />
              <LabeledInput
                label="Last name"
                value={lastNameInput}
                onChange={(e) => setLastNameInput(e.target.value)}
              />

              {/* Profile picture picker */}
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase text-slate-400">
                  Profile picture
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 rounded-md border border-slate-300 text-xs hover:bg-slate-50"
                  >
                    {avatarUploading ? "Uploading..." : "Choose image"}
                  </button>
                  <span className="text-xs text-slate-500">
                    {avatarInput ? "Image selected" : "No image chosen"}
                  </span>
                </div>

                {/* hidden file input that opens gallery and file picker */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                />
              </div>
            </div>
          )}
        </section>

        {/* Change password section, only when editing */}
        {isEditing && (
          <section className="space-y-3">
            <h2 className="font-semibold text-lg">Password</h2>
            <form
              className="space-y-3 max-w-md"
              onSubmit={handleChangePassword}
            >
              <LabeledInput
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <LabeledInput
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div className="flex flex-wrap gap-3 items-center">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-slate-800 text-white text-sm hover:bg-slate-900"
                >
                  Change password
                </button>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-red-600 hover:underline"
                >
                  Forgot password? Send reset link
                </button>
              </div>
              {pwMessage && (
                <p className="text-xs text-slate-500 mt-1">{pwMessage}</p>
              )}
            </form>
          </section>
        )}

        {/* Badges buttons */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Badges & achievements</h2>
            <Link
              href="/badges"
              className="text-sm text-blue-600 hover:underline"
            >
              View all badges
            </Link>
          </div>

          {badgesToShow.length === 0 ? (
            <p className="text-sm text-slate-500">
              You haven&apos;t earned any badges yet. Keep using CashTag to
              unlock some!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {badgesToShow.map((earnedBadge) => (
                <div
                  key={earnedBadge.badge.id}
                  className="border rounded-lg px-4 py-3 flex items-start gap-3"
                >
                  <img
                    src={earnedBadge.badge.icon}
                    alt={earnedBadge.badge.name}
                    className="w-10 h-10 mr-2"
                  />
                  <div>
                    <div className="font-medium">
                      {earnedBadge.badge.name}
                    </div>
                    <div className="text-slate-500 text-xs mt-1">
                      {earnedBadge.badge.eventType === "STREAK"
                        ? `${profile.currentStreak || 0} day streak!`
                        : earnedBadge.badge.description}
                    </div>
                    {earnedBadge.earnedAt && (
                      <div className="text-slate-400 text-xs mt-1">
                        Earned on{" "}
                        {new Date(earnedBadge.earnedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">{label}</div>
      <div className="mt-1 text-slate-800 break-words">
        {value || <span className="text-slate-400">Not set</span>}
      </div>
    </div>
  );
}

function LabeledInput({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase text-slate-400">{label}</span>
      <input
        className="border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-slate-400"
        {...props}
      />
    </div>
  );
}
