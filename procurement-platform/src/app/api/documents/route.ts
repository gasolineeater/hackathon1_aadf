import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET /api/documents
 * Retrieves a list of documents with optional filtering
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
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const tenderId = searchParams.get('tender_id');
    const proposalId = searchParams.get('proposal_id');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = supabase
      .from('documents')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (tenderId) {
      query = query.eq('tender_id', tenderId);
    }
    
    if (proposalId) {
      query = query.eq('proposal_id', proposalId);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Execute the query
    const { data: documents, count, error } = await query;
    
    if (error) {
      console.error('Error fetching documents:', error);
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      documents,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/documents:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/documents
 * Uploads a new document
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
    
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tenderId = formData.get('tender_id') as string;
    const proposalId = formData.get('proposal_id') as string;
    const type = formData.get('type') as string;
    const name = formData.get('name') as string || file.name;
    const description = formData.get('description') as string;
    
    // Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }
    
    if (!type) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }
    
    if (!tenderId && !proposalId) {
      return NextResponse.json(
        { error: 'Either tender_id or proposal_id is required' },
        { status: 400 }
      );
    }
    
    // Generate a unique ID for the document
    const documentId = uuidv4();
    
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${documentId}.${fileExt}`;
    const storagePath = `documents/${filePath}`;
    
    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file);
    
    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file', details: uploadError.message },
        { status: 500 }
      );
    }
    
    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(storagePath);
    
    // Prepare document data
    const documentData = {
      id: documentId,
      name: name,
      description: description || null,
      type: type,
      file_path: storagePath,
      file_url: publicUrl,
      file_type: file.type,
      file_size: file.size,
      tender_id: tenderId || null,
      proposal_id: proposalId || null,
      uploaded_by: user.id,
      validation_status: 'pending'
    };
    
    // Insert document into database
    const { data: document, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating document record:', error);
      
      // Delete the uploaded file if the database insert fails
      await supabase.storage
        .from('documents')
        .remove([storagePath]);
      
      return NextResponse.json(
        { error: 'Failed to create document record', details: error.message },
        { status: 500 }
      );
    }
    
    // Create audit log
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        action: 'document.upload',
        resource_type: 'document',
        resource_id: documentId,
        user_id: user.id,
        details: {
          name: name,
          type: type,
          tender_id: tenderId || null,
          proposal_id: proposalId || null,
          file_size: file.size
        }
      });
    
    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Continue anyway, as the document was uploaded successfully
    }
    
    return NextResponse.json(document, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/documents:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
