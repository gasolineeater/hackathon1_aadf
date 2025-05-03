import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/document-versions
 * Retrieves version history for a document
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
    const documentType = searchParams.get('document_type');
    const documentId = searchParams.get('document_id');
    
    // Validate required parameters
    if (!documentType || !documentId) {
      return NextResponse.json(
        { error: 'Missing required parameters: document_type and document_id' },
        { status: 400 }
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
    
    // Check access permissions based on document type
    if (documentType === 'tender') {
      // For tenders, check if user is admin, evaluator, or the creator
      if (!isAdmin && !isEvaluator) {
        const { data: tender, error } = await supabase
          .from('tenders')
          .select('created_by')
          .eq('id', documentId)
          .single();
        
        if (error || tender.created_by !== user.id) {
          return NextResponse.json(
            { error: 'Forbidden: You do not have permission to view this document history' },
            { status: 403 }
          );
        }
      }
    } else if (documentType === 'proposal') {
      // For proposals, check if user is admin, evaluator, or the vendor
      if (!isAdmin && !isEvaluator) {
        const { data: proposal, error } = await supabase
          .from('proposals')
          .select('vendor_id')
          .eq('id', documentId)
          .single();
        
        if (error) {
          return NextResponse.json(
            { error: 'Forbidden: You do not have permission to view this document history' },
            { status: 403 }
          );
        }
        
        const { data: vendor, error: vendorError } = await supabase
          .from('vendors')
          .select('user_id')
          .eq('id', proposal.vendor_id)
          .single();
        
        if (vendorError || vendor.user_id !== user.id) {
          return NextResponse.json(
            { error: 'Forbidden: You do not have permission to view this document history' },
            { status: 403 }
          );
        }
      }
    } else {
      // For other document types, only admins and evaluators can view history
      if (!isAdmin && !isEvaluator) {
        return NextResponse.json(
          { error: 'Forbidden: You do not have permission to view this document history' },
          { status: 403 }
        );
      }
    }
    
    // Fetch document versions
    const { data: versions, error } = await supabase
      .from('document_versions')
      .select(`
        *,
        created_by:users(id, email, full_name)
      `)
      .eq('document_type', documentType)
      .eq('document_id', documentId)
      .order('version', { ascending: false });
    
    if (error) {
      console.error('Error fetching document versions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch document versions', details: error.message },
        { status: 500 }
      );
    }
    
    // Format the response
    const formattedVersions = versions.map(version => ({
      ...version,
      created_by_name: version.created_by?.full_name || 'Unknown',
      created_by_email: version.created_by?.email || null
    }));
    
    return NextResponse.json(formattedVersions);
  } catch (error: any) {
    console.error('Error in GET /api/document-versions:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
