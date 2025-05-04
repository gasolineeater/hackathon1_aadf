import { NextRequest, NextResponse } from 'next/server';
import { mockDashboardData } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  try {
    // Return mock dashboard summary data
    return NextResponse.json(mockDashboardData.summary);
  } catch (error) {
    console.error('Dashboard summary API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
