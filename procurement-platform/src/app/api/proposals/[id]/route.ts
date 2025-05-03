import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/proposals/[id]
 * Retrieves a specific proposal by ID
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
    const isVendor = userProfile?.role === 'vendor';
    
    // Get proposal ID from params
    const proposalId = params.id;
    
    // Fetch proposal details
    const { data: proposal, error } = await supabase
      .from('proposals')
      .select(`
        *,
        tender:tenders(*),
        vendor:vendors(id, name, contact_person, contact_email, user_id),
        documents(id, name, type, url, created_at),
        evaluations(
          id, 
          evaluator_id, 
          score, 
          comments, 
          created_at,
          evaluator:users!evaluator_id(full_name)
        )
      `)
      .eq('id', proposalId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching proposal:', error);
      return NextResponse.json(
        { error: 'Failed to fetch proposal', details: error.message },
        { status: 500 }
      );
    }
    
    // Check access permissions
    const isProposalOwner = isVendor && proposal.vendor?.[0]?.user_id === user.id;
    const tenderDeadlinePassed = new Date(proposal.tender.deadline) < new Date();
    
    // Only allow access if:
    // 1. User is admin or evaluator
    // 2. User is the vendor who submitted the proposal
    // 3. Tender deadline has passed (for other vendors)
    if (!isAdmin && !isEvaluator && !isProposalOwner && !tenderDeadlinePassed) {
      return NextResponse.json(
        { error: 'Forbidden: Proposals are hidden until the tender deadline has passed' },
        { status: 403 }
      );
    }
    
    // Format evaluations
    const formattedEvaluations = proposal.evaluations?.map((evaluation: any) => ({
      ...evaluation,
      evaluator_name: evaluation.evaluator?.full_name || 'Unknown'
    })) || [];
    
    // Calculate average score
    const averageScore = formattedEvaluations.length
      ? formattedEvaluations.reduce((sum: number, eval: any) => sum + eval.score, 0) / formattedEvaluations.length
      : null;
    
    // Format the response
    const formattedProposal = {
      ...proposal,
      vendor_name: proposal.vendor?.[0]?.name || 'Unknown',
      vendor_contact: proposal.vendor?.[0]?.contact_person || null,
      vendor_email: proposal.vendor?.[0]?.contact_email || null,
      evaluations: formattedEvaluations,
      evaluation_count: formattedEvaluations.length,
      average_score: averageScore,
      is_owner: isProposalOwner,
      can_evaluate: (isAdmin || isEvaluator) && proposal.tender.status === 'closed',
      can_edit: isProposalOwner && proposal.tender.status === 'published' && !tenderDeadlinePassed,
      can_withdraw: isProposalOwner && proposal.tender.status === 'published' && !tenderDeadlinePassed
    };
    
    return NextResponse.json(formattedProposal);
  } catch (error: any) {
    console.error('Error in GET /api/proposals/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/proposals/[id]
 * Updates a specific proposal by ID
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
    
    const isVendor = userProfile?.role === 'vendor';
    
    // Get proposal ID from params
    const proposalId = params.id;
    
    // Fetch current proposal to check permissions
    const { data: existingProposal, error: fetchError } = await supabase
      .from('proposals')
      .select(`
        *,
        tender:tenders(deadline, status),
        vendor:vendors(user_id)
      `)
      .eq('id', proposalId)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching proposal:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch proposal', details: fetchError.message },
        { status: 500 }
      );
    }
    
    // Check if user is the vendor who submitted the proposal
    const isProposalOwner = isVendor && existingProposal.vendor?.[0]?.user_id === user.id;
    
    if (!isProposalOwner) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to update this proposal' },
        { status: 403 }
      );
    }
    
    // Check if tender deadline has passed
    const tenderDeadlinePassed = new Date(existingProposal.tender.deadline) < new Date();
    
    if (tenderDeadlinePassed) {
      return NextResponse.json(
        { error: 'Cannot update proposal after the tender deadline has passed' },
        { status: 400 }
      );
    }
    
    // Check if tender is still published
    if (existingProposal.tender.status !== 'published') {
      return NextResponse.json(
        { error: 'Cannot update proposal for a tender that is no longer published' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Prepare update data
    const updateData: any = {};
    
    // Fields that can be updated
    const updatableFields = [
      'title', 'content', 'price', 'currency', 'delivery_timeline', 'additional_info'
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
    
    // Update the proposal
    const { data: updatedProposal, error: updateError } = await supabase
      .from('proposals')
      .update(updateData)
      .eq('id', proposalId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating proposal:', updateError);
      return NextResponse.json(
        { error: 'Failed to update proposal', details: updateError.message },
        { status: 500 }
      );
    }
    
    // Create a new version record for version control
    const { error: versionError } = await supabase
      .from('document_versions')
      .insert({
        document_type: 'proposal',
        document_id: proposalId,
        version: existingProposal.version + 1,
        content: { ...existingProposal, ...updateData },
        created_by: user.id,
        change_summary: body.change_summary || 'Updated proposal'
      });
    
    if (versionError) {
      console.error('Error creating version record:', versionError);
      // Continue anyway, as the proposal was updated successfully
    }
    
    // Update the version number in the proposal
    await supabase
      .from('proposals')
      .update({ version: existingProposal.version + 1 })
      .eq('id', proposalId);
    
    // Create an audit log entry
    await supabase
      .from('audit_logs')
      .insert({
        action: 'update',
        resource_type: 'proposal',
        resource_id: proposalId,
        user_id: user.id,
        details: {
          tender_id: existingProposal.tender_id,
          proposal_title: updatedProposal.title,
          updated_fields: Object.keys(updateData)
        }
      });
    
    return NextResponse.json(updatedProposal);
  } catch (error: any) {
    console.error('Error in PUT /api/proposals/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/proposals/[id]
 * Withdraws a proposal (soft delete)
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
    
    const isVendor = userProfile?.role === 'vendor';
    
    // Get proposal ID from params
    const proposalId = params.id;
    
    // Fetch current proposal to check permissions
    const { data: existingProposal, error: fetchError } = await supabase
      .from('proposals')
      .select(`
        *,
        tender:tenders(deadline, status),
        vendor:vendors(user_id)
      `)
      .eq('id', proposalId)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching proposal:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch proposal', details: fetchError.message },
        { status: 500 }
      );
    }
    
    // Check if user is the vendor who submitted the proposal
    const isProposalOwner = isVendor && existingProposal.vendor?.[0]?.user_id === user.id;
    
    if (!isProposalOwner) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to withdraw this proposal' },
        { status: 403 }
      );
    }
    
    // Check if tender deadline has passed
    const tenderDeadlinePassed = new Date(existingProposal.tender.deadline) < new Date();
    
    if (tenderDeadlinePassed) {
      return NextResponse.json(
        { error: 'Cannot withdraw proposal after the tender deadline has passed' },
        { status: 400 }
      );
    }
    
    // Check if tender is still published
    if (existingProposal.tender.status !== 'published') {
      return NextResponse.json(
        { error: 'Cannot withdraw proposal for a tender that is no longer published' },
        { status: 400 }
      );
    }
    
    // Update the proposal status to 'withdrawn'
    const { error: updateError } = await supabase
      .from('proposals')
      .update({
        status: 'withdrawn',
        withdrawn_at: new Date().toISOString()
      })
      .eq('id', proposalId);
    
    if (updateError) {
      console.error('Error withdrawing proposal:', updateError);
      return NextResponse.json(
        { error: 'Failed to withdraw proposal', details: updateError.message },
        { status: 500 }
      );
    }
    
    // Create an audit log entry
    await supabase
      .from('audit_logs')
      .insert({
        action: 'withdraw',
        resource_type: 'proposal',
        resource_id: proposalId,
        user_id: user.id,
        details: {
          tender_id: existingProposal.tender_id,
          proposal_title: existingProposal.title
        }
      });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/proposals/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
