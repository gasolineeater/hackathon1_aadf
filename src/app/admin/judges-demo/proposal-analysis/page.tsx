'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import DemoBanner from '@/app/components/DemoBanner';
import AnalysisAnimation from '@/app/components/ai/AnalysisAnimation';

export default function ProposalAnalysisDemo() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Mock proposal data
  const proposal = {
    id: 'demo-proposal-1',
    title: 'Digital Transformation Services',
    vendor: 'Tech Solutions Ltd',
    submittedAt: '2023-05-01',
    content: `
      # Digital Transformation Services Proposal
      
      ## Executive Summary
      Tech Solutions Ltd is pleased to submit this proposal for the Digital Transformation Project. Our team of experts will deliver a comprehensive solution that meets all requirements.
      
      ## Approach
      We will implement an agile methodology with 2-week sprints to ensure regular deliverables and feedback cycles. Our approach includes:
      - Initial assessment and planning
      - Iterative development
      - Regular stakeholder reviews
      - Comprehensive testing
      - Knowledge transfer
      
      ## Timeline
      The project will be completed in 6 months, with major milestones at months 2, 4, and 6.
      
      ## Budget
      The total cost for this project is €120,000, broken down as follows:
      - Development: €75,000
      - Testing: €20,000
      - Training: €15,000
      - Support: €10,000
      
      ## Team
      Our team consists of 5 senior developers, 2 UX designers, and 1 project manager, all with over 5 years of experience in similar projects.
    `
  };
  
  // Mock tender data
  const tender = {
    id: 'demo-tender-1',
    title: 'Digital Transformation Project',
    category: 'IT Services',
    budget: '€150,000',
    deadline: '2023-04-30',
    requirements: `
      # Digital Transformation Project Requirements
      
      ## Overview
      AADF is seeking a vendor to implement a digital transformation project that will modernize our internal systems and processes.
      
      ## Technical Requirements
      1. Cloud-based solution
      2. Integration with existing systems
      3. Mobile-friendly interfaces
      4. Data migration from legacy systems
      5. Security compliance with industry standards
      
      ## Qualifications
      - Minimum 3 years experience in digital transformation projects
      - Experience with similar organizations
      - Certified professionals on the team
      
      ## Evaluation Criteria
      - Technical approach (40%)
      - Experience and qualifications (30%)
      - Cost (20%)
      - Timeline (10%)
      
      ## Budget
      The maximum budget for this project is €150,000.
    `
  };
  
  // Mock analysis results
  const analysisResults = {
    summary: {
      overallScore: 85,
      complianceScore: 90,
      evaluationScore: 82,
      recommendation: 'Accept',
      keyFindings: [
        'Proposal addresses 90% of tender requirements.',
        'Strong overall proposal with evaluation score of 82/100.',
        'Proposal is within the specified budget constraints.',
        'Strongest in "Technical approach" (88/100).',
        'Weakest in "Timeline" (75/100).'
      ]
    },
    compliance: {
      compliant: true,
      requirementResults: [
        { requirement: 'Cloud-based solution', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Integration with existing systems', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Mobile-friendly interfaces', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Data migration from legacy systems', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Security compliance', addressed: false, relevantSections: [] }
      ],
      budgetCompliance: {
        withinBudget: true,
        proposedAmount: 120000,
        budgetLimit: 150000,
        difference: 30000,
        percentageOfBudget: 80
      }
    },
    evaluation: {
      totalScore: 82,
      criteriaScores: [
        { criterion: 'Technical approach', score: 88, weight: 0.4, justification: 'Comprehensive approach with agile methodology' },
        { criterion: 'Experience and qualifications', score: 85, weight: 0.3, justification: 'Team exceeds minimum requirements' },
        { criterion: 'Cost', score: 85, weight: 0.2, justification: 'Within budget and good value for money' },
        { criterion: 'Timeline', score: 75, weight: 0.1, justification: 'Timeline is reasonable but could be more detailed' }
      ]
    },
    insights: {
      strengths: [
        'Strong technical approach with agile methodology',
        'Experienced team with relevant certifications',
        'Comprehensive testing strategy',
        'Clear budget breakdown'
      ],
      weaknesses: [
        'Security compliance not explicitly addressed',
        'Timeline could be more detailed',
        'Limited information on knowledge transfer',
        'No mention of post-implementation support'
      ],
      recommendations: [
        'Request additional information on security compliance',
        'Ask for a more detailed timeline with specific milestones',
        'Clarify knowledge transfer approach',
        'Discuss post-implementation support options'
      ]
    }
  };
  
  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    // Reset results if they were previously shown
    setShowResults(false);
  };
  
  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    setShowResults(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin/judges-demo"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Demo Dashboard
          </Link>
        </div>
        
        <DemoBanner 
          title="AI Proposal Analysis Demo" 
          subtitle="See how our AI evaluates vendor proposals against tender requirements"
          backLink="/admin/judges-demo"
          backText="Back to Demo Dashboard"
        />
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Proposal Analysis</h1>
            <p className="mt-1 text-sm text-gray-500">{proposal.title} by {proposal.vendor}</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Proposal Details</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Title</dt>
                      <dd className="mt-1 text-sm text-gray-900">{proposal.title}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Vendor</dt>
                      <dd className="mt-1 text-sm text-gray-900">{proposal.vendor}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Submitted</dt>
                      <dd className="mt-1 text-sm text-gray-900">{proposal.submittedAt}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tender Details</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Title</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tender.title}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tender.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Budget</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tender.budget}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            
            {!isAnalyzing && !showResults && (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Click the button below to run the AI analysis on this proposal.
                </p>
                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Run AI Analysis
                </button>
              </div>
            )}
            
            {isAnalyzing && (
              <AnalysisAnimation 
                isAnalyzing={isAnalyzing} 
                onComplete={handleAnalysisComplete}
                duration={5000} // 5 seconds for demo purposes
              />
            )}
            
            {showResults && (
              <div className="space-y-6">
                {/* Overall Recommendation */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-indigo-800">Overall Recommendation</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="text-center py-2">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {analysisResults.summary.recommendation}
                      </h3>
                      <div className="flex justify-center items-center mt-4">
                        <div className="w-32 h-32 relative">
                          <svg viewBox="0 0 36 36" className="w-full h-full">
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke="#eee"
                              strokeWidth="3"
                            />
                            <path
                              d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none"
                              stroke={analysisResults.summary.overallScore >= 80 ? "#4ade80" : 
                                      analysisResults.summary.overallScore >= 60 ? "#facc15" : "#f87171"}
                              strokeWidth="3"
                              strokeDasharray={`${analysisResults.summary.overallScore}, 100`}
                              strokeLinecap="round"
                            />
                            <text x="18" y="20.5" className="text-5xl font-bold" textAnchor="middle" fill="#333">
                              {analysisResults.summary.overallScore}
                            </text>
                          </svg>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4 max-w-md mx-auto">
                        <div className="bg-blue-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-blue-800">Compliance</p>
                          <p className="text-xl font-bold text-blue-900">{analysisResults.summary.complianceScore}%</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-md">
                          <p className="text-sm font-medium text-purple-800">Evaluation</p>
                          <p className="text-xl font-bold text-purple-900">{analysisResults.summary.evaluationScore}%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Key Findings */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-blue-800">Key Findings</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <ul className="space-y-2">
                      {analysisResults.summary.keyFindings.map((finding, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 text-blue-500">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="ml-2 text-sm text-gray-700">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 bg-green-50 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-green-800">Strengths</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <ul className="space-y-2">
                        {analysisResults.insights.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 text-green-500">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                            <span className="ml-2 text-sm text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 bg-red-50 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-red-800">Weaknesses</h3>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                      <ul className="space-y-2">
                        {analysisResults.insights.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 text-red-500">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                            <span className="ml-2 text-sm text-gray-700">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                {/* Recommendations */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-yellow-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-yellow-800">Recommendations</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <ul className="space-y-2">
                      {analysisResults.insights.recommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 text-yellow-500">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </span>
                          <span className="ml-2 text-sm text-gray-700">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* Evaluation Criteria */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-purple-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-purple-800">Evaluation Criteria</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="space-y-4">
                      {analysisResults.evaluation.criteriaScores.map((criterion, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{criterion.criterion} ({criterion.weight * 100}%)</span>
                            <span className="text-sm font-medium text-gray-700">{criterion.score}/100</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${
                                criterion.score >= 80 ? 'bg-green-500' : 
                                criterion.score >= 60 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${criterion.score}%` }}
                            ></div>
                          </div>
                          <p className="mt-1 text-xs text-gray-500">{criterion.justification}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Budget Compliance */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-green-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-green-800">Budget Compliance</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-64 h-64 relative">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <circle cx="18" cy="18" r="16" fill="#f3f4f6" />
                          <path
                            d="M18 2
                              a 16 16 0 0 1 0 32
                              a 16 16 0 0 1 0 -32"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="1"
                          />
                          <path
                            d="M18 2
                              a 16 16 0 0 1 0 32
                              a 16 16 0 0 1 0 -32"
                            fill="none"
                            stroke="#4ade80"
                            strokeWidth="4"
                            strokeDasharray={`${analysisResults.compliance.budgetCompliance.percentageOfBudget}, 100`}
                            strokeLinecap="round"
                          />
                          <text x="18" y="15" className="text-xl font-bold" textAnchor="middle" fill="#333">
                            {analysisResults.compliance.budgetCompliance.percentageOfBudget}%
                          </text>
                          <text x="18" y="22" className="text-sm" textAnchor="middle" fill="#666">
                            of budget
                          </text>
                        </svg>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-500">Proposed Amount</p>
                        <p className="text-lg font-bold text-gray-900">€{analysisResults.compliance.budgetCompliance.proposedAmount.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-500">Budget Limit</p>
                        <p className="text-lg font-bold text-gray-900">€{analysisResults.compliance.budgetCompliance.budgetLimit.toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-gray-500">Savings</p>
                        <p className="text-lg font-bold text-green-600">€{analysisResults.compliance.budgetCompliance.difference.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Technical Implementation */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800">Technical Implementation</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      This analysis was performed using our AI-powered procurement platform, which combines natural language processing, machine learning, and domain-specific algorithms to evaluate proposals against tender requirements.
                    </p>
                    <div className="bg-gray-800 rounded-md p-4 overflow-x-auto">
                      <pre className="text-xs text-gray-300">
                        <code>{`// Core analysis function
export async function analyzeProposal(
  proposalContent: string,
  tenderContent: string,
  proposalMetadata: any = {},
  tenderMetadata: any = {}
) {
  // Extract tender requirements
  const tenderRequirements = extractTenderRequirements(tenderContent);

  // Check compliance with requirements
  const complianceResults = checkCompliance(tenderRequirements, proposalContent);

  // Score proposal against evaluation criteria
  const scoringResults = scoreProposal(
    tenderRequirements.evaluationCriteria,
    proposalContent
  );

  // Generate recommendations
  const recommendations = generateRecommendations(complianceResults, scoringResults);

  // Calculate overall score
  const overallScore = Math.round(
    (complianceResults.complianceScore * 0.4) + (scoringResults.totalScore * 0.6)
  );

  return {
    summary: {
      overallScore,
      recommendation: determineRecommendation(overallScore)
    },
    compliance: complianceResults,
    evaluation: scoringResults,
    recommendations
  };
}`}</code>
                      </pre>
                    </div>
                  </div>
                </div>
                
                {/* Time Savings */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-blue-800">Time Savings</h3>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">Manual vs. AI-Powered Analysis</h4>
                        <p className="text-sm text-gray-600">
                          Comparison of time required for proposal evaluation
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-blue-600">95%</p>
                        <p className="text-sm text-gray-600">Time saved</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div className="flex h-8 overflow-hidden rounded-lg">
                        <div
                          className="bg-blue-600 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: '5%' }}
                        >
                          AI
                        </div>
                        <div
                          className="bg-gray-400 flex items-center justify-center text-xs text-white font-medium"
                          style={{ width: '95%' }}
                        >
                          Manual
                        </div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span>AI: 5 minutes</span>
                        <span>Manual: 2 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
