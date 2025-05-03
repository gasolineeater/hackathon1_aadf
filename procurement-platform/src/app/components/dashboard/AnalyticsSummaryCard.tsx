'use client';

import Link from 'next/link';
import { ArrowRightIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface AnalyticsSummaryCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  href?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
}

export default function AnalyticsSummaryCard({
  title,
  value,
  change,
  icon,
  href,
  color = 'blue',
}: AnalyticsSummaryCardProps) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      text: 'text-blue-700',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      text: 'text-green-700',
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-600',
      text: 'text-yellow-700',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      text: 'text-red-700',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      text: 'text-purple-700',
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-600',
      text: 'text-gray-700',
    },
  };
  
  const CardContent = () => (
    <div className={`p-4 rounded-lg border ${colorClasses[color].bg} ${colorClasses[color].border} h-full`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className={`mt-1 text-2xl font-semibold ${colorClasses[color].text}`}>{value}</p>
          
          {change && (
            <div className="mt-1 flex items-center">
              {change.isPositive ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-xs font-medium ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {change.value}%
              </span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`p-2 rounded-full ${colorClasses[color].iconBg}`}>
            <div className={`h-6 w-6 ${colorClasses[color].iconText}`}>
              {icon}
            </div>
          </div>
        )}
      </div>
      
      {href && (
        <div className="mt-4 text-right">
          <span className={`text-xs font-medium ${colorClasses[color].text} flex items-center justify-end`}>
            View Details
            <ArrowRightIcon className="h-3 w-3 ml-1" />
          </span>
        </div>
      )}
    </div>
  );
  
  if (href) {
    return (
      <Link href={href} className="block h-full">
        <CardContent />
      </Link>
    );
  }
  
  return <CardContent />;
}
