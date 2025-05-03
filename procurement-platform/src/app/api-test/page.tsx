'use client';

import { useState } from 'react';
import { useToast } from '@/app/context/ToastContext';

export default function ApiTestPage() {
  const { showToast } = useToast();
  const [apiEndpoint, setApiEndpoint] = useState('/api/ai/analyze-proposal');
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    proposalContent: 'Sample proposal content...',
    tenderContent: 'Sample tender content...',
    proposalMetadata: {
      title: 'Sample Proposal',
      vendor: 'Sample Vendor',
    },
    tenderMetadata: {
      title: 'Sample Tender',
      category: 'Information Technology',
      budget: 50000,
    }
  }, null, 2));
  
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse('');
    
    try {
      // Validate JSON
      const requestData = JSON.parse(requestBody);
      
      // Make API request
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      const data = await response.json();
      
      // Format and display response
      setResponse(JSON.stringify(data, null, 2));
      
      if (response.ok) {
        showToast({
          type: 'success',
          title: 'API Request Successful',
          message: `Status: ${response.status} ${response.statusText}`,
        });
      } else {
        showToast({
          type: 'error',
          title: 'API Request Failed',
          message: `Status: ${response.status} ${response.statusText}`,
        });
      }
    } catch (error: any) {
      console.error('Error making API request:', error);
      setResponse(JSON.stringify({ error: error.message }, null, 2));
      showToast({
        type: 'error',
        title: 'API Request Failed',
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectEndpoint = (endpoint: string) => {
    setApiEndpoint(endpoint);
    
    // Set default request body based on selected endpoint
    switch (endpoint) {
      case '/api/ai/validate-document':
        setRequestBody(JSON.stringify({
          documentType: 'tender',
          content: 'Sample tender document content...',
          metadata: {
            title: 'Sample Tender',
            category: 'Information Technology',
          }
        }, null, 2));
        break;
        
      case '/api/ai/evaluate-tender':
        setRequestBody(JSON.stringify({
          tenderContent: 'Sample tender content...',
          metadata: {
            title: 'Sample Tender',
            category: 'Information Technology',
            budget: 50000,
            deadline: '2023-12-31',
          }
        }, null, 2));
        break;
        
      case '/api/ai/match-vendors':
        setRequestBody(JSON.stringify({
          tenderContent: 'Sample tender content...',
          metadata: {
            title: 'Sample Tender',
            category: 'Information Technology',
            budget: 50000,
          }
        }, null, 2));
        break;
        
      case '/api/ai/analyze-proposal':
        setRequestBody(JSON.stringify({
          proposalContent: 'Sample proposal content...',
          tenderContent: 'Sample tender content...',
          proposalMetadata: {
            title: 'Sample Proposal',
            vendor: 'Sample Vendor',
          },
          tenderMetadata: {
            title: 'Sample Tender',
            category: 'Information Technology',
            budget: 50000,
          }
        }, null, 2));
        break;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">AI API Testing Interface</h1>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Test AI APIs</h2>
              <p className="mt-1 text-sm text-gray-500">
                Use this interface to test the AI-powered APIs.
              </p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="apiEndpoint" className="block text-sm font-medium text-gray-700 mb-1">
                    API Endpoint
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`px-3 py-1 text-sm rounded-md ${apiEndpoint === '/api/ai/validate-document' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                      onClick={() => handleSelectEndpoint('/api/ai/validate-document')}
                    >
                      Validate Document
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1 text-sm rounded-md ${apiEndpoint === '/api/ai/evaluate-tender' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                      onClick={() => handleSelectEndpoint('/api/ai/evaluate-tender')}
                    >
                      Evaluate Tender
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1 text-sm rounded-md ${apiEndpoint === '/api/ai/match-vendors' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                      onClick={() => handleSelectEndpoint('/api/ai/match-vendors')}
                    >
                      Match Vendors
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1 text-sm rounded-md ${apiEndpoint === '/api/ai/analyze-proposal' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                      onClick={() => handleSelectEndpoint('/api/ai/analyze-proposal')}
                    >
                      Analyze Proposal
                    </button>
                  </div>
                  <input
                    type="text"
                    id="apiEndpoint"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="requestBody" className="block text-sm font-medium text-gray-700 mb-1">
                    Request Body (JSON)
                  </label>
                  <textarea
                    id="requestBody"
                    rows={15}
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : 'Send Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {response && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">API Response</h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[600px] text-sm font-mono">
                  {response}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
