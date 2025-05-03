'use client';

import { useState, useEffect } from 'react';
import FormInput from '../../../components/FormInput';

interface FinancialProposalStepProps {
  formData: {
    financialProposal: {
      amount: number;
      currency: string;
      breakdown: {
        personnel: number;
        materials: number;
        travel: number;
        subcontracts: number;
        other: number;
      };
    };
  };
  updateFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function FinancialProposalStep({
  formData,
  updateFormData,
  errors,
}: FinancialProposalStepProps) {
  // Local state for breakdown values
  const [breakdown, setBreakdown] = useState({
    personnel: formData.financialProposal.breakdown.personnel,
    materials: formData.financialProposal.breakdown.materials,
    travel: formData.financialProposal.breakdown.travel,
    subcontracts: formData.financialProposal.breakdown.subcontracts,
    other: formData.financialProposal.breakdown.other,
  });
  
  // Calculate total from breakdown
  const totalBreakdown = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
  
  // Update total amount when breakdown changes
  useEffect(() => {
    updateFormData({
      financialProposal: {
        ...formData.financialProposal,
        amount: totalBreakdown,
        breakdown,
      },
    });
  }, [breakdown, totalBreakdown]);
  
  // Handle amount change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value) || 0;
    updateFormData({
      financialProposal: {
        ...formData.financialProposal,
        amount,
      },
    });
  };
  
  // Handle currency change
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({
      financialProposal: {
        ...formData.financialProposal,
        currency: e.target.value,
      },
    });
  };
  
  // Handle breakdown change
  const handleBreakdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    setBreakdown((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.financialProposal.currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Financial Proposal</h3>
        <p className="text-sm text-blue-700">
          Provide a detailed breakdown of your financial proposal. The total amount should match the sum of the individual cost categories.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Total Amount
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">
                {formData.financialProposal.currency === 'EUR' ? '€' : 
                 formData.financialProposal.currency === 'USD' ? '$' : 
                 formData.financialProposal.currency === 'ALL' ? 'L' : ''}
              </span>
            </div>
            <input
              type="number"
              name="amount"
              id="amount"
              className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm"
              placeholder="0.00"
              value={formData.financialProposal.amount}
              onChange={handleAmountChange}
              readOnly
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">
                {formData.financialProposal.currency}
              </span>
            </div>
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600 error-message">{errors.amount}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
            Currency
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            id="currency"
            name="currency"
            className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm"
            value={formData.financialProposal.currency}
            onChange={handleCurrencyChange}
          >
            <option value="EUR">EUR - Euro</option>
            <option value="USD">USD - US Dollar</option>
            <option value="ALL">ALL - Albanian Lek</option>
          </select>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Breakdown</h3>
        
        {errors.breakdown && (
          <div className="mb-4 p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-600 error-message">{errors.breakdown}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="personnel" className="block text-sm font-medium text-gray-700 mb-1">
              Personnel Costs
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {formData.financialProposal.currency === 'EUR' ? '€' : 
                   formData.financialProposal.currency === 'USD' ? '$' : 
                   formData.financialProposal.currency === 'ALL' ? 'L' : ''}
                </span>
              </div>
              <input
                type="number"
                name="personnel"
                id="personnel"
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm"
                placeholder="0.00"
                value={breakdown.personnel}
                onChange={handleBreakdownChange}
                min="0"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {formData.financialProposal.currency}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Salaries, benefits, and other personnel-related expenses
            </p>
          </div>
          
          <div>
            <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">
              Materials & Equipment
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {formData.financialProposal.currency === 'EUR' ? '€' : 
                   formData.financialProposal.currency === 'USD' ? '$' : 
                   formData.financialProposal.currency === 'ALL' ? 'L' : ''}
                </span>
              </div>
              <input
                type="number"
                name="materials"
                id="materials"
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm"
                placeholder="0.00"
                value={breakdown.materials}
                onChange={handleBreakdownChange}
                min="0"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {formData.financialProposal.currency}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Cost of materials, supplies, and equipment needed for the project
            </p>
          </div>
          
          <div>
            <label htmlFor="travel" className="block text-sm font-medium text-gray-700 mb-1">
              Travel & Accommodation
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {formData.financialProposal.currency === 'EUR' ? '€' : 
                   formData.financialProposal.currency === 'USD' ? '$' : 
                   formData.financialProposal.currency === 'ALL' ? 'L' : ''}
                </span>
              </div>
              <input
                type="number"
                name="travel"
                id="travel"
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm"
                placeholder="0.00"
                value={breakdown.travel}
                onChange={handleBreakdownChange}
                min="0"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {formData.financialProposal.currency}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Transportation, lodging, and per diem expenses
            </p>
          </div>
          
          <div>
            <label htmlFor="subcontracts" className="block text-sm font-medium text-gray-700 mb-1">
              Subcontracts
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {formData.financialProposal.currency === 'EUR' ? '€' : 
                   formData.financialProposal.currency === 'USD' ? '$' : 
                   formData.financialProposal.currency === 'ALL' ? 'L' : ''}
                </span>
              </div>
              <input
                type="number"
                name="subcontracts"
                id="subcontracts"
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm"
                placeholder="0.00"
                value={breakdown.subcontracts}
                onChange={handleBreakdownChange}
                min="0"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {formData.financialProposal.currency}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Costs for any subcontractors or consultants
            </p>
          </div>
          
          <div>
            <label htmlFor="other" className="block text-sm font-medium text-gray-700 mb-1">
              Other Costs
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {formData.financialProposal.currency === 'EUR' ? '€' : 
                   formData.financialProposal.currency === 'USD' ? '$' : 
                   formData.financialProposal.currency === 'ALL' ? 'L' : ''}
                </span>
              </div>
              <input
                type="number"
                name="other"
                id="other"
                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm"
                placeholder="0.00"
                value={breakdown.other}
                onChange={handleBreakdownChange}
                min="0"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {formData.financialProposal.currency}
                </span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Any other costs not covered in the categories above
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Total</h3>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(totalBreakdown)}
          </p>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          <p>
            This total should match your financial proposal document. Make sure all costs are included and accurately calculated.
          </p>
        </div>
      </div>
    </div>
  );
}
