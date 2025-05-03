import { NextRequest, NextResponse } from 'next/server';
import { getTenderEvaluation } from '@/lib/ai/databaseStorage';

/**
 * API endpoint for retrieving tender evaluation results
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
    
    const { data, error } = await getTenderEvaluation(tenderId);
    
    if (error) {
      return NextResponse.json(
        { error: 'Error retrieving tender evaluation', details: error.message },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Tender evaluation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error retrieving tender evaluation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
