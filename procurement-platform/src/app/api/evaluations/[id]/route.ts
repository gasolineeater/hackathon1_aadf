import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/evaluations/[id]
 * Retrieves a specific evaluation by ID
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
    
    // Get evaluation ID from params
    const evaluationId = params.id;
    
    // Fetch evaluation details
    const { data: evaluation, error } = await supabase
      .from('evaluations')
      .select(`
        *,
        evaluator:users!evaluator_id(id, email, full_name),
        proposal:proposals(
          id,
          title,
          vendor_id,
          vendor:vendors(id, name)
        ),
        tender:tenders(id, title)
      `)
      .eq('id', evaluationId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Evaluation not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching evaluation:', error);
      return NextResponse.json(
        { error: 'Failed to fetch evaluation', details: error.message },
        { status: 500 }
      );
    }
    
    // Format the response
    const formattedEvaluation = {
      ...evaluation,
      evaluator_name: evaluation.evaluator?.full_name || 'Unknown',
      evaluator_email: evaluation.evaluator?.email || null,
      proposal_title: evaluation.proposal?.title || 'Unknown',
      vendor_name: evaluation.proposal?.vendor?.[0]?.name || 'Unknown',
      tender_title: evaluation.tender?.title || 'Unknown',
      is_own_evaluation: evaluation.evaluator_id === user.id,
      can_edit: isAdmin || evaluation.evaluator_id === user.id
    };
    
    return NextResponse.json(formattedEvaluation);
  } catch (error: any) {
    console.error('Error in GET /api/evaluations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/evaluations/[id]
 * Updates a specific evaluation by ID
 */
export async function PUT(
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
    
    // Get evaluation ID from params
    const evaluationId = params.id;
    
    // Fetch current evaluation to check permissions
    const { data: existingEvaluation, error: fetchError } = await supabase
      .from('evaluations')
      .select(`
        *,
        proposal:proposals(
          tender:tenders(status)
        )
      `)
      .eq('id', evaluationId)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Evaluation not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching evaluation:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch evaluation', details: fetchError.message },
        { status: 500 }
      );
    }
    
    // Check if user is the evaluator or an admin
    if (!isAdmin && existingEvaluation.evaluator_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to update this evaluation' },
        { status: 403 }
      );
    }
    
    // Check if tender is still in evaluation phase
    if (existingEvaluation.proposal.tender.status !== 'closed') {
      return NextResponse.json(
        { error: 'Cannot update evaluation for a tender that is not in the evaluation phase' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate score if provided
    if (body.score !== undefined) {
      if (body.score < 0 || body.score > 100) {
        return NextResponse.json(
          { error: 'Score must be between 0 and 100' },
          { status: 400 }
        );
      }
    }
    
    // Prepare update data
    const updateData: any = {};
    
    // Fields that can be updated
    const updatableFields = [
      'score', 'comments', 'criteria_scores', 'strengths', 'weaknesses', 'recommendations'
    ];
    
    // Add fields to update data if they exist in the request body
    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    
    // If no fields to update, return early
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();
    
    // Update the evaluation
    const { data: updatedEvaluation, error: updateError } = await supabase
      .from('evaluations')
      .update(updateData)
      .eq('id', evaluationId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating evaluation:', updateError);
      return NextResponse.json(
        { error: 'Failed to update evaluation', details: updateError.message },
        { status: 500 }
      );
    }
    
    // Create an audit log entry
    await supabase
      .from('audit_logs')
      .insert({
        action: 'update',
        resource_type: 'evaluation',
        resource_id: evaluationId,
        user_id: user.id,
        details: {
          tender_id: existingEvaluation.tender_id,
          proposal_id: existingEvaluation.proposal_id,
          updated_fields: Object.keys(updateData)
        }
      });
    
    return NextResponse.json(updatedEvaluation);
  } catch (error: any) {
    console.error('Error in PUT /api/evaluations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/evaluations/[id]
 * Deletes a specific evaluation by ID
 */
export async function DELETE(
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
    
    // Get evaluation ID from params
    const evaluationId = params.id;
    
    // Fetch current evaluation to check permissions
    const { data: existingEvaluation, error: fetchError } = await supabase
      .from('evaluations')
      .select(`
        *,
        proposal:proposals(
          tender:tenders(status)
        )
      `)
      .eq('id', evaluationId)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Evaluation not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching evaluation:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch evaluation', details: fetchError.message },
        { status: 500 }
      );
    }
    
    // Check if user is the evaluator or an admin
    if (!isAdmin && existingEvaluation.evaluator_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete this evaluation' },
        { status: 403 }
      );
    }
    
    // Check if tender is still in evaluation phase
    if (existingEvaluation.proposal.tender.status !== 'closed') {
      return NextResponse.json(
        { error: 'Cannot delete evaluation for a tender that is not in the evaluation phase' },
        { status: 400 }
      );
    }
    
    // Delete the evaluation
    const { error: deleteError } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', evaluationId);
    
    if (deleteError) {
      console.error('Error deleting evaluation:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete evaluation', details: deleteError.message },
        { status: 500 }
      );
    }
    
    // Create an audit log entry
    await supabase
      .from('audit_logs')
      .insert({
        action: 'delete',
        resource_type: 'evaluation',
        resource_id: evaluationId,
        user_id: user.id,
        details: {
          tender_id: existingEvaluation.tender_id,
          proposal_id: existingEvaluation.proposal_id
        }
      });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/evaluations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
