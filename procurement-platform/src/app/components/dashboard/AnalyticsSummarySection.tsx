'use client';

import { useEffect, useState } from 'react';
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  DocumentCheckIcon,
  DocumentIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import AnalyticsSummaryCard from './AnalyticsSummaryCard';

interface AnalyticsSummarySectionProps {
  userRole: string;
}

export default function AnalyticsSummarySection({ userRole }: AnalyticsSummarySectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<any>(null);
  
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await fetch('/api/dashboard/summary');
        if (response.ok) {
          const data = await response.json();
          setSummaryData(data);
        } else {
          console.error('Failed to fetch dashboard summary');
        }
      } catch (error) {
        console.error('Error fetching dashboard summary:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSummaryData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-32 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  if (!summaryData) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }
  
  const { counts, averages } = summaryData;
  
  // Determine which cards to show based on user role
  const isAdmin = userRole === 'admin';
  const isEvaluator = userRole === 'evaluator';
  const isVendor = userRole === 'vendor';
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Tenders Card - Show to all users */}
      <AnalyticsSummaryCard
        title="Active Tenders"
        value={counts.tenders}
        icon={<DocumentIcon />}
        href="/tenders"
        color="blue"
      />
      
      {/* Proposals Card - Show to all users */}
      <AnalyticsSummaryCard
        title={isVendor ? "Your Proposals" : "Total Proposals"}
        value={counts.proposals}
        icon={<DocumentCheckIcon />}
        href="/proposals"
        color="green"
      />
      
      {/* Vendors Card - Show only to admin/evaluator */}
      {(isAdmin || isEvaluator) && (
        <AnalyticsSummaryCard
          title="Registered Vendors"
          value={counts.vendors}
          icon={<UserIcon />}
          href="/vendors"
          color="purple"
        />
      )}
      
      {/* Evaluations Card */}
      {(isAdmin || isEvaluator) && (
        <AnalyticsSummaryCard
          title="Tender Evaluations"
          value={counts.evaluations}
          icon={<DocumentTextIcon />}
          color="yellow"
        />
      )}
      
      {/* Vendor Matches Card */}
      <AnalyticsSummaryCard
        title={isVendor ? "Your Matches" : "Vendor Matches"}
        value={counts.matches}
        icon={<UserGroupIcon />}
        color="red"
      />
      
      {/* Proposal Analyses Card */}
      <AnalyticsSummaryCard
        title={isVendor ? "Your Analyses" : "Proposal Analyses"}
        value={counts.analyses}
        icon={<ChartBarIcon />}
        color="gray"
      />
      
      {/* Average Evaluation Score - Admin/Evaluator only */}
      {(isAdmin || isEvaluator) && averages.evaluationScore > 0 && (
        <AnalyticsSummaryCard
          title="Avg. Evaluation Score"
          value={`${averages.evaluationScore}/100`}
          color="yellow"
        />
      )}
      
      {/* Average Match Score */}
      {averages.matchScore > 0 && (
        <AnalyticsSummaryCard
          title="Avg. Match Score"
          value={`${averages.matchScore}/100`}
          color="red"
        />
      )}
      
      {/* Average Analysis Score */}
      {averages.analysisScore > 0 && (
        <AnalyticsSummaryCard
          title="Avg. Analysis Score"
          value={`${averages.analysisScore}/100`}
          color="gray"
        />
      )}
    </div>
  );
}
