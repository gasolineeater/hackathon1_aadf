'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MicroButton from '@/app/components/MicroButton';

interface Tender {
  id: string;
  title: string;
  category: string;
  status: string;
}

interface Vendor {
  id: string;
  name: string;
  industry: string[];
}

interface CompatibilityScore {
  id: string;
  tender_id: string;
  vendor_id: string;
  score: number;
  factors: CompatibilityFactor[];
  tender: Tender;
  vendor: Vendor;
}

interface CompatibilityFactor {
  name: string;
  score: number;
  weight: number;
  explanation: string;
}

export default function CompatibilityDashboard() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [compatibilityScores, setCompatibilityScores] = useState<CompatibilityScore[]>([]);
  const [selectedTender, setSelectedTender] = useState<string>('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch tenders, vendors, and compatibility scores on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, these would be API calls
        // For now, we'll use mock data
        
        // Mock tenders
        const mockTenders: Tender[] = [
          { id: 'tender-1', title: 'Urban Trails Project', category: 'Infrastructure', status: 'published' },
          { id: 'tender-2', title: 'Digital Transformation', category: 'IT Services', status: 'published' },
          { id: 'tender-3', title: 'Cultural Heritage Preservation', category: 'Cultural', status: 'published' },
        ];
        
        // Mock vendors
        const mockVendors: Vendor[] = [
          { id: 'vendor-1', name: 'ABC Construction', industry: ['Construction', 'Infrastructure'] },
          { id: 'vendor-2', name: 'Tech Solutions Ltd', industry: ['IT', 'Software Development'] },
          { id: 'vendor-3', name: 'Heritage Experts', industry: ['Cultural', 'Preservation'] },
          { id: 'vendor-4', name: 'Digital Innovators', industry: ['IT', 'Digital Marketing'] },
        ];
        
        setTenders(mockTenders);
        setVendors(mockVendors);
        
        // Fetch compatibility scores
        await fetchCompatibilityScores();
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again.');
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch compatibility scores
  const fetchCompatibilityScores = async () => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      
      // Mock compatibility scores
      const mockScores: CompatibilityScore[] = [
        {
          id: 'score-1',
          tender_id: 'tender-1',
          vendor_id: 'vendor-1',
          score: 0.85,
          factors: [
            { name: 'Industry Match', score: 0.9, weight: 0.25, explanation: 'Vendor has experience in the required industries.' },
            { name: 'Expertise Match', score: 0.8, weight: 0.3, explanation: 'Vendor has most of the required expertise areas.' },
            { name: 'Experience Match', score: 0.95, weight: 0.2, explanation: 'Vendor has 15 years in business and 5 relevant projects.' },
            { name: 'Capacity Match', score: 0.7, weight: 0.15, explanation: 'Vendor size (medium) matches the required capacity.' },
            { name: 'Certification Match', score: 0.8, weight: 0.1, explanation: 'Vendor has 4 of 5 required certifications.' },
          ],
          tender: { id: 'tender-1', title: 'Urban Trails Project', category: 'Infrastructure', status: 'published' },
          vendor: { id: 'vendor-1', name: 'ABC Construction', industry: ['Construction', 'Infrastructure'] },
        },
        {
          id: 'score-2',
          tender_id: 'tender-1',
          vendor_id: 'vendor-2',
          score: 0.45,
          factors: [
            { name: 'Industry Match', score: 0.2, weight: 0.25, explanation: 'Vendor has limited experience in the required industries.' },
            { name: 'Expertise Match', score: 0.5, weight: 0.3, explanation: 'Vendor has some of the required expertise areas.' },
            { name: 'Experience Match', score: 0.6, weight: 0.2, explanation: 'Vendor has 8 years in business and 2 relevant projects.' },
            { name: 'Capacity Match', score: 0.5, weight: 0.15, explanation: 'Vendor size (small) partially matches the required capacity.' },
            { name: 'Certification Match', score: 0.4, weight: 0.1, explanation: 'Vendor has 2 of 5 required certifications.' },
          ],
          tender: { id: 'tender-1', title: 'Urban Trails Project', category: 'Infrastructure', status: 'published' },
          vendor: { id: 'vendor-2', name: 'Tech Solutions Ltd', industry: ['IT', 'Software Development'] },
        },
        {
          id: 'score-3',
          tender_id: 'tender-2',
          vendor_id: 'vendor-2',
          score: 0.92,
          factors: [
            { name: 'Industry Match', score: 1.0, weight: 0.25, explanation: 'Vendor has experience in all required industries.' },
            { name: 'Expertise Match', score: 0.9, weight: 0.3, explanation: 'Vendor has most of the required expertise areas.' },
            { name: 'Experience Match', score: 0.85, weight: 0.2, explanation: 'Vendor has 8 years in business and 12 relevant projects.' },
            { name: 'Capacity Match', score: 0.9, weight: 0.15, explanation: 'Vendor size (small) matches the required capacity.' },
            { name: 'Certification Match', score: 1.0, weight: 0.1, explanation: 'Vendor has all required certifications.' },
          ],
          tender: { id: 'tender-2', title: 'Digital Transformation', category: 'IT Services', status: 'published' },
          vendor: { id: 'vendor-2', name: 'Tech Solutions Ltd', industry: ['IT', 'Software Development'] },
        },
        {
          id: 'score-4',
          tender_id: 'tender-2',
          vendor_id: 'vendor-4',
          score: 0.88,
          factors: [
            { name: 'Industry Match', score: 0.9, weight: 0.25, explanation: 'Vendor has experience in most required industries.' },
            { name: 'Expertise Match', score: 0.85, weight: 0.3, explanation: 'Vendor has most of the required expertise areas.' },
            { name: 'Experience Match', score: 0.9, weight: 0.2, explanation: 'Vendor has 6 years in business and 8 relevant projects.' },
            { name: 'Capacity Match', score: 0.85, weight: 0.15, explanation: 'Vendor size (small) matches the required capacity.' },
            { name: 'Certification Match', score: 0.95, weight: 0.1, explanation: 'Vendor has most required certifications.' },
          ],
          tender: { id: 'tender-2', title: 'Digital Transformation', category: 'IT Services', status: 'published' },
          vendor: { id: 'vendor-4', name: 'Digital Innovators', industry: ['IT', 'Digital Marketing'] },
        },
        {
          id: 'score-5',
          tender_id: 'tender-3',
          vendor_id: 'vendor-3',
          score: 0.95,
          factors: [
            { name: 'Industry Match', score: 1.0, weight: 0.25, explanation: 'Vendor has experience in all required industries.' },
            { name: 'Expertise Match', score: 0.95, weight: 0.3, explanation: 'Vendor has almost all required expertise areas.' },
            { name: 'Experience Match', score: 0.9, weight: 0.2, explanation: 'Vendor has 20 years in business and 15 relevant projects.' },
            { name: 'Capacity Match', score: 0.9, weight: 0.15, explanation: 'Vendor size (medium) matches the required capacity.' },
            { name: 'Certification Match', score: 1.0, weight: 0.1, explanation: 'Vendor has all required certifications.' },
          ],
          tender: { id: 'tender-3', title: 'Cultural Heritage Preservation', category: 'Cultural', status: 'published' },
          vendor: { id: 'vendor-3', name: 'Heritage Experts', industry: ['Cultural', 'Preservation'] },
        },
      ];
      
      setCompatibilityScores(mockScores);
    } catch (error) {
      console.error('Error fetching compatibility scores:', error);
      setError('Failed to fetch compatibility scores. Please try again.');
    }
  };
  
  // Analyze compatibility between selected tender and vendor
  const analyzeCompatibility = async () => {
    if (!selectedTender || !selectedVendor) {
      setError('Please select both a tender and a vendor.');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // In a real implementation, this would be an API call
      // For now, we'll simulate the API call
      
      // Check if compatibility score already exists
      const existingScore = compatibilityScores.find(
        score => score.tender_id === selectedTender && score.vendor_id === selectedVendor
      );
      
      if (existingScore) {
        // If score exists, update it
        // In a real implementation, this would call the API
        console.log('Compatibility score already exists. Updating...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Refresh scores
        await fetchCompatibilityScores();
      } else {
        // If score doesn't exist, create a new one
        // In a real implementation, this would call the API
        console.log('Creating new compatibility score...');
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Get tender and vendor details
        const tender = tenders.find(t => t.id === selectedTender);
        const vendor = vendors.find(v => v.id === selectedVendor);
        
        if (!tender || !vendor) {
          throw new Error('Tender or vendor not found');
        }
        
        // Create mock compatibility score
        const newScore: CompatibilityScore = {
          id: `score-${Date.now()}`,
          tender_id: selectedTender,
          vendor_id: selectedVendor,
          score: Math.random() * 0.5 + 0.5, // Random score between 0.5 and 1.0
          factors: [
            { name: 'Industry Match', score: Math.random(), weight: 0.25, explanation: 'Generated explanation for industry match.' },
            { name: 'Expertise Match', score: Math.random(), weight: 0.3, explanation: 'Generated explanation for expertise match.' },
            { name: 'Experience Match', score: Math.random(), weight: 0.2, explanation: 'Generated explanation for experience match.' },
            { name: 'Capacity Match', score: Math.random(), weight: 0.15, explanation: 'Generated explanation for capacity match.' },
            { name: 'Certification Match', score: Math.random(), weight: 0.1, explanation: 'Generated explanation for certification match.' },
          ],
          tender,
          vendor,
        };
        
        // Add new score to the list
        setCompatibilityScores([...compatibilityScores, newScore]);
      }
      
      // Reset selection
      setSelectedTender('');
      setSelectedVendor('');
    } catch (error) {
      console.error('Error analyzing compatibility:', error);
      setError('Failed to analyze compatibility. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Filter scores based on selected tender
  const filteredScores = selectedTender
    ? compatibilityScores.filter(score => score.tender_id === selectedTender)
    : compatibilityScores;
  
  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">AI Compatibility Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage AI-powered compatibility scores between tenders and vendors
          </p>
        </div>
        
        {/* Analysis Form */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Analyze New Compatibility</h2>
          </div>
          
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="tender" className="block text-sm font-medium text-gray-700">
                  Select Tender
                </label>
                <select
                  id="tender"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                  value={selectedTender}
                  onChange={(e) => setSelectedTender(e.target.value)}
                >
                  <option value="">Select a tender...</option>
                  {tenders.map((tender) => (
                    <option key={tender.id} value={tender.id}>
                      {tender.title} ({tender.category})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="vendor" className="block text-sm font-medium text-gray-700">
                  Select Vendor
                </label>
                <select
                  id="vendor"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                >
                  <option value="">Select a vendor...</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name} ({vendor.industry.join(', ')})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 rounded-md text-sm text-red-700">
                <div className="flex">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <MicroButton
                variant="primary"
                onClick={analyzeCompatibility}
                disabled={!selectedTender || !selectedVendor || isAnalyzing}
                isLoading={isAnalyzing}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
              >
                Analyze Compatibility
              </MicroButton>
            </div>
          </div>
        </div>
        
        {/* Filter by Tender */}
        <div className="mb-6">
          <label htmlFor="filter-tender" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Tender
          </label>
          <select
            id="filter-tender"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0056a4] focus:ring-[#0056a4] sm:text-sm"
            value={selectedTender}
            onChange={(e) => setSelectedTender(e.target.value)}
          >
            <option value="">All Tenders</option>
            {tenders.map((tender) => (
              <option key={tender.id} value={tender.id}>
                {tender.title}
              </option>
            ))}
          </select>
        </div>
        
        {/* Compatibility Scores */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Compatibility Scores</h2>
          </div>
          
          {filteredScores.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
              No compatibility scores found.
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
                      Vendor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compatibility Score
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Top Factors
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredScores
                    .sort((a, b) => b.score - a.score)
                    .map((score) => (
                      <tr key={score.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{score.tender.title}</div>
                          <div className="text-sm text-gray-500">{score.tender.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{score.vendor.name}</div>
                          <div className="text-sm text-gray-500">{score.vendor.industry.join(', ')}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(score.score)}`}>
                            {Math.round(score.score * 100)}%
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {score.factors
                              .sort((a, b) => (b.score * b.weight) - (a.score * a.weight))
                              .slice(0, 2)
                              .map((factor, index) => (
                                <div key={index} className="mb-1">
                                  <span className="font-medium">{factor.name}:</span> {Math.round(factor.score * 100)}%
                                </div>
                              ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/admin/compatibility/${score.id}`}
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
      </div>
    </div>
  );
}
