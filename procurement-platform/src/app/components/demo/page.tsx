'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToastProvider, useToast } from '../../context/ToastContext';
import MicroButton from '../MicroButton';
import AnimatedTooltip from '../AnimatedTooltip';
import FormFeedback from '../FormFeedback';
import Toast from '../Toast';

// Wrap the demo content in the ToastProvider
function MicrointeractionsDemo() {
  const { showToast } = useToast();
  const [formFeedbackVisible, setFormFeedbackVisible] = useState(false);
  const [formFeedbackType, setFormFeedbackType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [isLoading, setIsLoading] = useState(false);

  // Handle button click to show toast
  const handleShowToast = (type: 'success' | 'error' | 'info' | 'warning') => {
    const messages = {
      success: 'Operation completed successfully!',
      error: 'An error occurred. Please try again.',
      info: 'Here is some important information.',
      warning: 'Warning: This action cannot be undone.',
    };
    
    showToast(messages[type], type);
  };

  // Handle button click to show form feedback
  const handleShowFormFeedback = (type: 'success' | 'error' | 'info' | 'warning') => {
    setFormFeedbackType(type);
    setFormFeedbackVisible(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setFormFeedbackVisible(false);
    }, 3000);
  };

  // Handle button click to show standalone toast
  const handleShowStandaloneToast = (type: 'success' | 'error' | 'info' | 'warning') => {
    setToastType(type);
    setToastVisible(true);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  // Handle loading button click
  const handleLoadingClick = () => {
    setIsLoading(true);
    
    // Simulate loading for 2 seconds
    setTimeout(() => {
      setIsLoading(false);
      showToast('Loading completed!', 'success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Microinteractions Demo</h1>
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
        
        {/* Standalone Toast Demo */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Standalone Toast</h2>
            <p className="text-gray-500 mb-4">
              This toast is rendered directly in the component and can be used for simple feedback.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <MicroButton
                variant="primary"
                onClick={() => handleShowStandaloneToast('success')}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Success Toast
              </MicroButton>
              
              <MicroButton
                variant="danger"
                onClick={() => handleShowStandaloneToast('error')}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                Error Toast
              </MicroButton>
              
              <MicroButton
                variant="outline"
                onClick={() => handleShowStandaloneToast('info')}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                Info Toast
              </MicroButton>
              
              <MicroButton
                variant="secondary"
                onClick={() => handleShowStandaloneToast('warning')}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                }
              >
                Warning Toast
              </MicroButton>
            </div>
            
            {/* Standalone Toast */}
            <Toast
              message={`This is a ${toastType} message!`}
              type={toastType}
              isVisible={toastVisible}
              onClose={() => setToastVisible(false)}
            />
          </div>
        </div>
        
        {/* Global Toast Demo */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Global Toast Notifications</h2>
            <p className="text-gray-500 mb-4">
              These toasts are managed by the ToastContext and can be triggered from anywhere in the application.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <MicroButton
                variant="primary"
                onClick={() => handleShowToast('success')}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              >
                Success Toast
              </MicroButton>
              
              <MicroButton
                variant="danger"
                onClick={() => handleShowToast('error')}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                Error Toast
              </MicroButton>
              
              <MicroButton
                variant="outline"
                onClick={() => handleShowToast('info')}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                Info Toast
              </MicroButton>
              
              <MicroButton
                variant="secondary"
                onClick={() => handleShowToast('warning')}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                }
              >
                Warning Toast
              </MicroButton>
            </div>
          </div>
        </div>
        
        {/* Form Feedback Demo */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Form Feedback</h2>
            <p className="text-gray-500 mb-4">
              These feedback messages can be used to provide contextual information within forms.
            </p>
            
            <div className="flex flex-wrap gap-3 mb-4">
              <MicroButton
                variant="primary"
                onClick={() => handleShowFormFeedback('success')}
              >
                Success Feedback
              </MicroButton>
              
              <MicroButton
                variant="danger"
                onClick={() => handleShowFormFeedback('error')}
              >
                Error Feedback
              </MicroButton>
              
              <MicroButton
                variant="outline"
                onClick={() => handleShowFormFeedback('info')}
              >
                Info Feedback
              </MicroButton>
              
              <MicroButton
                variant="secondary"
                onClick={() => handleShowFormFeedback('warning')}
              >
                Warning Feedback
              </MicroButton>
            </div>
            
            {/* Form Feedback */}
            <FormFeedback
              type={formFeedbackType}
              message={`This is a ${formFeedbackType} message that provides feedback to the user.`}
              isVisible={formFeedbackVisible}
            />
          </div>
        </div>
        
        {/* Button Microinteractions Demo */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Button Microinteractions</h2>
            <p className="text-gray-500 mb-4">
              These buttons include various microinteractions like hover effects, ripples, and loading states.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Button Variants</h3>
                <div className="flex flex-col gap-3">
                  <MicroButton variant="primary">Primary Button</MicroButton>
                  <MicroButton variant="secondary">Secondary Button</MicroButton>
                  <MicroButton variant="outline">Outline Button</MicroButton>
                  <MicroButton variant="ghost">Ghost Button</MicroButton>
                  <MicroButton variant="danger">Danger Button</MicroButton>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Button with Icons</h3>
                <div className="flex flex-col gap-3">
                  <MicroButton
                    variant="primary"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    }
                  >
                    Left Icon
                  </MicroButton>
                  
                  <MicroButton
                    variant="secondary"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    }
                    iconPosition="right"
                  >
                    Right Icon
                  </MicroButton>
                  
                  <MicroButton
                    variant="outline"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    }
                  >
                    Add New
                  </MicroButton>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Button States</h3>
                <div className="flex flex-col gap-3">
                  <MicroButton
                    variant="primary"
                    isLoading={isLoading}
                    onClick={handleLoadingClick}
                  >
                    {isLoading ? 'Loading...' : 'Click to Load'}
                  </MicroButton>
                  
                  <MicroButton
                    variant="secondary"
                    disabled
                  >
                    Disabled Button
                  </MicroButton>
                  
                  <MicroButton
                    variant="outline"
                    tooltip="This button has a tooltip!"
                  >
                    Hover for Tooltip
                  </MicroButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tooltip Demo */}
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Tooltips</h2>
            <p className="text-gray-500 mb-4">
              Animated tooltips that can be positioned in different directions.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 py-8">
              <AnimatedTooltip
                content="This tooltip appears on top"
                position="top"
              >
                <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md cursor-help">
                  Top Tooltip
                </div>
              </AnimatedTooltip>
              
              <AnimatedTooltip
                content="This tooltip appears on the bottom"
                position="bottom"
              >
                <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md cursor-help">
                  Bottom Tooltip
                </div>
              </AnimatedTooltip>
              
              <AnimatedTooltip
                content="This tooltip appears on the left"
                position="left"
              >
                <div className="px-4 py-2 bg-purple-100 text-purple-800 rounded-md cursor-help">
                  Left Tooltip
                </div>
              </AnimatedTooltip>
              
              <AnimatedTooltip
                content="This tooltip appears on the right"
                position="right"
              >
                <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md cursor-help">
                  Right Tooltip
                </div>
              </AnimatedTooltip>
              
              <AnimatedTooltip
                content={
                  <div className="max-w-xs">
                    <h3 className="font-bold mb-1">Rich Content Tooltip</h3>
                    <p>Tooltips can contain rich content including headings, paragraphs, and even images.</p>
                  </div>
                }
                position="top"
                maxWidth={300}
              >
                <div className="px-4 py-2 bg-red-100 text-red-800 rounded-md cursor-help">
                  Rich Content Tooltip
                </div>
              </AnimatedTooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the page component wrapped in ToastProvider
export default function MicrointeractionsDemoPage() {
  return (
    <ToastProvider>
      <MicrointeractionsDemo />
    </ToastProvider>
  );
}
