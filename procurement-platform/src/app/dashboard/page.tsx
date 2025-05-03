'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for dashboard
const recentTenders = [
  {
    id: 1,
    title: 'IT Equipment Procurement',
    status: 'Open',
    proposals: 5,
    deadline: '2023-06-15',
  },
  {
    id: 2,
    title: 'Office Renovation Services',
    status: 'Open',
    proposals: 3,
    deadline: '2023-06-20',
  },
  {
    id: 3,
    title: 'Marketing and PR Services',
    status: 'Open',
    proposals: 7,
    deadline: '2023-06-10',
  },
];

const pendingEvaluations = [
  {
    id: 101,
    tender: 'IT Equipment Procurement',
    vendor: 'Tech Solutions Ltd',
    submittedDate: '2023-05-28',
    status: 'Pending Review',
  },
  {
    id: 102,
    tender: 'IT Equipment Procurement',
    vendor: 'Digital Systems Inc',
    submittedDate: '2023-05-29',
    status: 'Pending Review',
  },
  {
    id: 103,
    tender: 'Office Renovation Services',
    vendor: 'Modern Spaces Co',
    submittedDate: '2023-05-30',
    status: 'In Evaluation',
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Dashboard
              </h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Export
              </button>
              <button
                type="button"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create New Tender
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`${
                activeTab === 'tenders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('tenders')}
            >
              Tenders
            </button>
            <button
              className={`${
                activeTab === 'evaluations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('evaluations')}
            >
              Evaluations
            </button>
            <button
              className={`${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('reports')}
            >
              Reports
            </button>
            <button
              className={`${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </nav>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Tenders</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">3</dd>
                  </dl>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending Evaluations</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">5</dd>
                  </dl>
                </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed Tenders</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">12</dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  <li className="py-3">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">New proposal submitted</h3>
                          <p className="text-sm text-gray-500">2h ago</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Digital Systems Inc submitted a proposal for IT Equipment Procurement
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Tender published</h3>
                          <p className="text-sm text-gray-500">1d ago</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Office Renovation Services tender was published
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex space-x-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium">Evaluation completed</h3>
                          <p className="text-sm text-gray-500">2d ago</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          Training and Development Program evaluation was completed
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Recent Tenders */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Tenders</h3>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Proposals
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Deadline
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTenders.map((tender) => (
                      <tr key={tender.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                          <Link href={`/tenders/${tender.id}`}>{tender.title}</Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {tender.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tender.proposals}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tender.deadline}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-200 text-right">
                <Link
                  href="/tenders"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all tenders &rarr;
                </Link>
              </div>
            </div>

            {/* Pending Evaluations */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Evaluations</h3>
              </div>
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tender
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Vendor
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Submitted
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingEvaluations.map((evaluation) => (
                      <tr key={evaluation.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{evaluation.tender}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evaluation.vendor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{evaluation.submittedDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {evaluation.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-3 border-t border-gray-200 text-right">
                <Link
                  href="/evaluations"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all evaluations &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tenders' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">All Tenders</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-500">Tenders content will be displayed here.</p>
            </div>
          </div>
        )}

        {activeTab === 'evaluations' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Evaluations</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-500">Evaluations content will be displayed here.</p>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Reports</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-blue-100">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Procurement Analytics</h3>
                    <p className="mb-4 text-gray-600">
                      Interactive charts and visualizations showing procurement trends, metrics, and performance indicators.
                    </p>
                    <Link
                      href="/dashboard/reports"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700"
                    >
                      View Analytics
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-purple-100">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Vendor Performance</h3>
                    <p className="mb-4 text-gray-600">
                      Detailed reports on vendor performance, ratings, and historical contract fulfillment metrics.
                    </p>
                    <span className="inline-flex items-center text-gray-400">
                      Coming Soon
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-green-100">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Compliance Reports</h3>
                    <p className="mb-4 text-gray-600">
                      Audit-ready reports showing compliance with procurement policies, regulations, and internal controls.
                    </p>
                    <span className="inline-flex items-center text-gray-400">
                      Coming Soon
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Settings</h3>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-500">Settings content will be displayed here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
