import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET /api/evaluations
 * Retrieves a list of evaluations with optional filtering
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
    
    // Only admins and evaluators can view evaluations
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can view evaluations' },
        { status: 403 }
      );
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const proposalId = searchParams.get('proposal_id');
    const tenderId = searchParams.get('tender_id');
    const evaluatorId = searchParams.get('evaluator_id');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = supabase
      .from('evaluations')
      .select(`
        *,
        proposal:proposals(id, title, vendor_id, tender_id),
        evaluator:profiles(id, full_name, email)
      `, { count: 'exact' });
    
    // Apply filters
    if (proposalId) {
      query = query.eq('proposal_id', proposalId);
    }
    
    if (evaluatorId) {
      query = query.eq('evaluator_id', evaluatorId);
    }
    
    if (status) {
      query = query.eq('status', status.toLowerCase());
    }
    
    // If tender ID is provided, we need to join through proposals
    if (tenderId) {
      // First get all proposals for this tender
      const { data: proposals, error: proposalError } = await supabase
        .from('proposals')
        .select('id')
        .eq('tender_id', tenderId);
      
      if (proposalError) {
        console.error('Error fetching proposals for tender:', proposalError);
        return NextResponse.json(
          { error: 'Failed to fetch proposals for tender' },
          { status: 500 }
        );
      }
      
      if (!proposals || proposals.length === 0) {
        // No proposals for this tender, so no evaluations
        return NextResponse.json({
          evaluations: [],
          pagination: {
            total: 0,
            page,
            limit,
            pages: 0
          }
        });
      }
      
      // Filter by these proposal IDs
      const proposalIds = proposals.map(p => p.id);
      query = query.in('proposal_id', proposalIds);
    }
    
    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Execute the query
    const { data: evaluations, count, error } = await query;
    
    if (error) {
      console.error('Error fetching evaluations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch evaluations' },
        { status: 500 }
      );
    }
    
    // Format the response
    const formattedEvaluations = evaluations.map(evaluation => ({
      ...evaluation,
      proposal_title: evaluation.proposal?.title || 'Unknown',
      evaluator_name: evaluation.evaluator?.full_name || 'Unknown',
      evaluator_email: evaluation.evaluator?.email || 'Unknown',
      is_own_evaluation: evaluation.evaluator_id === user.id
    }));
    
    return NextResponse.json({
      evaluations: formattedEvaluations,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/evaluations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/evaluations
 * Creates a new evaluation
 */
export async function POST(request: NextRequest) {
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
    
    // Only admins and evaluators can create evaluations
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can create evaluations' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['proposal_id', 'criteria', 'score'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check if proposal exists and is in a state that can be evaluated
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select('status, tender_id')
      .eq('id', body.proposal_id)
      .single();
    
    if (proposalError) {
      if (proposalError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching proposal:', proposalError);
      return NextResponse.json(
        { error: 'Failed to fetch proposal', details: proposalError.message },
        { status: 500 }
      );
    }
    
    // Check if proposal is submitted
    if (proposal.status !== 'submitted') {
      return NextResponse.json(
        { error: 'Cannot evaluate a proposal that has not been submitted' },
        { status: 400 }
      );
    }
    
    // Check if user has already evaluated this proposal
    const { count: existingEvaluationCount, error: countError } = await supabase
      .from('evaluations')
      .select('*', { count: 'exact', head: true })
      .eq('proposal_id', body.proposal_id)
      .eq('evaluator_id', user.id);
    
    if (!countError && existingEvaluationCount && existingEvaluationCount > 0) {
      return NextResponse.json(
        { error: 'You have already evaluated this proposal' },
        { status: 400 }
      );
    }
    
    // Generate a unique ID for the evaluation
    const evaluationId = uuidv4();
    
    // Prepare evaluation data
    const evaluationData = {
      id: evaluationId,
      proposal_id: body.proposal_id,
      evaluator_id: user.id,
      tender_id: proposal.tender_id,
      criteria: body.criteria,
      score: body.score,
      comments: body.comments || null,
      strengths: body.strengths || null,
      weaknesses: body.weaknesses || null,
      recommendations: body.recommendations || null,
      status: body.status || 'draft',
      submitted_at: body.status === 'submitted' ? new Date().toISOString() : null
    };
    
    // Insert evaluation into database
    const { data: evaluation, error } = await supabase
      .from('evaluations')
      .insert(evaluationData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating evaluation:', error);
      return NextResponse.json(
        { error: 'Failed to create evaluation', details: error.message },
        { status: 500 }
      );
    }
    
    // Create audit log
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        action: 'evaluation.create',
        resource_type: 'evaluation',
        resource_id: evaluationId,
        user_id: user.id,
        details: {
          proposal_id: body.proposal_id,
          score: body.score,
          status: body.status || 'draft'
        }
      });
    
    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Continue anyway, as the evaluation was created successfully
    }
    
    // If evaluation is submitted, update proposal average score
    if (body.status === 'submitted') {
      await updateProposalScore(body.proposal_id);
    }
    
    return NextResponse.json(evaluation, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/evaluations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Updates the average score for a proposal based on all submitted evaluations
 */
async function updateProposalScore(proposalId: string) {
  try {
    // Get all submitted evaluations for this proposal
    const { data: evaluations, error: evalError } = await supabase
      .from('evaluations')
      .select('score')
      .eq('proposal_id', proposalId)
      .eq('status', 'submitted');
    
    if (evalError) {
      console.error('Error fetching evaluations for score update:', evalError);
      return;
    }
    
    if (!evaluations || evaluations.length === 0) {
      return;
    }
    
    // Calculate average score
    const totalScore = evaluations.reduce((sum, eval_) => sum + eval_.score, 0);
    const averageScore = totalScore / evaluations.length;
    
    // Update proposal with average score
    const { error: updateError } = await supabase
      .from('proposals')
      .update({
        average_score: averageScore,
        evaluation_count: evaluations.length,
        last_evaluated_at: new Date().toISOString()
      })
      .eq('id', proposalId);
    
    if (updateError) {
      console.error('Error updating proposal score:', updateError);
    }
  } catch (error) {
    console.error('Error in updateProposalScore:', error);
  }
}
