'use client';

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface BudgetComplianceProps {
  budgetCompliance: {
    withinBudget: boolean;
    proposedAmount?: number;
    difference?: number;
    percentageDifference?: number;
  };
  budgetConstraint?: {
    amount?: number;
    range?: {
      min: number;
      max: number;
    };
  };
  currency?: string;
}

export default function BudgetCompliance({
  budgetCompliance,
  budgetConstraint,
  currency = 'USD',
}: BudgetComplianceProps) {
  if (!budgetCompliance) {
    return <p className="text-sm text-gray-500 italic">No budget compliance information available</p>;
  }
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Get budget constraint text
  const getBudgetConstraintText = () => {
    if (budgetConstraint?.amount) {
      return formatCurrency(budgetConstraint.amount);
    }
    
    if (budgetConstraint?.range) {
      return `${formatCurrency(budgetConstraint.range.min)} - ${formatCurrency(budgetConstraint.range.max)}`;
    }
    
    return 'Not specified';
  };
  
  return (
    <div className={`border rounded-md p-4 ${
      budgetCompliance.withinBudget ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
    }`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {budgetCompliance.withinBudget ? (
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
          ) : (
            <XCircleIcon className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${
            budgetCompliance.withinBudget ? 'text-green-800' : 'text-red-800'
          }`}>
            {budgetCompliance.withinBudget 
              ? 'Proposal is within budget constraints' 
              : 'Proposal exceeds budget constraints'}
          </p>
          
          {budgetConstraint && (
            <p className="text-xs text-gray-600 mt-1">
              Budget constraint: {getBudgetConstraintText()}
            </p>
          )}
          
          {budgetCompliance.proposedAmount !== undefined && (
            <p className="text-sm font-medium mt-2">
              Proposed amount: {formatCurrency(budgetCompliance.proposedAmount)}
            </p>
          )}
          
          {budgetCompliance.difference !== undefined && (
            <p className={`text-xs mt-1 ${
              budgetCompliance.difference >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {budgetCompliance.difference >= 0 
                ? `${formatCurrency(budgetCompliance.difference)} under budget` 
                : `${formatCurrency(Math.abs(budgetCompliance.difference))} over budget`}
              {budgetCompliance.percentageDifference !== undefined && 
                ` (${Math.abs(budgetCompliance.percentageDifference)}%)`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
