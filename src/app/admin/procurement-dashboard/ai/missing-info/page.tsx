'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockProposals, mockTenders } from '@/lib/mockData';

// Mock missing information data
const mockMissingInfo = [
  {
    proposal_id: 'proposal-001',
    tender_id: 'tender-001',
    vendor_id: 'Vendor A',
    missing_items: [
      { section: 'Technical Approach', item: 'Implementation timeline', severity: 'high', description: 'No detailed implementation timeline provided' },
      { section: 'Team Composition', item: 'Team CVs', severity: 'medium', description: 'CVs for 2 key team members are missing' }
    ],
    incomplete_items: [
      { section: 'Financial Proposal', item: 'Cost breakdown', severity: 'high', description: 'Cost breakdown is incomplete, missing hardware costs' },
      { section: 'Technical Approach', item: 'Testing methodology', severity: 'medium', description: 'Testing methodology lacks details on security testing' }
    ],
    ai_confidence: 85
  },
  {
    proposal_id: 'proposal-002',
    tender_id: 'tender-002',
    vendor_id: 'Vendor B',
    missing_items: [
      { section: 'Company Profile', item: 'Previous experience', severity: 'medium', description: 'No examples of similar projects provided' }
    ],
    incomplete_items: [
      { section: 'Technical Proposal', item: 'Technology stack', severity: 'high', description: 'Technology stack description is vague and lacks specifics' },
      { section: 'Project Management', item: 'Risk management plan', severity: 'medium', description: 'Risk management plan does not address potential delays' },
      { section: 'Financial Proposal', item: 'Payment schedule', severity: 'low', description: 'Payment schedule lacks milestone details' }
    ],
    ai_confidence: 92
  },
  {
    proposal_id: 'proposal-003',
    tender_id: 'tender-003',
    vendor_id: 'Vendor C',
    missing_items: [],
    incomplete_items: [
      { section: 'Technical Proposal', item: 'Integration approach', severity: 'medium', description: 'Integration approach with existing systems is not clearly defined' }
    ],
    ai_confidence: 78
  },
  {
    proposal_id: 'proposal-004',
    tender_id: 'tender-004',
    vendor_id: 'Vendor D',
    missing_items: [
      { section: 'Compliance', item: 'Security certifications', severity: 'high', description: 'Required security certifications not provided' },
      { section: 'Technical Proposal', item: 'Data migration plan', severity: 'high', description: 'No data migration plan included' },
      { section: 'Team Composition', item: 'Project manager details', severity: 'medium', description: 'Project manager details and experience not provided' }
    ],
    incomplete_items: [
      { section: 'Financial Proposal', item: 'Maintenance costs', severity: 'medium', description: 'Maintenance costs only provided for first year, not for full 3 years as required' }
    ],
    ai_confidence: 95
  },
  {
    proposal_id: 'proposal-005',
    tender_id: 'tender-005',
    vendor_id: 'Vendor E',
    missing_items: [],
    incomplete_items: [],
    ai_confidence: 90
  }
];

