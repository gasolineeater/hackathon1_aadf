import { NextRequest, NextResponse } from 'next/server';
import { AICompatibilityService } from '@/services/ai-compatibility.service';
import { getTenderById, getVendorById } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tenderId, vendorId } = body;
    
    if (!tenderId || !vendorId) {
      return NextResponse.json(
        { error: 'Tender ID and Vendor ID are required' },
        { status: 400 }
      );
    }
    
    // Get tender and vendor data
    const tender = await getTenderById(tenderId);
    const vendor = await getVendorById(vendorId);
    
    if (!tender) {
      return NextResponse.json(
        { error: `Tender with ID ${tenderId} not found` },
        { status: 404 }
      );
    }
    
    if (!vendor) {
      return NextResponse.json(
        { error: `Vendor with ID ${vendorId} not found` },
        { status: 404 }
      );
    }
    
    // Analyze compatibility
    const compatibilityResult = await AICompatibilityService.analyzeCompatibility(tender, vendor);
    
    // Save results to database
    await AICompatibilityService.saveCompatibilityAnalysis(tenderId, vendorId, compatibilityResult);
    
    return NextResponse.json(compatibilityResult);
  } catch (error) {
    console.error('Error analyzing compatibility:', error);
    return NextResponse.json(
      { error: 'Failed to analyze compatibility' },
      { status: 500 }
    );
  }
}
