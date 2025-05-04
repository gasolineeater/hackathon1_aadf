'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockTenders, mockVendors, mockCompatibilityScores } from '@/lib/mockData';

export default function TenderDetailsPage({ params }: { params: { id: string } }) {
  const tenderId = params.id;
  
  // Find the tender
  const tender = mockTenders.find(t => t.id === tenderId);
  
  // Get compatibility scores for this tender
  const compatibilityScores = mockCompatibilityScores
    .filter(score => score.tender_id === tenderId)
    .map(score => {
      // Find the vendor
      const vendor = mockVendors.find(v => v.id === score.vendor_id);
      
      return {
        id: score.vendor_id,
        name: vendor?.name || 'Unknown Vendor',
        score: score.score,
        factors: score.factors
      };
    })
    // Sort by score descending
    .sort((a, b) => b.score - a.score);
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Get text color based on score
  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-yellow-700';
    return 'text-red-700';
  };
  
  // Get background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };
  
  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Tender Not Found</h2>
            <p className="text-sm text-gray-500 mb-4">
              The tender you are looking for does not exist.
            </p>
            <Link
              href="/vendors"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Back to Vendors
            </Link>
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
            href="/vendors"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Vendors
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h1 className="text-xl font-bold text-indigo-800">{tender.title}</h1>
            <p className="mt-1 text-sm text-indigo-600">
              Tender ID: {tender.id}
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Tender Details</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {tender.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Budget</dt>
                      <dd className="mt-1 text-sm text-gray-900">€{tender.budget.toLocaleString()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Deadline</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tender.deadline}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="mt-1 text-sm text-gray-900">{tender.created_at}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-700">{tender.description}</p>
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mt-6 mb-3">Requirements</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {tender.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">AI-Matched Compatible Vendors</h3>
              
              {compatibilityScores.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  No compatible vendors found for this tender
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {compatibilityScores.map((vendor, index) => (
                    <div key={index} className={`p-4 rounded-md ${getScoreBgColor(vendor.score)}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">{vendor.name}</h4>
                        <span className={`font-bold ${getScoreTextColor(vendor.score)}`}>
                          {vendor.score}% Match
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div 
                          className={`h-2.5 rounded-full ${getScoreColor(vendor.score)}`}
                          style={{ width: `${vendor.score}%` }}
                        ></div>
                      </div>
                      
                      <div className="grid grid-cols-5 gap-2 mt-3">
                        {vendor.factors.map((factor, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-xs text-gray-500">{factor.name.replace(' Match', '')}</div>
                            <div className={`text-xs font-medium ${getScoreTextColor(factor.score)}`}>
                              {factor.score}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">AI-Powered Vendor Matching</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-600 mb-4">
              Our AI system has analyzed this tender and matched it with vendors based on compatibility scores. The compatibility score is calculated using multiple factors including industry match, expertise match, experience match, capacity match, and certification match.
            </p>
            
            <div className="bg-indigo-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-indigo-800 mb-2">Benefits of AI Matching</h4>
              <ul className="space-y-1 text-sm text-indigo-700">
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Find the most qualified vendors quickly
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Ensure fair and transparent vendor selection
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Reduce procurement cycle time by up to 75%
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Improve procurement outcomes with better vendor matches
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
