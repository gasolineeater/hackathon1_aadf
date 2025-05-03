'use client';

import { useState } from 'react';
import { useNotificationTrigger } from '@/hooks/useNotificationTrigger';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export default function NotificationTestPage() {
  const { user } = useAuth();
  const { isAdmin } = useRoleAccess();
  const { notifyTender, notifyProposal, notifyDocument, notifyApproval } = useNotificationTrigger();
  
  const [tenderTitle, setTenderTitle] = useState('Urban Development Project');
  const [proposalTitle, setProposalTitle] = useState('Infrastructure Proposal');
  const [documentName, setDocumentName] = useState('Technical Specification');
  const [resourceName, setResourceName] = useState('Budget Approval');
  
  // If not admin, show access denied
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
              <p className="mt-1 text-sm text-gray-500">
                You do not have permission to access this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Notification Testing</h1>
          <p className="mt-1 text-sm text-gray-500">
            Test different types of notifications in the system
          </p>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Tender Notifications</h2>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <label htmlFor="tenderTitle" className="block text-sm font-medium text-gray-700">
                Tender Title
              </label>
              <input
                type="text"
                id="tenderTitle"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                value={tenderTitle}
                onChange={(e) => setTenderTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => notifyTender('created', 'tender-123', tenderTitle)}
              >
                New Tender
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => notifyTender('updated', 'tender-123', tenderTitle)}
              >
                Tender Updated
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                onClick={() => notifyTender('deadline_approaching', 'tender-123', tenderTitle, { daysLeft: 2 })}
              >
                Deadline Approaching
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => notifyTender('closed', 'tender-123', tenderTitle)}
              >
                Tender Closed
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => notifyTender('awarded', 'tender-123', tenderTitle, { winnerName: 'ABC Construction' })}
              >
                Tender Awarded
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => notifyTender('cancelled', 'tender-123', tenderTitle)}
              >
                Tender Cancelled
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Proposal Notifications</h2>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <label htmlFor="proposalTitle" className="block text-sm font-medium text-gray-700">
                Proposal Title
              </label>
              <input
                type="text"
                id="proposalTitle"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => notifyProposal('submitted', 'proposal-456', proposalTitle, 'tender-123', tenderTitle)}
              >
                Proposal Submitted
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => notifyProposal('under_review', 'proposal-456', proposalTitle, 'tender-123', tenderTitle)}
              >
                Under Review
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => notifyProposal('accepted', 'proposal-456', proposalTitle, 'tender-123', tenderTitle)}
              >
                Proposal Accepted
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => notifyProposal('rejected', 'proposal-456', proposalTitle, 'tender-123', tenderTitle)}
              >
                Proposal Rejected
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => notifyProposal('feedback', 'proposal-456', proposalTitle, 'tender-123', tenderTitle)}
              >
                Feedback Received
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Document Notifications</h2>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">
                Document Name
              </label>
              <input
                type="text"
                id="documentName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => notifyDocument('uploaded', 'doc-789', documentName, 'tender', 'tender-123')}
              >
                Document Uploaded
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => notifyDocument('validated', 'doc-789', documentName, 'tender', 'tender-123')}
              >
                Document Validated
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                onClick={() => notifyDocument('invalid', 'doc-789', documentName, 'tender', 'tender-123', { issues: 'missing required sections' })}
              >
                Document Invalid
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => notifyDocument('updated', 'doc-789', documentName, 'tender', 'tender-123')}
              >
                Document Updated
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Approval Notifications</h2>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-4">
              <label htmlFor="resourceName" className="block text-sm font-medium text-gray-700">
                Resource Name
              </label>
              <input
                type="text"
                id="resourceName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => notifyApproval('requested', 'approval-123', 'tender', 'tender-123', resourceName, { requesterName: 'John Doe' })}
              >
                Approval Requested
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => notifyApproval('approved', 'approval-123', 'tender', 'tender-123', resourceName, { approverName: 'Jane Smith' })}
              >
                Request Approved
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => notifyApproval('rejected', 'approval-123', 'tender', 'tender-123', resourceName, { rejectorName: 'Jane Smith', reason: 'Budget exceeds limit' })}
              >
                Request Rejected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
