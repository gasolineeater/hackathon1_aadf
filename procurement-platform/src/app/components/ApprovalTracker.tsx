'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useToast } from '@/app/context/ToastContext';

interface Approval {
  id: string;
  resource_type: string;
  resource_id: string;
  resource_name: string;
  status: 'pending' | 'approved' | 'rejected';
  approvers: {
    id: string;
    name: string;
    role: string;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    approved_at?: string;
  }[];
  created_at: string;
  updated_at: string;
}

export default function ApprovalTracker() {
  const { user } = useAuth();
  const { isAdmin, isEvaluator } = useRoleAccess();
  const { showToast } = useToast();
  
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<Approval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  
  useEffect(() => {
    if (user && (isAdmin || isEvaluator)) {
      fetchApprovals();
    }
  }, [user, isAdmin, isEvaluator]);
  
  const fetchApprovals = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      
      // Mock approvals
      const mockApprovals: Approval[] = [
        {
          id: 'approval-1',
          resource_type: 'tender',
          resource_id: 'tender-1',
          resource_name: 'Urban Trails Project',
          status: 'pending',
          approvers: [
            {
              id: user?.id || 'user-1',
              name: user?.user_metadata?.full_name || 'Admin User',
              role: 'admin',
              status: 'pending'
            },
            {
              id: 'user-2',
              name: 'Evaluation Committee Chair',
              role: 'evaluator',
              status: 'approved',
              comments: 'Looks good to me',
              approved_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
            }
          ],
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          updated_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        },
        {
          id: 'approval-2',
          resource_type: 'tender',
          resource_id: 'tender-2',
          resource_name: 'Digital Transformation Project',
          status: 'approved',
          approvers: [
            {
              id: user?.id || 'user-1',
              name: user?.user_metadata?.full_name || 'Admin User',
              role: 'admin',
              status: 'approved',
              comments: 'Approved',
              approved_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
            },
            {
              id: 'user-2',
              name: 'Evaluation Committee Chair',
              role: 'evaluator',
              status: 'approved',
              comments: 'Approved with minor comments',
              approved_at: new Date(Date.now() - 345600000).toISOString() // 4 days ago
            }
          ],
          created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
          updated_at: new Date(Date.now() - 259200000).toISOString() // 3 days ago
        },
        {
          id: 'approval-3',
          resource_type: 'proposal',
          resource_id: 'proposal-1',
          resource_name: 'ABC Construction Proposal',
          status: 'pending',
          approvers: [
            {
              id: user?.id || 'user-1',
              name: user?.user_metadata?.full_name || 'Admin User',
              role: 'admin',
              status: 'pending'
            },
            {
              id: 'user-2',
              name: 'Evaluation Committee Chair',
              role: 'evaluator',
              status: 'pending'
            }
          ],
          created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
          updated_at: new Date(Date.now() - 43200000).toISOString() // 12 hours ago
        }
      ];
      
      setApprovals(mockApprovals);
      
      // Filter pending approvals that require action from the current user
      const pending = mockApprovals.filter((approval) => {
        // Check if the approval is pending and the current user is an approver
        return approval.status === 'pending' && 
          approval.approvers.some(approver => 
            approver.id === user?.id && approver.status === 'pending'
          );
      });
      
      setPendingApprovals(pending);
    } catch (error: any) {
      console.error('Error fetching approvals:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to load approvals'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApprove = async (approvalId: string, comments: string = '') => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll update the mock data
      
      // Find the approval to update
      const updatedApprovals = approvals.map(approval => {
        if (approval.id === approvalId) {
          // Update the current user's approver status
          const updatedApprovers = approval.approvers.map(approver => {
            if (approver.id === user?.id) {
              return {
                ...approver,
                status: 'approved',
                comments: comments || 'Approved',
                approved_at: new Date().toISOString()
              };
            }
            return approver;
          });
          
          // Check if all approvers have approved
          const allApproved = updatedApprovers.every(approver => approver.status === 'approved');
          
          return {
            ...approval,
            status: allApproved ? 'approved' : 'pending',
            approvers: updatedApprovers,
            updated_at: new Date().toISOString()
          };
        }
        return approval;
      });
      
      setApprovals(updatedApprovals);
      
      // Update pending approvals
      const pending = updatedApprovals.filter((approval) => {
        return approval.status === 'pending' && 
          approval.approvers.some(approver => 
            approver.id === user?.id && approver.status === 'pending'
          );
      });
      
      setPendingApprovals(pending);
      
      showToast({
        type: 'success',
        title: 'Approved',
        message: 'Item has been approved successfully'
      });
    } catch (error: any) {
      console.error('Error approving:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to approve'
      });
    }
  };
  
  const handleReject = async (approvalId: string, comments: string = '') => {
    if (!comments) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Comments are required when rejecting'
      });
      return;
    }
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll update the mock data
      
      // Find the approval to update
      const updatedApprovals = approvals.map(approval => {
        if (approval.id === approvalId) {
          // Update the current user's approver status
          const updatedApprovers = approval.approvers.map(approver => {
            if (approver.id === user?.id) {
              return {
                ...approver,
                status: 'rejected',
                comments: comments,
                approved_at: new Date().toISOString()
              };
            }
            return approver;
          });
          
          return {
            ...approval,
            status: 'rejected',
            approvers: updatedApprovers,
            updated_at: new Date().toISOString()
          };
        }
        return approval;
      });
      
      setApprovals(updatedApprovals);
      
      // Update pending approvals
      const pending = updatedApprovals.filter((approval) => {
        return approval.status === 'pending' && 
          approval.approvers.some(approver => 
            approver.id === user?.id && approver.status === 'pending'
          );
      });
      
      setPendingApprovals(pending);
      
      showToast({
        type: 'success',
        title: 'Rejected',
        message: 'Item has been rejected'
      });
    } catch (error: any) {
      console.error('Error rejecting:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to reject'
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  if (!user || (!isAdmin && !isEvaluator)) {
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const displayApprovals = activeTab === 'pending' ? pendingApprovals : approvals;
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Approval Tracker</h3>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage approvals across the platform
        </p>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`${
              activeTab === 'pending'
                ? 'border-[#0056a4] text-[#0056a4]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('pending')}
          >
            Pending My Approval
            {pendingApprovals.length > 0 && (
              <span className="ml-2 bg-[#0056a4] text-white text-xs font-semibold rounded-full px-2 py-0.5">
                {pendingApprovals.length}
              </span>
            )}
          </button>
          <button
            className={`${
              activeTab === 'all'
                ? 'border-[#0056a4] text-[#0056a4]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('all')}
          >
            All Approvals
          </button>
        </nav>
      </div>
      
      <div className="divide-y divide-gray-200">
        {displayApprovals.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            {activeTab === 'pending'
              ? 'No pending approvals requiring your action'
              : 'No approvals found'}
          </div>
        ) : (
          displayApprovals.map((approval) => {
            // Check if current user is a pending approver
            const isPendingApprover = approval.approvers.some(
              approver => approver.id === user?.id && approver.status === 'pending'
            );
            
            return (
              <div key={approval.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {approval.resource_name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {approval.resource_type.charAt(0).toUpperCase() + approval.resource_type.slice(1)} • 
                      Created {formatDate(approval.created_at)}
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                      approval.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h5 className="text-xs font-medium text-gray-700 mb-1">Approvers</h5>
                  <div className="flex flex-wrap gap-2">
                    {approval.approvers.map((approver) => (
                      <span
                        key={approver.id}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                          approver.status === 'approved' ? 'bg-green-50 text-green-700' :
                          approver.status === 'rejected' ? 'bg-red-50 text-red-700' :
                          'bg-gray-50 text-gray-700'
                        }`}
                      >
                        {approver.name} ({approver.role})
                        {approver.status === 'approved' && (
                          <svg className="ml-1 h-3 w-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {approver.status === 'rejected' && (
                          <svg className="ml-1 h-3 w-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                
                {isPendingApprover && (
                  <div className="mt-4 flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add comments (required for rejection)"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                      id={`comments-${approval.id}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleApprove(approval.id, (document.getElementById(`comments-${approval.id}`) as HTMLInputElement)?.value)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(approval.id, (document.getElementById(`comments-${approval.id}`) as HTMLInputElement)?.value)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
