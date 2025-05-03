import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateCompatibility } from '@/lib/ai/compatibility';

/**
 * GET /api/ai/compatibility
 * Retrieves compatibility scores between vendors and tenders
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
    
    // Only admins and evaluators can view compatibility scores
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can view compatibility scores' },
        { status: 403 }
      );
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const tenderId = searchParams.get('tender_id');
    const vendorId = searchParams.get('vendor_id');
    const minScore = searchParams.get('min_score') ? parseFloat(searchParams.get('min_score')!) : undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = supabase
      .from('compatibility_scores')
      .select(`
        *,
        tender:tenders(id, title, category, status),
        vendor:vendors(id, name, category, years_in_business)
      `, { count: 'exact' });
    
    // Apply filters
    if (tenderId) {
      query = query.eq('tender_id', tenderId);
    }
    
    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }
    
    if (minScore !== undefined) {
      query = query.gte('score', minScore);
    }
    
    // Apply pagination
    query = query
      .order('score', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Execute the query
    const { data: scores, count, error } = await query;
    
    if (error) {
      console.error('Error fetching compatibility scores:', error);
      return NextResponse.json(
        { error: 'Failed to fetch compatibility scores' },
        { status: 500 }
      );
    }
    
    // Format the response
    const formattedScores = scores.map(score => ({
      id: score.id,
      tender_id: score.tender_id,
      tender_title: score.tender?.title || 'Unknown',
      tender_category: score.tender?.category || 'Unknown',
      vendor_id: score.vendor_id,
      vendor_name: score.vendor?.name || 'Unknown',
      vendor_category: score.vendor?.category || 'Unknown',
      score: score.score,
      factors: score.factors || [],
      created_at: score.created_at
    }));
    
    return NextResponse.json({
      compatibility_scores: formattedScores,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/ai/compatibility:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/compatibility/calculate
 * Calculates compatibility for a specific tender
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
    
    // Only admins and evaluators can calculate compatibility
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can calculate compatibility' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.tender_id) {
      return NextResponse.json(
        { error: 'tender_id is required' },
        { status: 400 }
      );
    }
    
    // Check if tender exists
    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .select('*')
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
    
    // Get vendors to calculate compatibility for
    let vendorQuery = supabase.from('vendors').select('*');
    
    // If specific vendors are provided, filter by them
    if (body.vendor_ids && Array.isArray(body.vendor_ids) && body.vendor_ids.length > 0) {
      vendorQuery = vendorQuery.in('id', body.vendor_ids);
    }
    
    const { data: vendors, error: vendorError } = await vendorQuery;
    
    if (vendorError) {
      console.error('Error fetching vendors:', vendorError);
      return NextResponse.json(
        { error: 'Failed to fetch vendors', details: vendorError.message },
        { status: 500 }
      );
    }
    
    if (!vendors || vendors.length === 0) {
      return NextResponse.json(
        { error: 'No vendors found to calculate compatibility' },
        { status: 404 }
      );
    }
    
    // Calculate compatibility for each vendor
    const compatibilityResults = [];
    
    for (const vendor of vendors) {
      // Calculate compatibility score
      const compatibilityResult = await calculateCompatibility(tender, vendor);
      
      // Store compatibility score
      const { data: score, error: scoreError } = await supabase
        .from('compatibility_scores')
        .upsert({
          tender_id: body.tender_id,
          vendor_id: vendor.id,
          score: compatibilityResult.score,
          factors: compatibilityResult.factors,
          created_by: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (scoreError) {
        console.error('Error storing compatibility score:', scoreError);
        // Continue with other vendors
        continue;
      }
      
      compatibilityResults.push({
        id: score.id,
        tender_id: body.tender_id,
        vendor_id: vendor.id,
        vendor_name: vendor.name,
        score: compatibilityResult.score,
        factors: compatibilityResult.factors
      });
    }
    
    // Create audit log
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        action: 'compatibility.calculate',
        resource_type: 'tender',
        resource_id: body.tender_id,
        user_id: user.id,
        details: {
          vendor_count: vendors.length
        }
      });
    
    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Continue anyway, as the compatibility was calculated successfully
    }
    
    return NextResponse.json({
      tender_id: body.tender_id,
      tender_title: tender.title,
      vendor_count: vendors.length,
      compatibility_scores: compatibilityResults
    });
  } catch (error: any) {
    console.error('Error in POST /api/ai/compatibility/calculate:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
