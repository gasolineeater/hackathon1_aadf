import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET /api/proposals/[id]/evaluations
 * Retrieves evaluations for a specific proposal
 */
export async function GET(
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
    
    // Only admins and evaluators can view evaluations
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can view evaluations' },
        { status: 403 }
      );
    }
    
    // Get proposal ID from params
    const proposalId = params.id;
    
    // Fetch evaluations
    const { data: evaluations, error } = await supabase
      .from('evaluations')
      .select(`
        *,
        evaluator:users!evaluator_id(id, email, full_name)
      `)
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching evaluations:', error);
      return NextResponse.json(
        { error: 'Failed to fetch evaluations', details: error.message },
        { status: 500 }
      );
    }
    
    // Format the response
    const formattedEvaluations = evaluations.map(evaluation => ({
      ...evaluation,
      evaluator_name: evaluation.evaluator?.full_name || 'Unknown',
      evaluator_email: evaluation.evaluator?.email || null,
      is_own_evaluation: evaluation.evaluator_id === user.id
    }));
    
    return NextResponse.json(formattedEvaluations);
  } catch (error: any) {
    console.error('Error in GET /api/proposals/[id]/evaluations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/proposals/[id]/evaluations
 * Creates a new evaluation for a proposal
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
    
    // Only admins and evaluators can create evaluations
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can create evaluations' },
        { status: 403 }
      );
    }
    
    // Get proposal ID from params
    const proposalId = params.id;
    
    // Fetch proposal to check if it can be evaluated
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        tender:tenders(status)
      `)
      .eq('id', proposalId)
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
    
    // Check if tender is closed (evaluation phase)
    if (proposal.tender.status !== 'closed') {
      return NextResponse.json(
        { error: 'Cannot evaluate proposals for a tender that is not in the evaluation phase' },
        { status: 400 }
      );
    }
    
    // Check if user has already evaluated this proposal
    const { count, error: countError } = await supabase
      .from('evaluations')
      .select('*', { count: 'exact', head: true })
      .eq('proposal_id', proposalId)
      .eq('evaluator_id', user.id);
    
    if (!countError && count && count > 0) {
      return NextResponse.json(
        { error: 'You have already evaluated this proposal. Use PUT to update your evaluation.' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.score) {
      return NextResponse.json(
        { error: 'Missing required field: score' },
        { status: 400 }
      );
    }
    
    // Validate score range
    if (body.score < 0 || body.score > 100) {
      return NextResponse.json(
        { error: 'Score must be between 0 and 100' },
        { status: 400 }
      );
    }
    
    // Generate a unique ID for the evaluation
    const evaluationId = uuidv4();
    
    // Prepare evaluation data
    const evaluationData = {
      id: evaluationId,
      proposal_id: proposalId,
      tender_id: proposal.tender_id,
      evaluator_id: user.id,
      score: body.score,
      comments: body.comments || null,
      criteria_scores: body.criteria_scores || null,
      strengths: body.strengths || null,
      weaknesses: body.weaknesses || null,
      recommendations: body.recommendations || null,
      created_at: new Date().toISOString()
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
    
    // Create an audit log entry
    await supabase
      .from('audit_logs')
      .insert({
        action: 'create',
        resource_type: 'evaluation',
        resource_id: evaluationId,
        user_id: user.id,
        details: {
          tender_id: proposal.tender_id,
          proposal_id: proposalId,
          score: body.score
        }
      });
    
    return NextResponse.json(evaluation, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/proposals/[id]/evaluations:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
