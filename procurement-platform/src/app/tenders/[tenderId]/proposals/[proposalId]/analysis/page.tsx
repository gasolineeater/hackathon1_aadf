'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/app/context/ToastContext';
import AnalysisResultCard from '@/app/components/ai/AnalysisResultCard';
import InsightsList from '@/app/components/ai/InsightsList';
import CriteriaScores from '@/app/components/ai/CriteriaScores';
import ComplianceResults from '@/app/components/ai/ComplianceResults';
import BudgetCompliance from '@/app/components/ai/BudgetCompliance';

export default function ProposalAnalysisPage() {
  const params = useParams();
  const tenderId = params.tenderId as string;
  const proposalId = params.proposalId as string;
  const router = useRouter();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [tender, setTender] = useState<any>(null);
  
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
        
        // Fetch proposal details
        const proposalResponse = await fetch(`/api/proposals/${proposalId}`);
        if (!proposalResponse.ok) {
          throw new Error('Failed to fetch proposal details');
        }
        const proposalData = await proposalResponse.json();
        setProposal(proposalData);
        
        // Fetch proposal analysis
        const analysisResponse = await fetch(`/api/ai/analyses/proposal?proposalId=${proposalId}&tenderId=${tenderId}`);
        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          setAnalysis(analysisData);
        } else if (analysisResponse.status !== 404) {
          // Only show error if it's not a 404 (analysis might not exist yet)
          throw new Error('Failed to fetch proposal analysis');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to load proposal analysis',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (tenderId && proposalId) {
      fetchData();
    }
  }, [tenderId, proposalId, showToast]);
  
  const handleRunAnalysis = async () => {
    if (!tender || !proposal) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/analyze-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenderId,
          proposalId,
          tenderContent: tender.description,
          proposalContent: proposal.content,
          tenderMetadata: {
            title: tender.title,
            category: tender.category,
            budget: tender.budget,
            deadline: tender.submission_deadline,
          },
          proposalMetadata: {
            title: proposal.title,
            vendor_id: proposal.vendor_id,
            submitted_at: proposal.submitted_at,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze proposal');
      }
      
      const analysisData = await response.json();
      setAnalysis(analysisData);
      
      showToast({
        type: 'success',
        title: 'Analysis Complete',
        message: 'Proposal analysis has been completed successfully',
      });
    } catch (error: any) {
      console.error('Error analyzing proposal:', error);
      showToast({
        type: 'error',
        title: 'Analysis Failed',
        message: error.message || 'Failed to analyze proposal',
      });
    } finally {
      setIsLoading(false);
    }
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
  
  if (!tender || !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Resource Not Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The tender or proposal you are looking for does not exist or you do not have permission to view it.
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
  
  // Determine recommendation status color
  const getRecommendationStatus = (recommendation: string) => {
    switch (recommendation) {
      case 'Accept':
        return 'positive';
      case 'Consider with Revisions':
        return 'warning';
      case 'Request Major Revisions':
        return 'warning';
      case 'Reject':
        return 'negative';
      default:
        return 'neutral';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/tenders/${tenderId}/proposals/${proposalId}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Proposal
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h1 className="text-xl font-semibold text-gray-900">Proposal Analysis</h1>
            <p className="mt-1 text-sm text-gray-500">{proposal.title}</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {!analysis ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
                <p className="text-sm text-gray-500 mb-6">
                  This proposal has not been analyzed by the AI yet.
                </p>
                <button
                  type="button"
                  onClick={handleRunAnalysis}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                >
                  Run Analysis
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Recommendation */}
                <AnalysisResultCard
                  title="Overall Recommendation"
                  status={getRecommendationStatus(analysis.recommendation?.recommendation || '')}
                >
                  <div className="text-center py-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {analysis.recommendation?.recommendation || 'No Recommendation'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {analysis.recommendation?.justification || ''}
                    </p>
                    {analysis.recommendation?.confidence !== undefined && (
                      <p className="text-xs text-gray-500 mt-2">
                        Confidence: {analysis.recommendation.confidence}%
                      </p>
                    )}
                  </div>
                </AnalysisResultCard>
                
                {/* Summary Scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AnalysisResultCard
                    title="Overall Score"
                    score={analysis.summary?.overallScore}
                  >
                    <p className="text-sm text-gray-600">
                      Combined score based on compliance and evaluation criteria.
                    </p>
                  </AnalysisResultCard>
                  
                  <AnalysisResultCard
                    title="Compliance Score"
                    score={analysis.summary?.complianceScore}
                  >
                    <p className="text-sm text-gray-600">
                      How well the proposal addresses tender requirements.
                    </p>
                  </AnalysisResultCard>
                  
                  <AnalysisResultCard
                    title="Evaluation Score"
                    score={analysis.summary?.evaluationScore}
                  >
                    <p className="text-sm text-gray-600">
                      Quality assessment against evaluation criteria.
                    </p>
                  </AnalysisResultCard>
                </div>
                
                {/* Key Findings */}
                {analysis.summary?.keyFindings && analysis.summary.keyFindings.length > 0 && (
                  <AnalysisResultCard
                    title="Key Findings"
                    status="neutral"
                  >
                    <ul className="space-y-2">
                      {analysis.summary.keyFindings.map((finding: string, index: number) => (
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
                  </AnalysisResultCard>
                )}
                
                {/* Strengths and Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnalysisResultCard
                    title="Strengths"
                    status="positive"
                  >
                    <InsightsList
                      items={analysis.insights?.strengths || []}
                      type="strengths"
                      emptyMessage="No strengths identified"
                    />
                  </AnalysisResultCard>
                  
                  <AnalysisResultCard
                    title="Weaknesses"
                    status="negative"
                  >
                    <InsightsList
                      items={analysis.insights?.weaknesses || []}
                      type="weaknesses"
                      emptyMessage="No weaknesses identified"
                    />
                  </AnalysisResultCard>
                </div>
                
                {/* Recommendations */}
                <AnalysisResultCard
                  title="Recommendations"
                  status="warning"
                >
                  <InsightsList
                    items={analysis.insights?.recommendations || []}
                    type="recommendations"
                    emptyMessage="No recommendations available"
                  />
                </AnalysisResultCard>
                
                {/* Evaluation Criteria Scores */}
                <AnalysisResultCard
                  title="Evaluation Criteria"
                  collapsible
                >
                  <CriteriaScores
                    scores={analysis.evaluation?.criteriaScores || []}
                    showJustification={true}
                  />
                </AnalysisResultCard>
                
                {/* Compliance Results */}
                <AnalysisResultCard
                  title="Requirements Compliance"
                  collapsible
                >
                  <ComplianceResults
                    results={analysis.compliance?.requirementResults || []}
                    showRelevantSections={true}
                  />
                </AnalysisResultCard>
                
                {/* Budget Compliance */}
                {analysis.compliance?.budgetCompliance && (
                  <AnalysisResultCard
                    title="Budget Compliance"
                    status={analysis.compliance.budgetCompliance.withinBudget ? 'positive' : 'negative'}
                    collapsible
                  >
                    <BudgetCompliance
                      budgetCompliance={analysis.compliance.budgetCompliance}
                      budgetConstraint={tender.budget ? { amount: tender.budget } : undefined}
                    />
                  </AnalysisResultCard>
                )}
                
                {/* Metadata */}
                <AnalysisResultCard
                  title="Analysis Details"
                  status="neutral"
                  collapsible
                  initiallyExpanded={false}
                >
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Analysis ID:</span> {analysis.id}</p>
                    <p><span className="font-medium">Created:</span> {new Date(analysis.created_at).toLocaleString()}</p>
                    {analysis.updated_at && (
                      <p><span className="font-medium">Updated:</span> {new Date(analysis.updated_at).toLocaleString()}</p>
                    )}
                    {analysis.created_by && (
                      <p><span className="font-medium">Created by:</span> {analysis.created_by}</p>
                    )}
                  </div>
                </AnalysisResultCard>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
