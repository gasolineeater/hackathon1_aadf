'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockProposals, mockTenders } from '@/lib/mockData';

export default function EvaluationPage() {
  const [selectedTender, setSelectedTender] = useState<string | null>(null);
  
  // Get tenders with deadline passed
  const tendersWithDeadlinePassed = mockTenders.filter(tender => {
    const deadline = new Date(tender.deadline);
    const now = new Date();
    return now > deadline;
  });
  
  // Get proposals for selected tender
  const proposalsForTender = selectedTender
    ? mockProposals.filter(proposal => proposal.tender_id === selectedTender)
    : [];
  
  // Get tender details
  const selectedTenderDetails = selectedTender
    ? mockTenders.find(tender => tender.id === selectedTender)
    : null;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Generate random evaluation status
  const getEvaluationStatus = (proposalId: string) => {
    const statuses = ['not_started', 'in_progress', 'completed'];
    const hash = proposalId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return statuses[hash % statuses.length];
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Generate random score
  const getRandomScore = (proposalId: string) => {
    const hash = proposalId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 65 + (hash % 30); // Score between 65 and 94
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
          <h1 className="text-2xl font-bold text-gray-900">Proposal Evaluation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Score proposals transparently with AI-assisted evaluation tools
          </p>
        </div>
        
        {/* Tender Selection */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Select Tender for Evaluation</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tendersWithDeadlinePassed.map(tender => (
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
                  <p className="text-xs text-gray-500 mb-2">Deadline: {formatDate(tender.deadline)}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {mockProposals.filter(p => p.tender_id === tender.id).length} Proposals
                    </span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      tender.status === 'evaluation' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {tender.status === 'evaluation' ? 'In Evaluation' : 'Ready for Evaluation'}
                    </span>
                  </div>
                </div>
              ))}
              
              {tendersWithDeadlinePassed.length === 0 && (
                <div className="col-span-3 text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tenders ready for evaluation</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Tenders will appear here after their submission deadline has passed.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Proposals for Evaluation */}
        {selectedTender && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-indigo-800">
                Proposals for {selectedTenderDetails?.title}
              </h2>
              <p className="mt-1 text-sm text-indigo-600">
                {proposalsForTender.length} proposals to evaluate
              </p>
            </div>
            
            {proposalsForTender.length === 0 ? (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-gray-500">No proposals found for this tender</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Proposal
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evaluation Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evaluators
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {proposalsForTender.map((proposal) => {
                      const evaluationStatus = getEvaluationStatus(proposal.id);
                      const score = getRandomScore(proposal.id);
                      
                      return (
                        <tr key={proposal.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-indigo-600">
                              <Link href={`/admin/procurement-dashboard/proposals/${proposal.id}`} className="hover:underline">
                                {proposal.title}
                              </Link>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {proposal.vendor_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            €{proposal.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(evaluationStatus)}`}>
                              {evaluationStatus === 'not_started' ? 'Not Started' : 
                               evaluationStatus === 'in_progress' ? 'In Progress' : 'Completed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {evaluationStatus === 'completed' ? (
                              <div className="flex items-center">
                                <span className={`text-sm font-medium ${
                                  score >= 80 ? 'text-green-600' : 
                                  score >= 70 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {score}/100
                                </span>
                                <div className="ml-2 w-16 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className={`h-1.5 rounded-full ${
                                      score >= 80 ? 'bg-green-500' : 
                                      score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${score}%` }}
                                  ></div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex -space-x-1">
                              <div className="z-10 h-6 w-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs font-medium text-gray-500">
                                JD
                              </div>
                              <div className="z-20 h-6 w-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs font-medium text-gray-500">
                                AM
                              </div>
                              <div className="z-30 h-6 w-6 rounded-full bg-gray-200 border border-white flex items-center justify-center text-xs font-medium text-gray-500">
                                RK
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/admin/procurement-dashboard/proposals/${proposal.id}/evaluate`}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                              {evaluationStatus === 'not_started' ? 'Start Evaluation' : 
                               evaluationStatus === 'in_progress' ? 'Continue Evaluation' : 'View Evaluation'}
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Evaluation Criteria */}
        {selectedTender && selectedTenderDetails && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-indigo-800">Evaluation Criteria</h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="space-y-4">
                {selectedTenderDetails.evaluation_criteria.map((criterion: any, index: number) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-medium text-gray-900">{criterion.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Weight: {criterion.weight}%
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {criterion.name === 'Technical approach' && 'Evaluation of the proposed technical solution, methodology, and approach to meeting requirements.'}
                      {criterion.name === 'Experience and qualifications' && 'Assessment of the vendor\'s experience, qualifications, and past performance on similar projects.'}
                      {criterion.name === 'Cost' && 'Evaluation of the proposed cost, including value for money and budget alignment.'}
                      {criterion.name === 'Timeline' && 'Assessment of the proposed timeline, milestones, and delivery schedule.'}
                      {criterion.name === 'Innovation' && 'Evaluation of innovative approaches, technologies, or methodologies proposed.'}
                    </p>
                    <div className="mt-2 grid grid-cols-5 gap-2">
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-500">Poor</div>
                        <div className="text-xs text-gray-400">0-20</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-500">Fair</div>
                        <div className="text-xs text-gray-400">21-40</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-500">Good</div>
                        <div className="text-xs text-gray-400">41-60</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-500">Very Good</div>
                        <div className="text-xs text-gray-400">61-80</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-500">Excellent</div>
                        <div className="text-xs text-gray-400">81-100</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* AI Assistance */}
        {selectedTender && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600">
              <h2 className="text-lg font-medium text-white">AI-Assisted Evaluation</h2>
              <p className="mt-1 text-sm text-indigo-100">
                Let our AI help you evaluate proposals more efficiently and objectively
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-md font-medium text-indigo-900">Requirement Compliance Check</h3>
                  </div>
                  <p className="text-sm text-indigo-700 mb-3">
                    AI automatically checks if proposals address all tender requirements and flags any missing items.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Run Compliance Check
                  </button>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <h3 className="text-md font-medium text-indigo-900">Score Suggestions</h3>
                  </div>
                  <p className="text-sm text-indigo-700 mb-3">
                    AI analyzes proposals and suggests evaluation scores based on the tender criteria.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Generate Score Suggestions
                  </button>
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="text-md font-medium text-indigo-900">Evaluation Report</h3>
                  </div>
                  <p className="text-sm text-indigo-700 mb-3">
                    AI generates a comprehensive evaluation report with detailed analysis and recommendations.
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Generate Evaluation Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
