'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockTenders, mockVendors, mockCompatibilityScores } from '@/lib/mockData';

export default function CompatibilityPage() {
  const [selectedTender, setSelectedTender] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  
  // Process the mock data
  const tendersWithCompatibility = mockTenders.map(tender => {
    // Get compatibility scores for this tender
    const vendorScores = mockCompatibilityScores
      .filter(score => score.tender_id === tender.id)
      .map(score => {
        // Find the vendor
        const vendor = mockVendors.find(v => v.id === score.vendor_id);
        
        return {
          id: score.vendor_id,
          name: vendor?.name || 'Unknown Vendor',
          score: score.score,
          factors: score.factors
        };
      })
      // Sort by score descending
      .sort((a, b) => b.score - a.score);
    
    return {
      id: tender.id,
      title: tender.title,
      description: tender.description,
      budget: tender.budget,
      deadline: tender.deadline,
      status: tender.status,
      vendors: vendorScores
    };
  });
  
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
  
  // Find the selected tender
  const tender = selectedTender 
    ? tendersWithCompatibility.find(t => t.id === selectedTender) 
    : null;
  
  // Find the selected vendor
  const vendor = selectedVendor && tender
    ? tender.vendors.find(v => v.id === selectedVendor)
    : null;
  
  // Set the first tender as selected by default
  useEffect(() => {
    if (tendersWithCompatibility.length > 0 && !selectedTender) {
      setSelectedTender(tendersWithCompatibility[0].id);
    }
  }, [tendersWithCompatibility, selectedTender]);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">AI Vendor-Tender Compatibility</h1>
          <p className="mt-1 text-sm text-gray-500">
            View AI-generated compatibility scores between vendors and tenders
          </p>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Compatibility Analysis</h2>
            <p className="mt-1 text-sm text-indigo-600">
              Select a tender to see vendor compatibility scores
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Tender List */}
              <div className="border-r border-gray-200">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Tenders</h3>
                </div>
                <div className="overflow-y-auto max-h-96">
                  <ul className="divide-y divide-gray-200">
                    {tendersWithCompatibility.map((t) => (
                      <li 
                        key={t.id}
                        className={`cursor-pointer hover:bg-gray-50 ${selectedTender === t.id ? 'bg-indigo-50' : ''}`}
                        onClick={() => {
                          setSelectedTender(t.id);
                          setSelectedVendor(null);
                        }}
                      >
                        <div className="px-4 py-4">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium text-indigo-600">{t.title}</div>
                            <div className="text-xs text-gray-500">{t.vendors.length} vendors</div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500 truncate">{t.description}</p>
                          <div className="mt-2 flex justify-between text-xs text-gray-500">
                            <span>Budget: €{t.budget.toLocaleString()}</span>
                            <span>Deadline: {t.deadline}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Vendor List */}
              <div className="border-r border-gray-200">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Vendors</h3>
                </div>
                <div className="overflow-y-auto max-h-96">
                  {!selectedTender ? (
                    <div className="px-4 py-4 text-sm text-gray-500 text-center">
                      Select a tender to see vendors
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {tender?.vendors.map((v) => (
                        <li 
                          key={v.id}
                          className={`cursor-pointer hover:bg-gray-50 ${selectedVendor === v.id ? 'bg-indigo-50' : ''}`}
                          onClick={() => setSelectedVendor(v.id)}
                        >
                          <div className="px-4 py-4">
                            <div className="flex justify-between items-center">
                              <div className="text-sm font-medium text-gray-900">{v.name}</div>
                              <div className={`text-sm font-medium ${getScoreTextColor(v.score)}`}>
                                {v.score}% Match
                              </div>
                            </div>
                            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getScoreColor(v.score)}`}
                                style={{ width: `${v.score}%` }}
                              ></div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              {/* Compatibility Details */}
              <div>
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Compatibility Details</h3>
                </div>
                <div className="p-4">
                  {!selectedVendor ? (
                    <div className="text-sm text-gray-500 text-center">
                      Select a vendor to see compatibility details
                    </div>
                  ) : (
                    <div>
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-medium text-gray-900">{vendor?.name}</h4>
                          <span className={`text-lg font-bold ${getScoreTextColor(vendor?.score || 0)}`}>
                            {vendor?.score}% Match
                          </span>
                        </div>
                        
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${getScoreColor(vendor?.score || 0)}`}
                            style={{ width: `${vendor?.score}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <h5 className="text-sm font-medium text-gray-700 mb-3">Match Factors</h5>
                      <div className="space-y-4">
                        {vendor?.factors.map((factor, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-700">{factor.name}</span>
                              <span className={`text-sm font-medium ${getScoreTextColor(factor.score)}`}>
                                {factor.score}/100
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getScoreColor(factor.score)}`}
                                style={{ width: `${factor.score}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">AI Recommendation</h5>
                        <div className={`p-3 rounded-md ${getScoreBgColor(vendor?.score || 0)}`}>
                          <p className="text-sm text-gray-700">
                            {vendor?.score && vendor.score >= 80 ? (
                              <>
                                <span className="font-medium">Highly Compatible:</span> This vendor is an excellent match for this tender. Consider including them in your shortlist.
                              </>
                            ) : vendor?.score && vendor.score >= 60 ? (
                              <>
                                <span className="font-medium">Moderately Compatible:</span> This vendor meets most requirements but may have some gaps. Consider requesting additional information.
                              </>
                            ) : (
                              <>
                                <span className="font-medium">Low Compatibility:</span> This vendor does not appear to be a good match for this tender. Consider other vendors with higher compatibility scores.
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Explanation */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">How AI Calculates Compatibility</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">Match Factors</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-indigo-500 mr-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <div>
                      <span className="font-medium">Industry Match:</span> How well the vendor's industry focus aligns with the tender requirements
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-indigo-500 mr-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <div>
                      <span className="font-medium">Expertise Match:</span> How well the vendor's specific expertise matches the technical requirements
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-indigo-500 mr-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <div>
                      <span className="font-medium">Experience Match:</span> How the vendor's past project experience relates to the tender scope
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-indigo-500 mr-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <div>
                      <span className="font-medium">Capacity Match:</span> Whether the vendor has sufficient resources to handle the project
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 text-indigo-500 mr-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    <div>
                      <span className="font-medium">Certification Match:</span> How the vendor's certifications align with tender requirements
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">AI Methodology</h3>
                <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600">
                  <p className="mb-3">
                    Our AI analyzes tender requirements and vendor profiles using natural language processing and machine learning to calculate compatibility scores.
                  </p>
                  <p className="mb-3">
                    The system extracts key requirements from tender documents and matches them against vendor capabilities, past performance, and industry expertise.
                  </p>
                  <p>
                    Each factor is weighted based on its importance to the specific tender, and the final score represents the overall compatibility between the vendor and tender.
                  </p>
                </div>
                
                <div className="mt-4 bg-indigo-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-indigo-800 mb-2">Benefits</h4>
                  <ul className="space-y-1 text-sm text-indigo-700">
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Reduces vendor selection time by 75%
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Improves match quality by 40%
                    </li>
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Eliminates human bias in vendor selection
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
