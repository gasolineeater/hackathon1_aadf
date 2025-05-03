import { NextRequest, NextResponse } from 'next/server';
import { DocumentValidationService } from '@/app/services/document-validation.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { document, originalHash } = body;
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document is required' },
        { status: 400 }
      );
    }
    
    const validationResult = await DocumentValidationService.validateDocument(document, originalHash);
    
    return NextResponse.json(validationResult);
  } catch (error) {
    console.error('Error validating document:', error);
    return NextResponse.json(
      { error: 'Failed to validate document' },
      { status: 500 }
    );
  }
}
