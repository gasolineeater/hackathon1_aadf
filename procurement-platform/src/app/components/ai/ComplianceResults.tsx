'use client';

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface RequirementResult {
  requirement: string;
  addressed: boolean;
  confidence: number;
  relevantSection?: string;
}

interface ComplianceResultsProps {
  results: RequirementResult[];
  showRelevantSections?: boolean;
}

export default function ComplianceResults({
  results,
  showRelevantSections = false,
}: ComplianceResultsProps) {
  if (!results || results.length === 0) {
    return <p className="text-sm text-gray-500 italic">No compliance results available</p>;
  }
  
  // Sort by addressed status (not addressed first)
  const sortedResults = [...results].sort((a, b) => {
    if (a.addressed === b.addressed) return 0;
    return a.addressed ? 1 : -1;
  });
  
  return (
    <div className="space-y-4">
      {sortedResults.map((result, index) => (
        <div 
          key={index} 
          className={`border rounded-md p-3 ${
            result.addressed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              {result.addressed ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className={`text-sm font-medium ${
                result.addressed ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.requirement}
              </p>
              
              <p className="text-xs text-gray-500 mt-1">
                Confidence: {Math.round(result.confidence * 100)}%
              </p>
              
              {showRelevantSections && result.relevantSection && (
                <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                  <p className="text-xs text-gray-600 italic">Relevant section:</p>
                  <p className="text-xs text-gray-800 mt-1">{result.relevantSection}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
