import { NextRequest, NextResponse } from 'next/server';
import { mockDashboardData } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  try {
    // Get limit from query params
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '5');
    
    // Return mock dashboard activity data with limit
    return NextResponse.json(mockDashboardData.activity.slice(0, limit));
  } catch (error) {
    console.error('Dashboard activity API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
