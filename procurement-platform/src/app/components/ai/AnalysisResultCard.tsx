'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface AnalysisResultCardProps {
  title: string;
  score?: number;
  status?: 'positive' | 'warning' | 'negative' | 'neutral';
  children: React.ReactNode;
  collapsible?: boolean;
  initiallyExpanded?: boolean;
  className?: string;
}

export default function AnalysisResultCard({
  title,
  score,
  status = 'neutral',
  children,
  collapsible = false,
  initiallyExpanded = true,
  className = '',
}: AnalysisResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  
  // Determine status color
  const statusColors = {
    positive: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    negative: 'bg-red-50 border-red-200',
    neutral: 'bg-gray-50 border-gray-200',
  };
  
  const headerColors = {
    positive: 'bg-green-100',
    warning: 'bg-yellow-100',
    negative: 'bg-red-100',
    neutral: 'bg-gray-100',
  };
  
  const scoreColors = {
    positive: 'text-green-700 bg-green-100',
    warning: 'text-yellow-700 bg-yellow-100',
    negative: 'text-red-700 bg-red-100',
    neutral: 'text-gray-700 bg-gray-100',
  };
  
  // Determine status based on score if not explicitly provided
  const derivedStatus = status === 'neutral' && score !== undefined
    ? score >= 80 ? 'positive' : score >= 60 ? 'warning' : 'negative'
    : status;
  
  return (
    <div className={`border rounded-lg overflow-hidden ${statusColors[derivedStatus]} ${className}`}>
      <div 
        className={`px-4 py-3 flex justify-between items-center ${headerColors[derivedStatus]}`}
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
      >
        <h3 className="font-medium text-gray-900 flex items-center">
          {title}
          {score !== undefined && (
            <span className={`ml-2 px-2 py-1 text-sm rounded-full ${scoreColors[derivedStatus]}`}>
              {score}/100
            </span>
          )}
        </h3>
        
        {collapsible && (
          <button 
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      
      {(!collapsible || isExpanded) && (
        <div className="px-4 py-3">
          {children}
        </div>
      )}
    </div>
  );
}
