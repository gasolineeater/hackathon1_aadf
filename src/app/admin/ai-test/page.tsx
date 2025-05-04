'use client';

import { useState } from 'react';
import Link from 'next/link';
import { allTestCases } from '@/lib/testCases';
import DemoBanner from '@/app/components/DemoBanner';
import AnalysisAnimation from '@/app/components/ai/AnalysisAnimation';

export default function AITestPage() {
  const [selectedTestCase, setSelectedTestCase] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  
  const runTest = (testCaseIndex: number) => {
    setSelectedTestCase(testCaseIndex);
    setIsRunning(true);
    setResults(null);
    
    // Simulate AI processing time
    setTimeout(() => {
      setIsRunning(false);
      
      // For demo purposes, we'll just return the expected results
      const testCase = allTestCases[testCaseIndex];
      setResults(testCase.expectedResults);
    }, 3000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin/judges-demo"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Demo Dashboard
          </Link>
        </div>
        
        <DemoBanner 
          title="AI Evaluation Test Cases" 
          subtitle="Run test cases to evaluate the AI's performance"
          backLink="/admin/judges-demo"
          backText="Back to Demo Dashboard"
        />
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">AI Test Cases</h1>
            <p className="mt-1 text-sm text-gray-500">Select a test case to run and evaluate the AI's performance</p>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
              <div className="col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-indigo-800">Test Cases</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <ul className="divide-y divide-gray-200">
                    {allTestCases.map((testCase, index) => (
                      <li key={index} className="py-3">
                        <button
                          onClick={() => runTest(index)}
                          className="w-full text-left hover:bg-gray-50 p-2 rounded-md transition-colors"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-900">{testCase.name}</span>
                            <span className="text-indigo-600 text-sm">Run Test</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{testCase.description}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-indigo-800">Test Results</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  {selectedTestCase === null ? (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Selected</h3>
                      <p className="text-sm text-gray-500 mb-6">
                        Select a test case from the left panel to run the AI evaluation.
                      </p>
                    </div>
                  ) : isRunning ? (
                    <AnalysisAnimation 
                      isAnalyzing={isRunning} 
                      onComplete={() => {}}
                      duration={3000}
                    />
                  ) : results ? (
                    <div className="space-y-6">
                      {/* Overall Score */}
                      {results.overallScore !== undefined && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-indigo-800">Overall Score</h3>
                          </div>
                          <div className="px-4 py-5 sm:p-6">
                            <div className="text-center py-2">
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
                                      stroke={results.overallScore >= 80 ? "#4ade80" : 
                                              results.overallScore >= 60 ? "#facc15" : "#f87171"}
                                      strokeWidth="3"
                                      strokeDasharray={`${results.overallScore}, 100`}
                                      strokeLinecap="round"
                                    />
                                    <text x="18" y="20.5" className="text-5xl font-bold" textAnchor="middle" fill="#333">
                                      {results.overallScore}
                                    </text>
                                  </svg>
                                </div>
                              </div>
                              {results.recommendation && (
                                <h3 className="text-2xl font-bold text-gray-900 mb-2 mt-4">
                                  {results.recommendation}
                                </h3>
                              )}
                              {results.complianceScore && results.evaluationScore && (
                                <div className="grid grid-cols-2 gap-4 mt-4 max-w-md mx-auto">
                                  <div className="bg-blue-50 p-3 rounded-md">
                                    <p className="text-sm font-medium text-blue-800">Compliance</p>
                                    <p className="text-xl font-bold text-blue-900">{results.complianceScore}%</p>
                                  </div>
                                  <div className="bg-purple-50 p-3 rounded-md">
                                    <p className="text-sm font-medium text-purple-800">Evaluation</p>
                                    <p className="text-xl font-bold text-purple-900">{results.evaluationScore}%</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Strengths and Weaknesses */}
                      {(results.strengths || results.weaknesses) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {results.strengths && (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                              <div className="px-4 py-5 sm:px-6 bg-green-50 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-green-800">Strengths</h3>
                              </div>
                              <div className="px-4 py-5 sm:p-6">
                                <ul className="space-y-2">
                                  {results.strengths.map((strength: string, index: number) => (
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
                          )}
                          
                          {results.weaknesses && (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                              <div className="px-4 py-5 sm:px-6 bg-red-50 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-red-800">Weaknesses</h3>
                              </div>
                              <div className="px-4 py-5 sm:p-6">
                                <ul className="space-y-2">
                                  {results.weaknesses.map((weakness: string, index: number) => (
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
                          )}
                        </div>
                      )}
                      
                      {/* Conflicts */}
                      {results.conflicts && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <div className="px-4 py-5 sm:px-6 bg-yellow-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-yellow-800">Conflicting Information</h3>
                          </div>
                          <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-4">
                              {results.conflicts.map((conflict: any, index: number) => (
                                <div key={index} className="bg-yellow-50 p-3 rounded-md">
                                  <h4 className="font-medium text-yellow-800">{conflict.type}</h4>
                                  <div className="mt-2 space-y-2">
                                    {conflict.statements.map((statement: string, i: number) => (
                                      <div key={i} className="flex items-start">
                                        <span className="flex-shrink-0 text-yellow-500">
                                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                          </svg>
                                        </span>
                                        <span className="ml-2 text-sm text-gray-700">"{statement}"</span>
                                      </div>
                                    ))}
                                  </div>
                                  <p className="mt-2 text-sm text-yellow-800">
                                    <strong>Recommendation:</strong> {conflict.recommendation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Risks */}
                      {results.risks && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <div className="px-4 py-5 sm:px-6 bg-orange-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-orange-800">Risk Assessment</h3>
                          </div>
                          <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-4">
                              {results.risks.map((risk: any, index: number) => (
                                <div key={index} className="bg-orange-50 p-3 rounded-md">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium text-orange-800">{risk.type}</h4>
                                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                                      risk.severity === 'High' ? 'bg-red-100 text-red-800' :
                                      risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {risk.severity}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-700">{risk.description}</p>
                                  <p className="mt-2 text-sm text-orange-800">
                                    <strong>Mitigation:</strong> {risk.mitigation}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Recommendations */}
                      {results.recommendations && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <div className="px-4 py-5 sm:px-6 bg-blue-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-blue-800">Recommendations</h3>
                          </div>
                          <div className="px-4 py-5 sm:p-6">
                            <ul className="space-y-2">
                              {results.recommendations.map((recommendation: string, index: number) => (
                                <li key={index} className="flex items-start">
                                  <span className="flex-shrink-0 text-blue-500">
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                  </span>
                                  <span className="ml-2 text-sm text-gray-700">{recommendation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                      
                      {/* Compatibility Scores */}
                      {Array.isArray(results) && results.length > 0 && results[0].compatibilityScore && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-indigo-800">Vendor Compatibility</h3>
                          </div>
                          <div className="px-4 py-5 sm:p-6">
                            <div className="space-y-6">
                              {results.map((result: any, index: number) => (
                                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                    <h4 className="font-medium text-gray-900">
                                      Vendor {index + 1}: {allTestCases[selectedTestCase].vendors[index].name}
                                    </h4>
                                    <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                                      result.compatibilityScore >= 80 ? 'bg-green-100 text-green-800' :
                                      result.compatibilityScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {result.compatibilityScore}% Compatible
                                    </span>
                                  </div>
                                  <div className="px-4 py-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {result.strengths && result.strengths.length > 0 && (
                                        <div>
                                          <h5 className="text-sm font-medium text-gray-900 mb-2">Strengths</h5>
                                          <ul className="space-y-1">
                                            {result.strengths.map((strength: string, i: number) => (
                                              <li key={i} className="flex items-start">
                                                <span className="flex-shrink-0 text-green-500">
                                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                  </svg>
                                                </span>
                                                <span className="ml-2 text-xs text-gray-700">{strength}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                      
                                      {result.weaknesses && result.weaknesses.length > 0 && (
                                        <div>
                                          <h5 className="text-sm font-medium text-gray-900 mb-2">Weaknesses</h5>
                                          <ul className="space-y-1">
                                            {result.weaknesses.map((weakness: string, i: number) => (
                                              <li key={i} className="flex items-start">
                                                <span className="flex-shrink-0 text-red-500">
                                                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                  </svg>
                                                </span>
                                                <span className="ml-2 text-xs text-gray-700">{weakness}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Document Validation */}
                      {results.requiredSections && (
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-indigo-800">Document Validation</h3>
                          </div>
                          <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">
                                  {results.valid ? 'Valid Document' : 'Invalid Document'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Validation Score: {results.score}/100
                                </p>
                              </div>
                              <div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  results.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {results.valid ? 'Valid' : 'Invalid'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-6">
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Required Sections</h5>
                              <ul className="space-y-2 mb-6">
                                {results.requiredSections.map((section: any, index: number) => (
                                  <li key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md">
                                    <span className="text-sm text-gray-700">{section.name}</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                      section.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                      {section.present ? 'Present' : 'Missing'}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              
                              {results.issues && results.issues.length > 0 && (
                                <>
                                  <h5 className="text-sm font-medium text-gray-900 mb-2">Issues</h5>
                                  <ul className="space-y-2">
                                    {results.issues.map((issue: string, index: number) => (
                                      <li key={index} className="flex items-start">
                                        <span className="flex-shrink-0 text-red-500">
                                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                          </svg>
                                        </span>
                                        <span className="ml-2 text-sm text-gray-700">{issue}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
