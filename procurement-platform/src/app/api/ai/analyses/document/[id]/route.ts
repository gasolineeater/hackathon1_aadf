import { NextRequest, NextResponse } from 'next/server';
import { getDocumentValidation } from '@/lib/ai/databaseStorage';

/**
 * API endpoint for retrieving document validation results
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;
    
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await getDocumentValidation(documentId);
    
    if (error) {
      return NextResponse.json(
        { error: 'Error retrieving document validation', details: error.message },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Document validation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error retrieving document validation:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
