import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET /api/tenders
 * Retrieves a list of tenders with optional filtering
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
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = supabase
      .from('tenders')
      .select(`
        *,
        created_by:users!created_by(full_name),
        awarded_to:vendors(name)
      `, { count: 'exact' });
    
    // Apply filters
    if (status) {
      query = query.eq('status', status.toLowerCase());
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    // If vendor, only show published tenders
    if (isVendor) {
      query = query.in('status', ['published', 'closed', 'awarded']);
    }
    
    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Execute the query
    const { data: tenders, count, error } = await query;
    
    if (error) {
      console.error('Error fetching tenders:', error);
      return NextResponse.json(
        { error: 'Failed to fetch tenders' },
        { status: 500 }
      );
    }
    
    // Format the response
    const formattedTenders = tenders.map(tender => ({
      ...tender,
      created_by_name: tender.created_by?.full_name || 'Unknown',
      awarded_to_name: tender.awarded_to?.[0]?.name || null
    }));
    
    return NextResponse.json({
      tenders: formattedTenders,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/tenders:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tenders
 * Creates a new tender
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
    
    // Only admins and evaluators can create tenders
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can create tenders' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'deadline'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Generate a unique ID for the tender
    const tenderId = uuidv4();
    
    // Prepare tender data
    const tenderData = {
      id: tenderId,
      title: body.title,
      description: body.description,
      category: body.category,
      status: body.status || 'draft',
      budget_range: body.budget_range || null,
      location: body.location || null,
      deadline: body.deadline,
      requirements: body.requirements || null,
      evaluation_criteria: body.evaluation_criteria || null,
      created_by: user.id,
      published_at: body.status === 'published' ? new Date().toISOString() : null
    };
    
    // Insert tender into database
    const { data: tender, error } = await supabase
      .from('tenders')
      .insert(tenderData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating tender:', error);
      return NextResponse.json(
        { error: 'Failed to create tender', details: error.message },
        { status: 500 }
      );
    }
    
    // Create initial version record for version control
    const { error: versionError } = await supabase
      .from('document_versions')
      .insert({
        document_type: 'tender',
        document_id: tenderId,
        version: 1,
        content: tenderData,
        created_by: user.id,
        change_summary: 'Initial creation'
      });
    
    if (versionError) {
      console.error('Error creating version record:', versionError);
      // Continue anyway, as the tender was created successfully
    }
    
    return NextResponse.json(tender, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/tenders:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
