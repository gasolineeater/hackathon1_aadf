'use client';

import { useEffect, useState } from 'react';
import RecentActivityCard from './RecentActivityCard';

interface RecentActivitySectionProps {
  userRole: string;
  limit?: number;
}

export default function RecentActivitySection({ 
  userRole,
  limit = 5
}: RecentActivitySectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/dashboard/activity?limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          setActivities(data);
        } else {
          console.error('Failed to fetch recent activities');
        }
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchActivities();
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
  const title = userRole === 'vendor' ? 'Your Recent Activity' : 'Recent Platform Activity';
  
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
      <RecentActivityCard
        activities={activities}
        title={title}
        viewAllHref="/activity"
        emptyMessage={userRole === 'vendor' ? "You don't have any recent activity" : "No recent activity on the platform"}
      />
    </div>
  );
}
