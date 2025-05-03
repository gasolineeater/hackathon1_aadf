'use client';

import { useState } from 'react';
import MicroButton from '../../components/MicroButton';
import FormInput from '../../components/FormInput';
import { motion, AnimatePresence } from 'framer-motion';

interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  minScore: number;
  maxScore: number;
  scoringGuidelines?: string;
}

interface EvaluationCriteriaStepProps {
  formData: {
    evaluationCriteria: EvaluationCriterion[];
  };
  updateFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function EvaluationCriteriaStep({
  formData,
  updateFormData,
  errors,
}: EvaluationCriteriaStepProps) {
  // Calculate total weight
  const totalWeight = formData.evaluationCriteria.reduce(
    (sum, criterion) => sum + criterion.weight,
    0
  );
  
  // Handle criterion change
  const handleCriterionChange = (index: number, field: string, value: any) => {
    const updatedCriteria = [...formData.evaluationCriteria];
    
    // Convert numeric values
    if (['weight', 'minScore', 'maxScore'].includes(field)) {
      value = parseFloat(value) || 0;
    }
    
    updatedCriteria[index] = {
      ...updatedCriteria[index],
      [field]: value,
    };
    
    updateFormData({ evaluationCriteria: updatedCriteria });
  };
  
  // Add new criterion
  const addCriterion = () => {
    const newCriterion: EvaluationCriterion = {
      id: `criterion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      description: '',
      weight: 0,
      minScore: 0,
      maxScore: 10,
      scoringGuidelines: '',
    };
    
    updateFormData({
      evaluationCriteria: [...formData.evaluationCriteria, newCriterion],
    });
  };
  
  // Remove criterion
  const removeCriterion = (index: number) => {
    const updatedCriteria = [...formData.evaluationCriteria];
    updatedCriteria.splice(index, 1);
    
    // Ensure at least one criterion exists
    if (updatedCriteria.length === 0) {
      updatedCriteria.push({
        id: `criterion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: '',
        description: '',
        weight: 0,
        minScore: 0,
        maxScore: 10,
        scoringGuidelines: '',
      });
    }
    
