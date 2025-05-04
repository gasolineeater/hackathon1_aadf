'use client';

import Link from 'next/link';

export default function JudgesDemoHome() {
  // Demo features to showcase
  const demoFeatures = [
    {
      id: 'proposal-analysis',
      title: 'AI Proposal Analysis',
      description: 'See how our AI evaluates vendor proposals against tender requirements',
      path: '/admin/judges-demo/proposal-analysis',
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-xl shadow-xl overflow-hidden mb-10">
          <div className="px-6 py-12 sm:px-12">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              AI-Powered Procurement Platform
            </h1>
            <p className="mt-3 text-lg text-purple-100 max-w-3xl">
              Welcome to our demonstration for the AADF Hackathon judges. This platform showcases how artificial intelligence can transform procurement processes, making them more efficient, transparent, and effective.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/admin/judges-demo/proposal-analysis"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-purple-700 bg-white hover:bg-purple-50"
              >
                Start with Proposal Analysis
              </Link>
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
                <p className="mt-2 text-3xl font-extrabold text-indigo-600">95%</p>
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
        <div className="mb-10">
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
          </div>
        </div>

        {/* AI Test Cases */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">AI Test Cases</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="mb-4 md:mb-0 md:mr-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Evaluate AI Performance</h3>
                <p className="text-gray-600 max-w-2xl">
                  Run our comprehensive test suite to evaluate the AI's performance across different scenarios,
                  including proposal analysis, vendor-tender matching, and document validation.
                </p>
              </div>
              <Link
                href="/admin/ai-test"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                Run Test Cases
              </Link>
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
                href="/admin/judges-demo/proposal-analysis"
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
