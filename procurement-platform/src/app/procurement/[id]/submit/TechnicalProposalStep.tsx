'use client';

import { useState } from 'react';
import FormInput from '../../../components/FormInput';

interface TechnicalProposalStepProps {
  formData: {
    technicalProposal: string;
    methodology: string;
    timeline: string;
    teamComposition: string;
    qualityAssurance: string;
  };
  updateFormData: (data: any) => void;
  errors: Record<string, string>;
}

export default function TechnicalProposalStep({
  formData,
  updateFormData,
  errors,
}: TechnicalProposalStepProps) {
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-1">Technical Proposal</h3>
        <p className="text-sm text-blue-700">
          Describe your approach to fulfilling the requirements of this tender. Be specific about your methodology, timeline, and team composition.
        </p>
      </div>
      
      <FormInput
        id="technicalProposal"
        label="Technical Approach"
        type="textarea"
        value={formData.technicalProposal}
        onChange={handleInputChange}
        placeholder="Provide a comprehensive overview of your technical approach to meeting the requirements of this tender."
        error={errors.technicalProposal}
        required
        rows={6}
      />
      
      <FormInput
        id="methodology"
        label="Methodology"
        type="textarea"
        value={formData.methodology}
        onChange={handleInputChange}
        placeholder="Describe the specific methodologies, frameworks, or approaches you will use to deliver the required services or products."
        error={errors.methodology}
        required
        rows={4}
      />
      
      <FormInput
        id="timeline"
        label="Implementation Timeline"
        type="textarea"
        value={formData.timeline}
        onChange={handleInputChange}
        placeholder="Outline your proposed timeline for implementation, including key milestones and deliverables."
        error={errors.timeline}
        required
        rows={4}
      />
      
      <FormInput
        id="teamComposition"
        label="Team Composition"
        type="textarea"
        value={formData.teamComposition}
        onChange={handleInputChange}
        placeholder="Describe the team that will work on this project, including their roles, qualifications, and relevant experience."
        error={errors.teamComposition}
        required
        rows={4}
      />
      
      <FormInput
        id="qualityAssurance"
        label="Quality Assurance"
        type="textarea"
        value={formData.qualityAssurance}
        onChange={handleInputChange}
        placeholder="Explain your quality assurance processes and how you will ensure high-quality deliverables."
        error={errors.qualityAssurance}
        rows={4}
      />
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-800 mb-2">Evaluation Criteria</h3>
        <p className="text-sm text-gray-600 mb-4">
          Your technical proposal will be evaluated based on the following criteria:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Understanding of the requirements</li>
          <li>Appropriateness of the proposed methodology</li>
          <li>Feasibility of the implementation timeline</li>
          <li>Qualifications and experience of the proposed team</li>
          <li>Quality assurance measures</li>
        </ul>
      </div>
    </div>
  );
}