    updateFormData({ evaluationCriteria: updatedCriteria });
  };
  
  // Distribute weights evenly
  const distributeWeightsEvenly = () => {
    const count = formData.evaluationCriteria.length;
    const evenWeight = Math.floor(100 / count);
    const remainder = 100 - (evenWeight * count);
    
    const updatedCriteria = formData.evaluationCriteria.map((criterion, index) => ({
      ...criterion,
      weight: evenWeight + (index === 0 ? remainder : 0),
    }));
    
    updateFormData({ evaluationCriteria: updatedCriteria });
  };
  
  // Common evaluation criteria templates
  const criteriaTemplates = [
    {
      name: 'Technical Approach',
      description: 'Assessment of the proposed technical methodology and approach',
      weight: 30,
      minScore: 0,
      maxScore: 10,
      scoringGuidelines: '0-3: Poor, 4-6: Satisfactory, 7-8: Good, 9-10: Excellent',
    },
    {
      name: 'Experience',
      description: 'Relevant experience in similar projects',
      weight: 25,
      minScore: 0,
      maxScore: 10,
      scoringGuidelines: '0-3: Limited experience, 4-6: Moderate experience, 7-10: Extensive experience',
    },
    {
      name: 'Price',
      description: 'Competitiveness of the financial proposal',
      weight: 30,
      minScore: 0,
      maxScore: 10,
      scoringGuidelines: 'Lowest price gets 10 points, others scored proportionally',
    },
    {
      name: 'Team Qualifications',
      description: 'Qualifications and experience of the proposed team members',
      weight: 15,
      minScore: 0,
      maxScore: 10,
      scoringGuidelines: 'Based on CVs, certifications, and relevant experience',
    },
  ];
  
  // Add template criterion
  const addTemplateCriterion = (template: any) => {
    const newCriterion: EvaluationCriterion = {
      id: `criterion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: template.name,
      description: template.description,
      weight: template.weight,
      minScore: template.minScore,
      maxScore: template.maxScore,
      scoringGuidelines: template.scoringGuidelines,
    };
    
    updateFormData({
      evaluationCriteria: [...formData.evaluationCriteria, newCriterion],
    });
  };
  
  // Use template set
  const useTemplateSet = () => {
    // Calculate weights to ensure they sum to 100%
    const totalTemplateWeight = criteriaTemplates.reduce((sum, t) => sum + t.weight, 0);
    const scaleFactor = 100 / totalTemplateWeight;
    
    const newCriteria = criteriaTemplates.map((template) => ({
      id: `criterion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: template.name,
      description: template.description,
      weight: Math.round(template.weight * scaleFactor),
      minScore: template.minScore,
      maxScore: template.maxScore,
      scoringGuidelines: template.scoringGuidelines,
    }));
    
    // Adjust the first criterion to ensure total is exactly 100%
    const newTotal = newCriteria.reduce((sum, c) => sum + c.weight, 0);
    if (newTotal !== 100 && newCriteria.length > 0) {
      newCriteria[0].weight += (100 - newTotal);
    }
    
    updateFormData({ evaluationCriteria: newCriteria });
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Evaluation Criteria</h3>
        <p className="text-sm text-blue-700">
          Define the criteria that will be used to evaluate and score proposals.
          The weights should add up to 100%.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-md font-medium text-gray-900">Criteria List</h3>
          <p className="text-sm text-gray-500">
            Total weight: <span className={totalWeight === 100 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
              {totalWeight}%
            </span>
            {totalWeight !== 100 && ' (should be 100%)'}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <MicroButton
            variant="outline"
            size="sm"
            onClick={distributeWeightsEvenly}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            }
          >
            Distribute Evenly
          </MicroButton>
          
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
      </div>
      
      {errors.evaluationCriteria && (
        <p className="mt-1 text-sm text-red-600 error-message">{errors.evaluationCriteria}</p>
      )}
      
      {errors.totalWeight && (
        <p className="mt-1 text-sm text-red-600 error-message">{errors.totalWeight}</p>
      )}
      
      <AnimatePresence>
        {formData.evaluationCriteria.map((criterion, index) => (
          <motion.div
            key={criterion.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.2 }}
            className="bg-white p-4 border border-gray-200 rounded-md mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mr-2">
                  {index + 1}
                </span>
                <h4 className="text-md font-medium text-gray-900">
                  {criterion.name || `Criterion ${index + 1}`}
                </h4>
              </div>
              
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormInput
                id={`criterion_${index}_name`}
                label="Criterion Name"
                value={criterion.name}
                onChange={(e) => handleCriterionChange(index, 'name', e.target.value)}
                placeholder="e.g., Technical Approach"
                error={errors[`criterion_${index}_name`]}
                required
              />
              
              <FormInput
                id={`criterion_${index}_weight`}
                label="Weight (%)"
                type="number"
                value={criterion.weight}
                onChange={(e) => handleCriterionChange(index, 'weight', e.target.value)}
                placeholder="Enter weight percentage"
                error={errors[`criterion_${index}_weight`]}
                required
                min={0}
                max={100}
                step={1}
              />
            </div>
            
            <FormInput
              id={`criterion_${index}_description`}
              label="Description"
              type="textarea"
              value={criterion.description}
              onChange={(e) => handleCriterionChange(index, 'description', e.target.value)}
              placeholder="Describe what this criterion evaluates"
              error={errors[`criterion_${index}_description`]}
              required
              rows={2}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormInput
                id={`criterion_${index}_minScore`}
                label="Minimum Score"
                type="number"
                value={criterion.minScore}
                onChange={(e) => handleCriterionChange(index, 'minScore', e.target.value)}
                error={errors[`criterion_${index}_score`]}
                required
                min={0}
                step={1}
              />
              
              <FormInput
                id={`criterion_${index}_maxScore`}
                label="Maximum Score"
                type="number"
                value={criterion.maxScore}
                onChange={(e) => handleCriterionChange(index, 'maxScore', e.target.value)}
                error={errors[`criterion_${index}_score`]}
                required
                min={1}
                step={1}
              />
            </div>
            
            <FormInput
              id={`criterion_${index}_scoringGuidelines`}
              label="Scoring Guidelines"
              type="textarea"
              value={criterion.scoringGuidelines || ''}
              onChange={(e) => handleCriterionChange(index, 'scoringGuidelines', e.target.value)}
              placeholder="Optional: Provide guidelines for how to score this criterion"
              rows={2}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-md font-medium text-gray-900 mb-4">Templates</h3>
        
        <div className="mb-4">
          <MicroButton
            variant="secondary"
            onClick={useTemplateSet}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          >
            Use Standard Criteria Set
          </MicroButton>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criteriaTemplates.map((template, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md p-3 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
              onClick={() => addTemplateCriterion(template)}
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                <span className="text-sm text-blue-600 font-medium">{template.weight}%</span>
              </div>
              <p className="text-xs text-gray-500">{template.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
