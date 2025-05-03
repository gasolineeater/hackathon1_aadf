import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/tenders/[id]
 * Retrieves a specific tender by ID
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
    
    // Get tender ID from params
    const tenderId = params.id;
    
    // Fetch tender details
    const { data: tender, error } = await supabase
      .from('tenders')
      .select(`
        *,
        created_by:users!created_by(id, email, full_name),
        awarded_to:vendors(id, name, contact_email),
        documents(id, name, type, url, created_at),
        evaluations(id, evaluator_id, score, comments, created_at)
      `)
      .eq('id', tenderId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tender not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching tender:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tender', details: error.message },
        { status: 500 }
      );
    }
    
    // Check access permissions
    if (tender.status === 'draft' && !isAdmin && !isEvaluator && tender.created_by.id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to view this tender' },
        { status: 403 }
      );
    }
    
    // Get proposal count if admin or evaluator
    let proposalCount = 0;
    if (isAdmin || isEvaluator) {
      const { count, error: countError } = await supabase
        .from('proposals')
        .select('*', { count: 'exact', head: true })
        .eq('tender_id', tenderId);
      
      if (!countError) {
        proposalCount = count || 0;
      }
    }
    
    // Format the response
    const formattedTender = {
      ...tender,
      created_by_name: tender.created_by?.full_name || 'Unknown',
      created_by_email: tender.created_by?.email,
      awarded_to_name: tender.awarded_to?.[0]?.name || null,
      awarded_to_email: tender.awarded_to?.[0]?.contact_email || null,
      proposal_count: proposalCount,
      is_owner: tender.created_by.id === user.id,
      can_edit: isAdmin || isEvaluator || tender.created_by.id === user.id,
      can_delete: isAdmin || tender.created_by.id === user.id,
      can_publish: (isAdmin || isEvaluator) && tender.status === 'draft',
      can_award: (isAdmin || isEvaluator) && tender.status === 'closed',
      can_submit_proposal: isVendor && tender.status === 'published' && new Date(tender.deadline) > new Date()
    };
    
    return NextResponse.json(formattedTender);
  } catch (error: any) {
    console.error('Error in GET /api/tenders/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tenders/[id]
 * Updates a specific tender by ID
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
    const isEvaluator = userProfile?.role === 'evaluator';
    
    // Get tender ID from params
    const tenderId = params.id;
    
    // Fetch current tender to check permissions
    const { data: existingTender, error: fetchError } = await supabase
      .from('tenders')
      .select('*')
      .eq('id', tenderId)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tender not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching tender:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch tender', details: fetchError.message },
        { status: 500 }
      );
    }
    
    // Check permissions
    if (!isAdmin && !isEvaluator && existingTender.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to update this tender' },
        { status: 403 }
      );
    }
    
    // Check if tender is in a state that can be updated
    if (existingTender.status === 'awarded' || existingTender.status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot update a tender that has been awarded or cancelled' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Prepare update data
    const updateData: any = {};
    
    // Fields that can be updated
    const updatableFields = [
      'title', 'description', 'category', 'budget_range', 
      'location', 'deadline', 'requirements', 'evaluation_criteria'
    ];
    
    // Add fields to update data if they exist in the request body
    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }
    
    // Status changes require special handling
    if (body.status !== undefined) {
      // Only admins and evaluators can change status
      if (!isAdmin && !isEvaluator) {
        return NextResponse.json(
          { error: 'Forbidden: Only admins and evaluators can change tender status' },
          { status: 403 }
        );
      }
      
      // Validate status transitions
      const validTransitions: Record<string, string[]> = {
        'draft': ['published', 'cancelled'],
        'published': ['closed', 'cancelled'],
        'closed': ['awarded', 'cancelled'],
        'awarded': [],
        'cancelled': []
      };
      
      if (!validTransitions[existingTender.status].includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status transition from ${existingTender.status} to ${body.status}` },
          { status: 400 }
        );
      }
      
      updateData.status = body.status;
      
      // Set timestamps for status changes
      if (body.status === 'published' && existingTender.status === 'draft') {
        updateData.published_at = new Date().toISOString();
      } else if (body.status === 'closed' && existingTender.status === 'published') {
        updateData.closed_at = new Date().toISOString();
      } else if (body.status === 'awarded' && existingTender.status === 'closed') {
        updateData.awarded_at = new Date().toISOString();
        
        // Validate awarded_to if status is changing to awarded
        if (!body.awarded_to) {
          return NextResponse.json(
            { error: 'awarded_to is required when status is changed to awarded' },
            { status: 400 }
          );
        }
        
        updateData.awarded_to = body.awarded_to;
      } else if (body.status === 'cancelled') {
        updateData.cancelled_at = new Date().toISOString();
      }
    }
    
    // If no fields to update, return early
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    // Update the tender
    const { data: updatedTender, error: updateError } = await supabase
      .from('tenders')
      .update(updateData)
      .eq('id', tenderId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating tender:', updateError);
      return NextResponse.json(
        { error: 'Failed to update tender', details: updateError.message },
        { status: 500 }
      );
    }
    
    // Create a new version record for version control
    const { error: versionError } = await supabase
      .from('document_versions')
      .insert({
        document_type: 'tender',
        document_id: tenderId,
        version: existingTender.version + 1,
        content: { ...existingTender, ...updateData },
        created_by: user.id,
        change_summary: body.change_summary || 'Updated tender'
      });
    
    if (versionError) {
      console.error('Error creating version record:', versionError);
      // Continue anyway, as the tender was updated successfully
    }
    
    // Update the version number in the tender
    await supabase
      .from('tenders')
      .update({ version: existingTender.version + 1 })
      .eq('id', tenderId);
    
    return NextResponse.json(updatedTender);
  } catch (error: any) {
    console.error('Error in PUT /api/tenders/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tenders/[id]
 * Deletes a specific tender by ID
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
    
    // Get tender ID from params
    const tenderId = params.id;
    
    // Fetch current tender to check permissions
    const { data: existingTender, error: fetchError } = await supabase
      .from('tenders')
      .select('*')
      .eq('id', tenderId)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Tender not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching tender:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch tender', details: fetchError.message },
        { status: 500 }
      );
    }
    
    // Check permissions
    if (!isAdmin && existingTender.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete this tender' },
        { status: 403 }
      );
    }
    
    // Check if tender has proposals
    const { count, error: countError } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('tender_id', tenderId);
    
    if (!countError && count && count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete a tender that has proposals' },
        { status: 400 }
      );
    }
    
    // Delete the tender
    const { error: deleteError } = await supabase
      .from('tenders')
      .delete()
      .eq('id', tenderId);
    
    if (deleteError) {
      console.error('Error deleting tender:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete tender', details: deleteError.message },
        { status: 500 }
      );
    }
    
    // Create an audit log entry
    await supabase
      .from('audit_logs')
      .insert({
        action: 'delete',
        resource_type: 'tender',
        resource_id: tenderId,
        user_id: user.id,
        details: {
          tender_title: existingTender.title,
          tender_status: existingTender.status
        }
      });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/tenders/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
