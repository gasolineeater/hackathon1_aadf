'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Document } from '../../types/procurement';
import { ValidationResult } from '../../services/document-validation.service';
import MicroButton from '../../components/MicroButton';
import DocumentValidationHistory from '../../components/DocumentValidationHistory';

// Mock data for document validation history
const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Technical Proposal',
    type: 'proposal',
    fileUrl: '#',
    fileSize: 2500000,
    fileType: 'application/pdf',
    uploadedBy: 'user-1',
    uploadedAt: new Date('2023-05-15'),
    description: 'Technical proposal for the Urban Trails project',
    isPublic: true,
  },
  {
    id: 'doc-2',
    name: 'Financial Offer',
    type: 'financial_offer',
    fileUrl: '#',
    fileSize: 1200000,
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadedBy: 'user-2',
    uploadedAt: new Date('2023-05-16'),
    description: 'Financial offer for the Urban Trails project',
    isPublic: true,
  },
  {
    id: 'doc-3',
    name: 'Company Profile',
    type: 'company_profile',
    fileUrl: '#',
    fileSize: 3500000,
    fileType: 'application/pdf',
    uploadedBy: 'user-1',
    uploadedAt: new Date('2023-05-14'),
    description: 'Company profile and portfolio',
    isPublic: true,
  },
];

// Mock validation history
const mockValidationHistory: Record<string, ValidationResult[]> = {
  'doc-1': [
    {
      valid: true,
      integrity: true,
      format: { valid: true, errors: [] },
      security: { clean: true, threats: [] },
      metadata: { valid: true, errors: [] },
      content: { valid: true, errors: [] },
      timestamp: Date.now() - 86400000 * 2, // 2 days ago
      validationId: 'val-1-1',
    },
    {
      valid: false,
      integrity: true,
      format: { valid: true, errors: [] },
      security: { clean: false, threats: ['Potential malware detected'] },
      metadata: { valid: true, errors: [] },
      content: { valid: true, errors: [] },
      timestamp: Date.now() - 86400000 * 3, // 3 days ago
      validationId: 'val-1-2',
    },
  ],
  'doc-2': [
    {
      valid: true,
      integrity: true,
      format: { valid: true, errors: [] },
      security: { clean: true, threats: [] },
      metadata: { valid: true, errors: [] },
      content: { valid: true, errors: [] },
      timestamp: Date.now() - 86400000, // 1 day ago
      validationId: 'val-2-1',
    },
  ],
  'doc-3': [
    {
      valid: false,
      integrity: true,
      format: { valid: true, errors: [] },
      security: { clean: true, threats: [] },
      metadata: { valid: true, errors: [] },
      content: { valid: false, errors: ['Missing required section'] },
      timestamp: Date.now() - 86400000 / 2, // 12 hours ago
      validationId: 'val-3-1',
    },
    {
      valid: false,
      integrity: true,
      format: { valid: false, errors: ['Invalid file type: application/octet-stream. Allowed types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG'] },
      security: { clean: true, threats: [] },
      metadata: { valid: true, errors: [] },
      timestamp: Date.now() - 86400000, // 1 day ago
      validationId: 'val-3-2',
    },
  ],
};

export default function DocumentValidationDashboard() {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'invalid'>('all');
  
  // Filter documents based on search term and status
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === 'all') {
      return matchesSearch;
    }
    
    const latestValidation = mockValidationHistory[doc.id]?.[0];
    const isValid = latestValidation?.valid || false;
    
    return matchesSearch && (
      (filterStatus === 'valid' && isValid) ||
      (filterStatus === 'invalid' && !isValid)
    );
  });
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // Get document type label
  const getDocumentTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      'proposal': 'Technical Proposal',
      'financial_offer': 'Financial Offer',
      'company_profile': 'Company Profile',
      'cv': 'CV',
      'certificate': 'Certificate',
      'reference': 'Reference',
      'tender_specification': 'Tender Specification',
      'technical_requirements': 'Technical Requirements',
      'contract': 'Contract',
      'other': 'Other',
    };
    
    return typeMap[type] || type.replace('_', ' ');
  };
  
  // Get validation status of document
  const getDocumentValidationStatus = (docId: string) => {
    const validations = mockValidationHistory[docId];
    if (!validations || validations.length === 0) {
      return { valid: false, status: 'Not Validated' };
    }
    
    const latestValidation = validations[0];
    return {
      valid: latestValidation.valid,
      status: latestValidation.valid ? 'Valid' : 'Invalid',
    };
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Document Validation Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage document validations across the platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Document List */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Documents</h2>
              </div>
              
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <select
                    className="block w-full sm:w-auto rounded-md border-gray-300 shadow-sm focus:ring-[#0056a4] focus:border-[#0056a4] sm:text-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'valid' | 'invalid')}
                  >
                    <option value="all">All Documents</option>
                    <option value="valid">Valid Only</option>
                    <option value="invalid">Invalid Only</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                <ul className="divide-y divide-gray-200">
                  {filteredDocuments.length === 0 ? (
                    <li className="p-4 text-center text-gray-500">
                      No documents found matching your criteria
                    </li>
                  ) : (
                    filteredDocuments.map((doc) => {
                      const validationStatus = getDocumentValidationStatus(doc.id);
                      
                      return (
                        <li
                          key={doc.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedDocument?.id === doc.id ? 'bg-gray-50' : ''}`}
                          onClick={() => setSelectedDocument(doc)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-3 ${
                                validationStatus.valid ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                  {getDocumentTypeLabel(doc.type)} • {formatFileSize(doc.fileSize)}
                                </p>
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              validationStatus.valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {validationStatus.status}
                            </span>
                          </div>
                        </li>
                      );
                    })
                  )}
                </ul>
              </div>
            </div>
            
            <MicroButton
              variant="primary"
              onClick={() => {
                // In a real app, this would navigate to a page to validate a new document
                alert('This would open a page to validate a new document');
              }}
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
            >
              Validate New Document
            </MicroButton>
          </div>
          
          {/* Document Details and Validation History */}
          <div className="lg:col-span-2 space-y-6">
            {selectedDocument ? (
              <>
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                  <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Document Details</h2>
                    <MicroButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // In a real app, this would validate the selected document
                        alert(`This would validate the document: ${selectedDocument.name}`);
                      }}
                      icon={
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      }
                    >
                      Validate Now
                    </MicroButton>
                  </div>
                  
                  <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Document Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedDocument.name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Document Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{getDocumentTypeLabel(selectedDocument.type)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">File Size</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatFileSize(selectedDocument.fileSize)}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">File Type</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedDocument.fileType}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Uploaded By</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedDocument.uploadedBy}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Upload Date</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedDocument.uploadedAt)}</dd>
                      </div>
                      <div className="md:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Description</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedDocument.description || 'No description provided'}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                
                <DocumentValidationHistory
                  document={selectedDocument}
                  validationHistory={mockValidationHistory[selectedDocument.id] || []}
                />
              </>
            ) : (
              <div className="bg-white shadow-sm rounded-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No document selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a document from the list to view its details and validation history.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
