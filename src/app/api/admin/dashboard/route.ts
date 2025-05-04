import { NextRequest, NextResponse } from 'next/server';
import { mockTenders, mockVendors, mockCompatibilityScores } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  try {
    // Create a dashboard summary with compatibility scores
    const tendersWithCompatibility = mockTenders.slice(0, 3).map(tender => {
      // Get compatibility scores for this tender
      const vendorScores = mockCompatibilityScores
        .filter(score => score.tender_id === tender.id)
        .map(score => {
          // Find the vendor
          const vendor = mockVendors.find(v => v.id === score.vendor_id);
          
          return {
            id: score.vendor_id,
            name: vendor?.name || 'Unknown Vendor',
            score: score.score,
            matchDetails: {
              industryMatch: score.factors.find(f => f.name === 'Industry Match')?.score || 0,
              expertiseMatch: score.factors.find(f => f.name === 'Expertise Match')?.score || 0,
              experienceMatch: score.factors.find(f => f.name === 'Experience Match')?.score || 0,
              capacityMatch: score.factors.find(f => f.name === 'Capacity Match')?.score || 0,
              certificationMatch: score.factors.find(f => f.name === 'Certification Match')?.score || 0
            }
          };
        })
        // Sort by score descending
        .sort((a, b) => b.score - a.score);
      
      return {
        id: tender.id,
        title: tender.title,
        category: tender.status,
        deadline: tender.deadline,
        vendors: vendorScores
      };
    });
    
    // Create summary statistics
    const stats = {
      activeTenders: mockTenders.filter(t => t.status === 'open').length,
      totalVendors: mockVendors.length,
      averageCompatibility: Math.round(
        mockCompatibilityScores.reduce((sum, score) => sum + score.score, 0) / 
        mockCompatibilityScores.length
      ),
      highCompatibilityMatches: mockCompatibilityScores.filter(score => score.score >= 80).length
    };
    
    // Return the dashboard data
    return NextResponse.json({
      stats,
      tendersWithCompatibility
    });
  } catch (error) {
    console.error('Admin dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
