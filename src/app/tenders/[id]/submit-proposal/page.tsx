'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockTenders } from '@/lib/mockData';

export default function SubmitProposalPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const tenderId = params.id;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tender, setTender] = useState<any>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isAIChecking, setIsAIChecking] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    vendorName: '',
    email: '',
    phone: '',
    amount: '',
    description: '',
    approach: '',
    timeline: '',
    team: '',
    acceptTerms: false
  });

  // Fetch tender data
  useEffect(() => {
    const tenderData = mockTenders.find(t => t.id === tenderId);
    setTender(tenderData);

    if (tenderData) {
      setFormData(prev => ({
        ...prev,
        title: `Proposal for ${tenderData.title}`
      }));
    }
  }, [tenderId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle AI check
  const handleAICheck = async () => {
    setIsAIChecking(true);
    setShowAIModal(true);

    try {
      // In a real app, we would call an AI API
      // For demo purposes, we'll just simulate a delay and return mock results
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock AI results based on form data
      const missingFields = [];
      const suggestions = [];
      let score = 85;

      if (!formData.title || formData.title.length < 10) {
        missingFields.push('A more descriptive proposal title');
        score -= 5;
      }

      if (!formData.description || formData.description.length < 50) {
        missingFields.push('A more detailed executive summary');
        score -= 10;
      }

      if (!formData.approach || formData.approach.length < 100) {
        missingFields.push('A more comprehensive approach and methodology');
        score -= 15;
      }

      if (!formData.timeline || formData.timeline.length < 50) {
        missingFields.push('A more detailed timeline with specific milestones');
        score -= 10;
      }

      if (!formData.team || formData.team.length < 50) {
        missingFields.push('More information about your team and their qualifications');
        score -= 10;
      }

      // Add suggestions based on tender requirements
      if (tender.requirements.some((req: string) => req.toLowerCase().includes('security'))) {
        if (!formData.approach || !formData.approach.toLowerCase().includes('security')) {
          suggestions.push('Include more details about your security approach');
        }
      }

      if (tender.requirements.some((req: string) => req.toLowerCase().includes('training'))) {
        if (!formData.approach || !formData.approach.toLowerCase().includes('training')) {
          suggestions.push('Add information about your training methodology');
        }
      }

      setAiResults({
        score: Math.max(score, 30),
        missingFields,
        suggestions,
        compatibility: {
          technical: Math.floor(Math.random() * 30) + 70,
          experience: Math.floor(Math.random() * 30) + 70,
          budget: formData.amount ? (Number(formData.amount) <= tender.budget ? 90 : 60) : 50,
          timeline: Math.floor(Math.random() * 30) + 70
        }
      });
    } catch (error) {
      console.error('Error running AI check:', error);
    } finally {
      setIsAIChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, we would submit to an API
      // For demo purposes, we'll just simulate a delay and redirect
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to the success page
      router.push(`/tenders/${tenderId}/submit-proposal/success`);
    } catch (error) {
      console.error('Error submitting proposal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if deadline has passed
  const isDeadlinePassed = () => {
    if (!tender) return false;
    const deadline = new Date(tender.deadline);
    const now = new Date();
    return now > deadline;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="text-lg font-medium text-gray-900 mt-4">Loading tender details...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (isDeadlinePassed()) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href={`/tenders/${tenderId}`}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tender
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-gray-900 mb-2">Submission Deadline Passed</h2>
            <p className="text-sm text-gray-500 mb-4">
              The deadline for submitting proposals to this tender was {formatDate(tender.deadline)}.
            </p>
            <Link
              href="/tenders"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View Other Tenders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* AI Analysis Modal */}
      {showAIModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    AI Proposal Analysis
                  </h3>

                  {isAIChecking ? (
                    <div className="mt-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-500">Analyzing your proposal...</p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      {aiResults && (
                        <div className="text-left">
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Overall Compatibility Score</h4>
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full ${
                                    aiResults.score >= 80 ? 'bg-green-600' :
                                    aiResults.score >= 60 ? 'bg-yellow-500' : 'bg-red-600'
                                  }`}
                                  style={{ width: `${aiResults.score}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-sm font-medium text-gray-700">{aiResults.score}%</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Compatibility Breakdown</h4>
                            <div className="space-y-2">
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Technical Fit</span>
                                  <span>{aiResults.compatibility.technical}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-blue-600 h-1.5 rounded-full"
                                    style={{ width: `${aiResults.compatibility.technical}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Experience Match</span>
                                  <span>{aiResults.compatibility.experience}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-purple-600 h-1.5 rounded-full"
                                    style={{ width: `${aiResults.compatibility.experience}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Budget Alignment</span>
                                  <span>{aiResults.compatibility.budget}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-green-600 h-1.5 rounded-full"
                                    style={{ width: `${aiResults.compatibility.budget}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Timeline Feasibility</span>
                                  <span>{aiResults.compatibility.timeline}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-yellow-500 h-1.5 rounded-full"
                                    style={{ width: `${aiResults.compatibility.timeline}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {aiResults.missingFields.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-red-700 mb-2">Missing Information</h4>
                              <ul className="list-disc pl-5 text-sm text-red-600 space-y-1">
                                {aiResults.missingFields.map((field: string, index: number) => (
                                  <li key={index}>{field}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {aiResults.suggestions.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-medium text-indigo-700 mb-2">Suggestions for Improvement</h4>
                              <ul className="list-disc pl-5 text-sm text-indigo-600 space-y-1">
                                {aiResults.suggestions.map((suggestion: string, index: number) => (
                                  <li key={index}>{suggestion}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {aiResults.missingFields.length === 0 && aiResults.suggestions.length === 0 && (
                            <div className="mb-4 bg-green-50 p-3 rounded-md">
                              <div className="flex">
                                <div className="flex-shrink-0">
                                  <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm text-green-700">
                                    Your proposal looks complete and addresses all the tender requirements!
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={() => setShowAIModal(false)}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/tenders/${tenderId}`}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tender
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Submit Proposal</h1>
          <p className="mt-1 text-sm text-gray-500">
            For: {tender.title}
          </p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Tender Details</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">{tender.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{tender.description}</p>

                <div className="bg-yellow-50 p-4 rounded-md mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Submission Deadline</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>{formatDate(tender.deadline)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Requirements</h3>
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1 mb-4">
                  {tender.requirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>

                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Budget:</span> €{tender.budget.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 bg-indigo-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-indigo-800">Proposal Submission</h2>
            <p className="mt-1 text-sm text-indigo-600">
              Fill in the details of your proposal
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Vendor Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vendor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700">
                      Company/Vendor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="vendorName"
                      id="vendorName"
                      required
                      value={formData.vendorName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Proposal Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Proposed Amount (€) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      required
                      min="0"
                      max={tender.budget * 1.2} // Allow up to 20% over budget
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {formData.amount && Number(formData.amount) > tender.budget && (
                      <p className="mt-1 text-xs text-yellow-600">
                        Note: Your proposed amount exceeds the tender budget of €{tender.budget.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Proposal Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Proposal Details</h3>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Executive Summary <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Provide a brief summary of your proposal"
                    />
                  </div>

                  <div>
                    <label htmlFor="approach" className="block text-sm font-medium text-gray-700">
                      Approach & Methodology <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="approach"
                      name="approach"
                      rows={6}
                      required
                      value={formData.approach}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Describe your approach to meeting the tender requirements"
                    />
                  </div>

                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                      Timeline & Deliverables <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="timeline"
                      name="timeline"
                      rows={4}
                      required
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Outline your proposed timeline and key deliverables"
                    />
                  </div>

                  <div>
                    <label htmlFor="team" className="block text-sm font-medium text-gray-700">
                      Team & Qualifications <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="team"
                      name="team"
                      rows={4}
                      required
                      value={formData.team}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Describe your team and their qualifications"
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Supporting Documents</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Technical Proposal <span className="text-red-500">*</span>
                    </label>
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="technical-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload file</span>
                            <input id="technical-upload" name="technical-upload" type="file" className="sr-only" required />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF or DOCX up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Financial Proposal <span className="text-red-500">*</span>
                    </label>
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="financial-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload file</span>
                            <input id="financial-upload" name="financial-upload" type="file" className="sr-only" required />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF or XLSX up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Profile & References (Optional)
                    </label>
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
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
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="profile-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload file</span>
                            <input id="profile-upload" name="profile-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF or DOCX up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI-Assisted Features */}
              <div className="bg-indigo-50 p-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-indigo-800">AI-Assisted Proposal Submission</h3>
                    <div className="mt-2 text-sm text-indigo-700">
                      <p>Our AI will:</p>
                      <ul className="list-disc pl-5 space-y-1 mt-1">
                        <li>Check your proposal for completeness</li>
                        <li>Identify missing information</li>
                        <li>Suggest improvements to better address tender requirements</li>
                        <li>Estimate your proposal's compatibility score</li>
                      </ul>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={handleAICheck}
                        disabled={isAIChecking}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50"
                      >
                        {isAIChecking ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-700" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                          </>
                        ) : (
                          'Run AI Check'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      required
                      checked={formData.acceptTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                      I certify that all information provided is accurate and complete. I understand that any false information may result in disqualification. <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Proposal saved as draft')}
                  className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save as Draft
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    isSubmitting
                      ? 'bg-indigo-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Proposal'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
