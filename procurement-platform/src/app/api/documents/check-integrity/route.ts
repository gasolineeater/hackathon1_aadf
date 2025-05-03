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
    
    if (!originalHash) {
      return NextResponse.json(
        { error: 'Original hash is required for integrity check' },
        { status: 400 }
      );
    }
    
    const integrityValid = DocumentValidationService.validateIntegrity(document, originalHash);
    
    return NextResponse.json({
      valid: integrityValid,
      calculatedHash: DocumentValidationService.calculateDocumentHash(document),
      originalHash
    });
  } catch (error) {
    console.error('Error checking document integrity:', error);
    return NextResponse.json(
      { error: 'Failed to check document integrity' },
      { status: 500 }
    );
  }
}
