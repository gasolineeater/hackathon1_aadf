'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockVendors, mockTenders, mockCompatibilityScores } from '@/lib/mockData';

interface VendorWithCompatibility {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  expertise: string[];
  created_at: string;
  updated_at: string;
  compatibleTenders: {
    tenderId: string;
    tenderTitle: string;
    compatibilityScore: number;
    matchFactors: {
      name: string;
      score: number;
    }[];
  }[];
}

export default function VendorsPage() {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [expertiseFilter, setExpertiseFilter] = useState<string | null>(null);
  
  // Process the mock data to add compatibility information
  const vendorsWithCompatibility: VendorWithCompatibility[] = mockVendors.map(vendor => {
    // Get compatibility scores for this vendor
    const compatibilityScores = mockCompatibilityScores.filter(score => score.vendor_id === vendor.id);
    
    // Map to compatible tenders
    const compatibleTenders = compatibilityScores.map(score => {
      const tender = mockTenders.find(t => t.id === score.tender_id);
      return {
        tenderId: score.tender_id,
        tenderTitle: tender?.title || 'Unknown Tender',
        compatibilityScore: score.score,
        matchFactors: score.factors
      };
    }).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    return {
      ...vendor,
      compatibleTenders
    };
  });
  
  // Get unique industries and expertise for filters
  const industries = Array.from(new Set(vendorsWithCompatibility.map(v => v.industry)));
  const expertiseAreas = Array.from(
    new Set(vendorsWithCompatibility.flatMap(v => v.expertise))
  );
  
  // Filter vendors based on search term and filters
  const filteredVendors = vendorsWithCompatibility.filter(vendor => {
    const matchesSearch = 
      searchTerm === '' || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesIndustry = 
      industryFilter === null || 
      vendor.industry === industryFilter;
    
    const matchesExpertise = 
      expertiseFilter === null || 
      vendor.expertise.includes(expertiseFilter);
    
    return matchesSearch && matchesIndustry && matchesExpertise;
  });
  
  // Find the selected vendor
  const vendor = selectedVendor 
    ? vendorsWithCompatibility.find(v => v.id === selectedVendor) 
    : null;
  
  // Set the first vendor as selected by default
  useEffect(() => {
    if (filteredVendors.length > 0 && !selectedVendor) {
      setSelectedVendor(filteredVendors[0].id);
    }
  }, [filteredVendors, selectedVendor]);
  
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Vendor Matching</h1>
          <p className="mt-1 text-sm text-gray-500">
            Find the perfect vendors for your tenders based on AI-calculated compatibility scores
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Search and Filter Vendors</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Vendors
                </label>
                <input
                  type="text"
                  id="search"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by name, industry, or expertise"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <select
                  id="industry"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={industryFilter || ''}
                  onChange={(e) => setIndustryFilter(e.target.value || null)}
                >
                  <option value="">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-1">
                  Expertise
                </label>
                <select
                  id="expertise"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={expertiseFilter || ''}
                  onChange={(e) => setExpertiseFilter(e.target.value || null)}
                >
                  <option value="">All Expertise</option>
                  {expertiseAreas.map((expertise) => (
                    <option key={expertise} value={expertise}>
                      {expertise}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Vendor-Tender Compatibility</h2>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Vendor List */}
              <div className="border-r border-gray-200">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Vendors ({filteredVendors.length})</h3>
                </div>
                <div className="overflow-y-auto max-h-96">
                  {filteredVendors.length === 0 ? (
                    <div className="px-4 py-4 text-sm text-gray-500 text-center">
                      No vendors match your filters
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {filteredVendors.map((v) => (
                        <li 
                          key={v.id}
                          className={`cursor-pointer hover:bg-gray-50 ${selectedVendor === v.id ? 'bg-indigo-50' : ''}`}
                          onClick={() => setSelectedVendor(v.id)}
                        >
                          <div className="px-4 py-4">
                            <div className="flex justify-between">
                              <div className="text-sm font-medium text-indigo-600">{v.name}</div>
                              <div className="text-xs text-gray-500">{v.compatibleTenders.length} matches</div>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">{v.industry}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {v.expertise.slice(0, 3).map((exp, index) => (
                                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {exp}
                                </span>
                              ))}
                              {v.expertise.length > 3 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  +{v.expertise.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              
              {/* Vendor Details */}
              <div className="col-span-1 md:col-span-2 border-r border-gray-200">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Vendor Details & Compatible Tenders</h3>
                </div>
                <div className="p-4">
                  {!selectedVendor ? (
                    <div className="text-sm text-gray-500 text-center">
                      Select a vendor to see details
                    </div>
                  ) : (
                    <div>
                      <div className="mb-6 pb-6 border-b border-gray-200">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">{vendor?.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Industry:</span> {vendor?.industry}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Email:</span> {vendor?.email}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Phone:</span> {vendor?.phone}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Address:</span> {vendor?.address}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Registered:</span> {new Date(vendor?.created_at || '').toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Expertise</h5>
                          <div className="flex flex-wrap gap-1">
                            {vendor?.expertise.map((exp, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <h5 className="text-md font-medium text-gray-900 mb-3">AI-Matched Compatible Tenders</h5>
                      
                      {vendor?.compatibleTenders.length === 0 ? (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No compatible tenders found for this vendor
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {vendor?.compatibleTenders.map((tender, index) => (
                            <div key={index} className={`p-4 rounded-md ${getScoreBgColor(tender.compatibilityScore)}`}>
                              <div className="flex justify-between items-center mb-2">
                                <h6 className="font-medium text-gray-900">{tender.tenderTitle}</h6>
                                <span className={`font-bold ${getScoreTextColor(tender.compatibilityScore)}`}>
                                  {tender.compatibilityScore}% Match
                                </span>
                              </div>
                              
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                <div 
                                  className={`h-2.5 rounded-full ${getScoreColor(tender.compatibilityScore)}`}
                                  style={{ width: `${tender.compatibilityScore}%` }}
                                ></div>
                              </div>
                              
                              <div className="grid grid-cols-5 gap-2 mt-3">
                                {tender.matchFactors.map((factor, idx) => (
                                  <div key={idx} className="text-center">
                                    <div className="text-xs text-gray-500">{factor.name.replace(' Match', '')}</div>
                                    <div className={`text-xs font-medium ${getScoreTextColor(factor.score)}`}>
                                      {factor.score}%
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="mt-3 text-right">
                                <Link
                                  href={`/tenders/${tender.tenderId}`}
                                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                                >
                                  View Tender Details
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
            <h2 className="text-lg font-medium text-indigo-800">How AI Matches Vendors to Tenders</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-3">AI Matching Factors</h3>
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
                    <li className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Increases procurement transparency
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
