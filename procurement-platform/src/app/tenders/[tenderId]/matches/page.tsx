'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/app/context/ToastContext';
import AnalysisResultCard from '@/app/components/ai/AnalysisResultCard';
import InsightsList from '@/app/components/ai/InsightsList';

export default function VendorMatchesPage() {
  const params = useParams();
  const tenderId = params.tenderId as string;
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>([]);
  const [tender, setTender] = useState<any>(null);
  const [matchSummary, setMatchSummary] = useState<any>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch tender details
        const tenderResponse = await fetch(`/api/tenders/${tenderId}`);
        if (!tenderResponse.ok) {
          throw new Error('Failed to fetch tender details');
        }
        const tenderData = await tenderResponse.json();
        setTender(tenderData);
        
        // Fetch vendor matches
        const matchesResponse = await fetch(`/api/ai/analyses/matches/tender/${tenderId}`);
        if (matchesResponse.ok) {
          const matchesData = await matchesResponse.json();
          setMatches(matchesData);
          
          // Generate summary
          if (matchesData.length > 0) {
            const summary = generateMatchSummary(matchesData);
            setMatchSummary(summary);
          }
        } else if (matchesResponse.status !== 404) {
          // Only show error if it's not a 404 (matches might not exist yet)
          throw new Error('Failed to fetch vendor matches');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to load vendor matches',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (tenderId) {
      fetchData();
    }
  }, [tenderId, showToast]);
  
  const generateMatchSummary = (matchesData: any[]) => {
    const totalVendors = matchesData.length;
    const highlyCompatible = matchesData.filter(m => m.compatibility_score >= 85).length;
    const moderatelyCompatible = matchesData.filter(m => m.compatibility_score >= 70 && m.compatibility_score < 85).length;
    const lowCompatible = matchesData.filter(m => m.compatibility_score < 70).length;
    
    const averageScore = matchesData.reduce((sum, m) => sum + m.compatibility_score, 0) / totalVendors;
    
    return {
      totalVendors,
      highlyCompatible,
      moderatelyCompatible,
      lowCompatible,
      averageScore: Math.round(averageScore),
      competitiveness: totalVendors > 5 ? 'High' : totalVendors > 2 ? 'Moderate' : 'Low',
      summary: `Found ${totalVendors} potential vendors, with ${highlyCompatible} highly compatible matches.`
    };
  };
  
  const handleRunMatching = async () => {
    if (!tender) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/match-vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenderId,
          tenderContent: tender.description,
          metadata: {
            title: tender.title,
            category: tender.category,
            budget: tender.budget,
            deadline: tender.submission_deadline,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to match vendors');
      }
      
      const matchingData = await response.json();
      
      // Fetch the stored matches
      const matchesResponse = await fetch(`/api/ai/analyses/matches/tender/${tenderId}`);
      if (matchesResponse.ok) {
        const matchesData = await matchesResponse.json();
        setMatches(matchesData);
        
        // Generate summary
        if (matchesData.length > 0) {
          const summary = generateMatchSummary(matchesData);
          setMatchSummary(summary);
        }
      }
      
      showToast({
        type: 'success',
        title: 'Matching Complete',
        message: 'Vendor matching has been completed successfully',
      });
    } catch (error: any) {
      console.error('Error matching vendors:', error);
      showToast({
        type: 'error',
        title: 'Matching Failed',
        message: error.message || 'Failed to match vendors',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to determine status based on compatibility score
  const getCompatibilityStatus = (score: number) => {
    if (score >= 85) return 'positive';
    if (score >= 70) return 'warning';
    return 'negative';
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056a4]"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Tender Not Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The tender you are looking for does not exist or you do not have permission to view it.
              </p>
              <div className="mt-6">
                <Link
                  href="/tenders"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                >
                  Back to Tenders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/tenders/${tenderId}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Tender
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h1 className="text-xl font-semibold text-gray-900">Vendor Matches</h1>
            <p className="mt-1 text-sm text-gray-500">{tender.title}</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {matches.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Vendor Matches Available</h3>
                <p className="text-sm text-gray-500 mb-6">
                  This tender has not been matched with vendors by the AI yet.
                </p>
                <button
                  type="button"
                  onClick={handleRunMatching}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                >
                  Run Vendor Matching
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Match Summary */}
                {matchSummary && (
                  <AnalysisResultCard
                    title="Match Summary"
                    status="neutral"
                  >
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900 mb-2">{matchSummary.summary}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500">Total Vendors</p>
                          <p className="text-lg font-semibold text-gray-900">{matchSummary.totalVendors}</p>
                        </div>
                        
                        <div className="bg-green-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500">Highly Compatible</p>
                          <p className="text-lg font-semibold text-green-700">{matchSummary.highlyCompatible}</p>
                        </div>
                        
                        <div className="bg-yellow-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500">Moderately Compatible</p>
                          <p className="text-lg font-semibold text-yellow-700">{matchSummary.moderatelyCompatible}</p>
                        </div>
                        
                        <div className="bg-red-50 p-3 rounded-md">
                          <p className="text-xs text-gray-500">Low Compatibility</p>
                          <p className="text-lg font-semibold text-red-700">{matchSummary.lowCompatible}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">Average Score</p>
                          <p className="text-lg font-semibold text-gray-900">{matchSummary.averageScore}/100</p>
                        </div>
                        
                        <div>
                          <p className="text-xs text-gray-500">Competitiveness</p>
                          <p className="text-lg font-semibold text-gray-900">{matchSummary.competitiveness}</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={handleRunMatching}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                        >
                          Refresh Matches
                        </button>
                      </div>
                    </div>
                  </AnalysisResultCard>
                )}
                
                {/* Vendor Matches */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium text-gray-900">Vendor Matches</h2>
                  
                  {matches.map((match, index) => (
                    <AnalysisResultCard
                      key={index}
                      title={match.vendors?.name || `Vendor ${index + 1}`}
                      score={match.compatibility_score}
                      status={getCompatibilityStatus(match.compatibility_score)}
                      collapsible
                      initiallyExpanded={index === 0}
                    >
                      <div className="space-y-4">
                        {/* Recommendation */}
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-gray-900">Recommendation</p>
                          <p className={`text-sm ${
                            match.recommendation === 'Highly Recommended' ? 'text-green-700' :
                            match.recommendation === 'Recommended' ? 'text-blue-700' :
                            match.recommendation === 'Consider' ? 'text-yellow-700' :
                            'text-red-700'
                          }`}>
                            {match.recommendation}
                          </p>
                        </div>
                        
                        {/* Match Details */}
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Match Details</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {match.match_details && Object.entries(match.match_details).map(([key, value]: [string, any]) => (
                              <div key={key} className="bg-gray-50 p-2 rounded-md">
                                <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                <div className="flex items-center">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5 mr-2">
                                    <div 
                                      className={`h-1.5 rounded-full ${
                                        value >= 80 ? 'bg-green-500' : 
                                        value >= 60 ? 'bg-yellow-500' : 
                                        'bg-red-500'
                                      }`}
                                      style={{ width: `${value}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-medium text-gray-900">{value}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Strengths and Weaknesses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-2">Strengths</p>
                            <InsightsList
                              items={match.strengths || []}
                              type="strengths"
                              emptyMessage="No strengths identified"
                            />
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-2">Weaknesses</p>
                            <InsightsList
                              items={match.weaknesses || []}
                              type="weaknesses"
                              emptyMessage="No weaknesses identified"
                            />
                          </div>
                        </div>
                        
                        {/* Vendor Details */}
                        {match.vendors && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium text-gray-900">Contact Information</p>
                                {match.vendors.contact_person && (
                                  <p className="text-sm text-gray-600">{match.vendors.contact_person}</p>
                                )}
                                {match.vendors.contact_email && (
                                  <p className="text-sm text-gray-600">{match.vendors.contact_email}</p>
                                )}
                              </div>
                              
                              <Link
                                href={`/vendors/${match.vendor_id}`}
                                className="inline-flex items-center text-sm text-[#0056a4] hover:text-[#004483]"
                              >
                                View Vendor Profile
                                <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    </AnalysisResultCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
