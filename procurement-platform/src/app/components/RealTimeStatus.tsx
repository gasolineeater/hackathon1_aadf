'use client';

import { useState, useEffect } from 'react';
import { useRealTime } from '@/contexts/RealTimeContext';

interface RealTimeStatusProps {
  showLabel?: boolean;
  className?: string;
}

export default function RealTimeStatus({ showLabel = true, className = '' }: RealTimeStatusProps) {
  const { isConnected, lastUpdate } = useRealTime();
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('Never');
  
  // Update the last update time
  useEffect(() => {
    if (lastUpdate) {
      const date = new Date(lastUpdate.timestamp);
      setLastUpdateTime(
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    }
  }, [lastUpdate]);
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center">
        <div
          className={`h-2 w-2 rounded-full mr-2 ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
        {showLabel && (
          <span className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        )}
      </div>
      
      {lastUpdate && (
        <div className="ml-4 text-xs text-gray-500">
          Last update: {lastUpdateTime}
        </div>
      )}
    </div>
  );
}
