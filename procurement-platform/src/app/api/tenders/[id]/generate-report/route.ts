import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/tenders/[id]/generate-report
 * Generates a final report for a tender
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    // Only admins and evaluators can generate reports
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can generate reports' },
        { status: 403 }
      );
    }
    
    // Get tender ID from params
    const tenderId = params.id;
    
    // Fetch tender details
    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .select(`
        *,
        created_by:users!created_by(id, email, full_name)
      `)
      .eq('id', tenderId)
      .single();
    
    if (tenderError) {
      if (tenderError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tender not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching tender:', tenderError);
      return NextResponse.json(
        { error: 'Failed to fetch tender', details: tenderError.message },
        { status: 500 }
      );
    }
    
    // Check if tender is closed or awarded
    if (tender.status !== 'closed' && tender.status !== 'awarded') {
      return NextResponse.json(
        { error: 'Cannot generate report for a tender that is not closed or awarded' },
        { status: 400 }
      );
    }
    
    // Fetch proposals
    const { data: proposals, error: proposalsError } = await supabase
      .from('proposals')
      .select(`
        *,
        vendor:vendors(id, name, contact_person, contact_email),
        evaluations(
          id, 
          evaluator_id, 
          score, 
          comments, 
          created_at,
          evaluator:users!evaluator_id(full_name)
        )
      `)
      .eq('tender_id', tenderId)
      .eq('status', 'submitted');
    
    if (proposalsError) {
      console.error('Error fetching proposals:', proposalsError);
      return NextResponse.json(
        { error: 'Failed to fetch proposals', details: proposalsError.message },
        { status: 500 }
      );
    }
    
    // Fetch evaluation committee
    const { data: committee, error: committeeError } = await supabase
      .from('evaluation_committee')
      .select(`
        *,
        member:users(id, email, full_name)
      `)
      .eq('tender_id', tenderId);
    
    if (committeeError) {
      console.error('Error fetching evaluation committee:', committeeError);
      return NextResponse.json(
        { error: 'Failed to fetch evaluation committee', details: committeeError.message },
        { status: 500 }
      );
    }
    
    // Parse request body for report options
    const body = await request.json();
    const options = body.options || {};
    
    // Generate the report
    const report = generateTenderReport(tender, proposals, committee, options);
    
    // Generate a unique ID for the report
    const reportId = uuidv4();
    
    // Prepare report data
    const reportData = {
      id: reportId,
      tender_id: tenderId,
      title: `Tender Evaluation Report - ${tender.title}`,
      content: report,
      generated_by: user.id,
      generated_at: new Date().toISOString(),
      options: options
    };
    
    // Insert report into database
    const { data: savedReport, error } = await supabase
      .from('tender_reports')
      .insert(reportData)
      .select()
      .single();
    
    if (error) {
      console.error('Error saving report:', error);
      return NextResponse.json(
        { error: 'Failed to save report', details: error.message },
        { status: 500 }
      );
    }
    
    // Create an audit log entry
    await supabase
      .from('audit_logs')
      .insert({
        action: 'generate_report',
        resource_type: 'tender',
        resource_id: tenderId,
        user_id: user.id,
        details: {
          report_id: reportId,
          report_title: reportData.title
        }
      });
    
    return NextResponse.json(savedReport);
  } catch (error: any) {
    console.error('Error in POST /api/tenders/[id]/generate-report:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Generates a tender report
 */
function generateTenderReport(tender: any, proposals: any[], committee: any[], options: any) {
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate average score for each proposal
  const proposalsWithScores = proposals.map(proposal => {
    const evaluations = proposal.evaluations || [];
    const totalScore = evaluations.reduce((sum: number, eval: any) => sum + eval.score, 0);
    const averageScore = evaluations.length > 0 ? totalScore / evaluations.length : 0;
    
    return {
      ...proposal,
      average_score: averageScore,
      evaluation_count: evaluations.length
    };
  });
  
  // Sort proposals by average score (descending)
  const sortedProposals = [...proposalsWithScores].sort((a, b) => b.average_score - a.average_score);
  
  // Format committee members
  const formattedCommittee = committee.map(member => ({
    name: member.member?.full_name || 'Unknown',
    role: member.role,
    email: member.member?.email || 'Unknown'
  }));
  
  // Generate report content
  const report = {
    tender: {
      id: tender.id,
      title: tender.title,
      description: tender.description,
      category: tender.category,
      status: tender.status,
      published_at: tender.published_at ? formatDate(tender.published_at) : 'N/A',
      deadline: tender.deadline ? formatDate(tender.deadline) : 'N/A',
      closed_at: tender.closed_at ? formatDate(tender.closed_at) : 'N/A',
      created_by: tender.created_by?.full_name || 'Unknown'
    },
    summary: {
      proposal_count: proposals.length,
      evaluation_count: proposals.reduce((sum: number, p: any) => sum + (p.evaluations?.length || 0), 0),
      average_score: proposals.length > 0
        ? proposals.reduce((sum: number, p: any) => sum + p.average_score, 0) / proposals.length
        : 0,
      highest_score: sortedProposals.length > 0 ? sortedProposals[0].average_score : 0,
      lowest_score: sortedProposals.length > 0 ? sortedProposals[sortedProposals.length - 1].average_score : 0
    },
    committee: formattedCommittee,
    proposals: sortedProposals.map(proposal => ({
      id: proposal.id,
      title: proposal.title,
      vendor: proposal.vendor?.[0]?.name || 'Unknown',
      price: proposal.price,
      currency: proposal.currency,
      submitted_at: formatDate(proposal.submitted_at),
      average_score: proposal.average_score,
      evaluation_count: proposal.evaluation_count,
      evaluations: proposal.evaluations?.map((eval: any) => ({
        evaluator: eval.evaluator?.full_name || 'Unknown',
        score: eval.score,
        comments: eval.comments,
        created_at: formatDate(eval.created_at)
      })) || []
    })),
    recommendation: sortedProposals.length > 0
      ? {
          recommended_vendor: sortedProposals[0].vendor?.[0]?.name || 'Unknown',
          score: sortedProposals[0].average_score,
          rationale: `Based on the evaluation scores, ${sortedProposals[0].vendor?.[0]?.name || 'Unknown'} received the highest average score of ${sortedProposals[0].average_score.toFixed(2)} out of 100.`
        }
      : {
          recommended_vendor: 'None',
          score: 0,
          rationale: 'No proposals were received or evaluated.'
        },
    conclusion: `This report was automatically generated on ${formatDate(new Date().toISOString())} based on the evaluation of ${proposals.length} proposals for tender "${tender.title}".`,
    metadata: {
      generated_at: new Date().toISOString(),
      options: options
    }
  };
  
  return report;
}
