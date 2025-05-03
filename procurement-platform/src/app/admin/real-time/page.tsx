'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useRealTimeUpdate } from '@/hooks/useRealTimeUpdate';
import RealTimeDashboard from '@/app/components/RealTimeDashboard';

export default function RealTimeAdminPage() {
  const { user } = useAuth();
  const { isAdmin } = useRoleAccess();
  const {
    updateTender,
    updateProposal,
    updateDocument,
    updateEvaluation,
    updateApproval,
    updateSystem
  } = useRealTimeUpdate();
  
  const [tenderTitle, setTenderTitle] = useState('Urban Development Project');
  const [proposalTitle, setProposalTitle] = useState('Infrastructure Proposal');
  const [documentTitle, setDocumentTitle] = useState('Technical Specification');
  const [evaluationTitle, setEvaluationTitle] = useState('Proposal Evaluation');
  const [approvalTitle, setApprovalTitle] = useState('Budget Approval');
  const [systemMessage, setSystemMessage] = useState('The system will undergo maintenance in 2 hours');
  
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
          <h1 className="text-2xl font-semibold text-gray-900">Real-time Updates</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor and test real-time updates across the platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Tender Updates */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Tender Updates</h2>
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
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => updateTender('created', 'tender-123', tenderTitle, {
                      createdBy: user.email,
                      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
                    })}
                  >
                    Created
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => updateTender('updated', 'tender-123', tenderTitle, {
                      updatedBy: user.email,
                      updatedFields: ['deadline', 'budget']
                    })}
                  >
                    Updated
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => updateTender('closed', 'tender-123', tenderTitle, {
                      closedBy: user.email,
                      closedAt: new Date().toISOString()
                    })}
                  >
                    Closed
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => updateTender('awarded', 'tender-123', tenderTitle, {
                      awardedBy: user.email,
                      awardedTo: 'ABC Construction',
                      awardedAt: new Date().toISOString()
                    })}
                  >
                    Awarded
                  </button>
                </div>
              </div>
            </div>
            
            {/* Proposal Updates */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Proposal Updates</h2>
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
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => updateProposal('submitted', 'proposal-456', proposalTitle, {
                      submittedBy: 'ABC Construction',
                      submittedAt: new Date().toISOString()
                    })}
                  >
                    Submitted
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => updateProposal('new_evaluation', 'proposal-456', proposalTitle, {
                      evaluatorName: 'John Smith',
                      score: 85,
                      comments: 'Good proposal with strong technical approach'
                    })}
                  >
                    New Evaluation
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => updateProposal('accepted', 'proposal-456', proposalTitle, {
                      acceptedBy: user.email,
                      acceptedAt: new Date().toISOString()
                    })}
                  >
                    Accepted
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => updateProposal('rejected', 'proposal-456', proposalTitle, {
                      rejectedBy: user.email,
                      rejectedAt: new Date().toISOString(),
                      reason: 'Budget exceeds limit'
                    })}
                  >
                    Rejected
                  </button>
                </div>
              </div>
            </div>
            
            {/* Document Updates */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Document Updates</h2>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <div className="mb-4">
                  <label htmlFor="documentTitle" className="block text-sm font-medium text-gray-700">
                    Document Title
                  </label>
                  <input
                    type="text"
                    id="documentTitle"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => updateDocument('uploaded', 'document-789', documentTitle, {
                      uploadedBy: user.email,
                      fileType: 'PDF',
                      fileSize: '2.4 MB'
                    })}
                  >
                    Uploaded
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => updateDocument('validated', 'document-789', documentTitle, {
                      validatedBy: 'AI System',
                      validatedAt: new Date().toISOString()
                    })}
                  >
                    Validated
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    onClick={() => updateDocument('invalid', 'document-789', documentTitle, {
                      validatedBy: 'AI System',
                      validatedAt: new Date().toISOString(),
                      issues: ['Missing required sections', 'Incomplete budget details']
                    })}
                  >
                    Invalid
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => updateDocument('updated', 'document-789', documentTitle, {
                      updatedBy: user.email,
                      updatedAt: new Date().toISOString(),
                      version: 2
                    })}
                  >
                    Updated
                  </button>
                </div>
              </div>
            </div>
            
            {/* System Updates */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">System Updates</h2>
              </div>
              
              <div className="px-4 py-5 sm:p-6">
                <div className="mb-4">
                  <label htmlFor="systemMessage" className="block text-sm font-medium text-gray-700">
                    System Message
                  </label>
                  <input
                    type="text"
                    id="systemMessage"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                    value={systemMessage}
                    onChange={(e) => setSystemMessage(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => updateSystem('maintenance', {
                      message: systemMessage,
                      duration: '30 minutes',
                      scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                      affectedServices: ['document upload', 'proposal submission']
                    })}
                  >
                    Maintenance
                  </button>
                  
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => updateSystem('announcement', {
                      message: systemMessage,
                      announcedBy: user.email,
                      announcedAt: new Date().toISOString()
                    })}
                  >
                    Announcement
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Real-time Dashboard */}
          <div>
            <RealTimeDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}
