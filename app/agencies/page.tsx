'use client'

import { useState, useEffect } from 'react';
import { getAgencies } from '../actions'; // We already created this action earlier

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getAgencies();
      setAgencies(data);
    }
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Agencies</h1>
      
      <div className="overflow-x-auto border rounded-lg shadow">
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
                    <a href={agency.website} target="_blank" rel="noopener noreferrer">Visit</a>
                  ) : 'N/A'}
                </td>
                <td className="px-6 py-4 text-gray-500">{agency._count?.contacts || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}