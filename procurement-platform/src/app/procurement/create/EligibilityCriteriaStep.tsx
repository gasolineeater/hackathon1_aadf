'use client';

import { useState } from 'react';
import MicroButton from '../../components/MicroButton';
import { motion, AnimatePresence } from 'framer-motion';

interface EligibilityCriteriaStepProps {
  formData: {
    eligibilityCriteria: string[];
  };
  updateFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function EligibilityCriteriaStep({
  formData,
  updateFormData,
  errors,
}: EligibilityCriteriaStepProps) {
  // Handle criteria changes
  const handleCriterionChange = (index: number, value: string) => {
    const updatedCriteria = [...formData.eligibilityCriteria];
    updatedCriteria[index] = value;
    updateFormData({ eligibilityCriteria: updatedCriteria });
  };
  
  // Add new criterion
  const addCriterion = () => {
    updateFormData({ eligibilityCriteria: [...formData.eligibilityCriteria, ''] });
  };
  
  // Remove criterion
  const removeCriterion = (index: number) => {
    const updatedCriteria = [...formData.eligibilityCriteria];
    updatedCriteria.splice(index, 1);
    updateFormData({ eligibilityCriteria: updatedCriteria.length ? updatedCriteria : [''] });
  };
  
  // Move criterion up
  const moveCriterionUp = (index: number) => {
    if (index === 0) return;
    
    const updatedCriteria = [...formData.eligibilityCriteria];
    const temp = updatedCriteria[index];
    updatedCriteria[index] = updatedCriteria[index - 1];
    updatedCriteria[index - 1] = temp;
    
    updateFormData({ eligibilityCriteria: updatedCriteria });
  };
  
  // Move criterion down
  const moveCriterionDown = (index: number) => {
    if (index === formData.eligibilityCriteria.length - 1) return;
    
    const updatedCriteria = [...formData.eligibilityCriteria];
    const temp = updatedCriteria[index];
    updatedCriteria[index] = updatedCriteria[index + 1];
    updatedCriteria[index + 1] = temp;
    
    updateFormData({ eligibilityCriteria: updatedCriteria });
  };
  
  // Common eligibility criteria templates
  const criteriaTemplates = [
    'Registered business entity with valid business registration',
    'Minimum 3 years of experience in similar projects',
    'No conflicts of interest with AADF or its partners',
    'Financial stability and adequate resources',
    'Compliance with tax obligations',
    'Professional liability insurance',
    'Qualified personnel with relevant certifications',
    'No record of legal proceedings or bankruptcy',
  ];
  
  // Add template criterion
  const addTemplateCriterion = (criterion: string) => {
    if (!formData.eligibilityCriteria.includes(criterion)) {
      updateFormData({ eligibilityCriteria: [...formData.eligibilityCriteria, criterion] });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Eligibility Criteria</h3>
        <p className="text-sm text-blue-700">
          Define the requirements that vendors must meet to be eligible to participate in this tender.
          These criteria will be used to pre-qualify vendors before their proposals are evaluated.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Eligibility Requirements
            <span className="text-red-500 ml-1">*</span>
          </label>
          <MicroButton
            variant="primary"
            size="sm"
            onClick={addCriterion}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Add Criterion
          </MicroButton>
        </div>
        
        {errors.eligibilityCriteria && (
          <p className="mt-1 text-sm text-red-600 error-message">{errors.eligibilityCriteria}</p>
        )}
        
        <AnimatePresence>
          {formData.eligibilityCriteria.map((criterion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.2 }}
              className="flex items-start space-x-2 bg-white p-3 border border-gray-200 rounded-md"
            >
              <div className="flex-shrink-0 pt-1">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                  {index + 1}
                </span>
              </div>
              <div className="flex-grow">
                <textarea
                  value={criterion}
                  onChange={(e) => handleCriterionChange(index, e.target.value)}
                  placeholder={`Criterion ${index + 1}`}
                  className="block w-full rounded-md shadow-sm focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm border-gray-300"
                  rows={2}
                />
              </div>
              <div className="flex-shrink-0 flex flex-col space-y-1">
                <button
                  type="button"
                  onClick={() => moveCriterionUp(index)}
                  disabled={index === 0}
                  className={`p-1 rounded ${
                    index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveCriterionDown(index)}
                  disabled={index === formData.eligibilityCriteria.length - 1}
                  className={`p-1 rounded ${
                    index === formData.eligibilityCriteria.length - 1
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => removeCriterion(index)}
                  className="p-1 rounded text-red-500 hover:bg-red-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-md font-medium text-gray-900 mb-4">Common Criteria Templates</h3>
        <p className="text-sm text-gray-500 mb-4">
          Click on any of these common criteria to add them to your list.
        </p>
        
        <div className="flex flex-wrap gap-2">
          {criteriaTemplates.map((template, index) => (
            <button
              key={index}
              type="button"
              onClick={() => addTemplateCriterion(template)}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {template.length > 30 ? template.substring(0, 30) + '...' : template}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
