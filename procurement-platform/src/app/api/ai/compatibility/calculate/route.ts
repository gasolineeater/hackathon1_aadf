import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateCompatibility } from '@/lib/ai/compatibility';

/**
 * POST /api/ai/compatibility/calculate
 * Calculates compatibility scores between vendors and a tender
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
    const compatibilityPromises = vendors.map(async (vendor) => {
      try {
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
          return null;
        }
        
        return {
          id: score.id,
          tender_id: body.tender_id,
          vendor_id: vendor.id,
          vendor_name: vendor.name,
          score: compatibilityResult.score,
          factors: compatibilityResult.factors
        };
      } catch (error) {
        console.error(`Error calculating compatibility for vendor ${vendor.id}:`, error);
        return null;
      }
    });
    
    // Wait for all compatibility calculations to complete
    const results = await Promise.all(compatibilityPromises);
    
    // Filter out null results (failed calculations)
    const validResults = results.filter(result => result !== null);
    
    // Create audit log
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        action: 'compatibility.calculate',
        resource_type: 'tender',
        resource_id: body.tender_id,
        user_id: user.id,
        details: {
          vendor_count: vendors.length,
          success_count: validResults.length
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
      success_count: validResults.length,
      compatibility_scores: validResults
    });
  } catch (error: any) {
    console.error('Error in POST /api/ai/compatibility/calculate:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
