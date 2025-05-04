'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockProposals, mockTenders } from '@/lib/mockData';

// Mock evaluation suggestions data
const mockEvaluationSuggestions = [
  {
    proposal_id: 'proposal-001',
    tender_id: 'tender-001',
    vendor_id: 'Vendor A',
    suggested_scores: [
      { criterion: 'Technical approach', weight: 40, score: 85, justification: 'Comprehensive methodology with clear implementation steps' },
      { criterion: 'Experience and qualifications', weight: 30, score: 90, justification: 'Team has extensive experience in similar projects' },
      { criterion: 'Cost', weight: 20, score: 75, justification: 'Within budget but slightly higher than other proposals' },
      { criterion: 'Timeline', weight: 10, score: 80, justification: 'Realistic timeline with appropriate milestones' }
    ],
    overall_score: 84.5,
    strengths: [
      'Strong technical approach with comprehensive methodology',
      'Team has excellent qualifications and relevant experience',
      'Realistic timeline with buffer for contingencies'
    ],
    weaknesses: [
      'Cost is slightly higher than other proposals',
      'Limited detail on risk management approach'
    ],
    ai_confidence: 92
  },
  {
    proposal_id: 'proposal-002',
    tender_id: 'tender-002',
    vendor_id: 'Vendor B',
    suggested_scores: [
      { criterion: 'Technical approach', weight: 40, score: 70, justification: 'Adequate methodology but lacks some implementation details' },
      { criterion: 'Experience and qualifications', weight: 30, score: 85, justification: 'Good experience but limited in some key areas' },
      { criterion: 'Cost', weight: 20, score: 90, justification: 'Very competitive pricing' },
      { criterion: 'Timeline', weight: 10, score: 75, justification: 'Timeline is reasonable but some milestones seem ambitious' }
    ],
    overall_score: 78.5,
    strengths: [
      'Very competitive pricing',
      'Good experience in most required areas',
      'Innovative approach to some technical challenges'
    ],
    weaknesses: [
      'Some implementation details are vague',
      'Timeline may be optimistic for certain phases',
      'Team lacks experience in one key area'
    ],
    ai_confidence: 85
  },
  {
    proposal_id: 'proposal-003',
    tender_id: 'tender-003',
    vendor_id: 'Vendor C',
    suggested_scores: [
      { criterion: 'Technical approach', weight: 35, score: 95, justification: 'Exceptional technical approach with innovative solutions' },
      { criterion: 'Experience and qualifications', weight: 25, score: 90, justification: 'Highly experienced team with relevant expertise' },
      { criterion: 'Cost', weight: 25, score: 65, justification: 'Significantly above budget' },
      { criterion: 'Timeline', weight: 15, score: 85, justification: 'Well-structured timeline with detailed milestones' }
    ],
    overall_score: 84.0,
    strengths: [
      'Exceptional technical approach with innovative solutions',
      'Highly experienced team with proven track record',
      'Comprehensive risk management strategy'
    ],
    weaknesses: [
      'Cost is significantly above budget',
      'Some proposed technologies are relatively new and untested'
    ],
    ai_confidence: 88
  },
  {
    proposal_id: 'proposal-004',
    tender_id: 'tender-004',
    vendor_id: 'Vendor D',
    suggested_scores: [
      { criterion: 'Technical approach', weight: 30, score: 60, justification: 'Basic approach with minimal innovation' },
      { criterion: 'Experience and qualifications', weight: 30, score: 70, justification: 'Adequate experience but limited portfolio' },
      { criterion: 'Cost', weight: 30, score: 95, justification: 'Lowest cost proposal, well below budget' },
      { criterion: 'Timeline', weight: 10, score: 65, justification: 'Timeline seems rushed in some phases' }
    ],
    overall_score: 74.5,
    strengths: [
      'Lowest cost proposal, well below budget',
      'Simple, straightforward approach',
      'Good understanding of basic requirements'
    ],
    weaknesses: [
      'Limited innovation in technical approach',
      'Team has less experience than other vendors',
      'Timeline may be unrealistic for some phases'
    ],
    ai_confidence: 90
  },
  {
    proposal_id: 'proposal-005',
    tender_id: 'tender-005',
    vendor_id: 'Vendor E',
    suggested_scores: [
      { criterion: 'Technical approach', weight: 40, score: 80, justification: 'Solid approach with good implementation details' },
      { criterion: 'Experience and qualifications', weight: 30, score: 85, justification: 'Well-qualified team with relevant experience' },
      { criterion: 'Cost', weight: 20, score: 85, justification: 'Competitive pricing within budget' },
      { criterion: 'Timeline', weight: 10, score: 80, justification: 'Realistic timeline with appropriate milestones' }
    ],
    overall_score: 82.5,
    strengths: [
      'Well-balanced proposal across all criteria',
      'Good value for money',
      'Experienced team with relevant expertise'
    ],
    weaknesses: [
      'Some aspects of the technical approach are conventional',
      'Limited information on quality assurance processes'
    ],
    ai_confidence: 94
  }
];

