'use client';

import { useState, useEffect } from 'react';
import { useRealTime } from '@/contexts/RealTimeContext';
import { RealTimeUpdate } from '@/lib/real-time-service';
import Link from 'next/link';

interface RealTimeFeedProps {
  maxItems?: number;
  showHeader?: boolean;
  showClear?: boolean;
  filterType?: string | string[];
  filterAction?: string | string[];
  className?: string;
}

export default function RealTimeFeed({
  maxItems = 10,
  showHeader = true,
  showClear = true,
  filterType,
  filterAction,
  className = ''
}: RealTimeFeedProps) {
  const { updates, clearUpdates, isConnected } = useRealTime();
  const [filteredUpdates, setFilteredUpdates] = useState<RealTimeUpdate[]>([]);
  
  // Filter updates based on props
  useEffect(() => {
    let filtered = [...updates];
    
    if (filterType) {
      const types = Array.isArray(filterType) ? filterType : [filterType];
      filtered = filtered.filter(update => types.includes(update.type));
    }
    
    if (filterAction) {
      const actions = Array.isArray(filterAction) ? filterAction : [filterAction];
      filtered = filtered.filter(update => actions.includes(update.action));
    }
    
    setFilteredUpdates(filtered.slice(0, maxItems));
  }, [updates, filterType, filterAction, maxItems]);
  
  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };
  
  // Get icon based on update type and action
  const getUpdateIcon = (update: RealTimeUpdate) => {
    const { type, action } = update;
    
    // Type-specific icons
    switch (type) {
      case 'tender':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
        
      case 'proposal':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
        
      case 'document':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        );
        
      case 'evaluation':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
        );
        
      case 'approval':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
        
      case 'system':
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
        
      default:
        return (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };
  
  // Get link for update
  const getUpdateLink = (update: RealTimeUpdate) => {
    const { type, entityId } = update;
    
    switch (type) {
      case 'tender':
        return `/tenders/${entityId}`;
      case 'proposal':
        return `/proposals/${entityId}`;
      case 'document':
        return `/documents/${entityId}`;
      case 'evaluation':
        return `/evaluations/${entityId}`;
      case 'approval':
        return `/approvals/${entityId}`;
      default:
        return '#';
    }
  };
  
  // Get formatted title for update
  const getUpdateTitle = (update: RealTimeUpdate) => {
    const { type, action, entityTitle } = update;
    
    const typeMap: Record<string, string> = {
      'tender': 'Tender',
      'proposal': 'Proposal',
      'document': 'Document',
      'evaluation': 'Evaluation',
      'approval': 'Approval',
      'system': 'System'
    };
    
    const actionMap: Record<string, string> = {
      'created': 'created',
      'updated': 'updated',
      'closed': 'closed',
      'awarded': 'awarded',
      'cancelled': 'cancelled',
      'submitted': 'submitted',
      'accepted': 'accepted',
      'rejected': 'rejected',
      'validated': 'validated',
      'invalid': 'has validation issues',
      'requested': 'requested',
      'approved': 'approved',
      'maintenance': 'maintenance'
    };
    
    const typeName = typeMap[type] || type;
    const actionName = actionMap[action] || action.replace('_', ' ');
    
    if (entityTitle) {
      return `${typeName} "${entityTitle}" ${actionName}`;
    }
    
    return `${typeName} ${actionName}`;
  };
  
  // Get update details
  const getUpdateDetails = (update: RealTimeUpdate) => {
    const { type, action, data } = update;
    
    if (type === 'system' && action === 'maintenance') {
      return data.message || 'System maintenance scheduled';
    }
    
    if (type === 'tender' && action === 'updated') {
      const fields = data.updatedFields || [];
      return `Updated fields: ${fields.join(', ')}`;
    }
    
    if (type === 'proposal' && action === 'new_evaluation') {
      return `Evaluated by ${data.evaluatorName} with score ${data.score}`;
    }
    
    if (type === 'document' && action === 'uploaded') {
      return `Uploaded by ${data.uploadedBy}`;
    }
    
    return '';
  };
  
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {showHeader && (
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Real-time Updates</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isConnected ? (
                <span className="flex items-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                  Connected
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                  Disconnected
                </span>
              )}
            </p>
          </div>
          
          {showClear && filteredUpdates.length > 0 && (
            <button
              type="button"
              onClick={clearUpdates}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4]"
            >
              Clear All
            </button>
          )}
        </div>
      )}
      
      <div className="max-h-96 overflow-y-auto">
        {filteredUpdates.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            No updates yet
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredUpdates.map((update) => (
              <li key={update.id} className="px-4 py-4 hover:bg-gray-50">
                <div className="flex items-start">
                  {getUpdateIcon(update)}
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {getUpdateTitle(update)}
                    </div>
                    {getUpdateDetails(update) && (
                      <div className="mt-1 text-sm text-gray-500">
                        {getUpdateDetails(update)}
                      </div>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        {formatRelativeTime(update.timestamp)}
                      </div>
                      <Link
                        href={getUpdateLink(update)}
                        className="text-xs text-[#0056a4] hover:text-[#004483]"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
