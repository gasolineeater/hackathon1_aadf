import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET /api/tenders/[id]/proposals
 * Retrieves proposals for a specific tender
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
    
    // Fetch tender to check permissions and deadline
    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .select('*')
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
    
    // If vendor, get their vendor ID
    let vendorId = null;
    if (isVendor) {
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (vendorError) {
        console.error('Error fetching vendor:', vendorError);
        return NextResponse.json(
          { error: 'Failed to fetch vendor information', details: vendorError.message },
          { status: 500 }
        );
      }
      
      vendorId = vendor.id;
    }
    
    // Check if deadline has passed or if user is admin/evaluator
    const deadlinePassed = new Date(tender.deadline) < new Date();
    const canViewAllProposals = isAdmin || isEvaluator || deadlinePassed;
    
    // Build query
    let query = supabase
      .from('proposals')
      .select(`
        *,
        vendor:vendors(id, name, contact_person, contact_email),
        documents(id, name, type, url, created_at),
        evaluations(id, evaluator_id, score, comments, created_at)
      `)
      .eq('tender_id', tenderId);
    
    // If vendor, only show their own proposals
    if (isVendor && vendorId) {
      query = query.eq('vendor_id', vendorId);
    } else if (!canViewAllProposals) {
      // If not admin/evaluator and deadline hasn't passed, don't show any proposals
      return NextResponse.json(
        { error: 'Proposals are hidden until the tender deadline has passed' },
        { status: 403 }
      );
    }
    
    // Execute query
    const { data: proposals, error } = await query;
    
    if (error) {
      console.error('Error fetching proposals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch proposals', details: error.message },
        { status: 500 }
      );
    }
    
    // Format the response
    const formattedProposals = proposals.map(proposal => ({
      ...proposal,
      vendor_name: proposal.vendor?.[0]?.name || 'Unknown',
      vendor_contact: proposal.vendor?.[0]?.contact_person || null,
      vendor_email: proposal.vendor?.[0]?.contact_email || null,
      evaluation_count: proposal.evaluations?.length || 0,
      average_score: proposal.evaluations?.length 
        ? proposal.evaluations.reduce((sum: number, eval: any) => sum + eval.score, 0) / proposal.evaluations.length 
        : null
    }));
    
    return NextResponse.json(formattedProposals);
  } catch (error: any) {
    console.error('Error in GET /api/tenders/[id]/proposals:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tenders/[id]/proposals
 * Submits a new proposal for a tender
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
    
    const isVendor = userProfile?.role === 'vendor';
    
    // Only vendors can submit proposals
    if (!isVendor) {
      return NextResponse.json(
        { error: 'Forbidden: Only vendors can submit proposals' },
        { status: 403 }
      );
    }
    
    // Get tender ID from params
    const tenderId = params.id;
    
    // Fetch tender to check status and deadline
    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .select('*')
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
    
    // Check if tender is published
    if (tender.status !== 'published') {
      return NextResponse.json(
        { error: 'Cannot submit proposal for a tender that is not published' },
        { status: 400 }
      );
    }
    
    // Check if deadline has passed
    if (new Date(tender.deadline) < new Date()) {
      return NextResponse.json(
        { error: 'Cannot submit proposal after the tender deadline' },
        { status: 400 }
      );
    }
    
    // Get vendor ID
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    if (vendorError) {
      console.error('Error fetching vendor:', vendorError);
      return NextResponse.json(
        { error: 'Failed to fetch vendor information', details: vendorError.message },
        { status: 500 }
      );
    }
    
    // Check if vendor has already submitted a proposal for this tender
    const { count, error: countError } = await supabase
      .from('proposals')
      .select('*', { count: 'exact', head: true })
      .eq('tender_id', tenderId)
      .eq('vendor_id', vendor.id);
    
    if (!countError && count && count > 0) {
      return NextResponse.json(
        { error: 'You have already submitted a proposal for this tender' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'content', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Generate a unique ID for the proposal
    const proposalId = uuidv4();
    
    // Prepare proposal data
    const proposalData = {
      id: proposalId,
      tender_id: tenderId,
      vendor_id: vendor.id,
      title: body.title,
      content: body.content,
      price: body.price,
      currency: body.currency || 'USD',
      delivery_timeline: body.delivery_timeline || null,
      additional_info: body.additional_info || null,
      status: 'submitted',
      submitted_at: new Date().toISOString()
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
        change_summary: 'Initial submission'
      });
    
    if (versionError) {
      console.error('Error creating version record:', versionError);
      // Continue anyway, as the proposal was created successfully
    }
    
    // Create an audit log entry
    await supabase
      .from('audit_logs')
      .insert({
        action: 'create',
        resource_type: 'proposal',
        resource_id: proposalId,
        user_id: user.id,
        details: {
          tender_id: tenderId,
          tender_title: tender.title,
          proposal_title: body.title
        }
      });
    
    return NextResponse.json(proposal, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/tenders/[id]/proposals:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
