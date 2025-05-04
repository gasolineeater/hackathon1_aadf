'use client';

import { useState } from 'react';
import Link from 'next/link';
import { mockTenders } from '@/lib/mockData';

// Mock approval data
const mockApprovals = [
  {
    id: 'apr-001',
    tender_id: 'tender-001',
    type: 'tender_publication',
    status: 'approved',
    requested_by: 'John Doe',
    requested_at: '2023-06-10T10:30:00Z',
    approvers: [
      { name: 'Jane Smith', role: 'Procurement Manager', status: 'approved', approved_at: '2023-06-11T14:20:00Z' },
      { name: 'Michael Johnson', role: 'Finance Director', status: 'approved', approved_at: '2023-06-12T09:15:00Z' }
    ]
  },
  {
    id: 'apr-002',
    tender_id: 'tender-002',
    type: 'tender_publication',
    status: 'pending',
    requested_by: 'Alice Brown',
    requested_at: '2023-06-15T11:45:00Z',
    approvers: [
      { name: 'Jane Smith', role: 'Procurement Manager', status: 'approved', approved_at: '2023-06-16T10:30:00Z' },
      { name: 'Michael Johnson', role: 'Finance Director', status: 'pending', approved_at: null }
    ]
  },
  {
    id: 'apr-003',
    tender_id: 'tender-003',
    type: 'award_decision',
    status: 'pending',
    requested_by: 'Robert Wilson',
    requested_at: '2023-06-18T14:20:00Z',
    approvers: [
      { name: 'Jane Smith', role: 'Procurement Manager', status: 'approved', approved_at: '2023-06-19T09:45:00Z' },
      { name: 'Michael Johnson', role: 'Finance Director', status: 'pending', approved_at: null },
      { name: 'Sarah Davis', role: 'CEO', status: 'pending', approved_at: null }
    ]
  },
  {
    id: 'apr-004',
    tender_id: 'tender-004',
    type: 'contract_signing',
    status: 'rejected',
    requested_by: 'David Miller',
    requested_at: '2023-06-20T13:10:00Z',
    approvers: [
      { name: 'Jane Smith', role: 'Procurement Manager', status: 'approved', approved_at: '2023-06-21T10:15:00Z' },
      { name: 'Michael Johnson', role: 'Finance Director', status: 'rejected', approved_at: '2023-06-22T11:30:00Z', comments: 'Budget exceeds approved amount. Please revise.' }
    ]
  },
  {
    id: 'apr-005',
    tender_id: 'tender-005',
    type: 'tender_publication',
    status: 'approved',
    requested_by: 'Emily Clark',
    requested_at: '2023-06-25T09:30:00Z',
    approvers: [
      { name: 'Jane Smith', role: 'Procurement Manager', status: 'approved', approved_at: '2023-06-26T14:45:00Z' },
      { name: 'Michael Johnson', role: 'Finance Director', status: 'approved', approved_at: '2023-06-27T10:20:00Z' }
    ]
  }
];

export default function ApprovalsPage() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  
  // Filter approvals based on status and type
  const filteredApprovals = mockApprovals.filter(approval => {
    const matchesStatus = 
      statusFilter === null || 
      approval.status === statusFilter;
    
    const matchesType = 
      typeFilter === null || 
      approval.type === typeFilter;
    
    return matchesStatus && matchesType;
  });
  
  // Get tender title
  const getTenderTitle = (tenderId: string) => {
    const tender = mockTenders.find(t => t.id === tenderId);
    return tender ? tender.title : 'Unknown Tender';
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tender_publication':
        return 'bg-blue-100 text-blue-800';
      case 'award_decision':
        return 'bg-purple-100 text-purple-800';
      case 'contract_signing':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format type for display
  const formatType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
          <h1 className="text-2xl font-bold text-gray-900">Approval Tracking</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track approvals and decisions in a centralized dashboard
          </p>
        </div>
        
        {/* Filters */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Filters</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={typeFilter || ''}
                  onChange={(e) => setTypeFilter(e.target.value || null)}
                >
                  <option value="">All Types</option>
                  <option value="tender_publication">Tender Publication</option>
                  <option value="award_decision">Award Decision</option>
                  <option value="contract_signing">Contract Signing</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Approvals List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Approvals ({filteredApprovals.length})</h2>
          </div>
          
          {filteredApprovals.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">No approvals found matching your criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApprovals.map((approval) => (
                <div key={approval.id} className="px-4 py-5 sm:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link href={`/admin/procurement-dashboard/tenders/${approval.tender_id}`} className="hover:underline">
                          {getTenderTitle(approval.tender_id)}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Requested by {approval.requested_by} on {formatDate(approval.requested_at)}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(approval.type)}`}>
                        {formatType(approval.type)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                        {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Approval Flow</h4>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-between">
                        {approval.approvers.map((approver, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              approver.status === 'approved' ? 'bg-green-500' :
                              approver.status === 'rejected' ? 'bg-red-500' : 'bg-gray-300'
                            }`}>
                              {approver.status === 'approved' ? (
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : approver.status === 'rejected' ? (
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              ) : (
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              )}
                            </div>
                            <div className="mt-2 text-center">
                              <div className="text-xs font-medium text-gray-900">{approver.name}</div>
                              <div className="text-xs text-gray-500">{approver.role}</div>
                              {approver.approved_at && (
                                <div className="text-xs text-gray-400">{formatDate(approver.approved_at)}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {approval.approvers.some(a => a.comments) && (
                      <div className="mt-4 bg-yellow-50 p-3 rounded-md">
                        <h5 className="text-sm font-medium text-yellow-800 mb-1">Comments</h5>
                        {approval.approvers.filter(a => a.comments).map((approver, index) => (
                          <div key={index} className="text-sm text-yellow-700">
                            <span className="font-medium">{approver.name}:</span> {approver.comments}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {approval.status === 'pending' && (
                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 mr-2"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Information Box */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">About Approval Tracking</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  The approval tracking system ensures transparency and accountability in the procurement process:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>All approval requests are tracked in a centralized dashboard</li>
                  <li>Each approval step is timestamped and recorded</li>
                  <li>Approvers can add comments to explain their decisions</li>
                  <li>Email notifications are sent automatically when action is required</li>
                  <li>The system maintains a complete audit trail for compliance purposes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
