'use client';

import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/outline';

interface Vendor {
  id: string;
  name: string;
  score: number;
  matchCount: number;
  proposalCount: number;
  href: string;
}

interface TopVendorsCardProps {
  vendors: Vendor[];
  title?: string;
  viewAllHref?: string;
  emptyMessage?: string;
}

export default function TopVendorsCard({
  vendors,
  title = 'Top Vendors',
  viewAllHref,
  emptyMessage = 'No vendor data available',
}: TopVendorsCardProps) {
  // Function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Function to get score background color
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-xs text-[#0056a4] hover:text-[#004483]">
            View All
          </Link>
        )}
      </div>
      
      <div className="divide-y divide-gray-200">
        {vendors.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          vendors.map((vendor) => (
            <Link 
              key={vendor.id} 
              href={vendor.href}
              className="block hover:bg-gray-50"
            >
              <div className="px-4 py-3 flex items-center">
                <div className="flex-shrink-0">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{vendor.name}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {vendor.matchCount} matches
                    </span>
                    <span className="mx-1 text-gray-300">•</span>
                    <span className="text-xs text-gray-500">
                      {vendor.proposalCount} proposals
                    </span>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreBgColor(vendor.score)} ${getScoreColor(vendor.score)}`}>
                    {vendor.score}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
