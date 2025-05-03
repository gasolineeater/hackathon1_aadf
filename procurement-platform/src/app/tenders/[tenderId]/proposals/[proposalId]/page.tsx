'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/app/context/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export default function ProposalDetailPage() {
  const params = useParams();
  const tenderId = params.tenderId as string;
  const proposalId = params.proposalId as string;
  const { showToast } = useToast();
  const { user } = useAuth();
  const { isAdmin, isEvaluator } = useRoleAccess();
  
  const [isLoading, setIsLoading] = useState(true);
  const [proposal, setProposal] = useState<any>(null);
  const [tender, setTender] = useState<any>(null);
  const [vendor, setVendor] = useState<any>(null);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch proposal details
        const proposalResponse = await fetch(`/api/proposals/${proposalId}`);
        if (!proposalResponse.ok) {
          throw new Error('Failed to fetch proposal details');
        }
        const proposalData = await proposalResponse.json();
        setProposal(proposalData);
        
        // Fetch tender details
        const tenderResponse = await fetch(`/api/tenders/${tenderId}`);
        if (!tenderResponse.ok) {
          throw new Error('Failed to fetch tender details');
        }
        const tenderData = await tenderResponse.json();
        setTender(tenderData);
        
        // Fetch vendor details
        if (proposalData.vendor_id) {
          const vendorResponse = await fetch(`/api/vendors/${proposalData.vendor_id}`);
          if (vendorResponse.ok) {
            const vendorData = await vendorResponse.json();
            setVendor(vendorData);
          }
        }
        
        // Check if analysis exists
        const analysisResponse = await fetch(`/api/ai/analyses/proposal?proposalId=${proposalId}&tenderId=${tenderId}`);
        setHasAnalysis(analysisResponse.ok);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to load proposal details',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (tenderId && proposalId) {
      fetchData();
    }
  }, [tenderId, proposalId, showToast]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056a4]"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!proposal || !tender) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Proposal Not Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The proposal you are looking for does not exist or you do not have permission to view it.
              </p>
              <div className="mt-6">
                <Link
                  href={`/tenders/${tenderId}/proposals`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                >
                  Back to Proposals
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Check if user has access to this proposal
  const canViewProposal = isAdmin || isEvaluator || (user?.id === vendor?.user_id);
  
  if (!canViewProposal) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
              <p className="mt-1 text-sm text-gray-500">
                You do not have permission to view this proposal.
              </p>
              <div className="mt-6">
                <Link
                  href={`/tenders/${tenderId}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                >
                  Back to Tender
                </Link>
              </div>
            </div>
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
            href={`/tenders/${tenderId}/proposals`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Proposals
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h1 className="text-xl font-semibold text-gray-900">{proposal.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Submitted by {vendor?.name || 'Unknown Vendor'} on {formatDate(proposal.submitted_at)}
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Proposal Content</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{proposal.content}</p>
                </div>
                
                {/* AI Analysis Link */}
                {(isAdmin || isEvaluator) && (
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">AI Analysis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link
                        href={`/tenders/${tenderId}/proposals/${proposalId}/analysis`}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <ChartBarIcon className="h-8 w-8 text-[#0056a4] mb-2" />
                        <span className="text-sm font-medium text-gray-900">Proposal Analysis</span>
                        <span className="text-xs text-gray-500 text-center mt-1">
                          {hasAnalysis 
                            ? 'View AI analysis of this proposal' 
                            : 'Generate AI analysis of this proposal'}
                        </span>
                      </Link>
                      
                      <Link
                        href={`/tenders/${tenderId}/evaluation`}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <DocumentTextIcon className="h-8 w-8 text-[#0056a4] mb-2" />
                        <span className="text-sm font-medium text-gray-900">Tender Requirements</span>
                        <span className="text-xs text-gray-500 text-center mt-1">
                          View tender evaluation and requirements
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Proposal Details</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-sm font-medium text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          proposal.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                          proposal.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                          proposal.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {proposal.status.split('_').map((word: string) => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </span>
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Submitted On</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(proposal.submitted_at)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Tender</p>
                      <p className="text-sm font-medium text-gray-900">
                        {tender.title}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Tender Deadline</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(tender.submission_deadline)}
                      </p>
                    </div>
                    
                    {proposal.proposed_budget && (
                      <div>
                        <p className="text-sm text-gray-500">Proposed Budget</p>
                        <p className="text-sm font-medium text-gray-900">
                          ${proposal.proposed_budget.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    {(isAdmin || isEvaluator) && !hasAnalysis && (
                      <Link
                        href={`/tenders/${tenderId}/proposals/${proposalId}/analysis`}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                      >
                        Analyze Proposal
                      </Link>
                    )}
                    
                    {(isAdmin || isEvaluator) && hasAnalysis && (
                      <Link
                        href={`/tenders/${tenderId}/proposals/${proposalId}/analysis`}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                      >
                        View Analysis
                      </Link>
                    )}
                  </div>
                </div>
                
                {vendor && (
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Vendor Information</h2>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Vendor Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {vendor.name}
                        </p>
                      </div>
                      
                      {vendor.contact_person && (
                        <div>
                          <p className="text-sm text-gray-500">Contact Person</p>
                          <p className="text-sm font-medium text-gray-900">
                            {vendor.contact_person}
                          </p>
                        </div>
                      )}
                      
                      {vendor.contact_email && (
                        <div>
                          <p className="text-sm text-gray-500">Contact Email</p>
                          <p className="text-sm font-medium text-gray-900">
                            {vendor.contact_email}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <Link
                        href={`/vendors/${vendor.id}`}
                        className="text-sm text-[#0056a4] hover:text-[#004483]"
                      >
                        View Vendor Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
