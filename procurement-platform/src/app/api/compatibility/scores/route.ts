import { NextRequest, NextResponse } from 'next/server';
import { getCompatibilityScores } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenderId = searchParams.get('tenderId');
    const vendorId = searchParams.get('vendorId');
    
    // Get compatibility scores
    const scores = await getCompatibilityScores(
      tenderId || undefined,
      vendorId || undefined
    );
    
    return NextResponse.json(scores);
  } catch (error) {
    console.error('Error fetching compatibility scores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch compatibility scores' },
      { status: 500 }
    );
  }
}
