'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockTenders, mockProposals } from '@/lib/mockData';

export default function EvaluateProposalPage({ 
  params 
}: { 
  params: { id: string; proposalId: string } 
}) {
  const router = useRouter();
  const tenderId = params.id;
  const proposalId = params.proposalId;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tender, setTender] = useState<any>(null);
  const [proposal, setProposal] = useState<any>(null);
  const [evaluationData, setEvaluationData] = useState<any>({
    scores: [],
    comments: '',
    recommendation: 'accept',
    confidenceLevel: 'medium'
  });
  const [showAIRecommendation, setShowAIRecommendation] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  
  // Fetch tender and proposal data
  useEffect(() => {
    const tenderData = mockTenders.find(t => t.id === tenderId);
    setTender(tenderData);
    
    const proposalData = mockProposals.find(p => p.id === proposalId);
    setProposal(proposalData);
    
    // Initialize scores based on tender evaluation criteria
    if (tenderData && tenderData.evaluation_criteria) {
      setEvaluationData(prev => ({
        ...prev,
        scores: tenderData.evaluation_criteria.map((criterion: any) => ({
          criterionName: criterion.name,
          weight: criterion.weight,
          score: 0
        }))
      }));
    }
  }, [tenderId, proposalId]);
  
  const handleScoreChange = (index: number, value: number) => {
    const updatedScores = [...evaluationData.scores];
    updatedScores[index] = {
      ...updatedScores[index],
      score: value
    };
    
    setEvaluationData({
      ...evaluationData,
      scores: updatedScores
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEvaluationData({
      ...evaluationData,
      [name]: value
    });
  };
  
  const calculateTotalScore = () => {
    return evaluationData.scores.reduce((total: number, item: any) => {
      return total + (item.score * item.weight / 100);
    }, 0).toFixed(2);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, we would submit to an API
      // For demo purposes, we'll just simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to the proposals list
      router.push(`/admin/tenders/${tenderId}/proposals`);
    } catch (error) {
      console.error('Error submitting evaluation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getAIRecommendation = () => {
    setShowAIRecommendation(true);
    
    // Simulate AI recommendation
    setTimeout(() => {
      setAiRecommendation({
        scores: [
          { criterionName: 'Technical approach', score: 85 },
          { criterionName: 'Experience and qualifications', score: 90 },
          { criterionName: 'Cost', score: 75 },
          { criterionName: 'Timeline', score: 80 }
        ],
        totalScore: 83.5,
        recommendation: 'accept',
        confidenceLevel: 'high',
        analysis: [
          'Strong technical approach with comprehensive methodology',
          'Team has excellent qualifications and relevant experience',
          'Cost is within budget but slightly higher than other proposals',
          'Timeline is realistic and includes buffer for contingencies'
        ],
        concerns: [
          'Limited detail on risk management approach',
          'Some ambiguity in the maintenance plan'
        ]
      });
    }, 1500);
  };
  
  const applyAIRecommendation = () => {
    if (!aiRecommendation) return;
    
    const updatedScores = evaluationData.scores.map((item: any) => {
      const aiScore = aiRecommendation.scores.find((s: any) => s.criterionName === item.criterionName);
      return {
        ...item,
        score: aiScore ? aiScore.score : item.score
      };
    });
    
    setEvaluationData({
      ...evaluationData,
      scores: updatedScores,
      recommendation: aiRecommendation.recommendation,
      comments: evaluationData.comments || 'AI-assisted evaluation. ' + 
        aiRecommendation.analysis.join(' ') + ' ' +
        (aiRecommendation.concerns.length > 0 ? 'Concerns: ' + aiRecommendation.concerns.join(' ') : '')
    });
  };
  
  if (!tender || !proposal) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="text-lg font-medium text-gray-900 mt-4">Loading...</h2>
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
            href={`/admin/tenders/${tenderId}/proposals`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Proposals
          </Link>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Evaluate Proposal</h1>
          <p className="mt-1 text-sm text-gray-500">
            {proposal.title} by {proposal.vendor_id}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Proposal Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-indigo-800">Proposal Details</h2>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{proposal.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{proposal.description}</p>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Vendor</dt>
                      <dd className="text-sm text-gray-900">{proposal.vendor_id}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Amount</dt>
                      <dd className="text-sm text-gray-900">€{proposal.amount.toLocaleString()}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Under Evaluation
                        </span>
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Submitted</dt>
                      <dd className="text-sm text-gray-900">{new Date(proposal.created_at).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-indigo-800">Documents</h2>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  {proposal.documents.map((doc: any, index: number) => (
                    <li key={index} className="py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-900">{doc.name}</span>
                      </div>
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-indigo-800">AI Assistance</h2>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Let our AI analyze this proposal and suggest evaluation scores based on the tender requirements.
                </p>
                
                <button
                  type="button"
                  onClick={getAIRecommendation}
                  disabled={showAIRecommendation && !aiRecommendation}
                  className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                    showAIRecommendation && !aiRecommendation
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {showAIRecommendation && !aiRecommendation ? (
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Get AI Recommendation
                    </>
                  )}
                </button>
                
                {aiRecommendation && (
                  <div className="mt-4 bg-indigo-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-indigo-800 mb-2">AI Recommendation</h3>
                    
                    <div className="mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Overall Score</span>
                        <span className="text-sm font-bold text-indigo-700">{aiRecommendation.totalScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${aiRecommendation.totalScore}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Recommendation</span>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          aiRecommendation.recommendation === 'accept' 
                            ? 'bg-green-100 text-green-800' 
                            : aiRecommendation.recommendation === 'review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {aiRecommendation.recommendation === 'accept' 
                            ? 'Accept' 
                            : aiRecommendation.recommendation === 'review'
                              ? 'Review'
                              : 'Reject'}
                        </span>
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {aiRecommendation.confidenceLevel.charAt(0).toUpperCase() + aiRecommendation.confidenceLevel.slice(1)} Confidence
                        </span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-700">Analysis</span>
                      <ul className="mt-1 space-y-1">
                        {aiRecommendation.analysis.map((point: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <svg className="h-4 w-4 text-green-500 mt-0.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-xs text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {aiRecommendation.concerns.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-700">Concerns</span>
                        <ul className="mt-1 space-y-1">
                          {aiRecommendation.concerns.map((point: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <svg className="h-4 w-4 text-red-500 mt-0.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              <span className="text-xs text-gray-700">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <button
                      type="button"
                      onClick={applyAIRecommendation}
                      className="mt-2 w-full inline-flex justify-center items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Apply AI Recommendation
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Right Column - Evaluation Form */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-indigo-800">Evaluation Form</h2>
                <p className="mt-1 text-sm text-indigo-600">
                  Score each criterion from 0 to 100
                </p>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Evaluation Criteria */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluation Criteria</h3>
                    
                    <div className="space-y-4">
                      {evaluationData.scores.map((item: any, index: number) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">
                              {item.criterionName} ({item.weight}%)
                            </label>
                            <span className="text-sm font-medium text-gray-700">
                              Score: {item.score}/100
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={item.score}
                            onChange={(e) => handleScoreChange(index, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Poor (0)</span>
                            <span>Average (50)</span>
                            <span>Excellent (100)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-900">Total Score</span>
                        <span className="text-lg font-bold text-indigo-700">{calculateTotalScore()}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{ width: `${calculateTotalScore()}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comments */}
                  <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
                      Comments and Justification
                    </label>
                    <textarea
                      id="comments"
                      name="comments"
                      rows={4}
                      value={evaluationData.comments}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Provide comments and justification for your evaluation"
                    />
                  </div>
                  
                  {/* Recommendation */}
                  <div>
                    <label htmlFor="recommendation" className="block text-sm font-medium text-gray-700 mb-1">
                      Recommendation
                    </label>
                    <select
                      id="recommendation"
                      name="recommendation"
                      value={evaluationData.recommendation}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="accept">Accept</option>
                      <option value="review">Request Clarification</option>
                      <option value="reject">Reject</option>
                    </select>
                  </div>
                  
                  {/* Confidence Level */}
                  <div>
                    <label htmlFor="confidenceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                      Confidence Level
                    </label>
                    <select
                      id="confidenceLevel"
                      name="confidenceLevel"
                      value={evaluationData.confidenceLevel}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                        isSubmitting
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Evaluation'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
