'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  score: number;
  matchDetails?: {
    industryMatch: number;
    expertiseMatch: number;
    experienceMatch: number;
    capacityMatch: number;
    certificationMatch: number;
  };
}

interface Tender {
  id: string;
  title: string;
  category: string;
  deadline: string;
  vendors: Vendor[];
}

interface CompatibilityScoreCardProps {
  tenders: Tender[];
}

export default function CompatibilityScoreCard({ tenders }: CompatibilityScoreCardProps) {
  const [expandedTender, setExpandedTender] = useState<string | null>(null);
  
  const toggleExpand = (tenderId: string) => {
    if (expandedTender === tenderId) {
      setExpandedTender(null);
    } else {
      setExpandedTender(tenderId);
    }
  };
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get text color based on score
  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-yellow-700';
    return 'text-red-700';
  };
  
  // Get background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-indigo-800">Vendor-Tender Compatibility</h3>
          <Link
            href="/admin/compatibility"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View All
          </Link>
        </div>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-4">
          {tenders.map((tender) => (
            <div key={tender.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer"
                onClick={() => toggleExpand(tender.id)}
              >
                <div>
                  <h4 className="font-medium text-gray-900">{tender.title}</h4>
                  <p className="text-xs text-gray-500">Category: {tender.category} | Deadline: {tender.deadline}</p>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">
                    {tender.vendors.length} Vendors
                  </span>
                  <svg 
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${expandedTender === tender.id ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              {expandedTender === tender.id && (
                <div className="px-4 py-3">
                  <div className="space-y-3">
                    {tender.vendors.map((vendor) => (
                      <div key={vendor.id} className={`p-3 rounded-md ${getScoreBgColor(vendor.score)}`}>
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-gray-900">{vendor.name}</h5>
                          <span className={`font-bold ${getScoreTextColor(vendor.score)}`}>
                            {vendor.score}% Match
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                          <div 
                            className={`h-2.5 rounded-full ${getScoreColor(vendor.score)}`}
                            style={{ width: `${vendor.score}%` }}
                          ></div>
                        </div>
                        
                        {vendor.matchDetails && (
                          <div className="grid grid-cols-5 gap-2 mt-2">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Industry</div>
                              <div className={`text-xs font-medium ${getScoreTextColor(vendor.matchDetails.industryMatch)}`}>
                                {vendor.matchDetails.industryMatch}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Expertise</div>
                              <div className={`text-xs font-medium ${getScoreTextColor(vendor.matchDetails.expertiseMatch)}`}>
                                {vendor.matchDetails.expertiseMatch}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Experience</div>
                              <div className={`text-xs font-medium ${getScoreTextColor(vendor.matchDetails.experienceMatch)}`}>
                                {vendor.matchDetails.experienceMatch}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Capacity</div>
                              <div className={`text-xs font-medium ${getScoreTextColor(vendor.matchDetails.capacityMatch)}`}>
                                {vendor.matchDetails.capacityMatch}%
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Certification</div>
                              <div className={`text-xs font-medium ${getScoreTextColor(vendor.matchDetails.certificationMatch)}`}>
                                {vendor.matchDetails.certificationMatch}%
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
