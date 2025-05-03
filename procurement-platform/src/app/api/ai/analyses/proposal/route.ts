import { NextRequest, NextResponse } from 'next/server';
import { getProposalAnalysis } from '@/lib/ai/databaseStorage';

/**
 * API endpoint for retrieving proposal analysis results
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const proposalId = searchParams.get('proposalId');
    const tenderId = searchParams.get('tenderId');
    
    if (!proposalId || !tenderId) {
      return NextResponse.json(
        { error: 'Both proposalId and tenderId are required' },
        { status: 400 }
      );
    }
    
    const { data, error } = await getProposalAnalysis(proposalId, tenderId);
    
    if (error) {
      return NextResponse.json(
        { error: 'Error retrieving proposal analysis', details: error.message },
        { status: 500 }
      );
    }
    
    if (!data) {
      return NextResponse.json(
        { error: 'Proposal analysis not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error retrieving proposal analysis:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
