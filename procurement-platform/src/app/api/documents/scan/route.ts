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
    
    const securityScan = await DocumentValidationService.scanForMalware(document);
    
    return NextResponse.json(securityScan);
  } catch (error) {
    console.error('Error scanning document:', error);
    return NextResponse.json(
      { error: 'Failed to scan document' },
      { status: 500 }
    );
  }
}
