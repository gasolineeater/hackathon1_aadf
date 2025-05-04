'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProcurementDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">AADF Procurement Platform</h1>
          <p className="mt-1 text-sm text-gray-500">
            Complete procurement management system with AI-powered features
          </p>
        </div>
        
        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Tender Management */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Tender Management</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Publish tenders, manage deadlines, and track the entire procurement process
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/admin/procurement-dashboard/tenders"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Manage Tenders
                </Link>
              </div>
            </div>
          </div>
          
          {/* Proposal Collection */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Proposal Collection</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Receive and organize vendor proposals automatically, hidden until deadline
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/admin/procurement-dashboard/proposals"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  View Proposals
                </Link>
              </div>
            </div>
          </div>
          
          {/* Evaluation */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Proposal Evaluation</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Score proposals transparently with AI-assisted evaluation tools
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/admin/procurement-dashboard/evaluation"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700"
                >
                  Evaluate Proposals
                </Link>
              </div>
            </div>
          </div>
          
          {/* Approval Tracking */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Approval Tracking</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Track approvals and decisions in a centralized dashboard
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/admin/procurement-dashboard/approvals"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Track Approvals
                </Link>
              </div>
            </div>
          </div>
          
          {/* Report Generation */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Report Generation</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Automatically generate final reports by the tender commission
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/admin/procurement-dashboard/reports"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                >
                  Generate Reports
                </Link>
              </div>
            </div>
          </div>
          
          {/* Document Management */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Document Management</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Version control and track changes for sensitive documents
                  </p>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  href="/admin/procurement-dashboard/documents"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                >
                  Manage Documents
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* AI Features */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-indigo-500 to-purple-600">
            <h2 className="text-lg font-medium text-white">AI-Powered Features</h2>
            <p className="mt-1 text-sm text-indigo-100">
              Advanced artificial intelligence capabilities to streamline procurement
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h3 className="text-md font-medium text-indigo-900">Missing Information Detection</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  AI automatically detects missing information in vendor proposals and flags them for review.
                </p>
                <Link
                  href="/admin/procurement-dashboard/ai/missing-info"
                  className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  View Demo →
                </Link>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <h3 className="text-md font-medium text-indigo-900">Evaluation Score Suggestions</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  AI analyzes proposals and suggests evaluation scores based on preset criteria.
                </p>
                <Link
                  href="/admin/procurement-dashboard/ai/evaluation"
                  className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  View Demo →
                </Link>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  <h3 className="text-md font-medium text-indigo-900">Vendor-Tender Matching</h3>
                </div>
                <p className="text-sm text-indigo-700 mb-3">
                  AI matches vendors to tenders based on compatibility and expertise.
                </p>
                <Link
                  href="/admin/procurement-dashboard/ai/matching"
                  className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
                >
                  View Demo →
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Procurement Overview</h2>
            <p className="mt-1 text-sm text-gray-500">
              Current status of procurement activities
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Tenders</dt>
                  <dd className="mt-1 text-3xl font-semibold text-indigo-600">12</dd>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Submitted Proposals</dt>
                  <dd className="mt-1 text-3xl font-semibold text-green-600">48</dd>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Approvals</dt>
                  <dd className="mt-1 text-3xl font-semibold text-yellow-600">7</dd>
                </div>
              </div>
              
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed Procurements</dt>
                  <dd className="mt-1 text-3xl font-semibold text-blue-600">23</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
