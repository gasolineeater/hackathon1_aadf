'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TenderService } from '../services/procurement.service';
import { Tender, TenderStatus } from '../types/procurement';
import MicroButton from '../components/MicroButton';
import { useToast } from '../context/ToastContext';

export default function ProcurementPage() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TenderStatus | 'all'>('all');
  const { showToast } = useToast();

  useEffect(() => {
    // Load tenders
    const loadTenders = () => {
      setIsLoading(true);
      try {
        const allTenders = TenderService.getAllTenders();
        setTenders(allTenders);
        setFilteredTenders(allTenders);
      } catch (error) {
        console.error('Error loading tenders:', error);
        showToast('Failed to load tenders. Please try again.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadTenders();
  }, [showToast]);

  // Filter tenders when search query or status filter changes
  useEffect(() => {
    let filtered = [...tenders];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(tender => tender.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tender =>
        tender.title.toLowerCase().includes(query) ||
        tender.reference.toLowerCase().includes(query) ||
        tender.description.toLowerCase().includes(query) ||
        tender.category.some(cat => cat.toLowerCase().includes(query))
      );
    }

    setFilteredTenders(filtered);
  }, [tenders, searchQuery, statusFilter]);

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

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Procurement</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            At AADF, recognizing the importance of responsibly and efficiently managing resources, we uphold transparency, fairness, and competitive excellence in all procurement activities. Dedicated to strengthening local markets through prioritized local sourcing, we also strive to foster knowledge transfer to local teams when collaborating with international experts, supporting professional growth and economic development. For any inquiries or further information, please contact us via email at tenders@aadf.org.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-gray-900">Active Tenders</h2>
          <div className="mt-4 md:mt-0">
            <MicroButton
              href="/procurement/create"
              variant="primary"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              }
            >
              Create New Tender
            </MicroButton>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <div className="flex-1 mb-4 md:mb-0">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Tenders
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by title, reference, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TenderStatus | 'all')}
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="evaluation">Under Evaluation</option>
                <option value="awarded">Awarded</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tenders List */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-[#0056a4] border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-2 text-sm text-gray-600">Loading tenders...</p>
              </div>
            </div>
          ) : filteredTenders.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tenders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter to find what you\'re looking for.'
                  : 'Get started by creating a new tender.'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <div className="mt-6">
                  <MicroButton
                    href="/procurement/create"
                    variant="primary"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    }
                  >
                    Create New Tender
                  </MicroButton>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tender
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timeline
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Budget
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTenders.map((tender) => (
                    <tr key={tender.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              <Link href={`/procurement/${tender.id}`} className="hover:text-[#0056a4]">
                                {tender.title}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-500">
                              Ref: {tender.reference}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {tender.category.map((cat, index) => (
                            <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(tender.status)}`}>
                          {tender.status.charAt(0).toUpperCase() + tender.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div>Published: {formatDate(tender.timeline.publicationDate)}</div>
                          <div>Deadline: {formatDate(tender.timeline.submissionDeadline)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tender.budget ? (
                          <span>{tender.budget.amount.toLocaleString()} {tender.budget.currency}</span>
                        ) : (
                          <span>Not specified</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/procurement/${tender.id}`}
                            className="text-[#0056a4] hover:text-[#004483]"
                          >
                            View
                          </Link>
                          {tender.status === 'published' && (
                            <Link
                              href={`/procurement/${tender.id}/submit`}
                              className="text-green-600 hover:text-green-800"
                            >
                              Submit Proposal
                            </Link>
                          )}
                          {tender.status === 'draft' && (
                            <Link
                              href={`/procurement/${tender.id}/edit`}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              Edit
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
