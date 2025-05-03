'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useToast } from '@/app/context/ToastContext';

interface ReportGeneratorProps {
  tenderId: string;
  tenderTitle: string;
}

export default function ReportGenerator({ tenderId, tenderTitle }: ReportGeneratorProps) {
  const { user } = useAuth();
  const { isAdmin, isEvaluator } = useRoleAccess();
  const { showToast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [options, setOptions] = useState({
    includeProposalDetails: true,
    includeEvaluationScores: true,
    includeVendorInformation: true,
    includeAIAnalysis: true,
    includeRecommendations: true,
    format: 'detailed'
  });
  
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked, value, type } = e.target;
    setOptions({
      ...options,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const generateReport = async () => {
    if (!user || (!isAdmin && !isEvaluator)) {
      showToast({
        type: 'error',
        title: 'Permission Error',
        message: 'You do not have permission to generate reports'
      });
      return;
    }
    
    setIsGenerating(true);
    setReport(null);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate the API call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock report
      const mockReport = {
        id: `report-${Date.now()}`,
        tender_id: tenderId,
        title: `Tender Evaluation Report - ${tenderTitle}`,
        generated_at: new Date().toISOString(),
        generated_by: user.email,
        options: options,
        content: {
          tender: {
            id: tenderId,
            title: tenderTitle,
            description: 'Development of urban trails in the city center',
            category: 'Infrastructure',
            status: 'closed',
            published_at: '2023-11-01T10:00:00Z',
            deadline: '2023-12-15T23:59:59Z',
            closed_at: '2023-12-16T00:00:00Z'
          },
          summary: {
            proposal_count: 5,
            evaluation_count: 15,
            average_score: 78.4,
            highest_score: 92.5,
            lowest_score: 65.2
          },
          committee: [
            {
              name: 'John Doe',
              role: 'Chair',
              email: 'john.doe@example.com'
            },
            {
              name: 'Jane Smith',
              role: 'Member',
              email: 'jane.smith@example.com'
            },
            {
              name: 'Bob Johnson',
              role: 'Secretary',
              email: 'bob.johnson@example.com'
            }
          ],
          proposals: options.includeProposalDetails ? [
            {
              id: 'proposal-1',
              title: 'Urban Trails Development Proposal',
              vendor: 'ABC Construction',
              price: 125000,
              currency: 'EUR',
              submitted_at: '2023-12-10T14:30:00Z',
              average_score: 92.5,
              evaluation_count: 3,
              evaluations: options.includeEvaluationScores ? [
                {
                  evaluator: 'John Doe',
                  score: 95,
                  comments: 'Excellent proposal with comprehensive approach',
                  created_at: '2023-12-17T10:15:00Z'
                },
                {
                  evaluator: 'Jane Smith',
                  score: 90,
                  comments: 'Very strong technical approach',
                  created_at: '2023-12-17T11:30:00Z'
                },
                {
                  evaluator: 'Bob Johnson',
                  score: 92.5,
                  comments: 'Well-structured and detailed',
                  created_at: '2023-12-17T14:45:00Z'
                }
              ] : []
            },
            {
              id: 'proposal-2',
              title: 'City Center Trails Project',
              vendor: 'XYZ Infrastructure',
              price: 135000,
              currency: 'EUR',
              submitted_at: '2023-12-12T09:45:00Z',
              average_score: 85.3,
              evaluation_count: 3,
              evaluations: options.includeEvaluationScores ? [
                {
                  evaluator: 'John Doe',
                  score: 88,
                  comments: 'Good proposal but slightly over budget',
                  created_at: '2023-12-17T10:30:00Z'
                },
                {
                  evaluator: 'Jane Smith',
                  score: 82,
                  comments: 'Strong technical approach but timeline concerns',
                  created_at: '2023-12-17T11:45:00Z'
                },
                {
                  evaluator: 'Bob Johnson',
                  score: 86,
                  comments: 'Well-structured but some details missing',
                  created_at: '2023-12-17T15:00:00Z'
                }
              ] : []
            },
            {
              id: 'proposal-3',
              title: 'Urban Mobility Enhancement',
              vendor: 'Green Paths Inc.',
              price: 118000,
              currency: 'EUR',
              submitted_at: '2023-12-14T16:20:00Z',
              average_score: 78.7,
              evaluation_count: 3,
              evaluations: options.includeEvaluationScores ? [
                {
                  evaluator: 'John Doe',
                  score: 80,
                  comments: 'Innovative approach but some technical concerns',
                  created_at: '2023-12-17T10:45:00Z'
                },
                {
                  evaluator: 'Jane Smith',
                  score: 75,
                  comments: 'Good but lacks detail in implementation plan',
                  created_at: '2023-12-17T12:00:00Z'
                },
                {
                  evaluator: 'Bob Johnson',
                  score: 81,
                  comments: 'Interesting approach but some risks identified',
                  created_at: '2023-12-17T15:15:00Z'
                }
              ] : []
            }
          ] : [],
          vendor_information: options.includeVendorInformation ? [
            {
              name: 'ABC Construction',
              contact_person: 'Alice Brown',
              contact_email: 'alice@abcconstruction.com',
              years_in_business: 15,
              previous_projects: 28,
              certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001']
            },
            {
              name: 'XYZ Infrastructure',
              contact_person: 'Charlie Davis',
              contact_email: 'charlie@xyzinfra.com',
              years_in_business: 12,
              previous_projects: 22,
              certifications: ['ISO 9001', 'ISO 14001']
            },
            {
              name: 'Green Paths Inc.',
              contact_person: 'David Evans',
              contact_email: 'david@greenpaths.com',
              years_in_business: 8,
              previous_projects: 15,
              certifications: ['ISO 9001']
            }
          ] : [],
          ai_analysis: options.includeAIAnalysis ? {
            compatibility_scores: [
              {
                vendor: 'ABC Construction',
                score: 0.92,
                factors: [
                  { name: 'Industry Match', score: 0.95, weight: 0.25 },
                  { name: 'Expertise Match', score: 0.9, weight: 0.3 },
                  { name: 'Experience Match', score: 0.95, weight: 0.2 },
                  { name: 'Capacity Match', score: 0.85, weight: 0.15 },
                  { name: 'Certification Match', score: 0.95, weight: 0.1 }
                ]
              },
              {
                vendor: 'XYZ Infrastructure',
                score: 0.85,
                factors: [
                  { name: 'Industry Match', score: 0.9, weight: 0.25 },
                  { name: 'Expertise Match', score: 0.85, weight: 0.3 },
                  { name: 'Experience Match', score: 0.8, weight: 0.2 },
                  { name: 'Capacity Match', score: 0.9, weight: 0.15 },
                  { name: 'Certification Match', score: 0.8, weight: 0.1 }
                ]
              },
              {
                vendor: 'Green Paths Inc.',
                score: 0.78,
                factors: [
                  { name: 'Industry Match', score: 0.8, weight: 0.25 },
                  { name: 'Expertise Match', score: 0.75, weight: 0.3 },
                  { name: 'Experience Match', score: 0.7, weight: 0.2 },
                  { name: 'Capacity Match', score: 0.85, weight: 0.15 },
                  { name: 'Certification Match', score: 0.85, weight: 0.1 }
                ]
              }
            ],
            proposal_analyses: [
              {
                vendor: 'ABC Construction',
                overall_score: 90,
                compliance_score: 95,
                evaluation_score: 88,
                key_findings: [
                  'Comprehensive approach to project implementation',
                  'Strong team with relevant experience',
                  'Detailed timeline with realistic milestones',
                  'Thorough risk assessment and mitigation strategies'
                ]
              },
              {
                vendor: 'XYZ Infrastructure',
                overall_score: 82,
                compliance_score: 90,
                evaluation_score: 78,
                key_findings: [
                  'Good technical approach but some gaps in implementation details',
                  'Experienced team but limited specific experience in urban trails',
                  'Timeline appears optimistic in some phases',
                  'Good risk assessment but some mitigation strategies lack detail'
                ]
              },
              {
                vendor: 'Green Paths Inc.',
                overall_score: 75,
                compliance_score: 85,
                evaluation_score: 70,
                key_findings: [
                  'Innovative approach but lacks some technical details',
                  'Team has limited experience with projects of this scale',
                  'Timeline is realistic but lacks contingency planning',
                  'Limited risk assessment and mitigation strategies'
                ]
              }
            ]
          } : null,
          recommendation: options.includeRecommendations ? {
            recommended_vendor: 'ABC Construction',
            score: 92.5,
            rationale: 'Based on both human evaluation and AI analysis, ABC Construction received the highest scores across all criteria. Their proposal demonstrates a comprehensive understanding of the project requirements, a strong technical approach, and a realistic implementation plan. The company has extensive experience in similar projects and all required certifications. The evaluation committee unanimously recommends awarding the contract to ABC Construction.'
          } : null,
          conclusion: `This report was automatically generated on ${new Date().toLocaleDateString()} based on the evaluation of 5 proposals for tender "${tenderTitle}". The evaluation process followed the procurement guidelines and was conducted by a committee of 3 members. All proposals were evaluated against the same criteria, and the results were validated through both manual review and AI-assisted analysis.`
        }
      };
      
      setReport(mockReport);
      
      showToast({
        type: 'success',
        title: 'Report Generated',
        message: 'The report has been generated successfully'
      });
    } catch (error: any) {
      console.error('Error generating report:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to generate report'
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const downloadReport = () => {
    if (!report) return;
    
    // Create a blob with the report data
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!user || (!isAdmin && !isEvaluator)) {
    return null;
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Report Generator</h3>
        <p className="mt-1 text-sm text-gray-500">
          Generate comprehensive reports for tender evaluation
        </p>
      </div>
      
      <div className="p-4">
        {report ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">
                {report.title}
              </h4>
              <button
                type="button"
                onClick={downloadReport}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4]"
              >
                <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Report
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Report Summary</h5>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Generated At</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(report.generated_at)}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Generated By</dt>
                  <dd className="mt-1 text-sm text-gray-900">{report.generated_by}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Tender</dt>
                  <dd className="mt-1 text-sm text-gray-900">{report.content.tender.title}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{report.content.tender.status.charAt(0).toUpperCase() + report.content.tender.status.slice(1)}</dd>
                </div>
              </dl>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h5 className="text-sm font-medium text-gray-700 mb-2">Proposal Statistics</h5>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Proposals</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">{report.content.summary.proposal_count}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Evaluations</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">{report.content.summary.evaluation_count}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Avg. Score</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">{report.content.summary.average_score.toFixed(1)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Top Score</dt>
                  <dd className="mt-1 text-2xl font-semibold text-gray-900">{report.content.summary.highest_score.toFixed(1)}</dd>
                </div>
              </dl>
            </div>
            
            {options.includeRecommendations && report.content.recommendation && (
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <h5 className="text-sm font-medium text-green-800 mb-2">Recommendation</h5>
                <p className="text-sm text-green-700 font-medium">
                  Recommended Vendor: {report.content.recommendation.recommended_vendor}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Score: {report.content.recommendation.score.toFixed(1)}
                </p>
                <p className="text-sm text-green-700 mt-2">
                  {report.content.recommendation.rationale}
                </p>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={() => setReport(null)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4]"
              >
                Generate Another Report
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Report Options</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="includeProposalDetails"
                      name="includeProposalDetails"
                      type="checkbox"
                      checked={options.includeProposalDetails}
                      onChange={handleOptionChange}
                      className="focus:ring-[#0056a4] h-4 w-4 text-[#0056a4] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="includeProposalDetails" className="font-medium text-gray-700">
                      Include Proposal Details
                    </label>
                    <p className="text-gray-500">Include detailed information about each proposal</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="includeEvaluationScores"
                      name="includeEvaluationScores"
                      type="checkbox"
                      checked={options.includeEvaluationScores}
                      onChange={handleOptionChange}
                      className="focus:ring-[#0056a4] h-4 w-4 text-[#0056a4] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="includeEvaluationScores" className="font-medium text-gray-700">
                      Include Evaluation Scores
                    </label>
                    <p className="text-gray-500">Include individual evaluation scores and comments</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="includeVendorInformation"
                      name="includeVendorInformation"
                      type="checkbox"
                      checked={options.includeVendorInformation}
                      onChange={handleOptionChange}
                      className="focus:ring-[#0056a4] h-4 w-4 text-[#0056a4] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="includeVendorInformation" className="font-medium text-gray-700">
                      Include Vendor Information
                    </label>
                    <p className="text-gray-500">Include detailed information about each vendor</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="includeAIAnalysis"
                      name="includeAIAnalysis"
                      type="checkbox"
                      checked={options.includeAIAnalysis}
                      onChange={handleOptionChange}
                      className="focus:ring-[#0056a4] h-4 w-4 text-[#0056a4] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="includeAIAnalysis" className="font-medium text-gray-700">
                      Include AI Analysis
                    </label>
                    <p className="text-gray-500">Include AI-powered analysis of proposals and compatibility</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="includeRecommendations"
                      name="includeRecommendations"
                      type="checkbox"
                      checked={options.includeRecommendations}
                      onChange={handleOptionChange}
                      className="focus:ring-[#0056a4] h-4 w-4 text-[#0056a4] border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="includeRecommendations" className="font-medium text-gray-700">
                      Include Recommendations
                    </label>
                    <p className="text-gray-500">Include recommendations based on evaluation and analysis</p>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                    Report Format
                  </label>
                  <select
                    id="format"
                    name="format"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                    value={options.format}
                    onChange={handleOptionChange}
                  >
                    <option value="detailed">Detailed Report</option>
                    <option value="summary">Summary Report</option>
                    <option value="executive">Executive Summary</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={generateReport}
                disabled={isGenerating}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4] disabled:opacity-50 disabled:cursor-not-allowed"
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
                  'Generate Report'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
