'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockVendors, mockTenders, mockCompatibilityScores } from '@/lib/mockData';

export default function VendorMatchingPage() {
  const [selectedTender, setSelectedTender] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Get tender details
  const selectedTenderDetails = selectedTender
    ? mockTenders.find(t => t.id === selectedTender)
    : null;
  
  // Get compatibility scores for selected tender
  const compatibilityScores = selectedTender
    ? mockCompatibilityScores
        .filter(score => score.tender_id === selectedTender)
        .map(score => {
          const vendor = mockVendors.find(v => v.id === score.vendor_id);
          return {
            ...score,
            vendor_name: vendor?.name || 'Unknown Vendor',
            vendor_industry: vendor?.industry || 'Unknown Industry',
            vendor_expertise: vendor?.expertise || []
          };
        })
        .sort((a, b) => b.score - a.score)
    : [];
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Get background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };
  
  // Handle analyze tender
  const handleAnalyzeTender = () => {
    if (!selectedTender) return;
    
    setIsAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin/procurement-dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">AI Vendor-Tender Matching</h1>
          <p className="mt-1 text-sm text-gray-500">
            Match vendors to tenders based on AI-calculated compatibility scores
          </p>
        </div>
        
        {/* Tender Selection */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Select Tender</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockTenders.map(tender => (
                <div
                  key={tender.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedTender === tender.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                  onClick={() => setSelectedTender(tender.id)}
                >
                  <h3 className="text-md font-medium text-gray-900 mb-1">{tender.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">Budget: €{tender.budget.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mb-2">Deadline: {formatDate(tender.deadline)}</p>
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      tender.status === 'open' ? 'bg-green-100 text-green-800' : 
                      tender.status === 'closed' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {mockCompatibilityScores.filter(s => s.tender_id === tender.id).length} matches
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Compatibility Results */}
        {selectedTender && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-indigo-800">
                  Compatible Vendors for {selectedTenderDetails?.title}
                </h2>
                <button
                  type="button"
                  onClick={handleAnalyzeTender}
                  disabled={isAnalyzing}
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                    isAnalyzing
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Re-analyze Tender
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {compatibilityScores.length === 0 ? (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-gray-500">No compatibility data available for this tender</p>
              </div>
            ) : (
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-6">
                  {compatibilityScores.map((score, index) => (
                    <div 
                      key={score.vendor_id} 
                      className={`p-4 rounded-md ${getScoreBgColor(score.score)}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-md font-medium text-gray-900">{score.vendor_name}</h3>
                          <p className="text-xs text-gray-500">
                            Industry: {score.vendor_industry}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getScoreColor(score.score)}`}>
                            {score.score}% Match
                          </div>
                          <div className="text-xs text-gray-500">
                            Rank #{index + 1}
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-white bg-opacity-50 rounded-full h-2.5 mb-4">
                        <div 
                          className={`h-2.5 rounded-full ${
                            score.score >= 80 ? 'bg-green-500' : 
                            score.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score.score}%` }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                        {score.factors.map((factor, idx) => (
                          <div key={idx} className="bg-white bg-opacity-75 p-2 rounded-md text-center">
                            <div className="text-xs text-gray-500">{factor.name.replace(' Match', '')}</div>
                            <div className={`text-sm font-medium ${getScoreColor(factor.score)}`}>
                              {factor.score}%
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {score.vendor_expertise.slice(0, 5).map((exp, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                            {exp}
                          </span>
                        ))}
                        {score.vendor_expertise.length > 5 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            +{score.vendor_expertise.length - 5} more
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <Link
                          href={`/vendors?id=${score.vendor_id}`}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                        >
                          View Vendor Profile
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Tender Requirements */}
        {selectedTenderDetails && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-indigo-800">Tender Requirements</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Details</h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Title</dt>
                      <dd className="mt-1 text-sm text-gray-900">{selectedTenderDetails.title}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Budget</dt>
                      <dd className="mt-1 text-sm text-gray-900">€{selectedTenderDetails.budget.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                      <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedTenderDetails.deadline)}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedTenderDetails.status === 'open' ? 'bg-green-100 text-green-800' : 
                          selectedTenderDetails.status === 'closed' ? 'bg-red-100 text-red-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedTenderDetails.status.charAt(0).toUpperCase() + selectedTenderDetails.status.slice(1)}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {selectedTenderDetails.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-sm text-gray-600">
                  {selectedTenderDetails.description}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* How It Works */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 className="text-lg font-medium text-white">How AI Vendor-Tender Matching Works</h2>
            <p className="mt-1 text-sm text-indigo-100">
              Our AI system matches vendors to tenders based on multiple compatibility factors
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-md font-medium text-indigo-900">Industry Match</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  AI analyzes how well the vendor's industry focus aligns with the tender requirements.
                </p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-md font-medium text-indigo-900">Expertise Match</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  The system evaluates how well the vendor's specific expertise matches the technical requirements.
                </p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-md font-medium text-indigo-900">Experience Match</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  AI assesses how the vendor's past project experience relates to the tender scope.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-md font-medium text-indigo-900">Capacity Match</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  The system evaluates whether the vendor has sufficient resources to handle the project.
                </p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-md font-medium text-indigo-900">Certification Match</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  AI checks how the vendor's certifications align with tender requirements.
                </p>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Benefits of AI Vendor-Tender Matching</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Reduces vendor selection time by 75%</li>
                      <li>Improves match quality by 40%</li>
                      <li>Eliminates human bias in vendor selection</li>
                      <li>Increases procurement transparency</li>
                      <li>Helps identify vendors that might otherwise be overlooked</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
