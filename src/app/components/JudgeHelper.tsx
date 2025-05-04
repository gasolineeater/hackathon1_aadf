'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function JudgeHelper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Helper button */}
      <button
        className="fixed bottom-4 right-4 bg-purple-600 text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-colors z-50"
        onClick={() => setIsOpen(true)}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>

      {/* Helper modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Hackathon Judge Guide</h3>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-600 mb-4">
                Welcome to the AADF Procurement Platform! This guide will help you navigate the key AI features of our platform.
              </p>

              <div className="space-y-4">
                <div className="bg-purple-50 p-3 rounded-md">
                  <h4 className="font-medium text-purple-800 mb-1">Judges Demo Dashboard</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    View all AI features in one place with metrics and technical details.
                  </p>
                  <Link
                    href="/admin/judges-demo"
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>Go to Demo Dashboard</span>
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="bg-blue-50 p-3 rounded-md">
                  <h4 className="font-medium text-blue-800 mb-1">AI Proposal Analysis</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    See how our AI evaluates vendor proposals against tender requirements.
                  </p>
                  <Link
                    href="/admin/judges-demo/proposal-analysis"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>View Proposal Analysis</span>
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="bg-green-50 p-3 rounded-md">
                  <h4 className="font-medium text-green-800 mb-1">Vendor-Tender Compatibility</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Discover how AI matches the right vendors to each tender.
                  </p>
                  <Link
                    href="/admin/compatibility"
                    className="inline-flex items-center text-sm text-green-600 hover:text-green-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>View Compatibility Analysis</span>
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="bg-red-50 p-3 rounded-md">
                  <h4 className="font-medium text-red-800 mb-1">AI Document Validation</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    See how AI validates procurement documents for compliance and quality.
                  </p>
                  <Link
                    href="/admin/document-validation"
                    className="inline-flex items-center text-sm text-red-600 hover:text-red-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>View Document Validation</span>
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 sm:px-6 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
                onClick={() => setIsOpen(false)}
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
