import Link from "next/link";
import "./globals.css";
import SignOut from "./sign-out/page.js";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav
          style={{ backgroundColor: "#9BC5DD" }}
          className="p-4 flex justify-between items-center text-gray-800 font-medium"
        >
           <div className="flex gap-4"> 
          <Link href="/login">Login</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/transactions">Transactions</Link>
          <Link href="/groups">Groups</Link>
          <Link href="/reports">Reports</Link>
          <Link href="/groups">Groups</Link> {/*added Groups link */}
          <Link href="/budgets">Budgets</Link>
          <Link href="/profile">Profile</Link>
          </div>
          <SignOut/>
        </nav>

        {children}
      </body>
    </html>
  );
}
