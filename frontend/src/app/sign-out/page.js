"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); 
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

    // Listen for state changes so that the text can update "signing out... "
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // when clicking at any place outside of the box, the user profile box should disappear 
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

  // Get first name from backend data or email
  const getFirstName = () => {
    return userData?.firstname || user?.email?.split('@')[0] || "User";
  };

  // Get initials
  const getInitials = () => {
    const firstName = getFirstName();
    return firstName.charAt(0).toUpperCase();
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
        {getInitials()}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
          {/* User Info  */}
          <div className="px-3 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900 ">
              {getFirstName()}
            </p>
            <p className="text-xs text-gray-500">
              {user.email}
            </p>
          </div>

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