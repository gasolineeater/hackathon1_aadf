import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/documents/[id]
 * Retrieves a specific document by ID
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
    
    // Get document ID from params
    const documentId = params.id;
    
    // Fetch document details
    const { data: document, error } = await supabase
      .from('documents')
      .select(`
        *,
        uploaded_by:profiles(id, full_name, email),
        validations:document_validations(id, validator_id, validation_type, is_valid, result, created_at)
      `)
      .eq('id', documentId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching document:', error);
      return NextResponse.json(
        { error: 'Failed to fetch document', details: error.message },
        { status: 500 }
      );
    }
    
    // Check access permissions
    // This would need to be expanded based on your access control requirements
    
    // Format the response
    const formattedDocument = {
      ...document,
      uploaded_by_name: document.uploaded_by?.full_name || 'Unknown',
      uploaded_by_email: document.uploaded_by?.email || 'Unknown',
      validations: document.validations || [],
      is_owner: document.uploaded_by?.id === user.id
    };
    
    return NextResponse.json(formattedDocument);
  } catch (error: any) {
    console.error('Error in GET /api/documents/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/documents/[id]
 * Deletes a specific document by ID
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
    
    // Get document ID from params
    const documentId = params.id;
    
    // Fetch document to check permissions and get file path
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching document:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch document', details: fetchError.message },
        { status: 500 }
      );
    }
    
    // Check permissions
    if (!isAdmin && document.uploaded_by !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not have permission to delete this document' },
        { status: 403 }
      );
    }
    
    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path]);
    
    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      // Continue anyway, as we still want to delete the database record
    }
    
    // Delete document validations
    const { error: validationError } = await supabase
      .from('document_validations')
      .delete()
      .eq('document_id', documentId);
    
    if (validationError) {
      console.error('Error deleting document validations:', validationError);
      // Continue anyway, as we still want to delete the document record
    }
    
    // Delete document record
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId);
    
    if (deleteError) {
      console.error('Error deleting document record:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete document', details: deleteError.message },
        { status: 500 }
      );
    }
    
    // Create audit log
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        action: 'document.delete',
        resource_type: 'document',
        resource_id: documentId,
        user_id: user.id,
        details: {
          name: document.name,
          type: document.type,
          tender_id: document.tender_id,
          proposal_id: document.proposal_id
        }
      });
    
    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Continue anyway, as the document was deleted successfully
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/documents/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
