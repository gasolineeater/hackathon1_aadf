'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { useToast } from '@/app/context/ToastContext';

export default function CreateTenderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { isAdmin, isEvaluator } = useRoleAccess();
  const { showToast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    budget_range: {
      min: '',
      max: '',
      currency: 'EUR'
    },
    location: '',
    deadline: '',
    requirements: '',
    evaluation_criteria: ''
  });
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('budget_range.')) {
      const budgetField = name.split('.')[1];
      setFormData({
        ...formData,
        budget_range: {
          ...formData.budget_range,
          [budgetField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast({
        type: 'error',
        title: 'Authentication Error',
        message: 'You must be logged in to create a tender',
      });
      return;
    }
    
    if (!isAdmin && !isEvaluator) {
      showToast({
        type: 'error',
        title: 'Permission Error',
        message: 'You do not have permission to create tenders',
      });
      return;
    }
    
    // Validate form
    if (!formData.title || !formData.description || !formData.category || !formData.deadline) {
      showToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare data for API
      const apiData = {
        ...formData,
        requirements: formData.requirements ? JSON.parse(formData.requirements) : {},
        evaluation_criteria: formData.evaluation_criteria ? JSON.parse(formData.evaluation_criteria) : {},
        status: 'draft'
      };
      
      // Call API to create tender
      const response = await fetch('/api/tenders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create tender');
      }
      
      const tender = await response.json();
      
      showToast({
        type: 'success',
        title: 'Tender Created',
        message: 'The tender has been created successfully',
      });
      
      // Redirect to tender detail page
      router.push(`/tenders/${tender.id}`);
    } catch (error: any) {
      console.error('Error creating tender:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to create tender',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If not admin or evaluator, show access denied
  if (!isAdmin && !isEvaluator) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Access Denied</h3>
              <p className="mt-1 text-sm text-gray-500">
                You do not have permission to create tenders.
              </p>
              <div className="mt-6">
                <Link
                  href="/tenders"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483]"
                >
                  Back to Tenders
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/tenders"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tenders
          </Link>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h1 className="text-xl font-semibold text-gray-900">Create New Tender</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details below to create a new procurement tender
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Tender Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select a category</option>
                      <option value="IT Services">IT Services</option>
                      <option value="Construction">Construction</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Supplies">Supplies</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      id="location"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="col-span-1 sm:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Budget and Timeline */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Budget and Timeline</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="budget_range.min" className="block text-sm font-medium text-gray-700">
                      Minimum Budget
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                      <input
                        type="number"
                        name="budget_range.min"
                        id="budget_range.min"
                        className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                        placeholder="0.00"
                        value={formData.budget_range.min}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="budget_range.max" className="block text-sm font-medium text-gray-700">
                      Maximum Budget
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">€</span>
                      </div>
                      <input
                        type="number"
                        name="budget_range.max"
                        id="budget_range.max"
                        className="block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                        placeholder="0.00"
                        value={formData.budget_range.max}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="budget_range.currency" className="block text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <select
                      id="budget_range.currency"
                      name="budget_range.currency"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                      value={formData.budget_range.currency}
                      onChange={handleChange}
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="ALL">ALL (L)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                      Submission Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="deadline"
                      id="deadline"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                      value={formData.deadline}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Requirements and Evaluation Criteria */}
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Requirements and Evaluation</h2>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                      Requirements (JSON format)
                    </label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm font-mono"
                      placeholder='{"mandatory": [{"id": "req1", "description": "Project timeline"}, {"id": "req2", "description": "Budget breakdown"}], "optional": [{"id": "req3", "description": "Risk assessment"}]}'
                      value={formData.requirements}
                      onChange={handleChange}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter requirements in JSON format. This will be used for AI validation.
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="evaluation_criteria" className="block text-sm font-medium text-gray-700">
                      Evaluation Criteria (JSON format)
                    </label>
                    <textarea
                      id="evaluation_criteria"
                      name="evaluation_criteria"
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm font-mono"
                      placeholder='{"technical_approach": {"weight": 0.3, "description": "Technical approach and methodology"}, "experience": {"weight": 0.2, "description": "Experience and qualifications"}, "timeline": {"weight": 0.2, "description": "Project timeline"}, "cost": {"weight": 0.3, "description": "Cost and budget"}}'
                      value={formData.evaluation_criteria}
                      onChange={handleChange}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter evaluation criteria in JSON format. This will be used for AI-assisted evaluation.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3">
                <Link
                  href="/tenders"
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4]"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0056a4] hover:bg-[#004483] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Tender'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
