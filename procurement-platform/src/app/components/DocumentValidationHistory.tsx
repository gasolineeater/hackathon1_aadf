'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ValidationResult } from '../services/document-validation.service';
import { Document } from '../types/procurement';
import MicroButton from './MicroButton';

interface DocumentValidationHistoryProps {
  document: Document;
  validationHistory: ValidationResult[];
}

export default function DocumentValidationHistory({
  document,
  validationHistory,
}: DocumentValidationHistoryProps) {
  const [expandedValidation, setExpandedValidation] = useState<string | null>(null);
  
  // Toggle expanded validation
  const toggleExpand = (validationId: string) => {
    if (expandedValidation === validationId) {
      setExpandedValidation(null);
    } else {
      setExpandedValidation(validationId);
    }
  };
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (!validationHistory || validationHistory.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        <p className="text-gray-500">No validation history available for this document.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Validation History</h3>
      
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {validationHistory.map((validation, index) => (
            <li key={validation.validationId} className="p-0">
              <div 
                className={`p-4 hover:bg-gray-50 cursor-pointer ${expandedValidation === validation.validationId ? 'bg-gray-50' : ''}`}
                onClick={() => toggleExpand(validation.validationId)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${validation.valid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Validation {validationHistory.length - index}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(validation.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      validation.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {validation.valid ? 'Valid' : 'Invalid'}
                    </span>
                    <svg 
                      className={`ml-2 w-5 h-5 text-gray-400 transform transition-transform ${
                        expandedValidation === validation.validationId ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {expandedValidation === validation.validationId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-4"
                >
                  <div className="bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Validation Details</h4>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start">
                        <span className="font-medium w-24">Integrity:</span>
                        <span className={validation.integrity ? 'text-green-600' : 'text-red-600'}>
                          {validation.integrity ? 'Passed' : 'Failed'}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium w-24">Format:</span>
                        <span className={validation.format.valid ? 'text-green-600' : 'text-red-600'}>
                          {validation.format.valid ? 'Passed' : 'Failed'}
                          {!validation.format.valid && validation.format.errors.length > 0 && (
                            <ul className="mt-1 ml-2 text-red-600">
                              {validation.format.errors.map((error, i) => (
                                <li key={i}>• {error}</li>
                              ))}
                            </ul>
                          )}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium w-24">Security:</span>
                        <span className={validation.security.clean ? 'text-green-600' : 'text-red-600'}>
                          {validation.security.clean ? 'Passed' : 'Failed'}
                          {!validation.security.clean && validation.security.threats.length > 0 && (
                            <ul className="mt-1 ml-2 text-red-600">
                              {validation.security.threats.map((threat, i) => (
                                <li key={i}>• {threat}</li>
                              ))}
                            </ul>
                          )}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="font-medium w-24">Metadata:</span>
                        <span className={validation.metadata.valid ? 'text-green-600' : 'text-red-600'}>
                          {validation.metadata.valid ? 'Passed' : 'Failed'}
                          {!validation.metadata.valid && validation.metadata.errors.length > 0 && (
                            <ul className="mt-1 ml-2 text-red-600">
                              {validation.metadata.errors.map((error, i) => (
                                <li key={i}>• {error}</li>
                              ))}
                            </ul>
                          )}
                        </span>
                      </li>
                      {validation.content && (
                        <li className="flex items-start">
                          <span className="font-medium w-24">Content:</span>
                          <span className={validation.content.valid ? 'text-green-600' : 'text-red-600'}>
                            {validation.content.valid ? 'Passed' : 'Failed'}
                            {!validation.content.valid && validation.content.errors.length > 0 && (
                              <ul className="mt-1 ml-2 text-red-600">
                                {validation.content.errors.map((error, i) => (
                                  <li key={i}>• {error}</li>
                                ))}
                              </ul>
                            )}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <MicroButton
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/api/document-validation/certificate/${validation.validationId}`, '_blank');
                      }}
                      icon={
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      }
                    >
                      View Certificate
                    </MicroButton>
                  </div>
                </motion.div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
