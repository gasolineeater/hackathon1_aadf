'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockTenders } from '@/lib/mockData';

// Mock reports data
const mockReports = [
  {
    id: 'report-001',
    tender_id: 'tender-001',
    type: 'evaluation_summary',
    title: 'Evaluation Summary Report',
    generated_at: '2023-06-15T14:30:00Z',
    generated_by: 'System',
    status: 'completed',
    file_url: '#'
  },
  {
    id: 'report-002',
    tender_id: 'tender-002',
    type: 'award_recommendation',
    title: 'Award Recommendation Report',
    generated_at: '2023-06-18T10:45:00Z',
    generated_by: 'Jane Smith',
    status: 'completed',
    file_url: '#'
  },
  {
    id: 'report-003',
    tender_id: 'tender-003',
    type: 'tender_summary',
    title: 'Tender Summary Report',
    generated_at: '2023-06-20T09:15:00Z',
    generated_by: 'System',
    status: 'completed',
    file_url: '#'
  },
  {
    id: 'report-004',
    tender_id: 'tender-004',
    type: 'evaluation_summary',
    title: 'Evaluation Summary Report',
    generated_at: '2023-06-22T16:20:00Z',
    generated_by: 'System',
    status: 'in_progress',
    file_url: null
  },
  {
    id: 'report-005',
    tender_id: 'tender-005',
    type: 'award_recommendation',
    title: 'Award Recommendation Report',
    generated_at: '2023-06-25T11:30:00Z',
    generated_by: 'Michael Johnson',
    status: 'completed',
    file_url: '#'
  }
];

export default function ReportsPage() {
  const [selectedTender, setSelectedTender] = useState<string | null>(null);
  const [reportType, setReportType] = useState<string>('evaluation_summary');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Filter reports based on selected tender
  const filteredReports = selectedTender
    ? mockReports.filter(report => report.tender_id === selectedTender)
    : mockReports;
  
  // Get tender title
  const getTenderTitle = (tenderId: string) => {
    const tender = mockTenders.find(t => t.id === tenderId);
    return tender ? tender.title : 'Unknown Tender';
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'evaluation_summary':
        return 'bg-blue-100 text-blue-800';
      case 'award_recommendation':
        return 'bg-purple-100 text-purple-800';
      case 'tender_summary':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format type for display
  const formatType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  // Handle report generation
  const handleGenerateReport = () => {
    if (!selectedTender) return;
    
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
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
          <h1 className="text-2xl font-bold text-gray-900">Report Generation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Automatically generate reports for tenders and evaluations
          </p>
        </div>
        
        {/* Generate Report */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Generate New Report</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="tender" className="block text-sm font-medium text-gray-700 mb-1">
                  Tender <span className="text-red-500">*</span>
                </label>
                <select
                  id="tender"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={selectedTender || ''}
                  onChange={(e) => setSelectedTender(e.target.value || null)}
                  required
                >
                  <option value="">Select a Tender</option>
                  {mockTenders.map(tender => (
                    <option key={tender.id} value={tender.id}>
                      {tender.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="reportType"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  required
                >
                  <option value="evaluation_summary">Evaluation Summary</option>
                  <option value="award_recommendation">Award Recommendation</option>
                  <option value="tender_summary">Tender Summary</option>
                  <option value="compliance_report">Compliance Report</option>
                  <option value="financial_analysis">Financial Analysis</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleGenerateReport}
                  disabled={!selectedTender || isGenerating}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    !selectedTender || isGenerating
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Generate Report
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="mt-6 bg-indigo-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-indigo-800">About Report Generation</h3>
                  <div className="mt-2 text-sm text-indigo-700">
                    <p>
                      Reports are automatically generated based on the data in the system. The following report types are available:
                    </p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li><span className="font-medium">Evaluation Summary:</span> Summarizes the evaluation scores and comments for all proposals</li>
                      <li><span className="font-medium">Award Recommendation:</span> Provides a recommendation for which vendor should be awarded the tender</li>
                      <li><span className="font-medium">Tender Summary:</span> Provides an overview of the tender, including requirements and timeline</li>
                      <li><span className="font-medium">Compliance Report:</span> Analyzes proposal compliance with tender requirements</li>
                      <li><span className="font-medium">Financial Analysis:</span> Compares the financial aspects of all proposals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reports List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Generated Reports ({filteredReports.length})</h2>
          </div>
          
          {filteredReports.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">No reports found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tender
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-600">
                          {report.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getTenderTitle(report.tender_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                          {formatType(report.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.generated_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(report.generated_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {report.status === 'completed' ? (
                          <div className="flex space-x-2 justify-end">
                            <a
                              href={report.file_url}
                              className="text-indigo-600 hover:text-indigo-900"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View
                            </a>
                            <a
                              href={report.file_url}
                              className="text-indigo-600 hover:text-indigo-900"
                              download
                            >
                              Download
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400">Unavailable</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* AI Features */}
        <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 className="text-lg font-medium text-white">AI-Powered Report Generation</h2>
            <p className="mt-1 text-sm text-indigo-100">
              Our AI enhances report generation with advanced analysis and insights
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-md font-medium text-indigo-900">Automated Analysis</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  AI automatically analyzes proposal data and generates insights, saving hours of manual work.
                </p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 className="text-md font-medium text-indigo-900">Comparative Insights</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  AI compares proposals across multiple dimensions and highlights key differences and strengths.
                </p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-md font-medium text-indigo-900">Custom Formatting</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  Reports are automatically formatted according to organizational standards and requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