export default function MissingInfoPage() {
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
  
  // Get missing info for selected proposal
  const selectedProposalInfo = selectedProposal
    ? mockMissingInfo.find(info => info.proposal_id === selectedProposal)
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
  
  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
  
  // Calculate total issues
  const getTotalIssues = (info: any) => {
    return info.missing_items.length + info.incomplete_items.length;
  };
  
  // Get status based on issues
  const getProposalStatus = (info: any) => {
    const totalIssues = getTotalIssues(info);
    const highSeverityIssues = [...info.missing_items, ...info.incomplete_items].filter(item => item.severity === 'high').length;
    
    if (totalIssues === 0) return 'complete';
    if (highSeverityIssues > 0) return 'critical';
    return 'incomplete';
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <h1 className="text-2xl font-bold text-gray-900">AI Missing Information Detection</h1>
          <p className="mt-1 text-sm text-gray-500">
            Automatically detect missing or incomplete information in proposals
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
                  {mockMissingInfo.map((info) => {
                    const proposal = getProposalDetails(info.proposal_id);
                    const tender = getTenderDetails(info.tender_id);
                    const status = getProposalStatus(info);
                    
                    return (
                      <li
                        key={info.proposal_id}
                        className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                          selectedProposal === info.proposal_id ? 'bg-indigo-50' : ''
                        }`}
                        onClick={() => setSelectedProposal(info.proposal_id)}
                      >
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-indigo-600">{proposal?.title || 'Unknown Proposal'}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(status)}`}>
                              {status === 'complete' ? 'Complete' : 
                               status === 'incomplete' ? 'Incomplete' : 'Critical Issues'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {tender?.title || 'Unknown Tender'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Vendor: {info.vendor_id}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              {getTotalIssues(info)} issues detected
                            </span>
                            <span className="text-xs text-gray-500">
                              {info.ai_confidence}% confidence
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
          
          {/* Analysis Results */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-indigo-800">Analysis Results</h2>
              </div>
              
              {!selectedProposalInfo ? (
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">Select a proposal to view analysis results</p>
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
                          Submitted by {selectedProposalInfo.vendor_id} on {selectedProposalDetails ? formatDate(selectedProposalDetails.created_at) : 'Unknown date'}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2">AI Confidence:</span>
                        <div className="bg-gray-200 rounded-full h-2 w-24">
                          <div 
                            className={`h-2 rounded-full ${
                              selectedProposalInfo.ai_confidence >= 90 ? 'bg-green-500' : 
                              selectedProposalInfo.ai_confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${selectedProposalInfo.ai_confidence}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">{selectedProposalInfo.ai_confidence}%</span>
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
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Notify Vendor
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Generate Report
                      </button>
                    </div>
                  </div>
                  
                  {/* Missing Items */}
                  <div className="mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Missing Information
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {selectedProposalInfo.missing_items.length} items
                      </span>
                    </h4>
                    
                    {selectedProposalInfo.missing_items.length === 0 ? (
                      <div className="bg-green-50 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">
                              No missing information detected in this proposal.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {selectedProposalInfo.missing_items.map((item, index) => (
                            <li key={index} className="px-4 py-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900">{item.item}</span>
                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                                      {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)} Severity
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    <span className="font-medium">Section:</span> {item.section}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.description}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  Request
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  {/* Incomplete Items */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Incomplete Information
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {selectedProposalInfo.incomplete_items.length} items
                      </span>
                    </h4>
                    
                    {selectedProposalInfo.incomplete_items.length === 0 ? (
                      <div className="bg-green-50 p-4 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">
                              No incomplete information detected in this proposal.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {selectedProposalInfo.incomplete_items.map((item, index) => (
                            <li key={index} className="px-4 py-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900">{item.item}</span>
                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(item.severity)}`}>
                                      {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)} Severity
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    <span className="font-medium">Section:</span> {item.section}
                                  </p>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {item.description}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  Request
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* How It Works */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 className="text-lg font-medium text-white">How AI Missing Information Detection Works</h2>
            <p className="mt-1 text-sm text-indigo-100">
              Our AI system automatically analyzes proposals to detect missing or incomplete information
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-lg font-medium">
                    1
                  </span>
                  <h3 className="ml-2 text-md font-medium text-indigo-900">Document Analysis</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  AI analyzes the proposal documents using natural language processing to understand the content and structure.
                </p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-lg font-medium">
                    2
                  </span>
                  <h3 className="ml-2 text-md font-medium text-indigo-900">Requirement Matching</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  The system compares the proposal content against the tender requirements to identify missing or incomplete information.
                </p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-lg font-medium">
                    3
                  </span>
                  <h3 className="ml-2 text-md font-medium text-indigo-900">Severity Assessment</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  Each missing or incomplete item is assigned a severity level based on its importance to the evaluation process.
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
                  <h3 className="text-sm font-medium text-blue-800">Benefits of AI Missing Information Detection</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Saves hours of manual review time</li>
                      <li>Ensures all required information is provided before evaluation</li>
                      <li>Improves proposal quality by allowing vendors to address gaps</li>
                      <li>Standardizes the evaluation process</li>
                      <li>Reduces the risk of overlooking critical information</li>
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
