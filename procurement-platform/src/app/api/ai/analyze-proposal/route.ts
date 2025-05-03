import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { analyzeProposal } from '@/lib/ai/proposalAnalysis';
import { storeProposalAnalysis } from '@/lib/ai/databaseStorage';

/**
 * Proposal analysis API
 * Analyzes a vendor proposal against tender requirements
 */
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = userProfile?.role === 'admin';
    const isEvaluator = userProfile?.role === 'evaluator';

    // Only admins and evaluators can analyze proposals
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can analyze proposals' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check for proposal_id in the new API format
    if (body.proposal_id) {
      // New API format
      return await handleNewApiFormat(request, user.id);
    }

    // Legacy API format
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
      await storeProposalAnalysis(
        body.tenderId,
        body.proposalId,
        proposalContent,
        tenderContent,
        analysisResult,
        user.id
      );

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          action: 'proposal.analyze',
          resource_type: 'proposal',
          resource_id: body.proposalId,
          user_id: user.id,
          details: {
            tender_id: body.tenderId,
            score: analysisResult.score || analysisResult.overall_score
          }
        });
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

/**
 * Handles the new API format for proposal analysis
 */
async function handleNewApiFormat(request: NextRequest, userId: string) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.proposal_id) {
      return NextResponse.json(
        { error: 'proposal_id is required' },
        { status: 400 }
      );
    }

    // Fetch proposal details
    const { data: proposal, error: proposalError } = await supabase
      .from('proposals')
      .select(`
        *,
        tender:tenders(id, title, requirements, evaluation_criteria),
        documents:documents(id, name, file_type, file_path, file_url)
      `)
      .eq('id', body.proposal_id)
      .single();

    if (proposalError) {
      if (proposalError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Proposal not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching proposal:', proposalError);
      return NextResponse.json(
        { error: 'Failed to fetch proposal', details: proposalError.message },
        { status: 500 }
      );
    }

    // Check if proposal is in a state that can be analyzed
    if (proposal.status !== 'submitted') {
      return NextResponse.json(
        { error: 'Cannot analyze a proposal that has not been submitted' },
        { status: 400 }
      );
    }

    // Prepare proposal content for analysis
    const proposalContent = proposal.content;
    const proposalMetadata = {
      id: proposal.id,
      title: proposal.title,
      price: proposal.price,
      currency: proposal.currency,
      delivery_timeline: proposal.delivery_timeline,
      additional_info: proposal.additional_info,
      documents: proposal.documents || []
    };

    // Prepare tender content for analysis
    const tenderContent = proposal.tender.requirements;
    const tenderMetadata = {
      id: proposal.tender.id,
      title: proposal.tender.title,
      evaluation_criteria: proposal.tender.evaluation_criteria
    };

    // Analyze proposal
    const analysisResult = await analyzeProposal(proposalContent, tenderContent, proposalMetadata, tenderMetadata);

    // Store analysis result
    const { data: analysis, error: analysisError } = await supabase
      .from('proposal_analyses')
      .insert({
        proposal_id: body.proposal_id,
        tender_id: proposal.tender.id,
        analyzer_id: userId,
        analysis_type: 'ai',
        result: analysisResult,
        score: analysisResult.overall_score || analysisResult.score,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (analysisError) {
      console.error('Error storing analysis result:', analysisError);
      return NextResponse.json(
        { error: 'Failed to store analysis result', details: analysisError.message },
        { status: 500 }
      );
    }

    // Update proposal with analysis score
    await supabase
      .from('proposals')
      .update({
        ai_score: analysisResult.overall_score || analysisResult.score,
        last_analyzed_at: new Date().toISOString()
      })
      .eq('id', body.proposal_id);

    // Create audit log
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        action: 'proposal.analyze',
        resource_type: 'proposal',
        resource_id: body.proposal_id,
        user_id: userId,
        details: {
          analysis_id: analysis.id,
          tender_id: proposal.tender.id,
          score: analysisResult.overall_score || analysisResult.score
        }
      });

    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Continue anyway, as the analysis was completed successfully
    }

    return NextResponse.json({
      analysis_id: analysis.id,
      proposal_id: body.proposal_id,
      tender_id: proposal.tender.id,
      score: analysisResult.overall_score || analysisResult.score,
      analysis_result: analysisResult
    });
  } catch (error: any) {
    console.error('Error in handleNewApiFormat:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/analyze-proposal
 * Retrieves analysis results for a proposal
 */
export async function GET(request: NextRequest) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = userProfile?.role === 'admin';
    const isEvaluator = userProfile?.role === 'evaluator';

    // Only admins and evaluators can view proposal analyses
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can view proposal analyses' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const proposalId = searchParams.get('proposal_id');

    if (!proposalId) {
      return NextResponse.json(
        { error: 'proposal_id is required' },
        { status: 400 }
      );
    }

    // Fetch analysis results
    const { data: analyses, error } = await supabase
      .from('proposal_analyses')
      .select(`
        *,
        analyzer:profiles(id, full_name, email)
      `)
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching proposal analyses:', error);
      return NextResponse.json(
        { error: 'Failed to fetch proposal analyses', details: error.message },
        { status: 500 }
      );
    }

    // Format the response
    const formattedAnalyses = analyses.map(analysis => ({
      ...analysis,
      analyzer_name: analysis.analyzer?.full_name || 'AI System',
      analyzer_email: analysis.analyzer?.email || 'system@aadf.org'
    }));

    return NextResponse.json({
      proposal_id: proposalId,
      analyses: formattedAnalyses
    });
  } catch (error: any) {
    console.error('Error in GET /api/ai/analyze-proposal:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

