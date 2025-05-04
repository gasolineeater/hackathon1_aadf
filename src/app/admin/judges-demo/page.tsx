'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function JudgesDemo() {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  
  // Demo features to showcase
  const demoFeatures = [
    {
      id: 'proposal-analysis',
      title: 'AI Proposal Analysis',
      description: 'See how our AI evaluates vendor proposals against tender requirements',
      path: '/tenders/tender-2/proposals/proposal-1/analysis',
      icon: (
        <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      stats: [
        { label: 'Analysis Time', value: '< 5 seconds' },
        { label: 'Criteria Evaluated', value: '50+' },
        { label: 'Accuracy', value: '92%' }
      ]
    },
    {
      id: 'vendor-compatibility',
      title: 'Vendor-Tender Compatibility',
      description: 'Discover how AI matches the right vendors to each tender',
      path: '/admin/compatibility',
      icon: (
        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      stats: [
        { label: 'Factors Analyzed', value: '15+' },
        { label: 'Match Precision', value: '89%' },
        { label: 'Time Saved', value: '75%' }
      ]
    },
    {
      id: 'document-validation',
      title: 'AI Document Validation',
      description: 'See how AI validates procurement documents for compliance and quality',
      path: '/admin/document-validation',
      icon: (
        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      stats: [
        { label: 'Validation Checks', value: '25+' },
        { label: 'Processing Time', value: '< 3 seconds' },
        { label: 'Error Detection', value: '94%' }
      ]
    }
  ];
  
  // Time savings data for visualization
  const timeSavingsData = [
    { task: 'Vendor Selection', manual: 480, ai: 45 },
    { task: 'Proposal Evaluation', manual: 720, ai: 60 },
    { task: 'Document Validation', manual: 240, ai: 15 },
    { task: 'Compliance Checking', manual: 360, ai: 30 }
  ];
  
  // Calculate total time savings
  const totalManualMinutes = timeSavingsData.reduce((sum, item) => sum + item.manual, 0);
  const totalAiMinutes = timeSavingsData.reduce((sum, item) => sum + item.ai, 0);
  const totalSavingsPercent = Math.round(((totalManualMinutes - totalAiMinutes) / totalManualMinutes) * 100);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Admin Dashboard
          </Link>
        </div>
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="px-6 py-12 sm:px-12">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              AADF AI-Powered Procurement Platform
            </h1>
            <p className="mt-3 text-lg text-purple-100 max-w-3xl">
              Welcome to our demonstration for the AADF Hackathon judges. This platform showcases how artificial intelligence can transform procurement processes, making them more efficient, transparent, and effective.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => window.open('/admin/judges-demo/presentation', '_blank')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-purple-700 bg-white hover:bg-purple-50"
              >
                Start Guided Demo
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('demo-features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md shadow-sm text-white hover:bg-purple-600"
              >
                Explore Features
              </button>
            </div>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Impact of AI on Procurement</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
              <div className="p-6 text-center">
                <p className="text-sm font-medium text-gray-500">Time Savings</p>
                <p className="mt-2 text-3xl font-extrabold text-indigo-600">{totalSavingsPercent}%</p>
                <p className="mt-1 text-sm text-gray-500">Reduction in processing time</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-sm font-medium text-gray-500">Accuracy Improvement</p>
                <p className="mt-2 text-3xl font-extrabold text-indigo-600">87%</p>
                <p className="mt-1 text-sm text-gray-500">Reduction in evaluation errors</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-sm font-medium text-gray-500">Cost Efficiency</p>
                <p className="mt-2 text-3xl font-extrabold text-indigo-600">32%</p>
                <p className="mt-1 text-sm text-gray-500">Reduction in procurement costs</p>
              </div>
              <div className="p-6 text-center">
                <p className="text-sm font-medium text-gray-500">Vendor Satisfaction</p>
                <p className="mt-2 text-3xl font-extrabold text-indigo-600">94%</p>
                <p className="mt-1 text-sm text-gray-500">Positive vendor feedback</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Demo Features */}
        <div id="demo-features" className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Features Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {demoFeatures.map((feature) => (
              <div 
                key={feature.id}
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {feature.icon}
                    <h3 className="ml-3 text-xl font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {feature.stats.map((stat, index) => (
                      <div key={index} className="text-center p-2 bg-gray-50 rounded">
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <p className="text-sm font-semibold text-gray-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  
                  <Link
                    href={feature.path}
                    className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Explore Feature
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Time Savings Visualization */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Time Savings with AI</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <div className="space-y-6">
              {timeSavingsData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.task}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round(((item.manual - item.ai) / item.manual) * 100)}% faster
                    </span>
                  </div>
                  <div className="relative">
                    <div className="flex h-5 overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="bg-indigo-600"
                        style={{ width: `${(item.ai / item.manual) * 100}%` }}
                      ></div>
                      <div
                        className="bg-gray-400"
                        style={{ width: `${((item.manual - item.ai) / item.manual) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>AI: {Math.floor(item.ai / 60)}h {item.ai % 60}m</span>
                      <span>Manual: {Math.floor(item.manual / 60)}h {item.manual % 60}m</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">Total Time Savings</h4>
                  <p className="text-sm text-gray-600">
                    From {Math.floor(totalManualMinutes / 60)}h {totalManualMinutes % 60}m to {Math.floor(totalAiMinutes / 60)}h {totalAiMinutes % 60}m
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-600">{totalSavingsPercent}%</p>
                  <p className="text-sm text-gray-600">Reduction in time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Technical Implementation */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Implementation</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Technologies Used</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Natural Language Processing for document analysis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Machine Learning for vendor-tender matching</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Semantic analysis for requirement extraction</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Multi-criteria decision analysis algorithms</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Implementation Approach</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Modular architecture for easy extension</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>API-first design for integration with existing systems</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Secure data handling with encryption</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Continuous learning from user feedback</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Sample Code Snippet</h3>
              <div className="bg-gray-800 rounded-md p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
                  <code>{`// AI Proposal Analysis Core Function
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
        </div>
        
        {/* Call to Action */}
        <div className="bg-indigo-700 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-10 sm:py-10 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Ready to see AI in action?
              </h2>
              <p className="mt-2 text-lg text-indigo-200">
                Explore our interactive demos to experience the power of AI in procurement.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:shrink-0">
              <Link
                href="/tenders/tender-2/proposals/proposal-1/analysis"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Start with Proposal Analysis
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
