'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TenderService } from '../../services/procurement.service';
import { Tender, TenderStatus } from '../../types/procurement';
import MicroButton from '../../components/MicroButton';
import { useToast } from '../../context/ToastContext';
import StepIndicator from '../../components/StepIndicator';
import BasicInfoStep from './BasicInfoStep';
import TimelineStep from './TimelineStep';
import EligibilityCriteriaStep from './EligibilityCriteriaStep';
import EvaluationCriteriaStep from './EvaluationCriteriaStep';
import DocumentsStep from './DocumentsStep';

export default function CreateTenderPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Form state management
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Basic Information
    title: '',
    reference: '',
    description: '',
    category: [''],
    budget: {
      amount: 0,
      currency: 'EUR',
    },

    // Timeline
    timeline: {
      publicationDate: new Date(),
      submissionDeadline: new Date(new Date().setDate(new Date().getDate() + 30)), // Default: 30 days from now
      evaluationStartDate: new Date(new Date().setDate(new Date().getDate() + 31)), // Default: 31 days from now
      evaluationEndDate: new Date(new Date().setDate(new Date().getDate() + 45)), // Default: 45 days from now
    },

    // Eligibility Criteria
    eligibilityCriteria: [''],

    // Evaluation Criteria
    evaluationCriteria: [
      {
        id: `criterion-${Date.now()}`,
        name: '',
        description: '',
        weight: 0,
        minScore: 0,
        maxScore: 10,
        scoringGuidelines: '',
      },
    ],

    // Documents
    documents: [],
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Total number of steps in the form
  const totalSteps = 5;

  // Update form data
  const updateFormData = (newData: any) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  // Step titles for the progress indicator
  const stepTitles = [
    'Basic Information',
    'Timeline',
    'Eligibility Criteria',
    'Evaluation Criteria',
    'Documents',
  ];

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
      case 1: // Basic Information
        if (!formData.title.trim()) {
          stepErrors.title = 'Tender title is required';
        }
        if (!formData.reference.trim()) {
          stepErrors.reference = 'Reference number is required';
        }
        if (!formData.description.trim()) {
          stepErrors.description = 'Description is required';
        }
        if (formData.category.length === 0 || !formData.category[0].trim()) {
          stepErrors.category = 'At least one category is required';
        }
        if (formData.budget.amount <= 0) {
          stepErrors.budget = 'Budget amount must be greater than zero';
        }
        break;

      case 2: // Timeline
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const pubDate = new Date(formData.timeline.publicationDate);
        const subDeadline = new Date(formData.timeline.submissionDeadline);
        const evalStart = new Date(formData.timeline.evaluationStartDate);
        const evalEnd = new Date(formData.timeline.evaluationEndDate);

        if (pubDate < now) {
          stepErrors.publicationDate = 'Publication date cannot be in the past';
        }
        if (subDeadline <= pubDate) {
          stepErrors.submissionDeadline = 'Submission deadline must be after publication date';
        }
        if (evalStart <= subDeadline) {
          stepErrors.evaluationStartDate = 'Evaluation start date must be after submission deadline';
        }
        if (evalEnd <= evalStart) {
          stepErrors.evaluationEndDate = 'Evaluation end date must be after evaluation start date';
        }
        break;

      case 3: // Eligibility Criteria
        if (formData.eligibilityCriteria.length === 0 || !formData.eligibilityCriteria[0].trim()) {
          stepErrors.eligibilityCriteria = 'At least one eligibility criterion is required';
        }
        break;

      case 4: // Evaluation Criteria
        if (formData.evaluationCriteria.length === 0) {
          stepErrors.evaluationCriteria = 'At least one evaluation criterion is required';
        } else {
          let totalWeight = 0;

          formData.evaluationCriteria.forEach((criterion, index) => {
            if (!criterion.name.trim()) {
              stepErrors[`criterion_${index}_name`] = 'Criterion name is required';
            }
            if (!criterion.description.trim()) {
              stepErrors[`criterion_${index}_description`] = 'Criterion description is required';
            }
            if (criterion.weight <= 0) {
              stepErrors[`criterion_${index}_weight`] = 'Weight must be greater than zero';
            }
            if (criterion.minScore >= criterion.maxScore) {
              stepErrors[`criterion_${index}_score`] = 'Maximum score must be greater than minimum score';
            }

            totalWeight += criterion.weight;
          });

          if (totalWeight !== 100) {
            stepErrors.totalWeight = `Total weight must equal 100% (currently ${totalWeight}%)`;
          }
        }
        break;

      case 5: // Documents
        // No validation required for documents as they are optional
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

    if (Object.keys(allErrors).length === 0) {
      setIsSubmitting(true);

      try {
        // Create new tender
        const newTender: Omit<Tender, 'id' | 'createdAt' | 'updatedAt'> = {
          title: formData.title,
          reference: formData.reference,
          description: formData.description,
          status: 'draft' as TenderStatus,
          category: formData.category.filter(cat => cat.trim()),
          budget: formData.budget.amount > 0 ? formData.budget : undefined,
          timeline: {
            publicationDate: new Date(formData.timeline.publicationDate),
            submissionDeadline: new Date(formData.timeline.submissionDeadline),
            evaluationStartDate: new Date(formData.timeline.evaluationStartDate),
            evaluationEndDate: new Date(formData.timeline.evaluationEndDate),
          },
          eligibilityCriteria: formData.eligibilityCriteria.filter(criterion => criterion.trim()),
          evaluationCriteria: formData.evaluationCriteria.map(criterion => ({
            ...criterion,
            id: criterion.id || `criterion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          })),
          documents: formData.documents,
          createdBy: 'user-1', // In a real app, this would be the current user's ID
        };

        const createdTender = TenderService.createTender(newTender);

        showToast('Tender created successfully', 'success');
        router.push(`/procurement/${createdTender.id}`);
      } catch (error) {
        console.error('Error creating tender:', error);
        showToast('Failed to create tender. Please try again.', 'error');
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Create New Tender</h1>
            <p className="mt-1 text-sm text-gray-500">
              Fill out the form below to create a new procurement tender.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              href="/procurement"
              className="inline-flex items-center text-sm font-medium text-[#0056a4] hover:text-[#004483]"
            >
              <svg className="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Procurement
            </Link>
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
              <BasicInfoStep
                formData={formData}
                updateFormData={setFormData}
                errors={errors}
              />
            )}

            {currentStep === 2 && (
              <TimelineStep
                formData={formData}
                updateFormData={setFormData}
                errors={errors}
              />
            )}

            {currentStep === 3 && (
              <EligibilityCriteriaStep
                formData={formData}
                updateFormData={setFormData}
                errors={errors}
              />
            )}

            {currentStep === 4 && (
              <EvaluationCriteriaStep
                formData={formData}
                updateFormData={setFormData}
                errors={errors}
              />
            )}

            {currentStep === 5 && (
              <DocumentsStep
                formData={formData}
                updateFormData={setFormData}
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
                Create Tender
              </MicroButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
