'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useToast } from '@/app/context/ToastContext';

interface Tender {
  id: string;
  title: string;
  status: 'draft' | 'published' | 'closed' | 'awarded' | 'cancelled';
  deadline: string;
  proposal_count: number;
  created_at: string;
  updated_at: string;
}

export default function TenderStatusTracker() {
  const { user } = useAuth();
  const { isAdmin, isEvaluator } = useRoleAccess();
  const { showToast } = useToast();
  
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  
  useEffect(() => {
    if (user && (isAdmin || isEvaluator)) {
      fetchTenders();
    }
  }, [user, isAdmin, isEvaluator]);
  
  const fetchTenders = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/tenders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch tenders');
      }
      
      const data = await response.json();
      setTenders(data.tenders);
    } catch (error: any) {
      console.error('Error fetching tenders:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to load tenders'
      });
    } finally {
      setIsLoading(false);
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
  
  // Check if deadline is approaching (within 3 days)
  const isDeadlineApproaching = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  };
  
  // Check if deadline has passed
  const isDeadlinePassed = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return deadlineDate < now;
  };
  
  // Filter tenders based on selected filter
  const filteredTenders = tenders.filter(tender => {
    if (filter === 'all') return true;
    if (filter === 'draft') return tender.status === 'draft';
    if (filter === 'published') return tender.status === 'published';
    if (filter === 'closed') return tender.status === 'closed';
    if (filter === 'awarded') return tender.status === 'awarded';
    if (filter === 'cancelled') return tender.status === 'cancelled';
    if (filter === 'deadline-approaching') {
      return tender.status === 'published' && isDeadlineApproaching(tender.deadline);
    }
    return true;
  });
  
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
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Tender Status Tracker</h3>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage tenders across the platform
        </p>
      </div>
      
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-700">Filter:</span>
          <select
            className="block rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Tenders</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="closed">Closed</option>
            <option value="awarded">Awarded</option>
            <option value="cancelled">Cancelled</option>
            <option value="deadline-approaching">Deadline Approaching</option>
          </select>
          
          <div className="ml-auto">
            <Link
              href="/tenders/create"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4]"
            >
              Create Tender
            </Link>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {filteredTenders.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-500">
            No tenders found matching the selected filter
          </div>
        ) : (
          filteredTenders.map((tender) => (
            <div key={tender.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <Link href={`/tenders/${tender.id}`} className="block">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-[#0056a4]">
                      {tender.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Created {formatDate(tender.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tender.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      tender.status === 'published' ? 'bg-green-100 text-green-800' :
                      tender.status === 'closed' ? 'bg-blue-100 text-blue-800' :
                      tender.status === 'awarded' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                    </span>
                    
                    {tender.proposal_count > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tender.proposal_count} {tender.proposal_count === 1 ? 'Proposal' : 'Proposals'}
                      </span>
                    )}
                  </div>
                </div>
                
                {tender.status === 'published' && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500">Deadline:</span>
                      <span className={`ml-1 text-xs font-medium ${
                        isDeadlinePassed(tender.deadline) ? 'text-red-600' :
                        isDeadlineApproaching(tender.deadline) ? 'text-yellow-600' :
                        'text-gray-900'
                      }`}>
                        {formatDate(tender.deadline)}
                        {isDeadlinePassed(tender.deadline) && ' (Passed)'}
                        {!isDeadlinePassed(tender.deadline) && isDeadlineApproaching(tender.deadline) && ' (Approaching)'}
                      </span>
                    </div>
                    
                    {/* Progress bar for time remaining */}
                    {!isDeadlinePassed(tender.deadline) && (
                      <div className="mt-1">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              isDeadlineApproaching(tender.deadline) ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{
                              width: `${calculateProgressPercentage(tender.created_at, tender.deadline)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {tender.status === 'closed' && (
                  <div className="mt-2 flex items-center">
                    <span className="text-xs text-gray-500">Ready for evaluation</span>
                    <svg className="ml-1 h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </Link>
            </div>
          ))
        )}
      </div>
      
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <Link
          href="/tenders"
          className="text-sm font-medium text-[#0056a4] hover:text-[#004483]"
        >
          View All Tenders →
        </Link>
      </div>
    </div>
  );
}

// Calculate progress percentage between creation date and deadline
function calculateProgressPercentage(createdAt: string, deadline: string): number {
  const creationDate = new Date(createdAt).getTime();
  const deadlineDate = new Date(deadline).getTime();
  const now = new Date().getTime();
  
  const totalDuration = deadlineDate - creationDate;
  const elapsed = now - creationDate;
  
  if (elapsed <= 0) return 0;
  if (elapsed >= totalDuration) return 100;
  
  return Math.round((elapsed / totalDuration) * 100);
}
