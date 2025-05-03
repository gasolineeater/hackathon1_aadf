'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useToast } from '@/app/context/ToastContext';
import AnalysisResultCard from '@/app/components/ai/AnalysisResultCard';
import InsightsList from '@/app/components/ai/InsightsList';

export default function TenderEvaluationPage() {
  const params = useParams();
  const tenderId = params.tenderId as string;
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<any>(null);
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
        
        // Fetch tender evaluation
        const evaluationResponse = await fetch(`/api/ai/analyses/tender/${tenderId}`);
        if (evaluationResponse.ok) {
          const evaluationData = await evaluationResponse.json();
          setEvaluation(evaluationData);
        } else if (evaluationResponse.status !== 404) {
          // Only show error if it's not a 404 (evaluation might not exist yet)
          throw new Error('Failed to fetch tender evaluation');
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to load tender evaluation',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (tenderId) {
      fetchData();
    }
  }, [tenderId, showToast]);
  
  const handleRunEvaluation = async () => {
    if (!tender) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/evaluate-tender', {
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
        throw new Error('Failed to evaluate tender');
      }
      
      const evaluationData = await response.json();
      setEvaluation(evaluationData);
      
      showToast({
        type: 'success',
        title: 'Evaluation Complete',
        message: 'Tender evaluation has been completed successfully',
      });
    } catch (error: any) {
      console.error('Error evaluating tender:', error);
      showToast({
        type: 'error',
        title: 'Evaluation Failed',
        message: error.message || 'Failed to evaluate tender',
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
            <h1 className="text-xl font-semibold text-gray-900">Tender Evaluation</h1>
            <p className="mt-1 text-sm text-gray-500">{tender.title}</p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            {!evaluation ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Evaluation Available</h3>
                <p className="text-sm text-gray-500 mb-6">
                  This tender has not been evaluated by the AI yet.
                </p>
                <button
                  type="button"
                  onClick={handleRunEvaluation}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                >
                  Run Evaluation
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Score */}
                <AnalysisResultCard
                  title="Overall Evaluation"
                  score={evaluation.score}
                  status={evaluation.score >= 80 ? 'positive' : evaluation.score >= 60 ? 'warning' : 'negative'}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Strengths</h4>
                      <InsightsList
                        items={evaluation.strengths || []}
                        type="strengths"
                        emptyMessage="No strengths identified"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Weaknesses</h4>
                      <InsightsList
                        items={evaluation.weaknesses || []}
                        type="weaknesses"
                        emptyMessage="No weaknesses identified"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h4>
                    <InsightsList
                      items={evaluation.recommendations || []}
                      type="recommendations"
                      emptyMessage="No recommendations available"
                    />
                  </div>
                </AnalysisResultCard>
                
                {/* Quality Scores */}
                <AnalysisResultCard
                  title="Quality Assessment"
                  collapsible
                >
                  <div className="space-y-4">
                    {evaluation.quality && Object.entries(evaluation.quality).map(([key, value]: [string, any]) => (
                      <div key={key} className="border border-gray-200 rounded-md p-3">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="text-sm font-medium text-gray-900 capitalize">{key}</h4>
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                            value.score >= 80 ? 'bg-green-100 text-green-800' : 
                            value.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {value.score}/100
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div 
                            className={`h-2.5 rounded-full ${
                              value.score >= 80 ? 'bg-green-500' : 
                              value.score >= 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${value.score}%` }}
                          ></div>
                        </div>
                        
                        {value.feedback && (
                          <p className="text-xs text-gray-600 mt-1">{value.feedback}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </AnalysisResultCard>
                
                {/* Issues */}
                {evaluation.issues && evaluation.issues.length > 0 && (
                  <AnalysisResultCard
                    title="Issues"
                    status="warning"
                    collapsible
                  >
                    <div className="space-y-3">
                      {evaluation.issues.map((issue: any, index: number) => (
                        <div 
                          key={index} 
                          className={`border rounded-md p-3 ${
                            issue.severity === 'critical' ? 'border-red-200 bg-red-50' : 
                            'border-yellow-200 bg-yellow-50'
                          }`}
                        >
                          <p className={`text-sm font-medium ${
                            issue.severity === 'critical' ? 'text-red-800' : 'text-yellow-800'
                          }`}>
                            {issue.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Type: {issue.type} | Severity: {issue.severity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </AnalysisResultCard>
                )}
                
                {/* Metadata */}
                <AnalysisResultCard
                  title="Evaluation Details"
                  status="neutral"
                  collapsible
                  initiallyExpanded={false}
                >
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">Evaluation ID:</span> {evaluation.id}</p>
                    <p><span className="font-medium">Created:</span> {new Date(evaluation.created_at).toLocaleString()}</p>
                    {evaluation.created_by && (
                      <p><span className="font-medium">Created by:</span> {evaluation.created_by}</p>
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
