'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockProposals, mockTenders } from '@/lib/mockData';

export default function ProposalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tenderFilter, setTenderFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  // Get tender details for each proposal
  const proposalsWithTenders = mockProposals.map(proposal => {
    const tender = mockTenders.find(t => t.id === proposal.tender_id);
    return {
      ...proposal,
      tenderTitle: tender?.title || 'Unknown Tender',
      tenderDeadline: tender?.deadline || '',
      isDeadlinePassed: new Date(tender?.deadline || '') < new Date()
    };
  });
  
  // Filter proposals based on search term, tender, and status
  const filteredProposals = proposalsWithTenders.filter(proposal => {
    const matchesSearch = 
      searchTerm === '' || 
      proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.tenderTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTender = 
      tenderFilter === null || 
      proposal.tender_id === tenderFilter;
    
    const matchesStatus = 
      statusFilter === null || 
      proposal.status === statusFilter;
    
    return matchesSearch && matchesTender && matchesStatus;
  });
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin/procurement-dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Proposal Collection</h1>
          <p className="mt-1 text-sm text-gray-500">
            Receive and organize vendor proposals, hidden until deadline
          </p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Search and Filter</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Proposals
                </label>
                <input
                  type="text"
                  id="search"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by title or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="tender" className="block text-sm font-medium text-gray-700 mb-1">
                  Tender
                </label>
                <select
                  id="tender"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={tenderFilter || ''}
                  onChange={(e) => setTenderFilter(e.target.value || null)}
                >
                  <option value="">All Tenders</option>
                  {mockTenders.map(tender => (
                    <option key={tender.id} value={tender.id}>
                      {tender.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                >
                  <option value="">All Statuses</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Proposals List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Proposals ({filteredProposals.length})</h2>
          </div>
          
          {filteredProposals.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">No proposals found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Proposal
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tender
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProposals.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-indigo-600">
                          {proposal.isDeadlinePassed ? (
                            <Link href={`/admin/procurement-dashboard/proposals/${proposal.id}`} className="hover:underline">
                              {proposal.title}
                            </Link>
                          ) : (
                            <div className="flex items-center">
                              <span className="text-gray-500">{proposal.title}</span>
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                Hidden until {formatDate(proposal.tenderDeadline)}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {proposal.tenderTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {proposal.vendor_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {proposal.isDeadlinePassed ? (
                          `€${proposal.amount.toLocaleString()}`
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                            Hidden
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1).replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(proposal.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {proposal.isDeadlinePassed ? (
                          <div className="flex space-x-2 justify-end">
                            <Link
                              href={`/admin/procurement-dashboard/proposals/${proposal.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View
                            </Link>
                            <Link
                              href={`/admin/procurement-dashboard/proposals/${proposal.id}/evaluate`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Evaluate
                            </Link>
                          </div>
                        ) : (
                          <span className="text-gray-400">Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Information Box */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">About Proposal Collection</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Proposals are automatically collected and organized by tender. To ensure fairness and transparency:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Proposal details remain hidden until the tender deadline passes</li>
                  <li>All proposals are securely stored with version control</li>
                  <li>The system automatically validates proposals for completeness</li>
                  <li>Vendors receive confirmation when their proposals are successfully submitted</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
