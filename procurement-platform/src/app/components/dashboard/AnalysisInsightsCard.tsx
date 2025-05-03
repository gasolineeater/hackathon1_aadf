'use client';

import Link from 'next/link';
import { 
  LightBulbIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface Insight {
  id: string;
  type: 'recommendation' | 'strength' | 'weakness';
  text: string;
  source: {
    type: 'tender' | 'proposal' | 'vendor_match';
    id: string;
    title: string;
  };
  href: string;
}

interface AnalysisInsightsCardProps {
  insights: Insight[];
  title?: string;
  viewAllHref?: string;
  emptyMessage?: string;
  maxItems?: number;
}

export default function AnalysisInsightsCard({
  insights,
  title = 'AI Insights',
  viewAllHref,
  emptyMessage = 'No insights available',
  maxItems = 5,
}: AnalysisInsightsCardProps) {
  // Function to get icon based on insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return <LightBulbIcon className="h-5 w-5 text-yellow-500" />;
      case 'strength':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'weakness':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <LightBulbIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Function to get source label
  const getSourceLabel = (source: Insight['source']) => {
    switch (source.type) {
      case 'tender':
        return 'Tender';
      case 'proposal':
        return 'Proposal';
      case 'vendor_match':
        return 'Vendor Match';
      default:
        return 'Source';
    }
  };
  
  // Limit the number of insights to display
  const displayedInsights = insights.slice(0, maxItems);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        {viewAllHref && (
          <Link href={viewAllHref} className="text-xs text-[#0056a4] hover:text-[#004483]">
            View All
          </Link>
        )}
      </div>
      
      <div className="divide-y divide-gray-200">
        {displayedInsights.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          displayedInsights.map((insight) => (
            <Link 
              key={insight.id} 
              href={insight.href}
              className="block hover:bg-gray-50"
            >
              <div className="px-4 py-3 flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-gray-900">{insight.text}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {getSourceLabel(insight.source)}: {insight.source.title}
                  </p>
                </div>
                <div className="ml-2 flex-shrink-0">
                  <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
      
      {insights.length > maxItems && !viewAllHref && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            +{insights.length - maxItems} more insights
          </p>
        </div>
      )}
    </div>
  );
}
