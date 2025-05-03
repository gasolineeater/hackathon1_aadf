import { NextRequest, NextResponse } from 'next/server';
import { getVendorProposalAnalyses } from '@/lib/ai/databaseStorage';

/**
 * API endpoint for retrieving all proposal analyses for a vendor
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const vendorId = params.id;
    
    if (!vendorId) {
      return NextResponse.json(
        { error: 'Vendor ID is required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await getVendorProposalAnalyses(vendorId);
    
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
