import { NextRequest, NextResponse } from 'next/server';
import { getVendorMatches } from '@/lib/ai/databaseStorage';

/**
 * API endpoint for retrieving vendor matching results for a tender
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenderId = params.id;
    
    if (!tenderId) {
      return NextResponse.json(
        { error: 'Tender ID is required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await getVendorMatches(tenderId);
    
    if (error) {
      return NextResponse.json(
        { error: 'Error retrieving vendor matches', details: error.message },
        { status: 500 }
      );
    }
    
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No vendor matches found for this tender' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error retrieving vendor matches:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
