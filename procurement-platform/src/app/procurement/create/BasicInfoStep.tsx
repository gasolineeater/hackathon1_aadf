'use client';

import { useState } from 'react';
import FormInput from '../../components/FormInput';
import MicroButton from '../../components/MicroButton';

interface BasicInfoStepProps {
  formData: {
    title: string;
    reference: string;
    description: string;
    category: string[];
    budget: {
      amount: number;
      currency: string;
    };
  };
  updateFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function BasicInfoStep({
  formData,
  updateFormData,
  errors,
}: BasicInfoStepProps) {
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };
  
  // Handle budget changes
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({
      budget: {
        ...formData.budget,
        [name]: name === 'amount' ? parseFloat(value) || 0 : value,
      },
    });
  };
  
  // Handle category changes
  const handleCategoryChange = (index: number, value: string) => {
    const updatedCategories = [...formData.category];
    updatedCategories[index] = value;
    updateFormData({ category: updatedCategories });
  };
  
  // Add new category
  const addCategory = () => {
    updateFormData({ category: [...formData.category, ''] });
  };
  
  // Remove category
  const removeCategory = (index: number) => {
    const updatedCategories = [...formData.category];
    updatedCategories.splice(index, 1);
    updateFormData({ category: updatedCategories.length ? updatedCategories : [''] });
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Basic Information</h3>
        <p className="text-sm text-blue-700">
          Provide the essential details about your tender. This information will be visible to all potential bidders.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="title"
          label="Tender Title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Enter tender title"
          error={errors.title}
          required
        />
        
        <FormInput
          id="reference"
          label="Reference Number"
          value={formData.reference}
          onChange={handleInputChange}
          placeholder="e.g., PROC-2023-001"
          error={errors.reference}
          required
          helpText="Unique identifier for this tender"
        />
      </div>
      
      <FormInput
        id="description"
        label="Description"
        type="textarea"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Provide a detailed description of the tender"
        error={errors.description}
        required
        rows={5}
      />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Categories
            <span className="text-red-500 ml-1">*</span>
          </label>
          <MicroButton
            variant="outline"
            size="sm"
            onClick={addCategory}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Add Category
          </MicroButton>
        </div>
        
        {errors.category && (
          <p className="mt-1 text-sm text-red-600 error-message">{errors.category}</p>
        )}
        
        {formData.category.map((category, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-grow">
              <input
                type="text"
                value={category}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                placeholder={`Category ${index + 1}`}
                className={`block w-full rounded-md shadow-sm focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm border-gray-300`}
              />
            </div>
            {formData.category.length > 1 && (
              <button
                type="button"
                onClick={() => removeCategory(index)}
                className="p-2 text-gray-400 hover:text-red-500"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            id="amount"
            label="Budget Amount"
            type="number"
            value={formData.budget.amount}
            onChange={handleBudgetChange}
            placeholder="Enter amount"
            error={errors.budget}
            required
            min={0}
            step={100}
          />
          
          <div className="mb-4">
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.budget.currency}
              onChange={handleBudgetChange}
              className="block w-full rounded-md shadow-sm focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm border-gray-300"
            >
              <option value="EUR">EUR - Euro</option>
              <option value="USD">USD - US Dollar</option>
              <option value="ALL">ALL - Albanian Lek</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
