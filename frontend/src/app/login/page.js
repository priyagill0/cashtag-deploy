"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabase/client";
import { useRouter } from "next/navigation"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
    const emailTrimmed = email.trim();
    const passwordTrimmed = password.trim();
      // Log in the user with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email:emailTrimmed,
        password:passwordTrimmed,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes("Invalid login credentials")) {
          setMessage("Email or password is incorrect. Please try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setMessage("Please verify your email address before logging in.");
        } else {
          setMessage(`Error: ${error.message}`);
        }
        setIsLoading(false);
        return;
      }

      // sync to backend
      const user = data.user;
      try {
        const syncResponse = await fetch("http://localhost:8080/api/groups/users/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
            email: user.email,
            firstName: user.user_metadata?.first_name || user.email.split('@')[0] || "User",
            lastName: user.user_metadata?.last_name || "",
            last_sign_in_at: user.last_sign_in_at   // Include last sign-in time
          })
        });

        if (!syncResponse.ok) {
          console.error("Failed to sync user to backend");
        } else {
          console.log("User synced to backend");
        }
      } catch (syncError) {
        console.error("Error syncing user:", syncError);
        // Don't block login if sync fails
      }
      
      setMessage("Login successful! Redirecting...");
      
      // Clear form
      setEmail("");
      setPassword("");
      
      setTimeout(() => {
        router.push("/dashboard"); // Redirect to home page
      }, 1000);
      
    } catch (err) {
      console.error(err);
      setMessage(`Error: ${err.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50"> 
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-md mx-auto mt-10">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-[#28799B]">Welcome Back</h1>
          <p className="text-gray-500 pt-3">
            Log in to your account to get started
          </p>
        </div>
        
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-500">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="first.lastname@youremail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2 text-gray-400"
              required
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-500">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2 text-gray-400"
              required
            />
          </div>
          
          {message && <p className="text-red-500 text-sm">{message}</p>}
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-full font-medium text-white transition cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
            style={{ backgroundColor: '#28799B' }}
            >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <a href="/sign-up" className="text-[#9BC5DD] font-bold">Sign up</a>
        </p>
      </div>
    </div>
  );
}