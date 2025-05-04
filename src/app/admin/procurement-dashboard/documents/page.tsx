'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock documents data
const mockDocuments = [
  {
    id: 'doc-001',
    name: 'RFP - IT Infrastructure Upgrade',
    type: 'rfp',
    tender_id: 'tender-001',
    created_by: 'John Doe',
    created_at: '2023-06-01T10:30:00Z',
    updated_at: '2023-06-10T14:45:00Z',
    version: 3,
    status: 'published',
    file_url: '#',
    versions: [
      { version: 1, updated_by: 'John Doe', updated_at: '2023-06-01T10:30:00Z', changes: 'Initial draft' },
      { version: 2, updated_by: 'Jane Smith', updated_at: '2023-06-05T09:15:00Z', changes: 'Updated technical requirements' },
      { version: 3, updated_by: 'John Doe', updated_at: '2023-06-10T14:45:00Z', changes: 'Finalized document for publication' }
    ]
  },
  {
    id: 'doc-002',
    name: 'Evaluation Criteria - Website Redesign',
    type: 'evaluation_criteria',
    tender_id: 'tender-002',
    created_by: 'Jane Smith',
    created_at: '2023-06-08T11:20:00Z',
    updated_at: '2023-06-15T16:30:00Z',
    version: 2,
    status: 'published',
    file_url: '#',
    versions: [
      { version: 1, updated_by: 'Jane Smith', updated_at: '2023-06-08T11:20:00Z', changes: 'Initial draft' },
      { version: 2, updated_by: 'Michael Johnson', updated_at: '2023-06-15T16:30:00Z', changes: 'Updated scoring weights' }
    ]
  },
  {
    id: 'doc-003',
    name: 'Contract Template - Digital Transformation',
    type: 'contract',
    tender_id: 'tender-003',
    created_by: 'Michael Johnson',
    created_at: '2023-06-12T09:45:00Z',
    updated_at: '2023-06-12T09:45:00Z',
    version: 1,
    status: 'draft',
    file_url: '#',
    versions: [
      { version: 1, updated_by: 'Michael Johnson', updated_at: '2023-06-12T09:45:00Z', changes: 'Initial draft' }
    ]
  },
  {
    id: 'doc-004',
    name: 'Technical Specifications - Cybersecurity Assessment',
    type: 'technical_specs',
    tender_id: 'tender-004',
    created_by: 'Robert Wilson',
    created_at: '2023-06-18T13:10:00Z',
    updated_at: '2023-06-22T10:25:00Z',
    version: 4,
    status: 'published',
    file_url: '#',
    versions: [
      { version: 1, updated_by: 'Robert Wilson', updated_at: '2023-06-18T13:10:00Z', changes: 'Initial draft' },
      { version: 2, updated_by: 'Jane Smith', updated_at: '2023-06-19T15:30:00Z', changes: 'Added penetration testing requirements' },
      { version: 3, updated_by: 'Michael Johnson', updated_at: '2023-06-20T11:45:00Z', changes: 'Updated compliance requirements' },
      { version: 4, updated_by: 'Robert Wilson', updated_at: '2023-06-22T10:25:00Z', changes: 'Finalized document for publication' }
    ]
  },
  {
    id: 'doc-005',
    name: 'Evaluation Report - IT Infrastructure Upgrade',
    type: 'evaluation_report',
    tender_id: 'tender-001',
    created_by: 'Jane Smith',
    created_at: '2023-06-25T14:20:00Z',
    updated_at: '2023-06-28T09:15:00Z',
    version: 2,
    status: 'draft',
    file_url: '#',
    versions: [
      { version: 1, updated_by: 'Jane Smith', updated_at: '2023-06-25T14:20:00Z', changes: 'Initial draft' },
      { version: 2, updated_by: 'John Doe', updated_at: '2023-06-28T09:15:00Z', changes: 'Added evaluation scores and comments' }
    ]
  }
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Filter documents based on search term, type, and status
  const filteredDocuments = mockDocuments.filter(document => {
    const matchesSearch = 
      searchTerm === '' || 
      document.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      typeFilter === null || 
      document.type === typeFilter;
    
    const matchesStatus = 
      statusFilter === null || 
      document.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Get selected document details
  const selectedDocumentDetails = selectedDocument
    ? mockDocuments.find(doc => doc.id === selectedDocument)
    : null;
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get type badge color
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'rfp':
        return 'bg-blue-100 text-blue-800';
      case 'evaluation_criteria':
        return 'bg-purple-100 text-purple-800';
      case 'contract':
        return 'bg-indigo-100 text-indigo-800';
      case 'technical_specs':
        return 'bg-cyan-100 text-cyan-800';
      case 'evaluation_report':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Format type for display
  const formatType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  // Handle document upload
  const handleUploadDocument = () => {
    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin/procurement-dashboard"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
        
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Version control and track changes for sensitive documents
            </p>
          </div>
          <button
            type="button"
            onClick={handleUploadDocument}
            disabled={isUploading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              isUploading
                ? 'bg-indigo-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Upload Document
              </>
            )}
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Search and Filter</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Documents
                </label>
                <input
                  type="text"
                  id="search"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by document name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type
                </label>
                <select
                  id="type"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={typeFilter || ''}
                  onChange={(e) => setTypeFilter(e.target.value || null)}
                >
                  <option value="">All Types</option>
                  <option value="rfp">RFP</option>
                  <option value="evaluation_criteria">Evaluation Criteria</option>
                  <option value="contract">Contract</option>
                  <option value="technical_specs">Technical Specifications</option>
                  <option value="evaluation_report">Evaluation Report</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={statusFilter || ''}
                  onChange={(e) => setStatusFilter(e.target.value || null)}
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-indigo-800">Documents ({filteredDocuments.length})</h2>
              </div>
              
              {filteredDocuments.length === 0 ? (
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">No documents found</p>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[600px]">
                  <ul className="divide-y divide-gray-200">
                    {filteredDocuments.map((document) => (
                      <li
                        key={document.id}
                        className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                          selectedDocument === document.id ? 'bg-indigo-50' : ''
                        }`}
                        onClick={() => setSelectedDocument(document.id)}
                      >
                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-indigo-600">{document.name}</span>
                            <span className="text-xs text-gray-500">v{document.version}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(document.type)}`}>
                              {formatType(document.type)}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(document.status)}`}>
                              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Updated {formatDate(document.updated_at)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          
          {/* Document Details */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
                <h2 className="text-lg font-medium text-indigo-800">Document Details</h2>
              </div>
              
              {!selectedDocumentDetails ? (
                <div className="px-4 py-5 sm:p-6 text-center">
                  <p className="text-gray-500">Select a document to view details</p>
                </div>
              ) : (
                <div className="px-4 py-5 sm:p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{selectedDocumentDetails.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedDocumentDetails.type)}`}>
                        {formatType(selectedDocumentDetails.type)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDocumentDetails.status)}`}>
                        {selectedDocumentDetails.status.charAt(0).toUpperCase() + selectedDocumentDetails.status.slice(1)}
                      </span>
                    </div>
                    
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Created By</dt>
                        <dd className="mt-1 text-sm text-gray-900">{selectedDocumentDetails.created_by}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Created At</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedDocumentDetails.created_at)}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(selectedDocumentDetails.updated_at)}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Current Version</dt>
                        <dd className="mt-1 text-sm text-gray-900">v{selectedDocumentDetails.version}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="flex space-x-2 mb-6">
                    <a
                      href={selectedDocumentDetails.file_url}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Document
                    </a>
                    <a
                      href={selectedDocumentDetails.file_url}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      download
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </a>
                    {selectedDocumentDetails.status === 'draft' && (
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Document
                      </button>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Version History</h4>
                    <div className="bg-gray-50 rounded-md p-4">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-between">
                          {selectedDocumentDetails.versions.map((version, index) => (
                            <div key={index} className="flex flex-col items-center">
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                version.version === selectedDocumentDetails.version ? 'bg-indigo-500' : 'bg-gray-300'
                              }`}>
                                <span className="text-xs font-medium text-white">{version.version}</span>
                              </div>
                              <div className="mt-2 text-center max-w-[120px]">
                                <div className="text-xs font-medium text-gray-900">{version.updated_by}</div>
                                <div className="text-xs text-gray-500">{formatDate(version.updated_at)}</div>
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{version.changes}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedDocumentDetails.status === 'draft' && (
                    <div className="mt-6 bg-yellow-50 p-4 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">Draft Document</h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              This document is still in draft status. Once finalized, you can publish it to make it available to all stakeholders.
                            </p>
                          </div>
                          <div className="mt-3">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700"
                            >
                              Publish Document
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Information Box */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">About Document Management</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  The document management system provides version control and change tracking for all procurement documents:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>All changes are tracked with timestamps and user information</li>
                  <li>Previous versions are preserved and can be accessed at any time</li>
                  <li>Documents can be in draft, published, or archived status</li>
                  <li>Access controls ensure only authorized users can view or edit documents</li>
                  <li>The system maintains a complete audit trail for compliance purposes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
