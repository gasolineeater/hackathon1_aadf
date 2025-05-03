import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API endpoint for fetching dashboard summary data
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
    const isVendor = userProfile?.role === 'vendor';
    
    // Get vendor ID if user is a vendor
    let vendorId = null;
    if (isVendor) {
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      vendorId = vendor?.id;
    }
    
    // Fetch counts based on user role
    let tenderCount = 0;
    let proposalCount = 0;
    let vendorCount = 0;
    let evaluationCount = 0;
    let matchCount = 0;
    let analysisCount = 0;
    
    // Tenders count
    if (isAdmin || isEvaluator) {
      const { count } = await supabase
        .from('tenders')
        .select('*', { count: 'exact', head: true });
      
      tenderCount = count || 0;
    } else if (isVendor) {
      // For vendors, count tenders they've submitted proposals for
      const { count } = await supabase
        .from('proposals')
        .select('tender_id', { count: 'exact', head: true })
        .eq('vendor_id', vendorId);
      
      tenderCount = count || 0;
    }
    
    // Proposals count
    if (isAdmin || isEvaluator) {
      const { count } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true });
      
      proposalCount = count || 0;
    } else if (isVendor && vendorId) {
      const { count } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId);
      
      proposalCount = count || 0;
    }
    
    // Vendors count (admin/evaluator only)
    if (isAdmin || isEvaluator) {
      const { count } = await supabase
        .from('vendors')
        .select('*', { count: 'exact', head: true });
      
      vendorCount = count || 0;
    }
    
    // Evaluation count
    if (isAdmin || isEvaluator) {
      const { count } = await supabase
        .from('tender_evaluations')
        .select('*', { count: 'exact', head: true });
      
      evaluationCount = count || 0;
    }
    
    // Match count
    if (isAdmin || isEvaluator) {
      const { count } = await supabase
        .from('tender_vendor_matches')
        .select('tender_id', { count: 'exact', head: true })
        .is('vendor_id', null);
      
      matchCount = count || 0;
    } else if (isVendor && vendorId) {
      const { count } = await supabase
        .from('tender_vendor_matches')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_id', vendorId);
      
      matchCount = count || 0;
    }
    
    // Analysis count
    if (isAdmin || isEvaluator) {
      const { count } = await supabase
        .from('proposal_analyses')
        .select('*', { count: 'exact', head: true });
      
      analysisCount = count || 0;
    } else if (isVendor && vendorId) {
      const { count } = await supabase
        .from('proposal_analyses')
        .select('*', { count: 'exact', head: true })
        .eq('proposals.vendor_id', vendorId);
      
      analysisCount = count || 0;
    }
    
    // Calculate average scores
    let averageEvaluationScore = 0;
    let averageMatchScore = 0;
    let averageAnalysisScore = 0;
    
    if (isAdmin || isEvaluator) {
      // Average tender evaluation score
      const { data: evaluations } = await supabase
        .from('tender_evaluations')
        .select('score');
      
      if (evaluations && evaluations.length > 0) {
        const sum = evaluations.reduce((acc, curr) => acc + curr.score, 0);
        averageEvaluationScore = Math.round(sum / evaluations.length);
      }
      
      // Average vendor match score
      const { data: matches } = await supabase
        .from('tender_vendor_matches')
        .select('compatibility_score');
      
      if (matches && matches.length > 0) {
        const sum = matches.reduce((acc, curr) => acc + curr.compatibility_score, 0);
        averageMatchScore = Math.round(sum / matches.length);
      }
      
      // Average proposal analysis score
      const { data: analyses } = await supabase
        .from('proposal_analyses')
        .select('overall_score');
      
      if (analyses && analyses.length > 0) {
        const sum = analyses.reduce((acc, curr) => acc + curr.overall_score, 0);
        averageAnalysisScore = Math.round(sum / analyses.length);
      }
    } else if (isVendor && vendorId) {
      // Average vendor match score for this vendor
      const { data: matches } = await supabase
        .from('tender_vendor_matches')
        .select('compatibility_score')
        .eq('vendor_id', vendorId);
      
      if (matches && matches.length > 0) {
        const sum = matches.reduce((acc, curr) => acc + curr.compatibility_score, 0);
        averageMatchScore = Math.round(sum / matches.length);
      }
      
      // Average proposal analysis score for this vendor
      const { data: analyses } = await supabase
        .from('proposal_analyses')
        .select('overall_score')
        .eq('proposals.vendor_id', vendorId);
      
      if (analyses && analyses.length > 0) {
        const sum = analyses.reduce((acc, curr) => acc + curr.overall_score, 0);
        averageAnalysisScore = Math.round(sum / analyses.length);
      }
    }
    
    return NextResponse.json({
      counts: {
        tenders: tenderCount,
        proposals: proposalCount,
        vendors: vendorCount,
        evaluations: evaluationCount,
        matches: matchCount,
        analyses: analysisCount,
      },
      averages: {
        evaluationScore: averageEvaluationScore,
        matchScore: averageMatchScore,
        analysisScore: averageAnalysisScore,
      },
      userRole: userProfile?.role || 'user',
    });
  } catch (error: any) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
