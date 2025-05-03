import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET /api/proposals
 * Retrieves a list of proposals with optional filtering
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
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const tenderId = searchParams.get('tender_id');
    const vendorId = searchParams.get('vendor_id');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = supabase
      .from('proposals')
      .select(`
        *,
        tender:tenders(id, title, status, deadline),
        vendor:vendors(id, name, contact_person, contact_email),
        documents:documents(id, name, file_type, file_url, created_at)
      `, { count: 'exact' });
    
    // Apply filters
    if (tenderId) {
      query = query.eq('tender_id', tenderId);
    }
    
    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }
    
    if (status) {
      query = query.eq('status', status.toLowerCase());
    }
    
    // Apply access control
    if (isVendor) {
      // Vendors can only see their own proposals
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!vendor) {
        return NextResponse.json(
          { error: 'Vendor profile not found' },
          { status: 404 }
        );
      }
      
      query = query.eq('vendor_id', vendor.id);
    } else if (!isAdmin && !isEvaluator) {
      // Regular users can't see proposals
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Execute the query
    const { data: proposals, count, error } = await query;
    
    if (error) {
      console.error('Error fetching proposals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch proposals' },
        { status: 500 }
      );
    }
    
    // Format the response
    const formattedProposals = proposals.map(proposal => ({
      ...proposal,
      tender_title: proposal.tender?.title || 'Unknown',
      tender_status: proposal.tender?.status || 'Unknown',
      vendor_name: proposal.vendor?.name || 'Unknown',
      documents: proposal.documents || []
    }));
    
    return NextResponse.json({
      proposals: formattedProposals,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/proposals:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/proposals
 * Creates a new proposal
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
    
    const isVendor = userProfile?.role === 'vendor';
    
    // Only vendors can create proposals
    if (!isVendor) {
      return NextResponse.json(
        { error: 'Forbidden: Only vendors can create proposals' },
        { status: 403 }
      );
    }
    
    // Get vendor ID
    const { data: vendor } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor profile not found' },
        { status: 404 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['tender_id', 'title', 'content', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check if tender exists and is open for proposals
    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .select('status, deadline')
      .eq('id', body.tender_id)
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
    
    // Check if tender is published and deadline has not passed
    if (tender.status !== 'published') {
      return NextResponse.json(
        { error: 'Tender is not open for proposals' },
        { status: 400 }
      );
    }
    
    const deadline = new Date(tender.deadline);
    const now = new Date();
    if (deadline < now) {
      return NextResponse.json(
        { error: 'Tender deadline has passed' },
        { status: 400 }
      );
    }
    
    // Check if vendor already has a proposal for this tender
    const { count: existingProposalCount, error: countError } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('tender_id', body.tender_id)
      .eq('vendor_id', vendor.id);
    
    if (!countError && existingProposalCount && existingProposalCount > 0) {
      return NextResponse.json(
        { error: 'You already have a proposal for this tender' },
        { status: 400 }
      );
    }
    
    // Generate a unique ID for the proposal
    const proposalId = uuidv4();
    
    // Prepare proposal data
    const proposalData = {
      id: proposalId,
      tender_id: body.tender_id,
      vendor_id: vendor.id,
      title: body.title,
      content: body.content,
      price: body.price,
      currency: body.currency || 'EUR',
      delivery_timeline: body.delivery_timeline || null,
      additional_info: body.additional_info || null,
      status: body.status || 'draft',
      submitted_at: body.status === 'submitted' ? new Date().toISOString() : null,
      version: 1
    };
    
    // Insert proposal into database
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert(proposalData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating proposal:', error);
      return NextResponse.json(
        { error: 'Failed to create proposal', details: error.message },
        { status: 500 }
      );
    }
    
    // Create initial version record for version control
    const { error: versionError } = await supabase
      .from('document_versions')
      .insert({
        document_type: 'proposal',
        document_id: proposalId,
        version: 1,
        content: proposalData,
        created_by: user.id,
        change_summary: 'Initial creation'
      });
    
    if (versionError) {
      console.error('Error creating version record:', versionError);
      // Continue anyway, as the proposal was created successfully
    }
    
    // Create audit log
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        action: 'proposal.create',
        resource_type: 'proposal',
        resource_id: proposalId,
        user_id: user.id,
        details: {
          tender_id: body.tender_id,
          status: body.status || 'draft'
        }
      });
    
    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Continue anyway, as the proposal was created successfully
    }
    
    return NextResponse.json(proposal, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/proposals:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
