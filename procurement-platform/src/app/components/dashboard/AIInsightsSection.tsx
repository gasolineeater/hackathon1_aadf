'use client';

import { useEffect, useState } from 'react';
import AnalysisInsightsCard from './AnalysisInsightsCard';

interface AIInsightsSectionProps {
  userRole: string;
  limit?: number;
}

export default function AIInsightsSection({ 
  userRole,
  limit = 5
}: AIInsightsSectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch(`/api/dashboard/insights?limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          setInsights(data);
        } else {
          console.error('Failed to fetch AI insights');
        }
      } catch (error) {
        console.error('Error fetching AI insights:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInsights();
  }, [limit]);
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="bg-gray-200 rounded-lg h-64"></div>
      </div>
    );
  }
  
  // Determine title based on user role
  const title = userRole === 'vendor' ? 'AI Insights for You' : 'AI-Generated Insights';
  
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
      <AnalysisInsightsCard
        insights={insights}
        title={title}
        viewAllHref="/insights"
        emptyMessage={userRole === 'vendor' ? "No AI insights available for you yet" : "No AI insights available yet"}
        maxItems={limit}
      />
    </div>
  );
}
