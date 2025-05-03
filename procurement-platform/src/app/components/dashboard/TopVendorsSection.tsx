'use client';

import { useEffect, useState } from 'react';
import TopVendorsCard from './TopVendorsCard';

interface TopVendorsSectionProps {
  limit?: number;
}

export default function TopVendorsSection({ limit = 5 }: TopVendorsSectionProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [vendors, setVendors] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch(`/api/dashboard/vendors?limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          setVendors(data);
        } else {
          console.error('Failed to fetch top vendors');
        }
      } catch (error) {
        console.error('Error fetching top vendors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVendors();
  }, [limit]);
  
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="bg-gray-200 rounded-lg h-64"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-4">Top Performing Vendors</h2>
      <TopVendorsCard
        vendors={vendors}
        title="Top Performing Vendors"
        viewAllHref="/vendors"
        emptyMessage="No vendor data available yet"
      />
    </div>
  );
}
