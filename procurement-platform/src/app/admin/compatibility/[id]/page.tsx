'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MicroButton from '@/app/components/MicroButton';

interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  requirements: any;
}

interface Vendor {
  id: string;
  name: string;
  description: string;
  industry: string[];
  expertise: string[];
  years_in_business: number;
  company_size: string;
}

interface CompatibilityFactor {
  name: string;
  score: number;
  weight: number;
  explanation: string;
}

interface CompatibilityScore {
  id: string;
  tender_id: string;
  vendor_id: string;
  score: number;
  factors: CompatibilityFactor[];
  created_at: string;
  updated_at: string;
  tender: Tender;
  vendor: Vendor;
}

export default function CompatibilityDetail() {
  const params = useParams();
  const router = useRouter();
  const [compatibilityScore, setCompatibilityScore] = useState<CompatibilityScore | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCompatibilityScore = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would be an API call
        // For now, we'll use mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock compatibility score
        const mockScore: CompatibilityScore = {
          id: params.id as string,
          tender_id: 'tender-1',
          vendor_id: 'vendor-1',
          score: 0.85,
          factors: [
            { name: 'Industry Match', score: 0.9, weight: 0.25, explanation: 'Vendor has experience in the required industries. ABC Construction specializes in infrastructure projects, which aligns perfectly with the Urban Trails Project requirements.' },
            { name: 'Expertise Match', score: 0.8, weight: 0.3, explanation: 'Vendor has most of the required expertise areas. The vendor has demonstrated expertise in trail construction, urban planning, and landscape architecture. However, they lack some experience in environmental impact assessment.' },
            { name: 'Experience Match', score: 0.95, weight: 0.2, explanation: 'Vendor has 15 years in business and 5 relevant projects. They have completed similar urban trail projects in multiple cities, demonstrating a strong track record in this specific area.' },
            { name: 'Capacity Match', score: 0.7, weight: 0.15, explanation: 'Vendor size (medium) matches the required capacity. The company has sufficient resources to handle a project of this scale, though they might be stretched if multiple large projects overlap.' },
            { name: 'Certification Match', score: 0.8, weight: 0.1, explanation: 'Vendor has 4 of 5 required certifications. They have ISO 9001, ISO 14001, OHSAS 18001, and local construction certifications, but lack the specialized environmental certification that would be beneficial.' },
          ],
          created_at: '2023-05-15T10:30:00Z',
          updated_at: '2023-05-15T10:30:00Z',
          tender: {
            id: 'tender-1',
            title: 'Urban Trails Project',
            description: 'Development of urban trails and green corridors to connect city parks and recreational areas.',
            category: 'Infrastructure',
            status: 'published',
            requirements: {
              industry: ['Construction', 'Infrastructure', 'Urban Planning'],
              expertise: ['Trail Construction', 'Urban Planning', 'Landscape Architecture', 'Environmental Assessment'],
              years_experience: 10,
              company_size: 'medium',
              certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001', 'Local Construction Certification', 'Environmental Certification']
            }
          },
          vendor: {
            id: 'vendor-1',
            name: 'ABC Construction',
            description: 'A leading construction company specializing in infrastructure and urban development projects.',
            industry: ['Construction', 'Infrastructure'],
            expertise: ['Trail Construction', 'Urban Planning', 'Landscape Architecture'],
            years_in_business: 15,
            company_size: 'medium'
          }
        };
        
        setCompatibilityScore(mockScore);
      } catch (error) {
        console.error('Error fetching compatibility score:', error);
        setError('Failed to fetch compatibility score. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (params.id) {
      fetchCompatibilityScore();
    }
  }, [params.id]);
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056a4]"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !compatibilityScore) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
            <p className="mt-1 text-sm text-gray-500">
              {error || 'Compatibility score not found.'}
            </p>
            <div className="mt-6">
              <MicroButton
                variant="primary"
                onClick={() => router.push('/admin/compatibility')}
              >
                Back to Compatibility Dashboard
              </MicroButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Compatibility Analysis</h1>
            <p className="mt-1 text-sm text-gray-500">
              Detailed compatibility analysis between tender and vendor
            </p>
          </div>
          <MicroButton
            variant="outline"
            onClick={() => router.push('/admin/compatibility')}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            }
          >
            Back to Dashboard
          </MicroButton>
        </div>
        
        {/* Summary Card */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Compatibility Summary</h2>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {compatibilityScore.tender.title} + {compatibilityScore.vendor.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Analysis performed on {formatDate(compatibilityScore.created_at)}
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-col items-center">
                <div className="text-3xl font-bold text-gray-900">
                  {Math.round(compatibilityScore.score * 100)}%
                </div>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(compatibilityScore.score)}`}>
                    {compatibilityScore.score >= 0.8 ? 'Excellent Match' : 
                     compatibilityScore.score >= 0.6 ? 'Good Match' : 'Poor Match'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-900">Compatibility Factors</h4>
              
              <div className="mt-4 space-y-4">
                {compatibilityScore.factors
                  .sort((a, b) => (b.score * b.weight) - (a.score * a.weight))
                  .map((factor, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h5 className="text-sm font-medium text-gray-900">{factor.name}</h5>
                          <p className="mt-1 text-sm text-gray-500">{factor.explanation}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(factor.score)}`}>
                            {Math.round(factor.score * 100)}%
                          </span>
                          <span className="mt-1 text-xs text-gray-500">
                            Weight: {Math.round(factor.weight * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tender and Vendor Details */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Tender Details */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Tender Details</h2>
              <Link
                href={`/admin/tenders/${compatibilityScore.tender_id}`}
                className="text-sm font-medium text-[#0056a4] hover:text-[#004483]"
              >
                View Tender
              </Link>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Title</dt>
                  <dd className="mt-1 text-sm text-gray-900">{compatibilityScore.tender.title}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">{compatibilityScore.tender.category}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{compatibilityScore.tender.description}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Required Industries</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {compatibilityScore.tender.requirements.industry.map((industry: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2">
                        {industry}
                      </span>
                    ))}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Required Expertise</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {compatibilityScore.tender.requirements.expertise.map((expertise: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2 mb-2">
                        {expertise}
                      </span>
                    ))}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Required Experience</dt>
                  <dd className="mt-1 text-sm text-gray-900">{compatibilityScore.tender.requirements.years_experience} years</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Required Company Size</dt>
                  <dd className="mt-1 text-sm text-gray-900">{compatibilityScore.tender.requirements.company_size}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Required Certifications</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {compatibilityScore.tender.requirements.certifications.map((certification: string, index: number) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2 mb-2">
                        {certification}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Vendor Details */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Vendor Details</h2>
              <Link
                href={`/admin/vendors/${compatibilityScore.vendor_id}`}
                className="text-sm font-medium text-[#0056a4] hover:text-[#004483]"
              >
                View Vendor
              </Link>
            </div>
            
            <div className="px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{compatibilityScore.vendor.name}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{compatibilityScore.vendor.description}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Industries</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {compatibilityScore.vendor.industry.map((industry, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2">
                        {industry}
                      </span>
                    ))}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Expertise</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {compatibilityScore.vendor.expertise.map((expertise, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2 mb-2">
                        {expertise}
                      </span>
                    ))}
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Years in Business</dt>
                  <dd className="mt-1 text-sm text-gray-900">{compatibilityScore.vendor.years_in_business} years</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Company Size</dt>
                  <dd className="mt-1 text-sm text-gray-900">{compatibilityScore.vendor.company_size}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-8 flex justify-end space-x-4">
          <MicroButton
            variant="outline"
            onClick={() => {
              // In a real implementation, this would trigger a re-analysis
              alert('This would trigger a re-analysis of the compatibility between this tender and vendor.');
            }}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          >
            Re-analyze Compatibility
          </MicroButton>
          
          <MicroButton
            variant="primary"
            onClick={() => {
              // In a real implementation, this would invite the vendor to submit a proposal
              alert('This would send an invitation to the vendor to submit a proposal for this tender.');
            }}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          >
            Invite Vendor to Submit Proposal
          </MicroButton>
        </div>
      </div>
    </div>
  );
}
