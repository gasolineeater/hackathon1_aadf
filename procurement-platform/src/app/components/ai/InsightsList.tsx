'use client';

import { CheckCircleIcon, ExclamationCircleIcon, LightBulbIcon } from '@heroicons/react/24/outline';

interface InsightsListProps {
  items: string[];
  type: 'strengths' | 'weaknesses' | 'recommendations';
  emptyMessage?: string;
}

export default function InsightsList({
  items,
  type,
  emptyMessage = 'No items to display',
}: InsightsListProps) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-gray-500 italic">{emptyMessage}</p>;
  }
  
  // Configure icon and colors based on type
  const config = {
    strengths: {
      icon: CheckCircleIcon,
      iconColor: 'text-green-500',
      textColor: 'text-green-800',
    },
    weaknesses: {
      icon: ExclamationCircleIcon,
      iconColor: 'text-red-500',
      textColor: 'text-red-800',
    },
    recommendations: {
      icon: LightBulbIcon,
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-800',
    },
  };
  
  const { icon: Icon, iconColor, textColor } = config[type];
  
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className={`flex-shrink-0 ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </span>
          <span className={`ml-2 text-sm ${textColor}`}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
