import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API endpoint for fetching recent activity for the dashboard
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
    
    // Initialize activities array
    let activities: any[] = [];
    
    if (isAdmin || isEvaluator) {
      // Fetch tender evaluations
      const { data: evaluations } = await supabase
        .from('tender_evaluations')
        .select(`
          id,
          tender_id,
          score,
          created_at,
          tenders (
            title
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (evaluations) {
        activities = activities.concat(
          evaluations.map(evaluation => ({
            id: `evaluation_${evaluation.id}`,
            type: 'tender_evaluation',
            title: `Tender Evaluation: ${evaluation.tenders?.title || 'Unknown Tender'}`,
            timestamp: evaluation.created_at,
            score: evaluation.score,
            status: 'completed',
            href: `/tenders/${evaluation.tender_id}/evaluation`
          }))
        );
      }
      
      // Fetch vendor matches
      const { data: matches } = await supabase
        .from('tender_vendor_matches')
        .select(`
          id,
          tender_id,
          compatibility_score,
          updated_at,
          tenders (
            title
          )
        `)
        .order('updated_at', { ascending: false })
        .limit(limit);
      
      if (matches) {
        activities = activities.concat(
          matches.map(match => ({
            id: `match_${match.id}`,
            type: 'vendor_match',
            title: `Vendor Matching: ${match.tenders?.title || 'Unknown Tender'}`,
            timestamp: match.updated_at,
            score: match.compatibility_score,
            status: 'completed',
            href: `/tenders/${match.tender_id}/matches`
          }))
        );
      }
      
      // Fetch proposal analyses
      const { data: analyses } = await supabase
        .from('proposal_analyses')
        .select(`
          id,
          tender_id,
          proposal_id,
          overall_score,
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
        .limit(limit);
      
      if (analyses) {
        activities = activities.concat(
          analyses.map(analysis => ({
            id: `analysis_${analysis.id}`,
            type: 'proposal_analysis',
            title: `Proposal Analysis: ${analysis.proposals?.title || 'Unknown Proposal'} by ${analysis.proposals?.vendors?.name || 'Unknown Vendor'}`,
            timestamp: analysis.created_at,
            score: analysis.overall_score,
            status: 'completed',
            href: `/tenders/${analysis.tender_id}/proposals/${analysis.proposal_id}/analysis`
          }))
        );
      }
      
      // Fetch document validations
      const { data: validations } = await supabase
        .from('document_validations')
        .select(`
          id,
          document_type,
          document_id,
          score,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (validations) {
        activities = activities.concat(
          validations.map(validation => ({
            id: `validation_${validation.id}`,
            type: 'document_validation',
            title: `Document Validation: ${validation.document_type.charAt(0).toUpperCase() + validation.document_type.slice(1)}`,
            timestamp: validation.created_at,
            score: validation.score,
            status: 'completed',
            href: `/documents/${validation.document_id}`
          }))
        );
      }
      
      // Fetch recent tenders
      const { data: tenders } = await supabase
        .from('tenders')
        .select(`
          id,
          title,
          created_at,
          created_by
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (tenders) {
        activities = activities.concat(
          tenders.map(tender => ({
            id: `tender_${tender.id}`,
            type: 'tender_created',
            title: `Tender Created: ${tender.title}`,
            timestamp: tender.created_at,
            href: `/tenders/${tender.id}`
          }))
        );
      }
      
      // Fetch recent proposals
      const { data: proposals } = await supabase
        .from('proposals')
        .select(`
          id,
          title,
          submitted_at,
          tender_id,
          vendor_id,
          vendors (
            name
          )
        `)
        .order('submitted_at', { ascending: false })
        .limit(limit);
      
      if (proposals) {
        activities = activities.concat(
          proposals.map(proposal => ({
            id: `proposal_${proposal.id}`,
            type: 'proposal_submitted',
            title: `Proposal Submitted: ${proposal.title} by ${proposal.vendors?.name || 'Unknown Vendor'}`,
            timestamp: proposal.submitted_at,
            href: `/tenders/${proposal.tender_id}/proposals/${proposal.id}`
          }))
        );
      }
    } else if (isVendor && vendorId) {
      // Fetch vendor matches for this vendor
      const { data: matches } = await supabase
        .from('tender_vendor_matches')
        .select(`
          id,
          tender_id,
          compatibility_score,
          updated_at,
          tenders (
            title
          )
        `)
        .eq('vendor_id', vendorId)
        .order('updated_at', { ascending: false })
        .limit(limit);
      
      if (matches) {
        activities = activities.concat(
          matches.map(match => ({
            id: `match_${match.id}`,
            type: 'vendor_match',
            title: `Vendor Match: ${match.tenders?.title || 'Unknown Tender'}`,
            timestamp: match.updated_at,
            score: match.compatibility_score,
            status: 'completed',
            href: `/tenders/${match.tender_id}`
          }))
        );
      }
      
      // Fetch proposal analyses for this vendor
      const { data: analyses } = await supabase
        .from('proposal_analyses')
        .select(`
          id,
          tender_id,
          proposal_id,
          overall_score,
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
        .limit(limit);
      
      if (analyses) {
        activities = activities.concat(
          analyses.map(analysis => ({
            id: `analysis_${analysis.id}`,
            type: 'proposal_analysis',
            title: `Proposal Analysis: ${analysis.proposals?.title || 'Unknown Proposal'}`,
            timestamp: analysis.created_at,
            score: analysis.overall_score,
            status: 'completed',
            href: `/tenders/${analysis.tender_id}/proposals/${analysis.proposal_id}/analysis`
          }))
        );
      }
      
      // Fetch recent proposals by this vendor
      const { data: proposals } = await supabase
        .from('proposals')
        .select(`
          id,
          title,
          submitted_at,
          tender_id,
          tenders (
            title
          )
        `)
        .eq('vendor_id', vendorId)
        .order('submitted_at', { ascending: false })
        .limit(limit);
      
      if (proposals) {
        activities = activities.concat(
          proposals.map(proposal => ({
            id: `proposal_${proposal.id}`,
            type: 'proposal_submitted',
            title: `Proposal Submitted: ${proposal.title} for ${proposal.tenders?.title || 'Unknown Tender'}`,
            timestamp: proposal.submitted_at,
            href: `/tenders/${proposal.tender_id}/proposals/${proposal.id}`
          }))
        );
      }
    }
    
    // Sort activities by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // Limit to requested number
    activities = activities.slice(0, limit);
    
    return NextResponse.json(activities);
  } catch (error: any) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
