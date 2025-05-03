import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/audit-logs
 * Retrieves audit logs with optional filtering
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
    
    // Only admins can view audit logs
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can view audit logs' },
        { status: 403 }
      );
    }
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const resourceType = searchParams.get('resource_type');
    const resourceId = searchParams.get('resource_id');
    const action = searchParams.get('action');
    const userId = searchParams.get('user_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = supabase
      .from('audit_logs')
      .select(`
        *,
        user:users(id, email, full_name)
      `, { count: 'exact' });
    
    // Apply filters
    if (resourceType) {
      query = query.eq('resource_type', resourceType);
    }
    
    if (resourceId) {
      query = query.eq('resource_id', resourceId);
    }
    
    if (action) {
      query = query.eq('action', action);
    }
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Execute the query
    const { data: logs, count, error } = await query;
    
    if (error) {
      console.error('Error fetching audit logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch audit logs', details: error.message },
        { status: 500 }
      );
    }
    
    // Format the response
    const formattedLogs = logs.map(log => ({
      ...log,
      user_name: log.user?.full_name || 'Unknown',
      user_email: log.user?.email || null
    }));
    
    return NextResponse.json({
      logs: formattedLogs,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/audit-logs:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
