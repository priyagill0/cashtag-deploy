"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Get the current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();

    // Listen for login and  logout , profile updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const newUser = session?.user ?? null;
        setUser(newUser);

        // reset old cached data when account changes
        setUserData(null);
        setAvatarUrl(null);
      }
    );
    const outsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", outsideClick);
    
    return () => {
      document.removeEventListener("mousedown", outsideClick);
      subscription?.unsubscribe();
    };
  }, []);

  // get data from backend
  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const res = await fetch(`http://localhost:8080/api/users/${user.id}`);
          if (res.ok) {
            const data = await res.json();
            setUserData(data);
            if (data.avatarUrl) {
              setAvatarUrl(data.avatarUrl);
            } else if (user.user_metadata?.avatar_url) {
              setAvatarUrl(user.user_metadata.avatar_url);
            } else {
              setAvatarUrl(null);          
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error.message);
        setIsLoading(false);
        return;
      }
      
      // Clear states before redirecting to login
      setIsLoading(false);
      setIsOpen(false);
      router.push("/login");
      
    } catch (err) {
      console.error("Unexpected error during sign out:", err);
      setIsLoading(false);
    }
  };

  // Get display name
const getDisplayName = () => {
  if (userData?.firstname || userData?.lastname) {
    return `${userData.firstname || ""} ${userData.lastname || ""}`.trim();
  }
  if (user?.email) {
    return user.email.split("@")[0];
  }
  return "User";
};

  // Get initials
 const getInitials = () => {
  const name = getDisplayName();
  return name
    .trim()
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Circle Button */}
        <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 aspect-square rounded-full flex items-center justify-center text-white"
        style={{ 
          backgroundColor: '#28799B',
          width: '30px',
          height: '30px',
          minWidth: '30px',
          minHeight: '30px'
        }}
        aria-label="User menu"
      >
    {avatarUrl ? (
    <img
      src={avatarUrl}
      alt="Profile"
      className="w-full h-full rounded-full object-cover"
    />
  ) : (
    getInitials()
  )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
          {/* User Info  */}
          <div className="px-3 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900 ">
              {getDisplayName()}
            </p>
            <p className="text-xs text-gray-500">
              {user.email}
            </p>
          </div>
          {/* View Profile Button */}
<button
  onClick={() => {
    setIsOpen(false);
    router.push("/profile");
  }}
  className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-gray-50 border-b border-gray-200"
>
  View profile
</button>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full p-2 text-left text-sm text-pink-500"
          >
            {isLoading ? "Signing out.." : "Sign out"}
          </button>
        </div>
      )}
    </div>
  );
}