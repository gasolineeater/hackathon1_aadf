import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API endpoint for fetching top vendors for the dashboard
 */
export async function GET(request: NextRequest) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    const isAdmin = userProfile?.role === 'admin';
    const isEvaluator = userProfile?.role === 'evaluator';
    
    // Only admin and evaluators can see top vendors
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    // Parse limit from query params
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '5', 10);
    
    // Get all vendors
    const { data: vendors } = await supabase
      .from('vendors')
      .select(`
        id,
        name
      `);
    
    if (!vendors || vendors.length === 0) {
      return NextResponse.json([]);
    }
    
    // For each vendor, get match count, proposal count, and average score
    const vendorStats = await Promise.all(
      vendors.map(async (vendor) => {
        // Get match count
        const { count: matchCount } = await supabase
          .from('tender_vendor_matches')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', vendor.id);
        
        // Get proposal count
        const { count: proposalCount } = await supabase
          .from('proposals')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', vendor.id);
        
        // Get average match score
        const { data: matches } = await supabase
          .from('tender_vendor_matches')
          .select('compatibility_score')
          .eq('vendor_id', vendor.id);
        
        let averageScore = 0;
        if (matches && matches.length > 0) {
          const sum = matches.reduce((acc, curr) => acc + curr.compatibility_score, 0);
          averageScore = Math.round(sum / matches.length);
        }
        
        // Get average proposal score
        const { data: analyses } = await supabase
          .from('proposal_analyses')
          .select('overall_score')
          .eq('proposals.vendor_id', vendor.id);
        
        if (analyses && analyses.length > 0) {
          const sum = analyses.reduce((acc, curr) => acc + curr.overall_score, 0);
          const proposalAvgScore = Math.round(sum / analyses.length);
          
          // Combine match and proposal scores (weighted)
          if (averageScore > 0) {
            averageScore = Math.round((averageScore + proposalAvgScore) / 2);
          } else {
            averageScore = proposalAvgScore;
          }
        }
        
        return {
          id: vendor.id,
          name: vendor.name,
          matchCount: matchCount || 0,
          proposalCount: proposalCount || 0,
          score: averageScore,
          href: `/vendors/${vendor.id}`
        };
      })
    );
    
    // Sort by score (highest first)
    vendorStats.sort((a, b) => b.score - a.score);
    
    // Limit to requested number
    const topVendors = vendorStats.slice(0, limit);
    
    return NextResponse.json(topVendors);
  } catch (error: any) {
    console.error('Error fetching top vendors:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
