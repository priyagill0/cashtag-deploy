"use client";
import { useState } from "react";
import { supabase } from "../../utils/supabase/client";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create the user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
        data: {
          firstname: firstname,  
          lastname: lastname
        }
      }
    });


//supabase error
    if (error) {
        console.error("Supabase signup error:", error);

        const lowerMsg = error.message.toLowerCase();
        if (
          lowerMsg.includes("already registered") ||
          lowerMsg.includes("duplicate") ||
          lowerMsg.includes("exists")
        ) {
          setMessage("An account with this email already exists. Please log in instead.");
        } else {
          setMessage(`Error: ${error.message}`);
        }
        return;
      }


      // Convert Supabase timestamp to Java LocalDateTime format
      const created_At = new Date(data.user.created_at).toISOString().slice(0, 19);

      // Save to backend
      const res = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            id: data.user.id,
            email: email,
          firstname: firstname,
          lastname: lastname,
          created_At
          
        }),
      });
         console.log("Backend response status:", res.status); // Debug log
    
   

     // Backened error Check if error is about duplicate email
        if (!res.ok) {
        const text = await res.text();
        console.error("Backend error:", text);

        if (res.status === 409 || text.includes("exists") || text.includes("duplicate")) {
          setMessage("This email is already associated with an account. Please log in instead.");
        } else {
          setMessage("There was an issue saving your account. Please try again later.");
        }
        return;
      }
      
    
    const result = await res.json();
    console.log("Backend saved user:", result); // Debug log
    setMessage("Please verify your email");
      
      // Clear form
      setEmail("");
      setFirstname("");
      setLastname("");
      setPassword("");
      
    } 
    catch (err) {
      console.error(err);
      setMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-pink-50" > 
    <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-md mx-auto mt-10">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-[#28799B]">Welcome</h1>
        <p className="text-gray-500 pt-3">
          Create an account to get started
        </p>
      </div>
      
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label htmlFor="firstname" className="text-sm font-medium text-gray-500">
            First Name
          </label>
          <input
            type="text"
            id="firstname"
            placeholder="your first name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className="w-full border rounded p-2 text-gray-400"
            required
          />
        </div>

         <div className="flex flex-col space-y-2">
          <label htmlFor="lastname" className="text-sm font-medium text-gray-500">
            Last Name
          </label>
          <input
            type="text"
            id="lastname"
            placeholder="your last name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className="w-full border rounded p-2 text-gray-400"
            required
          />
        </div>


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
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2 text-gray-400"
            required
          />
        </div>
        
        {message && <p className="text-red-500 text-sm">{message}</p>}
        
        <button
          type="submit"
          className="w-full py-2 rounded-full font-medium text-white transition cursor-pointer"
          style={{ backgroundColor: '#28799B' }}
        >
          Create Account
        </button>
      </form>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-[#9BC5DD] font-bold">Log in</a>
      </p>
    </div>
 </div>
  );
}

