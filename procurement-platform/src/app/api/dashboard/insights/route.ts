import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API endpoint for fetching AI insights for the dashboard
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
    
    // Parse limit from query params
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // Initialize insights array
    let insights: any[] = [];
    
    if (isAdmin || isEvaluator) {
      // Fetch tender evaluation recommendations
      const { data: evaluations } = await supabase
        .from('tender_evaluations')
        .select(`
          id,
          tender_id,
          recommendations,
          created_at,
          tenders (
            title
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (evaluations) {
        for (const evaluation of evaluations) {
          if (evaluation.recommendations && Array.isArray(evaluation.recommendations)) {
            // Take up to 2 recommendations per evaluation
            const recommendationsToAdd = evaluation.recommendations.slice(0, 2);
            
            insights = insights.concat(
              recommendationsToAdd.map((recommendation, index) => ({
                id: `eval_rec_${evaluation.id}_${index}`,
                type: 'recommendation',
                text: recommendation,
                source: {
                  type: 'tender',
                  id: evaluation.tender_id,
                  title: evaluation.tenders?.title || 'Unknown Tender'
                },
                href: `/tenders/${evaluation.tender_id}/evaluation`
              }))
            );
          }
        }
      }
      
      // Fetch proposal analysis recommendations
      const { data: analyses } = await supabase
        .from('proposal_analyses')
        .select(`
          id,
          tender_id,
          proposal_id,
          insights,
          created_at,
          proposals (
            title,
            vendor_id,
            vendors (
              name
            )
          ),
          tenders (
            title
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (analyses) {
        for (const analysis of analyses) {
          if (analysis.insights && analysis.insights.recommendations && Array.isArray(analysis.insights.recommendations)) {
            // Take up to 2 recommendations per analysis
            const recommendationsToAdd = analysis.insights.recommendations.slice(0, 2);
            
            insights = insights.concat(
              recommendationsToAdd.map((recommendation, index) => ({
                id: `analysis_rec_${analysis.id}_${index}`,
                type: 'recommendation',
                text: recommendation,
                source: {
                  type: 'proposal',
                  id: analysis.proposal_id,
                  title: `${analysis.proposals?.title || 'Unknown Proposal'} by ${analysis.proposals?.vendors?.name || 'Unknown Vendor'}`
                },
                href: `/tenders/${analysis.tender_id}/proposals/${analysis.proposal_id}/analysis`
              }))
            );
          }
          
          if (analysis.insights && analysis.insights.strengths && Array.isArray(analysis.insights.strengths)) {
            // Take 1 strength per analysis
            const strengthToAdd = analysis.insights.strengths[0];
            
            if (strengthToAdd) {
              insights.push({
                id: `analysis_str_${analysis.id}`,
                type: 'strength',
                text: strengthToAdd,
                source: {
                  type: 'proposal',
                  id: analysis.proposal_id,
                  title: `${analysis.proposals?.title || 'Unknown Proposal'} by ${analysis.proposals?.vendors?.name || 'Unknown Vendor'}`
                },
                href: `/tenders/${analysis.tender_id}/proposals/${analysis.proposal_id}/analysis`
              });
            }
          }
          
          if (analysis.insights && analysis.insights.weaknesses && Array.isArray(analysis.insights.weaknesses)) {
            // Take 1 weakness per analysis
            const weaknessToAdd = analysis.insights.weaknesses[0];
            
            if (weaknessToAdd) {
              insights.push({
                id: `analysis_wk_${analysis.id}`,
                type: 'weakness',
                text: weaknessToAdd,
                source: {
                  type: 'proposal',
                  id: analysis.proposal_id,
                  title: `${analysis.proposals?.title || 'Unknown Proposal'} by ${analysis.proposals?.vendors?.name || 'Unknown Vendor'}`
                },
                href: `/tenders/${analysis.tender_id}/proposals/${analysis.proposal_id}/analysis`
              });
            }
          }
        }
      }
      
      // Fetch vendor match insights
      const { data: matches } = await supabase
        .from('tender_vendor_matches')
        .select(`
          id,
          tender_id,
          vendor_id,
          strengths,
          weaknesses,
          updated_at,
          vendors (
            name
          ),
          tenders (
            title
          )
        `)
        .order('updated_at', { ascending: false })
        .limit(10);
      
      if (matches) {
        for (const match of matches) {
          if (match.strengths && Array.isArray(match.strengths) && match.strengths.length > 0) {
            // Take 1 strength per match
            insights.push({
              id: `match_str_${match.id}`,
              type: 'strength',
              text: match.strengths[0],
              source: {
                type: 'vendor_match',
                id: `${match.tender_id}_${match.vendor_id}`,
                title: `${match.vendors?.name || 'Unknown Vendor'} for ${match.tenders?.title || 'Unknown Tender'}`
              },
              href: `/tenders/${match.tender_id}/matches`
            });
          }
          
          if (match.weaknesses && Array.isArray(match.weaknesses) && match.weaknesses.length > 0) {
            // Take 1 weakness per match
            insights.push({
              id: `match_wk_${match.id}`,
              type: 'weakness',
              text: match.weaknesses[0],
              source: {
                type: 'vendor_match',
                id: `${match.tender_id}_${match.vendor_id}`,
                title: `${match.vendors?.name || 'Unknown Vendor'} for ${match.tenders?.title || 'Unknown Tender'}`
              },
              href: `/tenders/${match.tender_id}/matches`
            });
          }
        }
      }
    } else if (isVendor && vendorId) {
      // Fetch vendor match insights for this vendor
      const { data: matches } = await supabase
        .from('tender_vendor_matches')
        .select(`
          id,
          tender_id,
          strengths,
          weaknesses,
          updated_at,
          tenders (
            title
          )
        `)
        .eq('vendor_id', vendorId)
        .order('updated_at', { ascending: false })
        .limit(10);
      
      if (matches) {
        for (const match of matches) {
          if (match.strengths && Array.isArray(match.strengths) && match.strengths.length > 0) {
            // Take up to 2 strengths per match
            const strengthsToAdd = match.strengths.slice(0, 2);
            
            insights = insights.concat(
              strengthsToAdd.map((strength, index) => ({
                id: `match_str_${match.id}_${index}`,
                type: 'strength',
                text: strength,
                source: {
                  type: 'vendor_match',
                  id: match.tender_id,
                  title: match.tenders?.title || 'Unknown Tender'
                },
                href: `/tenders/${match.tender_id}`
              }))
            );
          }
          
          if (match.weaknesses && Array.isArray(match.weaknesses) && match.weaknesses.length > 0) {
            // Take 1 weakness per match
            insights.push({
              id: `match_wk_${match.id}`,
              type: 'weakness',
              text: match.weaknesses[0],
              source: {
                type: 'vendor_match',
                id: match.tender_id,
                title: match.tenders?.title || 'Unknown Tender'
              },
              href: `/tenders/${match.tender_id}`
            });
          }
        }
      }
      
      // Fetch proposal analysis insights for this vendor
      const { data: analyses } = await supabase
        .from('proposal_analyses')
        .select(`
          id,
          tender_id,
          proposal_id,
          insights,
          created_at,
          proposals (
            title
          ),
          tenders (
            title
          )
        `)
        .eq('proposals.vendor_id', vendorId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (analyses) {
        for (const analysis of analyses) {
          if (analysis.insights && analysis.insights.recommendations && Array.isArray(analysis.insights.recommendations)) {
            // Take up to 2 recommendations per analysis
            const recommendationsToAdd = analysis.insights.recommendations.slice(0, 2);
            
            insights = insights.concat(
              recommendationsToAdd.map((recommendation, index) => ({
                id: `analysis_rec_${analysis.id}_${index}`,
                type: 'recommendation',
                text: recommendation,
                source: {
                  type: 'proposal',
                  id: analysis.proposal_id,
                  title: `${analysis.proposals?.title || 'Unknown Proposal'} for ${analysis.tenders?.title || 'Unknown Tender'}`
                },
                href: `/tenders/${analysis.tender_id}/proposals/${analysis.proposal_id}/analysis`
              }))
            );
          }
          
          if (analysis.insights && analysis.insights.strengths && Array.isArray(analysis.insights.strengths)) {
            // Take 1 strength per analysis
            const strengthToAdd = analysis.insights.strengths[0];
            
            if (strengthToAdd) {
              insights.push({
                id: `analysis_str_${analysis.id}`,
                type: 'strength',
                text: strengthToAdd,
                source: {
                  type: 'proposal',
                  id: analysis.proposal_id,
                  title: `${analysis.proposals?.title || 'Unknown Proposal'} for ${analysis.tenders?.title || 'Unknown Tender'}`
                },
                href: `/tenders/${analysis.tender_id}/proposals/${analysis.proposal_id}/analysis`
              });
            }
          }
        }
      }
    }
    
    // Shuffle insights to mix different types
    insights = shuffleArray(insights);
    
    // Limit to requested number
    insights = insights.slice(0, limit);
    
    return NextResponse.json(insights);
  } catch (error: any) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to shuffle an array
function shuffleArray(array: any[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
