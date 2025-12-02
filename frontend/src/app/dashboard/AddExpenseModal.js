"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth"; // import your auth hook 


export default function AddExpenseModal({ isOpen, onClose, onExpenseAdded }) {


 //store the user’s input for the new expense.
 const [title, setTitle] = useState("");
 const [amount, setAmount] = useState("");
 const [category, setCategory] = useState("");
 const [categories, setCategories] = useState([]); // this holds all categories fetched from the backend
 const [isRecurring, setIsRecurring] = useState(false); //for the recurring expense button
 const { user, loading } = useAuth("/login");


 //when popup opens, fetch list of tags
 useEffect(() => {
   if (isOpen) {
     fetch("http://localhost:8080/api/categories") // backend endpoint to get categories
       .then((res) => res.json()) // convert the response to JSON
       .then((data) => setCategories(data)) // save the data in `categories` state
       .catch((err) => console.error("Error fetching categories", err)); // handle any network errors
   }
 }, [isOpen]);


 //submit the form
 const handleSubmit = async (e) => {
  if (!user?.id) return; 

   e.preventDefault();


   const expense = {
     description: title,
     amount: parseFloat(amount),
     category: category.toUpperCase(),
     date:  new Date().toLocaleDateString("en-CA", { timeZone: "America/Toronto",}),
     userId: user?.id, //"6899c10f-f3e4-4101-b7fe-c72cbe0e07ba"
     recurring: isRecurring,
   };


   try {
     const res = await fetch("http://localhost:8080/api/expense", {
       method: "POST",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify(expense),
     });


     if (res.ok) {
       setTitle("");
       setAmount("");
       setCategory("");
       onExpenseAdded();
       onClose();
       setIsRecurring(false);
     } else {
       const errorText = await res.text();
       console.error("Server returned:", errorText);
     }
   } catch (err) {
     console.error("Error adding expense", err);
   }
 };


 //if popup is not open, don’t render anything
 if (!isOpen) return null;


 //popup layout
 return (
   <div className="fixed inset-0 flex justify-center items-center">


     <div className="bg-white p-6 rounded-lg shadow-lg w-96">
       <h2 className="text-xl font-bold mb-4">Add New Expense</h2>


       <form onSubmit={handleSubmit} className="flex flex-col gap-3">
         {/*expense title */}
         <input
           type="text"
           placeholder="Expense Title"
           value={title}
           onChange={(e) => setTitle(e.target.value)}
           className="border p-2 rounded"
         />
         {/* amount */}
         <input
           type="number"
           placeholder="Amount"
           value={amount}
           onChange={(e) => setAmount(e.target.value)}
           className="border p-2 rounded"
         />


         {/*dropdown for category */}
         <select
           value={category}
           onChange={(e) => setCategory(e.target.value)}
           className="border p-2 rounded"
         >
           <option value="">Select Category</option>
           {categories.map((cat, index) => (
 <option key={index} value={cat}>
   {cat.charAt(0) + cat.slice(1).toLowerCase()}
 </option>
))}


         </select>

         {/* Recurring checkbox */}
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
          />
          <span>Recurring expense</span>
        </label>



         {/*cancel and save buttons */}
         <div className="flex justify-end gap-3 mt-4">
           <button
             type="button"
             onClick={onClose}
             className="bg-gray-300 text-black px-4 py-2 rounded"
           >
             Cancel
           </button>


           <button
             type="submit"
             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
           >
             Save
           </button>
         </div>
       </form>
     </div>
   </div>
 );
}