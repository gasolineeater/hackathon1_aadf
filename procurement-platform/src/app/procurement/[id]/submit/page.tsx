'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TenderService, ProposalService } from '../../../services/procurement.service';
import { Tender, Proposal, Document, DocumentType } from '../../../types/procurement';
import MicroButton from '../../../components/MicroButton';
import { useToast } from '../../../context/ToastContext';
import StepIndicator from '../../../components/StepIndicator';
import VendorInfoStep from './VendorInfoStep';
import TechnicalProposalStep from './TechnicalProposalStep';
import FinancialProposalStep from './FinancialProposalStep';
import DocumentsStep from './DocumentsStep';

export default function SubmitProposalPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  // State for tender data
  const [tender, setTender] = useState<Tender | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state management
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Vendor Information
    vendorName: '',
    vendorId: 'vendor-1', // In a real app, this would be the current user's ID
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    companyProfile: '',

    // Technical Proposal
    technicalProposal: '',
    methodology: '',
    timeline: '',
    teamComposition: '',
    qualityAssurance: '',

    // Financial Proposal
    financialProposal: {
      amount: 0,
      currency: 'EUR',
      breakdown: {
        personnel: 0,
        materials: 0,
        travel: 0,
        subcontracts: 0,
        other: 0,
      },
    },

    // Documents
    documents: [] as Document[],
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Total number of steps in the form
  const totalSteps = 4;

  // Step titles for the progress indicator
  const stepTitles = [
    'Vendor Information',
    'Technical Proposal',
    'Financial Proposal',
    'Documents',
  ];

  // Load tender data
  useEffect(() => {
    const loadTenderData = async () => {
      setIsLoading(true);
      try {
        const tenderId = params.id as string;
        const tenderData = TenderService.getTenderById(tenderId);

        if (!tenderData) {
          showToast('Tender not found', 'error');
          router.push('/procurement');
          return;
        }

        // Check if tender is published and open for submissions
        if (tenderData.status !== 'published') {
          showToast('This tender is not currently accepting proposals', 'error');
          router.push(`/procurement/${tenderId}`);
          return;
        }

        // Check if submission deadline has passed
        const now = new Date();
        const deadline = new Date(tenderData.timeline.submissionDeadline);
        if (now > deadline) {
          showToast('The submission deadline for this tender has passed', 'error');
          router.push(`/procurement/${tenderId}`);
          return;
        }

        setTender(tenderData);
      } catch (error) {
        console.error('Error loading tender data:', error);
        showToast('Failed to load tender data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadTenderData();
  }, [params.id, router, showToast]);

  // Update form data
  const updateFormData = (newData: any) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // Handle next step
  const handleNextStep = () => {
    // Validate current step
    const currentStepErrors = validateStep(currentStep);

    if (Object.keys(currentStepErrors).length === 0) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
      setErrors({});
    } else {
      setErrors(currentStepErrors);
      // Scroll to the first error
      const firstErrorElement = document.querySelector('.error-message');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setErrors({});
  };

  // Validate current step
  const validateStep = (step: number): Record<string, string> => {
    const stepErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Vendor Information
        if (!formData.vendorName.trim()) {
          stepErrors.vendorName = 'Vendor name is required';
        }
        if (!formData.contactPerson.trim()) {
          stepErrors.contactPerson = 'Contact person is required';
        }
        if (!formData.contactEmail.trim()) {
          stepErrors.contactEmail = 'Contact email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.contactEmail)) {
          stepErrors.contactEmail = 'Invalid email format';
        }
        if (!formData.contactPhone.trim()) {
          stepErrors.contactPhone = 'Contact phone is required';
        }
        if (!formData.companyProfile.trim()) {
          stepErrors.companyProfile = 'Company profile is required';
        }
        break;

      case 2: // Technical Proposal
        if (!formData.technicalProposal.trim()) {
          stepErrors.technicalProposal = 'Technical proposal is required';
        }
        if (!formData.methodology.trim()) {
          stepErrors.methodology = 'Methodology is required';
        }
        if (!formData.timeline.trim()) {
          stepErrors.timeline = 'Timeline is required';
        }
        if (!formData.teamComposition.trim()) {
          stepErrors.teamComposition = 'Team composition is required';
        }
        break;

      case 3: // Financial Proposal
        if (formData.financialProposal.amount <= 0) {
          stepErrors.amount = 'Amount must be greater than zero';
        }

        // Check if budget breakdown adds up to total amount
        const { personnel, materials, travel, subcontracts, other } = formData.financialProposal.breakdown;
        const totalBreakdown = personnel + materials + travel + subcontracts + other;

        if (Math.abs(totalBreakdown - formData.financialProposal.amount) > 0.01) {
          stepErrors.breakdown = `Budget breakdown total (${totalBreakdown}) does not match the total amount (${formData.financialProposal.amount})`;
        }
        break;

      case 4: // Documents
        // Check if required document types are present
        const requiredTypes: DocumentType[] = ['proposal', 'financial_offer', 'company_profile'];
        const missingTypes: DocumentType[] = [];

        requiredTypes.forEach(type => {
          if (!formData.documents.some(doc => doc.type === type)) {
            missingTypes.push(type);
          }
        });

        if (missingTypes.length > 0) {
          stepErrors.documents = `Missing required documents: ${missingTypes.map(type => type.replace('_', ' ')).join(', ')}`;
        }
        break;
    }

    return stepErrors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate all steps
    let allErrors: Record<string, string> = {};

    for (let step = 1; step <= totalSteps; step++) {
      const stepErrors = validateStep(step);
      allErrors = { ...allErrors, ...stepErrors };
    }

    if (Object.keys(allErrors).length === 0 && tender) {
      setIsSubmitting(true);

      try {
        // Create new proposal
        const newProposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'> = {
          tenderId: tender.id,
          vendorId: formData.vendorId,
          vendorName: formData.vendorName,
          status: 'submitted',
          submissionDate: new Date(),
          technicalProposal: formData.technicalProposal,
          financialProposal: formData.financialProposal,
          documents: formData.documents,
        };

        const createdProposal = ProposalService.createProposal(newProposal);

        showToast('Proposal submitted successfully', 'success');
        router.push(`/procurement/${tender.id}`);
      } catch (error) {
        console.error('Error submitting proposal:', error);
        showToast('Failed to submit proposal. Please try again.', 'error');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setErrors(allErrors);
      // Find the first step with errors
      for (let step = 1; step <= totalSteps; step++) {
        const stepErrors = validateStep(step);
        if (Object.keys(stepErrors).length > 0) {
          setCurrentStep(step);
          break;
        }
      }

      // Scroll to the first error
      const firstErrorElement = document.querySelector('.error-message');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-[#0056a4] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-gray-600">Loading tender details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tender Not Found</h2>
            <p className="text-gray-500 mb-6">The tender you are looking for does not exist or has been removed.</p>
            <MicroButton href="/procurement" variant="primary">
              Back to Procurement
            </MicroButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Submit Proposal</h1>
            <p className="mt-1 text-sm text-gray-500">
              For tender: {tender.title}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href={`/procurement/${tender.id}`}
              className="inline-flex items-center text-sm font-medium text-[#0056a4] hover:text-[#004483]"
            >
              <svg className="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tender
            </Link>
          </div>
        </div>

        {/* Tender Summary */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Tender Summary</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Reference</dt>
                <dd className="mt-1 text-sm text-gray-900">{tender.reference}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Submission Deadline</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(tender.timeline.submissionDeadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{tender.description}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Step Indicator */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <StepIndicator
              steps={stepTitles}
              currentStep={currentStep}
              onStepClick={(step) => setCurrentStep(step)}
              allowNavigation={true}
            />
          </div>

          {/* Form Content */}
          <div className="px-4 py-5 sm:p-6">
            {currentStep === 1 && (
              <VendorInfoStep
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 2 && (
              <TechnicalProposalStep
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 3 && (
              <FinancialProposalStep
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 4 && (
              <DocumentsStep
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
              />
            )}
          </div>

          {/* Form Actions */}
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between">
            <MicroButton
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1 || isSubmitting}
            >
              Previous
            </MicroButton>

            {currentStep < totalSteps ? (
              <MicroButton
                variant="primary"
                onClick={handleNextStep}
                disabled={isSubmitting}
              >
                Next
              </MicroButton>
            ) : (
              <MicroButton
                variant="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit Proposal
              </MicroButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
