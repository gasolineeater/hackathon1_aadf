'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useToast } from '@/app/context/ToastContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';

export default function TenderDetailPage() {
  const params = useParams();
  const tenderId = params.id as string;
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { isAdmin, isEvaluator } = useRoleAccess();
  
  const [isLoading, setIsLoading] = useState(true);
  const [tender, setTender] = useState<any>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch tender details
        const tenderResponse = await fetch(`/api/tenders/${tenderId}`);
        if (!tenderResponse.ok) {
          throw new Error('Failed to fetch tender details');
        }
        const tenderData = await tenderResponse.json();
        setTender(tenderData);
        
        // Fetch proposals if user is admin or evaluator
        if (isAdmin || isEvaluator) {
          const proposalsResponse = await fetch(`/api/tenders/${tenderId}/proposals`);
          if (proposalsResponse.ok) {
            const proposalsData = await proposalsResponse.json();
            setProposals(proposalsData);
          }
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: error.message || 'Failed to load tender details',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (tenderId) {
      fetchData();
    }
  }, [tenderId, isAdmin, isEvaluator, showToast]);
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tender?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/tenders/${tenderId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete tender');
      }
      
      showToast({
        type: 'success',
        title: 'Tender Deleted',
        message: 'The tender has been deleted successfully',
      });
      
      router.push('/tenders');
    } catch (error: any) {
      console.error('Error deleting tender:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete tender',
      });
    }
  };
  
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
  
  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Tender Not Found</h3>
              <p className="mt-1 text-sm text-gray-500">
                The tender you are looking for does not exist or you do not have permission to view it.
              </p>
              <div className="mt-6">
                <Link
                  href="/tenders"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                >
                  Back to Tenders
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
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/tenders"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Tenders
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{tender.title}</h1>
              <p className="mt-1 text-sm text-gray-500">
                {tender.category} | Published: {formatDate(tender.created_at)}
              </p>
            </div>
            
            {(isAdmin || isEvaluator) && (
              <div className="flex space-x-2">
                <Link
                  href={`/tenders/${tenderId}/edit`}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilSquareIcon className="h-4 w-4 mr-1" />
                  Edit
                </Link>
                
                {isAdmin && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{tender.description}</p>
                </div>
                
                {/* AI Analysis Links */}
                {(isAdmin || isEvaluator) && (
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">AI Analysis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Link
                        href={`/tenders/${tenderId}/evaluation`}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <DocumentTextIcon className="h-8 w-8 text-[#0056a4] mb-2" />
                        <span className="text-sm font-medium text-gray-900">Tender Evaluation</span>
                        <span className="text-xs text-gray-500 text-center mt-1">
                          AI evaluation of tender quality and completeness
                        </span>
                      </Link>
                      
                      <Link
                        href={`/tenders/${tenderId}/matches`}
                        className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <UserGroupIcon className="h-8 w-8 text-[#0056a4] mb-2" />
                        <span className="text-sm font-medium text-gray-900">Vendor Matching</span>
                        <span className="text-xs text-gray-500 text-center mt-1">
                          Find the best vendor matches for this tender
                        </span>
                      </Link>
                      
                      {proposals.length > 0 && (
                        <Link
                          href={`/tenders/${tenderId}/proposals`}
                          className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <ChartBarIcon className="h-8 w-8 text-[#0056a4] mb-2" />
                          <span className="text-sm font-medium text-gray-900">Proposal Analysis</span>
                          <span className="text-xs text-gray-500 text-center mt-1">
                            Compare and analyze submitted proposals
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Tender Details</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="text-sm font-medium text-gray-900">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tender.status === 'open' ? 'bg-green-100 text-green-800' :
                          tender.status === 'closed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                        </span>
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Submission Deadline</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(tender.submission_deadline)}
                      </p>
                    </div>
                    
                    {tender.budget && (
                      <div>
                        <p className="text-sm text-gray-500">Budget</p>
                        <p className="text-sm font-medium text-gray-900">
                          ${tender.budget.toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-gray-500">Created By</p>
                      <p className="text-sm font-medium text-gray-900">
                        {tender.created_by_name || 'Unknown'}
                      </p>
                    </div>
                    
                    {(isAdmin || isEvaluator) && proposals.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500">Proposals Received</p>
                        <p className="text-sm font-medium text-gray-900">
                          {proposals.length}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    {tender.status === 'open' && !isAdmin && !isEvaluator && (
                      <Link
                        href={`/tenders/${tenderId}/submit-proposal`}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                      >
                        Submit Proposal
                      </Link>
                    )}
                    
                    {(isAdmin || isEvaluator) && (
                      <Link
                        href={`/tenders/${tenderId}/proposals`}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                      >
                        View Proposals
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
