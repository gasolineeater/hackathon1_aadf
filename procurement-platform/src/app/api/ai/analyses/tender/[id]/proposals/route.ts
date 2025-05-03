import { NextRequest, NextResponse } from 'next/server';
import { getTenderProposalAnalyses } from '@/lib/ai/databaseStorage';

/**
 * API endpoint for retrieving all proposal analyses for a tender
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
    
    const { data, error } = await getTenderProposalAnalyses(tenderId);
    
    if (error) {
      return NextResponse.json(
        { error: 'Error retrieving proposal analyses', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
  } catch (error: any) {
    console.error('Error retrieving proposal analyses:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
