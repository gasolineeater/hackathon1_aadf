'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateTenderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'IT Services',
    budget: '',
    deadline: '',
    requirements: '',
    evaluationCriteria: [
      { name: 'Technical approach', weight: 40 },
      { name: 'Experience and qualifications', weight: 30 },
      { name: 'Cost', weight: 20 },
      { name: 'Timeline', weight: 10 }
    ]
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleCriteriaChange = (index: number, field: string, value: string | number) => {
    const updatedCriteria = [...formData.evaluationCriteria];
    updatedCriteria[index] = {
      ...updatedCriteria[index],
      [field]: field === 'weight' ? Number(value) : value
    };
    
    setFormData({
      ...formData,
      evaluationCriteria: updatedCriteria
    });
  };
  
  const addCriterion = () => {
    setFormData({
      ...formData,
      evaluationCriteria: [
        ...formData.evaluationCriteria,
        { name: '', weight: 0 }
      ]
    });
  };
  
  const removeCriterion = (index: number) => {
    const updatedCriteria = [...formData.evaluationCriteria];
    updatedCriteria.splice(index, 1);
    
    setFormData({
      ...formData,
      evaluationCriteria: updatedCriteria
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, we would submit to an API
      // For demo purposes, we'll just simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to the tenders list
      router.push('/admin/tenders');
    } catch (error) {
      console.error('Error creating tender:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculate total weight
  const totalWeight = formData.evaluationCriteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin/tenders"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tenders
          </Link>
        </div>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Tender</h1>
          <p className="mt-1 text-sm text-gray-500">
            Publish a new tender for vendors to submit proposals
          </p>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Tender Details</h2>
            <p className="mt-1 text-sm text-indigo-600">
              Fill in the details of the tender you want to publish
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Tender Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g. IT Infrastructure Upgrade"
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
                    value={formData.category}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="IT Services">IT Services</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Construction">Construction</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Training">Training</option>
                    <option value="Research">Research</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                    Budget (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="budget"
                    id="budget"
                    required
                    min="0"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g. 150000"
                  />
                </div>
                
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                    Submission Deadline <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    id="deadline"
                    required
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Provide a detailed description of the tender"
                />
              </div>
              
              {/* Requirements */}
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                  Requirements <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  Enter each requirement on a new line
                </p>
                <textarea
                  id="requirements"
                  name="requirements"
                  rows={5}
                  required
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g.&#10;Cloud-based solution&#10;Integration with existing systems&#10;Mobile-friendly interfaces&#10;Data migration from legacy systems&#10;Security compliance with industry standards"
                />
              </div>
              
              {/* Evaluation Criteria */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Evaluation Criteria <span className="text-red-500">*</span>
                  </label>
                  <span className={`text-sm ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
                    Total Weight: {totalWeight}% {totalWeight !== 100 && '(should be 100%)'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {formData.evaluationCriteria.map((criterion, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={criterion.name}
                        onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Criterion name"
                        required
                      />
                      <div className="flex items-center w-32">
                        <input
                          type="number"
                          value={criterion.weight}
                          onChange={(e) => handleCriteriaChange(index, 'weight', e.target.value)}
                          className="w-16 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          min="0"
                          max="100"
                          required
                        />
                        <span className="ml-1 text-gray-500">%</span>
                      </div>
                      {formData.evaluationCriteria.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCriterion(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={addCriterion}
                  className="mt-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Criterion
                </button>
              </div>
              
              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tender Documents (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOCX, XLSX up to 10MB each</p>
                  </div>
                </div>
              </div>
              
              {/* AI-Assisted Features */}
              <div className="bg-indigo-50 p-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-indigo-800">AI-Assisted Tender Creation</h3>
                    <div className="mt-2 text-sm text-indigo-700">
                      <p>Our AI will:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Analyze your tender for completeness</li>
                        <li>Suggest improvements to requirements</li>
                        <li>Recommend evaluation criteria weights</li>
                        <li>Identify potential vendors based on tender requirements</li>
                      </ul>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50"
                      >
                        Run AI Analysis
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || totalWeight !== 100}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isSubmitting || totalWeight !== 100
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    'Publish Tender'
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
