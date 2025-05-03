'use client';

import { useState } from 'react';
import FormInput from '../../../components/FormInput';

interface VendorInfoStepProps {
  formData: {
    vendorName: string;
    contactPerson: string;
    contactEmail: string;
    contactPhone: string;
    companyProfile: string;
  };
  updateFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function VendorInfoStep({
  formData,
  updateFormData,
  errors,
}: VendorInfoStepProps) {
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Vendor Information</h3>
        <p className="text-sm text-blue-700">
          Provide information about your company and contact details. This information will be used for communication regarding your proposal.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="vendorName"
          label="Company/Vendor Name"
          value={formData.vendorName}
          onChange={handleInputChange}
          placeholder="Enter your company name"
          error={errors.vendorName}
          required
        />
        
        <FormInput
          id="contactPerson"
          label="Contact Person"
          value={formData.contactPerson}
          onChange={handleInputChange}
          placeholder="Full name of primary contact"
          error={errors.contactPerson}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          id="contactEmail"
          label="Email Address"
          type="email"
          value={formData.contactEmail}
          onChange={handleInputChange}
          placeholder="email@example.com"
          error={errors.contactEmail}
          required
        />
        
        <FormInput
          id="contactPhone"
          label="Phone Number"
          value={formData.contactPhone}
          onChange={handleInputChange}
          placeholder="+355 XX XXX XXXX"
          error={errors.contactPhone}
          required
        />
      </div>
      
      <FormInput
        id="companyProfile"
        label="Company Profile"
        type="textarea"
        value={formData.companyProfile}
        onChange={handleInputChange}
        placeholder="Provide a brief description of your company, including your experience, expertise, and qualifications relevant to this tender."
        error={errors.companyProfile}
        required
        rows={6}
      />
      
      <div className="bg-yellow-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                All information provided will be kept confidential and used only for the purpose of evaluating your proposal.
                Make sure all contact information is accurate as this will be used for all communications regarding your proposal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
