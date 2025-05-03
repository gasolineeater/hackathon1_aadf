'use client';

import { motion } from 'framer-motion';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  allowNavigation?: boolean;
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  allowNavigation = false,
}: StepIndicatorProps) {
  const handleStepClick = (step: number) => {
    if (allowNavigation && onStepClick && step <= currentStep) {
      onStepClick(step);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {steps[currentStep - 1]}
        </h3>
        <p className="text-sm text-gray-500">
          Step {currentStep} of {steps.length}
        </p>
      </div>
      
      {/* Progress bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <motion.div
            initial={{ width: `${((currentStep - 1) / steps.length) * 100}%` }}
            animate={{ width: `${(currentStep / steps.length) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#0056a4]"
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep >= stepNumber;
            const isCurrent = currentStep === stepNumber;
            
            return (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  allowNavigation && stepNumber <= currentStep
                    ? 'cursor-pointer'
                    : ''
                }`}
                style={{
                  width: `${100 / steps.length}%`,
                  maxWidth: '100px',
                }}
                onClick={() => handleStepClick(stepNumber)}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                    isCurrent
                      ? 'bg-[#0056a4] text-white ring-4 ring-blue-100'
                      : isActive
                      ? 'bg-[#0056a4] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {stepNumber}
                </div>
                <span
                  className={`mt-1 text-xs text-center transition-colors duration-200 ${
                    isActive ? 'text-[#0056a4] font-medium' : 'text-gray-500'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
