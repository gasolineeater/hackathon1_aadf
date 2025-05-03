import { NextRequest, NextResponse } from 'next/server';
import { DocumentValidationService } from '@/app/services/document-validation.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { document } = body;
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document is required' },
        { status: 400 }
      );
    }
    
    const formatValidation = DocumentValidationService.validateFormat(document);
    
    return NextResponse.json(formatValidation);
  } catch (error) {
    console.error('Error validating document format:', error);
    return NextResponse.json(
      { error: 'Failed to validate document format' },
      { status: 500 }
    );
  }
}
