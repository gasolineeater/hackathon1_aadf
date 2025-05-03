'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { TenderService, ProposalService, EvaluationService } from '../../services/procurement.service';
import { Tender, Proposal, TenderStatus } from '../../types/procurement';
import MicroButton from '../../components/MicroButton';
import { useToast } from '../../context/ToastContext';
import AnimatedProgressBar from '../../components/AnimatedProgressBar';

export default function TenderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const [tender, setTender] = useState<Tender | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status: TenderStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'evaluation':
        return 'bg-yellow-100 text-yellow-800';
      case 'awarded':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle status change
  const handleStatusChange = async (newStatus: TenderStatus) => {
    if (!tender) return;

    try {
      const updatedTender = TenderService.updateTenderStatus(tender.id, newStatus);
      if (updatedTender) {
        setTender(updatedTender);
        showToast(`Tender status updated to ${newStatus}`, 'success');
      } else {
        showToast('Failed to update tender status', 'error');
      }
    } catch (error) {
      console.error('Error updating tender status:', error);
      showToast('Failed to update tender status', 'error');
    }
  };

  // Calculate tender progress
  const calculateTenderProgress = () => {
    if (!tender) return 0;

    const statusOrder: TenderStatus[] = ['draft', 'published', 'evaluation', 'awarded', 'completed'];
    const currentIndex = statusOrder.indexOf(tender.status);

    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  useEffect(() => {
    const loadTenderData = async () => {
      setIsLoading(true);
      try {
        const tenderId = params.id as string;
        const tenderData = TenderService.getTenderById(tenderId);

        if (!tenderData) {
          showToast('Tender not found', 'error');
          router.push('/procurement');
          return;
        }

        setTender(tenderData);

        // Load proposals if user has permission
        // In a real app, this would check user roles
        if (tenderData.status !== 'draft') {
          const proposalData = ProposalService.getProposalsByTenderId(tenderId);
          setProposals(proposalData);
        }
      } catch (error) {
        console.error('Error loading tender data:', error);
        showToast('Failed to load tender data', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadTenderData();
  }, [params.id, router, showToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-[#0056a4] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-sm text-gray-600">Loading tender details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Tender Not Found</h2>
            <p className="text-gray-500 mb-6">The tender you are looking for does not exist or has been removed.</p>
            <MicroButton href="/procurement" variant="primary">
              Back to Procurement
            </MicroButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button and actions */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/procurement"
            className="inline-flex items-center text-sm font-medium text-[#0056a4] hover:text-[#004483] mb-4 sm:mb-0"
          >
            <svg className="mr-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Procurement
          </Link>

          <div className="flex flex-wrap gap-2">
            {tender.status === 'draft' && (
              <>
                <MicroButton
                  variant="primary"
                  onClick={() => handleStatusChange('published')}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  }
                >
                  Publish Tender
                </MicroButton>
                <MicroButton
                  href={`/procurement/${tender.id}/edit`}
                  variant="secondary"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  }
                >
                  Edit Tender
                </MicroButton>
              </>
            )}

            {tender.status === 'published' && (
              <>
                <MicroButton
                  href={`/procurement/${tender.id}/submit`}
                  variant="primary"
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                >
                  Submit Proposal
                </MicroButton>
                <MicroButton
                  variant="secondary"
                  onClick={() => handleStatusChange('evaluation')}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  }
                >
                  Start Evaluation
                </MicroButton>
              </>
            )}

            {tender.status === 'evaluation' && (
              <MicroButton
                href={`/procurement/${tender.id}/evaluate`}
                variant="primary"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                Evaluate Proposals
              </MicroButton>
            )}

            {tender.status === 'awarded' && (
              <MicroButton
                href={`/procurement/${tender.id}/contract`}
                variant="primary"
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              >
                Manage Contract
              </MicroButton>
            )}

            {(tender.status === 'draft' || tender.status === 'published') && (
              <MicroButton
                variant="outline"
                onClick={() => handleStatusChange('cancelled')}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                Cancel Tender
              </MicroButton>
            )}
          </div>
        </div>

        {/* Tender header */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{tender.title}</h1>
                <p className="mt-1 text-sm text-gray-500">Reference: {tender.reference}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(tender.status)}`}>
                  {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Procurement Progress</h3>
              <AnimatedProgressBar
                value={calculateTenderProgress()}
                height={8}
                color="#0056a4"
                isLoading={false}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
                <div className="mt-2 text-sm text-gray-900">
                  <div className="flex justify-between mb-1">
                    <span>Publication Date:</span>
                    <span>{formatDate(tender.timeline.publicationDate)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Submission Deadline:</span>
                    <span>{formatDate(tender.timeline.submissionDeadline)}</span>
                  </div>
                  {tender.timeline.evaluationStartDate && (
                    <div className="flex justify-between mb-1">
                      <span>Evaluation Start:</span>
                      <span>{formatDate(tender.timeline.evaluationStartDate)}</span>
                    </div>
                  )}
                  {tender.timeline.evaluationEndDate && (
                    <div className="flex justify-between mb-1">
                      <span>Evaluation End:</span>
                      <span>{formatDate(tender.timeline.evaluationEndDate)}</span>
                    </div>
                  )}
                  {tender.timeline.awardDate && (
                    <div className="flex justify-between">
                      <span>Award Date:</span>
                      <span>{formatDate(tender.timeline.awardDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tender.category.map((cat, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                <div className="mt-2 text-sm text-gray-900">
                  {tender.budget ? (
                    <span className="text-lg font-semibold">{tender.budget.amount.toLocaleString()} {tender.budget.currency}</span>
                  ) : (
                    <span>Not specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                className={`${
                  activeTab === 'overview'
                    ? 'border-[#0056a4] text-[#0056a4]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`${
                  activeTab === 'documents'
                    ? 'border-[#0056a4] text-[#0056a4]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('documents')}
              >
                Documents
              </button>
              {(tender.status === 'evaluation' || tender.status === 'awarded' || tender.status === 'completed') && (
                <button
                  className={`${
                    activeTab === 'proposals'
                      ? 'border-[#0056a4] text-[#0056a4]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('proposals')}
                >
                  Proposals ({proposals.length})
                </button>
              )}
              {(tender.status === 'awarded' || tender.status === 'completed') && (
                <button
                  className={`${
                    activeTab === 'contract'
                      ? 'border-[#0056a4] text-[#0056a4]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm`}
                  onClick={() => setActiveTab('contract')}
                >
                  Contract
                </button>
              )}
            </nav>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Tender Description</h2>
                <p className="text-gray-700 mb-6">{tender.description}</p>

                <h3 className="text-lg font-medium text-gray-900 mb-4">Eligibility Criteria</h3>
                <ul className="list-disc pl-5 mb-6 text-gray-700">
                  {tender.eligibilityCriteria.map((criterion, index) => (
                    <li key={index} className="mb-2">{criterion}</li>
                  ))}
                </ul>

                <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluation Criteria</h3>
                <div className="overflow-hidden bg-white shadow-sm border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Criterion
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Weight
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score Range
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {tender.evaluationCriteria.map((criterion) => (
                        <tr key={criterion.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {criterion.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {criterion.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {criterion.weight}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {criterion.minScore} - {criterion.maxScore}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Tender Documents</h2>
                {tender.documents.length === 0 ? (
                  <p className="text-gray-500">No documents available for this tender.</p>
                ) : (
                  <div className="overflow-hidden bg-white shadow-sm border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Document Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Uploaded
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tender.documents.map((document) => (
                          <tr key={document.id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {document.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {document.type.replace('_', ' ').charAt(0).toUpperCase() + document.type.replace('_', ' ').slice(1)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {(document.fileSize / (1024 * 1024)).toFixed(2)} MB
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(document.uploadedAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a
                                href={document.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0056a4] hover:text-[#004483]"
                              >
                                Download
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'proposals' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Submitted Proposals</h2>
                {proposals.length === 0 ? (
                  <p className="text-gray-500">No proposals have been submitted for this tender yet.</p>
                ) : (
                  <div className="overflow-hidden bg-white shadow-sm border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vendor
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submission Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Financial Offer
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {proposals.map((proposal) => (
                          <tr key={proposal.id}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {proposal.vendorName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(proposal.submissionDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                proposal.status === 'selected' ? 'bg-green-100 text-green-800' :
                                proposal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                proposal.status === 'shortlisted' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {proposal.status.replace('_', ' ').charAt(0).toUpperCase() + proposal.status.replace('_', ' ').slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {proposal.financialProposal.amount.toLocaleString()} {proposal.financialProposal.currency}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link
                                href={`/procurement/${tender.id}/proposals/${proposal.id}`}
                                className="text-[#0056a4] hover:text-[#004483]"
                              >
                                View Details
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contract' && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Contract Information</h2>
                <p className="text-gray-500">Contract details will be displayed here once the tender has been awarded.</p>
                <div className="mt-6">
                  <MicroButton
                    href={`/procurement/${tender.id}/contract`}
                    variant="primary"
                  >
                    View Contract Details
                  </MicroButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
