'use client';

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  title: string;
  content: ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  onComplete: (currentStep: number) => void;
  className?: string;
}

export default function MultiStepForm({
  steps,
  onComplete,
  className = '',
}: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for backward, 1 for forward

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(currentStep);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <div className={`${className}`}>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-300 ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-[#0056a4] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2">
                  <div className="h-full bg-gray-200 rounded">
                    <div
                      className={`h-full rounded transition-all duration-500 ${
                        index < currentStep ? 'bg-green-500' : ''
                      }`}
                      style={{
                        width: index < currentStep ? '100%' : '0%',
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`${
                index === currentStep ? 'text-[#0056a4] font-medium' : ''
              } ${index === 0 ? 'text-left' : index === steps.length - 1 ? 'text-right' : 'text-center'}`}
              style={{ width: index === 0 || index === steps.length - 1 ? 'auto' : `${100 / steps.length}%` }}
            >
              {step.title}
            </div>
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="w-full"
          >
            {steps[currentStep].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={goToPreviousStep}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded-md border border-gray-300 transition-colors ${
            currentStep === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-gray-100'
          }`}
        >
          Previous
        </button>
        <button
          onClick={goToNextStep}
          className="px-4 py-2 rounded-md bg-[#0056a4] text-white hover:bg-[#004483] transition-colors btn-pulse"
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}
