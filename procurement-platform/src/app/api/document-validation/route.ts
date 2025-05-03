import { NextRequest, NextResponse } from 'next/server';
import { DocumentValidationService } from '@/app/services/document-validation.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { document, originalHash, validationType } = body;
    
    if (!document) {
      return NextResponse.json(
        { error: 'Document is required' },
        { status: 400 }
      );
    }
    
    // Determine which validation to perform based on the validationType parameter
    switch (validationType) {
      case 'integrity':
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
        
      case 'format':
        const formatValidation = DocumentValidationService.validateFormat(document);
        return NextResponse.json(formatValidation);
        
      case 'security':
        const securityScan = await DocumentValidationService.scanForMalware(document);
        return NextResponse.json(securityScan);
        
      case 'metadata':
        const metadataValidation = DocumentValidationService.validateMetadata(document);
        return NextResponse.json(metadataValidation);
        
      case 'all':
      default:
        // Perform comprehensive validation
        const validationResult = await DocumentValidationService.validateDocument(document, originalHash);
        return NextResponse.json(validationResult);
    }
  } catch (error) {
    console.error('Error validating document:', error);
    return NextResponse.json(
      { error: 'Failed to validate document' },
      { status: 500 }
    );
  }
}
