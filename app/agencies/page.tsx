'use client'

import { useState, useEffect } from 'react';
import { getAgencies } from '../actions';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function AgenciesPage() {
    const [agencies, setAgencies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await getAgencies();
            setAgencies(data);
            setLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
                <Link href="/" className="font-bold text-xl hover:text-blue-600 transition">
                    Internship Dashboard
                </Link>
                <div className="flex gap-6 items-center">
                    <Link href="/agencies" className="text-blue-600 font-semibold">Agencies</Link>
                    <Link href="/contacts" className="text-gray-600 hover:text-blue-600 transition">Contacts</Link>
                    <UserButton />
                </div>
            </nav>

            {/* Main Content */}
            <main className="p-8">
                <h1 className="text-2xl font-bold mb-6">Agencies</h1>

                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading agencies...</p>
                    </div>
                )}

                {!loading && (
                    <div className="overflow-x-auto border rounded-lg shadow bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Website</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Count</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {agencies.map((agency) => (
                                    <tr key={agency.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{agency.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{agency.state}</td>
                                        <td className="px-6 py-4 text-blue-600">
                                            {agency.website ? (
                                                <a href={agency.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Visit</a>
                                            ) : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{agency._count?.contacts || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}