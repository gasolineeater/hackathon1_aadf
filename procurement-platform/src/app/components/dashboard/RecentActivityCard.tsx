'use client';

import Link from 'next/link';
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  DocumentCheckIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface ActivityItem {
  id: string;
  type: 'tender_evaluation' | 'vendor_match' | 'proposal_analysis' | 'document_validation' | 'tender_created' | 'proposal_submitted';
  title: string;
  timestamp: string;
  score?: number;
  status?: string;
  href: string;
}

interface RecentActivityCardProps {
  activities: ActivityItem[];
  title?: string;
  viewAllHref?: string;
  emptyMessage?: string;
}

export default function RecentActivityCard({
  activities,
  title = 'Recent Activity',
  viewAllHref,
  emptyMessage = 'No recent activity',
}: RecentActivityCardProps) {
  // Function to get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'tender_evaluation':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />;
      case 'vendor_match':
        return <UserGroupIcon className="h-5 w-5 text-purple-500" />;
      case 'proposal_analysis':
        return <ChartBarIcon className="h-5 w-5 text-green-500" />;
      case 'document_validation':
        return <DocumentCheckIcon className="h-5 w-5 text-yellow-500" />;
      case 'tender_created':
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
      case 'proposal_submitted':
        return <DocumentCheckIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Function to format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };
  
  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
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
        {activities.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          activities.map((activity) => (
            <Link 
              key={activity.id} 
              href={activity.href}
              className="block hover:bg-gray-50"
            >
              <div className="px-4 py-3 flex items-center">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-gray-500 mr-2">
                      {formatTimestamp(activity.timestamp)}
                    </p>
                    {activity.status && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status.replace('_', ' ')}
                      </span>
                    )}
                    {activity.score !== undefined && (
                      <span className={`text-xs font-medium ml-2 ${getScoreColor(activity.score)}`}>
                        Score: {activity.score}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
