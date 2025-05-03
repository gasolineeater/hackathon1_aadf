'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CreateTenderPage() {
  const [formData, setFormData] = useState({
    title: '',
    reference: '',
    description: '',
    fullDescription: '',
    deadline: '',
    deadlineTime: '',
    ceilingFund: '',
    currency: 'USD',
    category: '',
    evaluationCriteria: [
      { name: 'Technical Approach', weight: 40, description: 'Methodology, work plan, and understanding of requirements' },
      { name: 'Experience & Qualifications', weight: 30, description: 'Previous similar projects and team qualifications' },
      { name: 'Financial Proposal', weight: 20, description: 'Cost-effectiveness and budget allocation' },
      { name: 'Timeline', weight: 10, description: 'Proposed schedule and ability to meet deadlines' },
    ],
    requiredDocuments: [
      { name: 'Technical Proposal', required: true },
      { name: 'Financial Proposal', required: true },
      { name: 'Company Profile', required: true },
      { name: 'Team CVs', required: false },
      { name: 'Similar Project References', required: false },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCriteriaChange = (index: number, field: string, value: string | number) => {
    const updatedCriteria = [...formData.evaluationCriteria];
    updatedCriteria[index] = {
      ...updatedCriteria[index],
      [field]: field === 'weight' ? Number(value) : value,
    };
    setFormData({
      ...formData,
      evaluationCriteria: updatedCriteria,
    });
  };

  const addCriteria = () => {
    setFormData({
      ...formData,
      evaluationCriteria: [
        ...formData.evaluationCriteria,
        { name: '', weight: 0, description: '' },
      ],
    });
  };

  const removeCriteria = (index: number) => {
    const updatedCriteria = [...formData.evaluationCriteria];
    updatedCriteria.splice(index, 1);
    setFormData({
      ...formData,
      evaluationCriteria: updatedCriteria,
    });
  };

  const handleDocumentChange = (index: number, field: string, value: string | boolean) => {
    const updatedDocuments = [...formData.requiredDocuments];
    updatedDocuments[index] = {
      ...updatedDocuments[index],
      [field]: field === 'required' ? value === 'true' : value,
    };
    setFormData({
      ...formData,
      requiredDocuments: updatedDocuments,
    });
  };

  const addDocument = () => {
    setFormData({
      ...formData,
      requiredDocuments: [
        ...formData.requiredDocuments,
        { name: '', required: false },
      ],
    });
  };

  const removeDocument = (index: number) => {
    const updatedDocuments = [...formData.requiredDocuments];
    updatedDocuments.splice(index, 1);
    setFormData({
      ...formData,
      requiredDocuments: updatedDocuments,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Form submitted:', formData);
    alert('Tender created successfully!');
    // Redirect to dashboard or tender list
  };

  const totalWeight = formData.evaluationCriteria.reduce((sum, criteria) => sum + criteria.weight, 0);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Tender</h1>
          <p className="text-gray-600">
            Fill in the details below to create a new tender. All fields marked with an asterisk (*) are required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Tender Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number *
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#00000"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description *
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  A brief description (max 150 characters) that will appear in the tenders list.
                </p>
              </div>

              <div>
                <label htmlFor="fullDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description *
                </label>
                <textarea
                  id="fullDescription"
                  name="fullDescription"
                  rows={5}
                  value={formData.fullDescription}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
                <p className="mt-1 text-xs text-gray-500">
                  Detailed description of the tender requirements and objectives.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline Date *
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="deadlineTime" className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline Time *
                  </label>
                  <input
                    type="time"
                    id="deadlineTime"
                    name="deadlineTime"
                    value={formData.deadlineTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Construction">Construction</option>
                    <option value="IT Services">IT Services</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Training">Training</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="ceilingFund" className="block text-sm font-medium text-gray-700 mb-1">
                    Ceiling Fund *
                  </label>
                  <input
                    type="text"
                    id="ceilingFund"
                    name="ceilingFund"
                    value={formData.ceilingFund}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 50,000"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Currency *
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="ALL">ALL (Albanian Lek)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Criteria */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Evaluation Criteria</h2>
            </div>
            <div className="p-6 space-y-6">
              {totalWeight !== 100 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Total weight must equal 100%. Current total: {totalWeight}%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {formData.evaluationCriteria.map((criteria, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-sm font-medium text-gray-900">Criteria #{index + 1}</h3>
                      {formData.evaluationCriteria.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCriteria(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor={`criteria-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          id={`criteria-name-${index}`}
                          value={criteria.name}
                          onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`criteria-weight-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Weight (%) *
                        </label>
                        <input
                          type="number"
                          id={`criteria-weight-${index}`}
                          value={criteria.weight}
                          onChange={(e) => handleCriteriaChange(index, 'weight', e.target.value)}
                          min="0"
                          max="100"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label htmlFor={`criteria-description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        id={`criteria-description-${index}`}
                        value={criteria.description}
                        onChange={(e) => handleCriteriaChange(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addCriteria}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  + Add Criteria
                </button>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Required Documents</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                {formData.requiredDocuments.map((document, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex-grow">
                      <input
                        type="text"
                        value={document.name}
                        onChange={(e) => handleDocumentChange(index, 'name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Document name"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="inline-flex items-center mr-4">
                        <input
                          type="radio"
                          name={`required-${index}`}
                          value="true"
                          checked={document.required}
                          onChange={(e) => handleDocumentChange(index, 'required', e.target.value)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Required</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`required-${index}`}
                          value="false"
                          checked={!document.required}
                          onChange={(e) => handleDocumentChange(index, 'required', e.target.value)}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Optional</span>
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={addDocument}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  + Add Document
                </button>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Tender
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
