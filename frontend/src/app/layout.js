import Link from "next/link";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav
          style={{ backgroundColor: "#9BC5DD" }}
          className="p-4 flex gap-4 text-gray-800 font-medium"
        >
          <Link href="/login">Login</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/transactions">Transactions</Link>
          <Link href="/groups">Groups</Link> {/*added Groups link */}
        </nav>
        {children}
      </body>
    </html>
  );
}
