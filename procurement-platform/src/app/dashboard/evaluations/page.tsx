'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for evaluations
const proposals = [
  {
    id: 1,
    tenderId: 1,
    tenderTitle: 'Executive Design of Urban Trails in Tirana',
    tenderReference: '#00189',
    vendorName: 'Urban Design Studio',
    submissionDate: '2025-02-10',
    status: 'Pending Evaluation',
    technicalScore: null,
    financialScore: null,
    aiSuggestedScore: 85,
    missingInfo: ['Project timeline', 'Team CVs'],
  },
  {
    id: 2,
    tenderId: 1,
    tenderTitle: 'Executive Design of Urban Trails in Tirana',
    tenderReference: '#00189',
    vendorName: 'Architectural Solutions Ltd',
    submissionDate: '2025-02-12',
    status: 'Pending Evaluation',
    technicalScore: null,
    financialScore: null,
    aiSuggestedScore: 78,
    missingInfo: ['Budget breakdown', 'Similar project references'],
  },
  {
    id: 3,
    tenderId: 1,
    tenderTitle: 'Executive Design of Urban Trails in Tirana',
    tenderReference: '#00189',
    vendorName: 'Green Path Designers',
    submissionDate: '2025-02-15',
    status: 'Pending Evaluation',
    technicalScore: null,
    financialScore: null,
    aiSuggestedScore: 92,
    missingInfo: [],
  },
  {
    id: 4,
    tenderId: 2,
    tenderTitle: 'IT Equipment Procurement',
    tenderReference: '#00188',
    vendorName: 'Tech Solutions Ltd',
    submissionDate: '2025-01-30',
    status: 'In Evaluation',
    technicalScore: 85,
    financialScore: null,
    aiSuggestedScore: 88,
    missingInfo: ['Warranty details'],
  },
  {
    id: 5,
    tenderId: 2,
    tenderTitle: 'IT Equipment Procurement',
    tenderReference: '#00188',
    vendorName: 'Digital Systems Inc',
    submissionDate: '2025-02-01',
    status: 'In Evaluation',
    technicalScore: 92,
    financialScore: null,
    aiSuggestedScore: 90,
    missingInfo: [],
  },
];

// Evaluation criteria
const evaluationCriteria = [
  {
    id: 1,
    name: 'Technical Approach',
    description: 'Methodology, work plan, and understanding of requirements',
    weight: 40,
  },
  {
    id: 2,
    name: 'Experience & Qualifications',
    description: 'Previous similar projects and team qualifications',
    weight: 30,
  },
  {
    id: 3,
    name: 'Financial Proposal',
    description: 'Cost-effectiveness and budget allocation',
    weight: 20,
  },
  {
    id: 4,
    name: 'Timeline',
    description: 'Proposed schedule and ability to meet deadlines',
    weight: 10,
  },
];

export default function EvaluationsPage() {
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [criteriaScores, setCriteriaScores] = useState<{[key: number]: number}>({});
  const [comments, setComments] = useState<string>('');
  
  const proposal = selectedProposal ? proposals.find(p => p.id === selectedProposal) : null;
  
  const handleScoreChange = (criteriaId: number, score: number) => {
    setCriteriaScores({
      ...criteriaScores,
      [criteriaId]: score
    });
  };
  
  const calculateTotalScore = () => {
    let totalScore = 0;
    let totalWeight = 0;
    
    evaluationCriteria.forEach(criteria => {
      if (criteriaScores[criteria.id]) {
        totalScore += (criteriaScores[criteria.id] * criteria.weight);
        totalWeight += criteria.weight;
      }
    });
    
    return totalWeight > 0 ? (totalScore / totalWeight).toFixed(2) : 'N/A';
  };
  
  const handleSubmitEvaluation = () => {
    alert('Evaluation submitted successfully!');
    setSelectedProposal(null);
    setCriteriaScores({});
    setComments('');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Proposal Evaluations</h1>
          <p className="text-gray-600">
            Review and evaluate submitted proposals. AI-powered analysis is available to assist with evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Proposals List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Pending Evaluations</h2>
              </div>
              <div className="overflow-y-auto max-h-[600px]">
                <ul className="divide-y divide-gray-200">
                  {proposals.map((p) => (
                    <li 
                      key={p.id} 
                      className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${selectedProposal === p.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedProposal(p.id)}
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-900">{p.vendorName}</span>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            p.status === 'Pending Evaluation' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">{p.tenderTitle}</p>
                        <p className="text-xs text-gray-400">Submitted: {p.submissionDate}</p>
                        {p.missingInfo.length > 0 && (
                          <div className="mt-1 flex items-center">
                            <svg className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-xs text-red-500">Missing information detected</span>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Evaluation Form */}
          <div className="lg:col-span-2">
            {selectedProposal ? (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Evaluate Proposal</h2>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{proposal?.vendorName}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      {proposal?.tenderTitle} ({proposal?.tenderReference})
                    </p>
                    
                    {proposal?.missingInfo.length ? (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Missing Information Detected</h3>
                            <div className="mt-2 text-sm text-red-700">
                              <ul className="list-disc pl-5 space-y-1">
                                {proposal?.missingInfo.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-blue-800">AI-Suggested Score: {proposal?.aiSuggestedScore}/100</h3>
                          <div className="mt-2 text-sm text-blue-700">
                            <p>
                              Our AI has analyzed this proposal based on the tender requirements and suggests a score of {proposal?.aiSuggestedScore}/100.
                              This is a recommendation only and should be reviewed by the evaluation committee.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Evaluation Criteria</h4>
                      <div className="space-y-4">
                        {evaluationCriteria.map((criteria) => (
                          <div key={criteria.id} className="border border-gray-200 rounded-md p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <h5 className="text-sm font-medium text-gray-900">{criteria.name}</h5>
                                <p className="text-xs text-gray-500">{criteria.description}</p>
                              </div>
                              <span className="text-xs text-gray-500">Weight: {criteria.weight}%</span>
                            </div>
                            <div className="mt-2">
                              <label htmlFor={`score-${criteria.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Score (0-100)
                              </label>
                              <input
                                type="number"
                                id={`score-${criteria.id}`}
                                min="0"
                                max="100"
                                value={criteriaScores[criteria.id] || ''}
                                onChange={(e) => handleScoreChange(criteria.id, parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                        Comments
                      </label>
                      <textarea
                        id="comments"
                        rows={4}
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Add your evaluation comments here..."
                      ></textarea>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-md mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900">Total Weighted Score:</span>
                        <span className="text-lg font-bold text-blue-600">{calculateTotalScore()}/100</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProposal(null);
                          setCriteriaScores({});
                          setComments('');
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmitEvaluation}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Submit Evaluation
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No proposal selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a proposal from the list to begin evaluation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
