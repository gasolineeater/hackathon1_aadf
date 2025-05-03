import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { analyzeProposal, storeAnalysisResult } from '@/lib/ai/proposalAnalysis';

/**
 * Proposal analysis API
 * Analyzes a vendor proposal against tender requirements
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Required fields validation
    if ((!body.proposalId && !body.proposalContent) || (!body.tenderId && !body.tenderContent)) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: 'Either proposalId or proposalContent, and either tenderId or tenderContent are required'
        },
        { status: 400 }
      );
    }

    // Initialize variables for content
    let proposalContent = body.proposalContent;
    let tenderContent = body.tenderContent;
    let proposalMetadata = body.proposalMetadata || {};
    let tenderMetadata = body.tenderMetadata || {};

    // If proposalId is provided, fetch the proposal from the database
    if (body.proposalId && !proposalContent) {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', body.proposalId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Proposal not found', details: error?.message },
          { status: 404 }
        );
      }

      proposalContent = data.content;
      proposalMetadata = {
        title: data.title,
        vendor_id: data.vendor_id,
        submitted_at: data.submitted_at,
        ...proposalMetadata
      };
    }

    // If tenderId is provided, fetch the tender from the database
    if (body.tenderId && !tenderContent) {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', body.tenderId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { error: 'Tender not found', details: error?.message },
          { status: 404 }
        );
      }

      tenderContent = data.description;
      tenderMetadata = {
        title: data.title,
        category: data.category,
        budget: data.budget,
        deadline: data.submission_deadline,
        ...tenderMetadata
      };
    }

    // Analyze the proposal against the tender
    const analysisResult = await analyzeProposal(proposalContent, tenderContent, proposalMetadata, tenderMetadata);

    // Store analysis result if IDs are provided
    if (body.proposalId && body.tenderId) {
      await storeAnalysisResult(body.tenderId, body.proposalId, analysisResult);
    }

    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error('Error analyzing proposal:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}


