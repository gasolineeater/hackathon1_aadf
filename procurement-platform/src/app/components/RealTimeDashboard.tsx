'use client';

import { useState } from 'react';
import { useRealTime } from '@/contexts/RealTimeContext';
import RealTimeFeed from './RealTimeFeed';
import RealTimeStatus from './RealTimeStatus';

interface RealTimeDashboardProps {
  className?: string;
}

export default function RealTimeDashboard({ className = '' }: RealTimeDashboardProps) {
  const { updates } = useRealTime();
  const [activeTab, setActiveTab] = useState<'all' | 'tenders' | 'proposals' | 'documents' | 'system'>('all');
  
  // Count updates by type
  const tenderCount = updates.filter(update => update.type === 'tender').length;
  const proposalCount = updates.filter(update => update.type === 'proposal').length;
  const documentCount = updates.filter(update => update.type === 'document').length;
  const systemCount = updates.filter(update => update.type === 'system').length;
  
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Real-time Dashboard</h3>
          <RealTimeStatus />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Monitor real-time updates across the platform
        </p>
      </div>
      
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`${
              activeTab === 'all'
                ? 'border-[#0056a4] text-[#0056a4]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('all')}
          >
            All Updates
            <span className="ml-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full px-2 py-0.5">
              {updates.length}
            </span>
          </button>
          
          <button
            className={`${
              activeTab === 'tenders'
                ? 'border-[#0056a4] text-[#0056a4]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('tenders')}
          >
            Tenders
            {tenderCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full px-2 py-0.5">
                {tenderCount}
              </span>
            )}
          </button>
          
          <button
            className={`${
              activeTab === 'proposals'
                ? 'border-[#0056a4] text-[#0056a4]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('proposals')}
          >
            Proposals
            {proposalCount > 0 && (
              <span className="ml-2 bg-green-100 text-green-700 text-xs font-semibold rounded-full px-2 py-0.5">
                {proposalCount}
              </span>
            )}
          </button>
          
          <button
            className={`${
              activeTab === 'documents'
                ? 'border-[#0056a4] text-[#0056a4]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
            {documentCount > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full px-2 py-0.5">
                {documentCount}
              </span>
            )}
          </button>
          
          <button
            className={`${
              activeTab === 'system'
                ? 'border-[#0056a4] text-[#0056a4]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('system')}
          >
            System
            {systemCount > 0 && (
              <span className="ml-2 bg-red-100 text-red-700 text-xs font-semibold rounded-full px-2 py-0.5">
                {systemCount}
              </span>
            )}
          </button>
        </nav>
      </div>
      
      <div className="p-4">
        {activeTab === 'all' && (
          <RealTimeFeed maxItems={20} showHeader={false} />
        )}
        
        {activeTab === 'tenders' && (
          <RealTimeFeed maxItems={20} showHeader={false} filterType="tender" />
        )}
        
        {activeTab === 'proposals' && (
          <RealTimeFeed maxItems={20} showHeader={false} filterType="proposal" />
        )}
        
        {activeTab === 'documents' && (
          <RealTimeFeed maxItems={20} showHeader={false} filterType="document" />
        )}
        
        {activeTab === 'system' && (
          <RealTimeFeed maxItems={20} showHeader={false} filterType="system" />
        )}
      </div>
    </div>
  );
}
