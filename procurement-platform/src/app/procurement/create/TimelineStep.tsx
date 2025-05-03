'use client';

import { useState } from 'react';
import FormInput from '../../components/FormInput';

interface TimelineStepProps {
  formData: {
    timeline: {
      publicationDate: Date;
      submissionDeadline: Date;
      evaluationStartDate: Date;
      evaluationEndDate: Date;
    };
  };
  updateFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function TimelineStep({
  formData,
  updateFormData,
  errors,
}: TimelineStepProps) {
  // Format date for input
  const formatDateForInput = (date: Date): string => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };
  
  // Handle date changes
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({
      timeline: {
        ...formData.timeline,
        [name]: new Date(value),
      },
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Timeline Information</h3>
        <p className="text-sm text-blue-700">
          Set the key dates for your procurement process. These dates will determine the schedule for the entire tender.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="text-md font-medium text-gray-900 mb-4">Publication Phase</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="publicationDate"
              label="Publication Date"
              type="date"
              value={formatDateForInput(formData.timeline.publicationDate)}
              onChange={handleDateChange}
              error={errors.publicationDate}
              required
              helpText="When the tender will be published"
            />
            
            <FormInput
              id="submissionDeadline"
              label="Submission Deadline"
              type="date"
              value={formatDateForInput(formData.timeline.submissionDeadline)}
              onChange={handleDateChange}
              error={errors.submissionDeadline}
              required
              helpText="Last day for proposal submissions"
            />
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-4">Evaluation Phase</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="evaluationStartDate"
              label="Evaluation Start Date"
              type="date"
              value={formatDateForInput(formData.timeline.evaluationStartDate)}
              onChange={handleDateChange}
              error={errors.evaluationStartDate}
              required
              helpText="When proposal evaluation begins"
            />
            
            <FormInput
              id="evaluationEndDate"
              label="Evaluation End Date"
              type="date"
              value={formatDateForInput(formData.timeline.evaluationEndDate)}
              onChange={handleDateChange}
              error={errors.evaluationEndDate}
              required
              helpText="When evaluation is expected to complete"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md mt-6">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Timeline Summary</h3>
        
        <div className="relative">
          <div className="absolute left-4 inset-y-0 w-0.5 bg-gray-200"></div>
          
          <div className="relative pl-8 py-2">
            <div className="absolute left-0 rounded-full w-8 h-8 bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Publication Date</p>
              <p className="text-sm text-gray-500">
                {new Date(formData.timeline.publicationDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          
          <div className="relative pl-8 py-2">
            <div className="absolute left-0 rounded-full w-8 h-8 bg-green-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Submission Deadline</p>
              <p className="text-sm text-gray-500">
                {new Date(formData.timeline.submissionDeadline).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          
          <div className="relative pl-8 py-2">
            <div className="absolute left-0 rounded-full w-8 h-8 bg-yellow-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Evaluation Period</p>
              <p className="text-sm text-gray-500">
                {new Date(formData.timeline.evaluationStartDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {' to '}
                {new Date(formData.timeline.evaluationEndDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          
          <div className="relative pl-8 py-2">
            <div className="absolute left-0 rounded-full w-8 h-8 bg-purple-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Expected Award Date</p>
              <p className="text-sm text-gray-500">
                {new Date(formData.timeline.evaluationEndDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
