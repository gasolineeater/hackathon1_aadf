'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, DocumentType } from '../types/procurement';
import MicroButton from './MicroButton';
import DocumentValidationStatus from './DocumentValidationStatus';
import { ValidationResult } from '../services/document-validation.service';

interface DocumentUploaderProps {
  onUploadComplete: (document: Document) => void;
  allowedTypes?: DocumentType[];
  maxSize?: number; // in bytes
  label?: string;
  description?: string;
  required?: boolean;
}

export default function DocumentUploader({
  onUploadComplete,
  allowedTypes = ['proposal', 'financial_offer', 'company_profile', 'cv', 'certificate', 'reference', 'other'],
  maxSize = 10 * 1024 * 1024, // 10MB default
  label = 'Upload Document',
  description = 'Upload a document in PDF, Word, Excel, or image format',
  required = false,
}: DocumentUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>(allowedTypes[0] || 'other');
  const [documentName, setDocumentName] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Document type options
  const documentTypeOptions = [
    { value: 'proposal', label: 'Technical Proposal' },
    { value: 'financial_offer', label: 'Financial Offer' },
    { value: 'company_profile', label: 'Company Profile' },
    { value: 'cv', label: 'Team CVs' },
    { value: 'certificate', label: 'Certificates & Licenses' },
    { value: 'reference', label: 'Reference Letters' },
    { value: 'tender_specification', label: 'Tender Specification' },
    { value: 'technical_requirements', label: 'Technical Requirements' },
    { value: 'contract', label: 'Contract' },
    { value: 'other', label: 'Other Document' },
  ].filter(option => allowedTypes.includes(option.value as DocumentType));
  
  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setValidationResult(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Check file size
      if (selectedFile.size > maxSize) {
        setError(`File size exceeds the maximum allowed (${formatFileSize(maxSize)})`);
        return;
      }
      
      setFile(selectedFile);
      
      // Auto-fill name if not already set
      if (!documentName) {
        setDocumentName(selectedFile.name.split('.')[0]);
      }
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get icon for file type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return (
        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 384 512">
          <path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z" />
        </svg>
      );
    } else if (fileType.includes('image')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 384 512">
          <path d="M384 121.941V128H256V0h6.059a24 24 0 0 1 16.97 7.029l97.941 97.941a24.002 24.002 0 0 1 7.03 16.971zM248 160c-13.2 0-24-10.8-24-24V0H24C10.745 0 0 10.745 0 24v464c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V160H248zm-135.455 16c26.51 0 48 21.49 48 48s-21.49 48-48 48-48-21.49-48-48 21.49-48 48-48zm208 240h-256l.485-48.485L104.545 328c4.686-4.686 11.799-4.686 16.485 0L160.545 368 264.06 264.485c4.686-4.686 12.284-4.686 16.971 0L320.545 304v112z" />
        </svg>
      );
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return (
        <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 384 512">
          <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm57.1 120H305c7.7 0 13.4 7.1 11.7 14.7l-38 168c-1.2 5.5-6.1 9.3-11.7 9.3h-38c-5.5 0-10.3-3.8-11.6-9.1-25.8-103.5-20.8-81.2-25.6-110.5h-.5c-1.1 14.3-2.4 17.4-25.6 110.5-1.3 5.3-6.1 9.1-11.6 9.1H117c-5.6 0-10.5-3.9-11.7-9.4l-37.8-168c-1.7-7.5 4-14.6 11.7-14.6h24.5c5.7 0 10.7 4 11.8 9.7 15.6 78 20.1 109.5 21 122.2 1.6-10.2 7.3-32.7 29.4-122.7 1.3-5.4 6.1-9.1 11.7-9.1h29.1c5.6 0 10.4 3.8 11.7 9.2 24 100.4 28.8 124 29.6 129.4-.2-11.2-2.6-17.8 21.6-129.2 1-5.6 5.9-9.5 11.5-9.5zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
        </svg>
      );
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return (
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 384 512">
          <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L224 336l60.1 93.5c5.1 8-.6 18.5-10.1 18.5h-34.9c-4.4 0-8.5-2.4-10.6-6.3C208.9 405.5 192 373 192 373c-6.4 14.8-10 20-36.6 68.8-2.1 3.9-6.1 6.3-10.5 6.3H110c-9.5 0-15.2-10.5-10.1-18.5l60.3-93.5-60.3-93.5c-5.2-8 .6-18.5 10.1-18.5h34.8c4.4 0 8.5 2.4 10.6 6.3 26.1 48.8 20 33.6 36.6 68.5 0 0 6.1-11.7 36.6-68.5 2.1-3.9 6.2-6.3 10.6-6.3H274c9.5-.1 15.2 10.4 10.1 18.4zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 384 512">
          <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z" />
        </svg>
      );
    }
  };
  
  // Validate document
  const validateDocument = async (document: Document) => {
    setIsValidating(true);
    setError(null);
    
    try {
      const response = await fetch('/api/document-validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document,
          validationType: 'all',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to validate document');
      }
      
      const result = await response.json();
      setValidationResult(result);
      
      return result.valid;
    } catch (error) {
      console.error('Error validating document:', error);
      setError('Failed to validate document. Please try again.');
      return false;
    } finally {
      setIsValidating(false);
    }
  };
  
  // Handle document upload
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!documentName.trim()) {
      setError('Please enter a document name');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // In a real app, this would upload the file to a server
      // For now, we'll just create a mock document
      const newDocument: Document = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: documentName,
        type: documentType,
        fileUrl: URL.createObjectURL(file), // This is temporary and will be revoked when the page is unloaded
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: 'user-1', // In a real app, this would be the current user's ID
        uploadedAt: new Date(),
        description: documentDescription,
        isPublic: true,
      };
      
      // Validate the document
      const isValid = await validateDocument(newDocument);
      
      if (isValid) {
        // If validation passes, complete the upload
        onUploadComplete(newDocument);
        
        // Reset form
        setFile(null);
        setDocumentName('');
        setDocumentDescription('');
        setDocumentType(allowedTypes[0] || 'other');
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setError('Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-md p-4">
        <h3 className="text-md font-medium text-gray-900 mb-4">{label}</h3>
        
        {/* File Upload Area */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File {required && <span className="text-red-500">*</span>}
          </label>
          <div 
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-[#0056a4] transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-[#0056a4] hover:text-[#004483] focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">
                {description}
              </p>
              <p className="text-xs text-gray-500">
                Maximum file size: {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Selected File Preview */}
        <AnimatePresence>
          {file && (
            <motion.div 
              className="bg-gray-50 p-3 rounded-md mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center">
                {getFileIcon(file.type)}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                    setValidationResult(null);
                  }}
                  className="ml-auto p-1 rounded text-gray-400 hover:text-red-500 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Document Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="documentName" className="block text-sm font-medium text-gray-700 mb-1">
              Document Name {required && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              className="block w-full rounded-md shadow-sm focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm border-gray-300"
              placeholder="Enter document name"
            />
          </div>
          
          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
              Document Type {required && <span className="text-red-500">*</span>}
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              className="block w-full rounded-md shadow-sm focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm border-gray-300"
            >
              {documentTypeOptions.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="documentDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="documentDescription"
            value={documentDescription}
            onChange={(e) => setDocumentDescription(e.target.value)}
            className="block w-full rounded-md shadow-sm focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm border-gray-300"
            placeholder="Enter document description"
            rows={2}
          />
        </div>
        
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div 
              className="mb-4 p-3 bg-red-50 rounded-md text-sm text-red-700"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Upload Button */}
        <div className="flex justify-end">
          <MicroButton
            variant="primary"
            onClick={handleUpload}
            disabled={!file || isUploading || isValidating}
            isLoading={isUploading}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
              </svg>
            }
          >
            {isValidating ? 'Validating...' : isUploading ? 'Uploading...' : 'Upload Document'}
          </MicroButton>
        </div>
      </div>
      
      {/* Validation Result */}
      <DocumentValidationStatus 
        validationResult={validationResult} 
        isLoading={isValidating}
      />
    </div>
  );
}
