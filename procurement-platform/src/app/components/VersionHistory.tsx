'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/app/context/ToastContext';

interface DocumentVersion {
  id: string;
  document_type: string;
  document_id: string;
  version: number;
  content: any;
  created_by: {
    id: string;
    email: string;
    full_name: string;
  };
  created_at: string;
  change_summary: string;
}

interface VersionHistoryProps {
  documentType: string;
  documentId: string;
}

export default function VersionHistory({ documentType, documentId }: VersionHistoryProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null);
  const [comparisonVersion, setComparisonVersion] = useState<DocumentVersion | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  
  useEffect(() => {
    if (user && documentType && documentId) {
      fetchVersions();
    }
  }, [user, documentType, documentId]);
  
  const fetchVersions = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      
      // Mock versions
      const mockVersions: DocumentVersion[] = [
        {
          id: 'version-1',
          document_type: documentType,
          document_id: documentId,
          version: 3,
          content: {
            title: 'Urban Trails Project',
            description: 'Development of urban trails in the city center',
            category: 'Infrastructure',
            status: 'published',
            budget_range: {
              min: 100000,
              max: 150000,
              currency: 'EUR'
            },
            deadline: '2023-12-15T23:59:59Z'
          },
          created_by: {
            id: 'user-1',
            email: 'admin@aadf.org',
            full_name: 'Admin User'
          },
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          change_summary: 'Updated budget range and deadline'
        },
        {
          id: 'version-2',
          document_type: documentType,
          document_id: documentId,
          version: 2,
          content: {
            title: 'Urban Trails Project',
            description: 'Development of urban trails in the city center',
            category: 'Infrastructure',
            status: 'draft',
            budget_range: {
              min: 80000,
              max: 120000,
              currency: 'EUR'
            },
            deadline: '2023-12-10T23:59:59Z'
          },
          created_by: {
            id: 'user-1',
            email: 'admin@aadf.org',
            full_name: 'Admin User'
          },
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          change_summary: 'Updated project description'
        },
        {
          id: 'version-3',
          document_type: documentType,
          document_id: documentId,
          version: 1,
          content: {
            title: 'Urban Trails Project',
            description: 'Development of urban trails',
            category: 'Infrastructure',
            status: 'draft',
            budget_range: {
              min: 80000,
              max: 120000,
              currency: 'EUR'
            },
            deadline: '2023-12-10T23:59:59Z'
          },
          created_by: {
            id: 'user-1',
            email: 'admin@aadf.org',
            full_name: 'Admin User'
          },
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          change_summary: 'Initial creation'
        }
      ];
      
      setVersions(mockVersions);
      setSelectedVersion(mockVersions[0]);
    } catch (error: any) {
      console.error('Error fetching versions:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Failed to load version history'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCompare = (version: DocumentVersion) => {
    if (selectedVersion && version.id !== selectedVersion.id) {
      setComparisonVersion(version);
      setShowComparison(true);
    } else {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Please select a different version to compare'
      });
    }
  };
  
  const handleRestore = (version: DocumentVersion) => {
    // In a real implementation, this would call an API to restore the version
    showToast({
      type: 'success',
      title: 'Version Restored',
      message: `Restored to version ${version.version}`
    });
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Find differences between two objects
  const findDifferences = (obj1: any, obj2: any, path: string = ''): string[] => {
    const differences: string[] = [];
    
    // Check if both inputs are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        differences.push(`${path}: ${JSON.stringify(obj1)} → ${JSON.stringify(obj2)}`);
      }
      return differences;
    }
    
    // Get all keys from both objects
    const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
    
    // Check each key
    for (const key of keys) {
      const currentPath = path ? `${path}.${key}` : key;
      
      // Check if key exists in both objects
      if (!(key in obj1)) {
        differences.push(`${currentPath}: Added ${JSON.stringify(obj2[key])}`);
      } else if (!(key in obj2)) {
        differences.push(`${currentPath}: Removed ${JSON.stringify(obj1[key])}`);
      } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object' && obj1[key] !== null && obj2[key] !== null) {
        // Recursively check nested objects
        differences.push(...findDifferences(obj1[key], obj2[key], currentPath));
      } else if (obj1[key] !== obj2[key]) {
        differences.push(`${currentPath}: ${JSON.stringify(obj1[key])} → ${JSON.stringify(obj2[key])}`);
      }
    }
    
    return differences;
  };
  
  if (!user || !documentType || !documentId) {
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Version History</h3>
        <p className="mt-1 text-sm text-gray-500">
          Track changes and restore previous versions
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        {/* Version List */}
        <div className="md:col-span-1 overflow-y-auto" style={{ maxHeight: '400px' }}>
          <ul className="divide-y divide-gray-200">
            {versions.length === 0 ? (
              <li className="px-4 py-6 text-center text-gray-500">
                No version history found
              </li>
            ) : (
              versions.map((version) => (
                <li
                  key={version.id}
                  className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${selectedVersion?.id === version.id ? 'bg-gray-50' : ''}`}
                  onClick={() => setSelectedVersion(version)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Version {version.version}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(version.created_at)}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {version.version === 1 ? 'Initial' : 'Update'}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">
                    {version.change_summary}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    By: {version.created_by.full_name}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
        
        {/* Version Details */}
        <div className="md:col-span-2 p-4">
          {selectedVersion ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-900">
                  Version {selectedVersion.version} Details
                </h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowComparison(!showComparison)}
                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4]"
                  >
                    {showComparison ? 'Hide Comparison' : 'Compare Versions'}
                  </button>
                  {selectedVersion.version !== versions[0].version && (
                    <button
                      type="button"
                      onClick={() => handleRestore(selectedVersion)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-[#0056a4] hover:bg-[#004483] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4]"
                    >
                      Restore This Version
                    </button>
                  )}
                </div>
              </div>
              
              {showComparison ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="comparison-version" className="block text-xs font-medium text-gray-700 mb-1">
                      Compare with:
                    </label>
                    <select
                      id="comparison-version"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] text-sm"
                      value={comparisonVersion?.id || ''}
                      onChange={(e) => {
                        const selected = versions.find(v => v.id === e.target.value);
                        if (selected) setComparisonVersion(selected);
                      }}
                    >
                      <option value="">Select a version...</option>
                      {versions
                        .filter(v => v.id !== selectedVersion.id)
                        .map(v => (
                          <option key={v.id} value={v.id}>
                            Version {v.version} ({formatDate(v.created_at)})
                          </option>
                        ))}
                    </select>
                  </div>
                  
                  {comparisonVersion && (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h5 className="text-xs font-medium text-gray-700 mb-2">
                        Changes from Version {comparisonVersion.version} to Version {selectedVersion.version}
                      </h5>
                      <ul className="space-y-1">
                        {findDifferences(comparisonVersion.content, selectedVersion.content).map((diff, index) => (
                          <li key={index} className="text-xs text-gray-600">
                            {diff}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">
                      Change Summary
                    </h5>
                    <p className="text-sm text-gray-600">
                      {selectedVersion.change_summary}
                    </p>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">
                      Content
                    </h5>
                    <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-x-auto">
                      {JSON.stringify(selectedVersion.content, null, 2)}
                    </pre>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2">
                      Metadata
                    </h5>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                      <div>
                        <dt className="text-gray-500">Created By</dt>
                        <dd className="text-gray-900">{selectedVersion.created_by.full_name}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Created At</dt>
                        <dd className="text-gray-900">{formatDate(selectedVersion.created_at)}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Document Type</dt>
                        <dd className="text-gray-900">{selectedVersion.document_type}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Version</dt>
                        <dd className="text-gray-900">{selectedVersion.version}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Select a version to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
