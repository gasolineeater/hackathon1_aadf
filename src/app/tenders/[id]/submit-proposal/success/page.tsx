'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockTenders } from '@/lib/mockData';

export default function SubmissionSuccessPage({ params }: { params: { id: string } }) {
  const tenderId = params.id;
  const [tender, setTender] = useState<any>(null);
  
  // Fetch tender data
  useEffect(() => {
    const tenderData = mockTenders.find(t => t.id === tenderId);
    setTender(tenderData);
  }, [tenderId]);
  
  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="text-lg font-medium text-gray-900 mt-4">Loading tender details...</h2>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proposal Submitted Successfully!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Your proposal for "{tender.title}" has been received.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md mb-6 max-w-md mx-auto">
            <h3 className="text-md font-medium text-gray-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-gray-600 text-left space-y-2">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Your proposal will remain sealed until the submission deadline.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>After the deadline, all proposals will be evaluated by our team.</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>You will be notified of the results via email.</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={`/tenders/${tenderId}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Tender
            </Link>
            <Link
              href="/tenders"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View All Tenders
            </Link>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your registered email address.
              <br />
              If you have any questions, please contact <a href="mailto:procurement@aadf.org" className="text-indigo-600 hover:text-indigo-900">procurement@aadf.org</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
