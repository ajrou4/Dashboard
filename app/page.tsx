// app/page.tsx
import Link from 'next/link';
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="font-bold text-xl">Internship Dashboard</div>
        <UserButton />
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto mt-10 p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Welcome! Select a Database</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Agencies */}
          <Link href="/agencies" className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition border">
            <h2 className="text-2xl font-semibold mb-2 text-blue-600">🏢 View Agencies</h2>
            <p className="text-gray-600">Browse the list of randomized government agencies and cities.</p>
          </Link>

          {/* Card 2: Contacts */}
          <Link href="/contacts" className="block p-6 bg-white rounded-xl shadow hover:shadow-lg transition border">
            <h2 className="text-2xl font-semibold mb-2 text-green-600">👥 View Contacts</h2>
            <p className="text-gray-600">Access employee contact details. (Daily Limit: 50)</p>
          </Link>
        </div>
      </main>
    </div>
  );
}