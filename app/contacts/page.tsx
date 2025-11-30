'use client'

import { useState, useEffect } from 'react';
import { getContacts } from '../actions';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';

export default function ContactsPage() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [usage, setUsage] = useState({ count: 0, limit: 50, remaining: 50 });
    const [loading, setLoading] = useState(true);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await getContacts();
            setContacts(data.contacts);
            setUsage(data.usage);

            // Show upgrade modal if limit reached
            if (data.usage.remaining === 0) {
                setShowUpgradeModal(true);
            }

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
                    <Link href="/agencies" className="text-gray-600 hover:text-blue-600 transition">Agencies</Link>
                    <Link href="/contacts" className="text-blue-600 font-semibold">Contacts</Link>
                    <UserButton />
                </div>
            </nav>

            {/* Main Content */}
            <main className="p-8">
                {/* Header with usage counter */}
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Contacts</h1>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                        <p className="text-sm text-gray-600">Daily Limit</p>
                        <p className="text-lg font-bold text-blue-600">
                            {usage.count} / {usage.limit}
                        </p>
                        <p className="text-xs text-gray-500">
                            {usage.remaining} remaining today
                        </p>
                    </div>
                </div>

                {/* Upgrade Modal */}
                {showUpgradeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md mx-4">
                            <div className="text-center">
                                <div className="text-6xl mb-4">🚀</div>
                                <h2 className="text-2xl font-bold mb-2">Daily Limit Reached</h2>
                                <p className="text-gray-600 mb-6">
                                    You've viewed {usage.limit} contacts today. Upgrade to Premium for unlimited access!
                                </p>

                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 mb-6">
                                    <h3 className="text-xl font-bold mb-2">Premium Plan</h3>
                                    <p className="text-3xl font-bold mb-1">$29<span className="text-lg">/month</span></p>
                                    <ul className="text-sm text-left mt-4 space-y-2">
                                        <li>✓ Unlimited contact views</li>
                                        <li>✓ Advanced search filters</li>
                                        <li>✓ Export to CSV</li>
                                        <li>✓ Priority support</li>
                                    </ul>
                                </div>

                                <button
                                    onClick={() => setShowUpgradeModal(false)}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
                                >
                                    Maybe Later
                                </button>
                                <p className="text-xs text-gray-500 mt-4">
                                    Your limit resets tomorrow at midnight
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading contacts...</p>
                    </div>
                )}

                {/* No Contacts Message */}
                {!loading && contacts.length === 0 && usage.remaining === 0 && (
                    <div className="text-center py-12 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-lg font-semibold text-yellow-800">Daily limit reached!</p>
                        <p className="text-gray-600 mt-2">Come back tomorrow or upgrade to Premium.</p>
                    </div>
                )}

                {/* Contacts Table */}
                {!loading && contacts.length > 0 && (
                    <div className="overflow-x-auto border rounded-lg shadow bg-white">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">State</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contacts.map((contact) => (
                                    <tr key={contact.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {contact.firstName} {contact.lastName}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{contact.email}</td>
                                        <td className="px-6 py-4 text-gray-500">{contact.phone || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-500">{contact.agency?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-gray-500">{contact.agency?.state || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {usage.remaining === 0 && (
                            <div className="bg-yellow-50 border-t border-yellow-200 p-4 text-center">
                                <p className="text-sm text-yellow-800 font-semibold">
                                    You've reached your daily limit of {usage.limit} contacts
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