export default function EvaluationSuggestionPage() {
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Get proposal details
  const getProposalDetails = (proposalId: string) => {
    return mockProposals.find(p => p.id === proposalId);
  };

  // Get tender details
  const getTenderDetails = (tenderId: string) => {
    return mockTenders.find(t => t.id === tenderId);
  };

  // Get evaluation suggestion for selected proposal
  const selectedProposalSuggestion = selectedProposal
    ? mockEvaluationSuggestions.find(suggestion => suggestion.proposal_id === selectedProposal)
    : null;

  // Get proposal details for selected proposal
  const selectedProposalDetails = selectedProposal
    ? getProposalDetails(selectedProposal)
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

  // Get score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get score background color
  const getScoreBgColor = (score: number) => {
    if (score >= 85) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Handle analyze proposal
  const handleAnalyzeProposal = () => {
    if (!selectedProposal) return;

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
          <h1 className="text-2xl font-bold text-gray-900">AI Evaluation Score Suggestions</h1>
          <p className="mt-1 text-sm text-gray-500">
            AI-powered suggestions for proposal evaluation scores based on preset criteria
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Proposals List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-indigo-800">Proposals</h2>
              </div>

              <div className="overflow-y-auto max-h-[600px]">
                <ul className="divide-y divide-gray-200">
                  {mockEvaluationSuggestions.map((suggestion) => {
                    const proposal = getProposalDetails(suggestion.proposal_id);
                    const tender = getTenderDetails(suggestion.tender_id);

                    return (
                      <li
                        key={suggestion.proposal_id}
                        className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                          selectedProposal === suggestion.proposal_id ? 'bg-indigo-50' : ''
                        }`}
                        onClick={() => setSelectedProposal(suggestion.proposal_id)}
                      >
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-indigo-600">{proposal?.title || 'Unknown Proposal'}</span>
                            <span className={`text-sm font-medium ${getScoreColor(suggestion.overall_score)}`}>
                              {suggestion.overall_score}/100
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {tender?.title || 'Unknown Tender'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Vendor: {suggestion.vendor_id}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className={`h-1.5 rounded-full ${
                                suggestion.overall_score >= 85 ? 'bg-green-500' :
                                suggestion.overall_score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${suggestion.overall_score}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-end">
                            <span className="text-xs text-gray-500">
                              AI Confidence: {suggestion.ai_confidence}%
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Evaluation Suggestions */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-indigo-800">Evaluation Suggestions</h2>
              </div>

              {!selectedProposalSuggestion ? (
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">Select a proposal to view evaluation suggestions</p>
                </div>
              ) : (
                <div className="px-4 py-5 sm:p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {selectedProposalDetails?.title || 'Unknown Proposal'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Submitted by {selectedProposalSuggestion.vendor_id} on {selectedProposalDetails ? formatDate(selectedProposalDetails.created_at) : 'Unknown date'}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2">AI Confidence:</span>
                        <div className="bg-gray-200 rounded-full h-2 w-24">
                          <div
                            className={`h-2 rounded-full ${
                              selectedProposalSuggestion.ai_confidence >= 90 ? 'bg-green-500' :
                              selectedProposalSuggestion.ai_confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${selectedProposalSuggestion.ai_confidence}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">{selectedProposalSuggestion.ai_confidence}%</span>
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button
                        type="button"
                        onClick={handleAnalyzeProposal}
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
                            Re-analyze Proposal
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('Report generated and downloaded')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Generate Report
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('AI suggestions applied to evaluation')}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Apply Suggestions
                      </button>
                    </div>
                  </div>

                  {/* Overall Score */}
                  <div className={`mb-6 p-4 rounded-md ${getScoreBgColor(selectedProposalSuggestion.overall_score)}`}>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-md font-medium text-gray-900">Overall Score</h4>
                      <span className={`text-lg font-bold ${getScoreColor(selectedProposalSuggestion.overall_score)}`}>
                        {selectedProposalSuggestion.overall_score}/100
                      </span>
                    </div>
                    <div className="w-full bg-white bg-opacity-50 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          selectedProposalSuggestion.overall_score >= 85 ? 'bg-green-500' :
                          selectedProposalSuggestion.overall_score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedProposalSuggestion.overall_score}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Criterion Scores */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Criterion Scores</h4>
                    <div className="space-y-4">
                      {selectedProposalSuggestion.suggested_scores.map((score, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <div>
                              <span className="text-sm font-medium text-gray-900">{score.criterion}</span>
                              <span className="ml-2 text-xs text-gray-500">Weight: {score.weight}%</span>
                            </div>
                            <span className={`text-sm font-bold ${getScoreColor(score.score)}`}>
                              {score.score}/100
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                            <div
                              className={`h-1.5 rounded-full ${
                                score.score >= 85 ? 'bg-green-500' :
                                score.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${score.score}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            <span className="font-medium">Justification:</span> {score.justification}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths and Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-green-800 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {selectedProposalSuggestion.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-4 w-4 text-green-500 mt-0.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-xs text-green-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-red-800 mb-2">Weaknesses</h4>
                      <ul className="space-y-1">
                        {selectedProposalSuggestion.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-4 w-4 text-red-500 mt-0.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-xs text-red-700">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 className="text-lg font-medium text-white">How AI Evaluation Suggestions Work</h2>
            <p className="mt-1 text-sm text-indigo-100">
              Our AI system analyzes proposals and suggests evaluation scores based on preset criteria
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-lg font-medium">
                    1
                  </span>
                  <h3 className="ml-2 text-md font-medium text-indigo-900">Content Analysis</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  AI analyzes the proposal content using natural language processing to understand the approach, qualifications, and other key factors.
                </p>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-lg font-medium">
                    2
                  </span>
                  <h3 className="ml-2 text-md font-medium text-indigo-900">Criteria Matching</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  The system evaluates how well the proposal meets each criterion based on the tender requirements and industry best practices.
                </p>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-lg font-medium">
                    3
                  </span>
                  <h3 className="ml-2 text-md font-medium text-indigo-900">Score Generation</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  AI generates suggested scores for each criterion, along with justifications, strengths, and weaknesses to support the evaluation.
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
                  <h3 className="text-sm font-medium text-blue-800">Benefits of AI Evaluation Suggestions</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Provides objective, consistent evaluation across all proposals</li>
                      <li>Reduces bias in the evaluation process</li>
                      <li>Saves time for evaluators by providing initial scores and justifications</li>
                      <li>Identifies strengths and weaknesses that might be overlooked</li>
                      <li>Improves the quality and transparency of the evaluation process</li>
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
