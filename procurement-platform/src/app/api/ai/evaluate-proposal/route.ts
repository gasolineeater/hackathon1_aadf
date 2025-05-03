import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * POST /api/ai/evaluate-proposal
 * Evaluates a proposal using AI and suggests scores
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
    
    // Only admins and evaluators can evaluate proposals
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can evaluate proposals' },
        { status: 403 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['proposal_id', 'tender_id', 'content'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Fetch tender to get evaluation criteria
    const { data: tender, error: tenderError } = await supabase
      .from('tenders')
      .select('evaluation_criteria, requirements')
      .eq('id', body.tender_id)
      .single();
    
    if (tenderError) {
      console.error('Error fetching tender:', tenderError);
      return NextResponse.json(
        { error: 'Failed to fetch tender information', details: tenderError.message },
        { status: 500 }
      );
    }
    
    // Generate a content hash for version control
    const contentHash = generateContentHash(body.content);
    
    // Check if this exact content has been evaluated before
    const { data: existingAnalysis, error: existingError } = await supabase
      .from('proposal_analyses')
      .select('*')
      .eq('proposal_id', body.proposal_id)
      .eq('tender_id', body.tender_id)
      .eq('content_hash', contentHash)
      .maybeSingle();
    
    if (!existingError && existingAnalysis) {
      return NextResponse.json(existingAnalysis);
    }
    
    // Perform AI evaluation
    const evaluationResult = await evaluateProposal(
      body.content,
      tender.evaluation_criteria || {},
      tender.requirements || {},
      body.metadata || {}
    );
    
    // Generate a unique ID for the analysis
    const analysisId = uuidv4();
    
    // Prepare analysis data
    const analysisData = {
      id: analysisId,
      proposal_id: body.proposal_id,
      tender_id: body.tender_id,
      content_hash: contentHash,
      overall_score: evaluationResult.overall_score,
      compliance_score: evaluationResult.compliance_score,
      evaluation_score: evaluationResult.evaluation_score,
      recommendation: evaluationResult.recommendation,
      key_findings: evaluationResult.key_findings || null,
      compliance: evaluationResult.compliance || null,
      evaluation: evaluationResult.evaluation || null,
      insights: evaluationResult.insights || null,
      recommendation_details: evaluationResult.recommendation_details || null,
      created_by: user.id
    };
    
    // Insert analysis into database
    const { data: analysis, error } = await supabase
      .from('proposal_analyses')
      .insert(analysisData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating proposal analysis:', error);
      return NextResponse.json(
        { error: 'Failed to create proposal analysis', details: error.message },
        { status: 500 }
      );
    }
    
    // Create an audit log entry
    await supabase
      .from('audit_logs')
      .insert({
        action: 'evaluate',
        resource_type: 'proposal',
        resource_id: body.proposal_id,
        user_id: user.id,
        details: {
          tender_id: body.tender_id,
          analysis_id: analysisId,
          overall_score: evaluationResult.overall_score
        }
      });
    
    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Error in POST /api/ai/evaluate-proposal:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Generates a content hash for version control
 */
function generateContentHash(content: string): string {
  // In a real implementation, this would use a proper hashing algorithm
  // For now, we'll use a simple hash function
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

/**
 * Evaluates a proposal using AI
 */
async function evaluateProposal(
  content: string,
  evaluationCriteria: any,
  requirements: any,
  metadata: any
) {
  // In a real implementation, this would call an AI service
  // For now, we'll simulate AI evaluation
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Default criteria if none provided
  const criteria = evaluationCriteria || {
    technical_approach: { weight: 0.3, description: 'Technical approach and methodology' },
    experience: { weight: 0.2, description: 'Experience and qualifications' },
    timeline: { weight: 0.2, description: 'Project timeline and milestones' },
    cost: { weight: 0.3, description: 'Cost and budget' }
  };
  
  // Evaluate compliance with requirements
  const complianceResults = evaluateCompliance(content, requirements);
  
  // Evaluate against criteria
  const criteriaResults = evaluateCriteria(content, criteria);
  
  // Calculate overall scores
  const complianceScore = complianceResults.score;
  const evaluationScore = criteriaResults.score;
  
  // Calculate weighted overall score
  const overallScore = Math.round(complianceScore * 0.4 + evaluationScore * 0.6);
  
  // Generate recommendation
  const recommendation = generateRecommendation(overallScore, complianceScore, evaluationScore);
  
  // Generate key findings
  const keyFindings = [
    ...complianceResults.findings,
    ...criteriaResults.findings
  ];
  
  return {
    overall_score: overallScore,
    compliance_score: complianceScore,
    evaluation_score: evaluationScore,
    recommendation,
    key_findings: keyFindings,
    compliance: complianceResults.details,
    evaluation: criteriaResults.details,
    insights: generateInsights(content, criteria, requirements),
    recommendation_details: {
      rationale: `This proposal received an overall score of ${overallScore}/100, with a compliance score of ${complianceScore}/100 and an evaluation score of ${evaluationScore}/100.`,
      strengths: criteriaResults.strengths,
      weaknesses: criteriaResults.weaknesses,
      compliance_issues: complianceResults.issues
    }
  };
}

/**
 * Evaluates compliance with requirements
 */
function evaluateCompliance(content: string, requirements: any) {
  const lowerContent = content.toLowerCase();
  const results = {
    score: 0,
    findings: [] as string[],
    issues: [] as any[],
    details: {} as any
  };
  
  // Default requirements if none provided
  const reqs = requirements || {
    mandatory: [
      { id: 'req1', description: 'Project timeline' },
      { id: 'req2', description: 'Budget breakdown' },
      { id: 'req3', description: 'Team composition' }
    ],
    optional: [
      { id: 'req4', description: 'Risk assessment' },
      { id: 'req5', description: 'Quality assurance plan' }
    ]
  };
  
  // Check mandatory requirements
  const mandatoryResults = reqs.mandatory.map(req => {
    const keywords = req.description.toLowerCase().split(' ');
    const found = keywords.some(keyword => lowerContent.includes(keyword));
    
    if (!found) {
      results.issues.push({
        type: 'missing_requirement',
        severity: 'critical',
        requirement: req.description
      });
      results.findings.push(`Missing mandatory requirement: ${req.description}`);
    }
    
    return {
      requirement: req.description,
      compliant: found,
      severity: 'mandatory'
    };
  });
  
  // Check optional requirements
  const optionalResults = reqs.optional.map(req => {
    const keywords = req.description.toLowerCase().split(' ');
    const found = keywords.some(keyword => lowerContent.includes(keyword));
    
    if (!found) {
      results.issues.push({
        type: 'missing_requirement',
        severity: 'warning',
        requirement: req.description
      });
      results.findings.push(`Missing optional requirement: ${req.description}`);
    }
    
    return {
      requirement: req.description,
      compliant: found,
      severity: 'optional'
    };
  });
  
  // Calculate compliance score
  const mandatoryCompliance = mandatoryResults.filter(r => r.compliant).length / mandatoryResults.length;
  const optionalCompliance = optionalResults.length > 0 
    ? optionalResults.filter(r => r.compliant).length / optionalResults.length 
    : 1;
  
  results.score = Math.round(mandatoryCompliance * 80 + optionalCompliance * 20);
  
  // Prepare detailed results
  results.details = {
    mandatory_requirements: mandatoryResults,
    optional_requirements: optionalResults,
    compliance_rate: {
      mandatory: Math.round(mandatoryCompliance * 100),
      optional: Math.round(optionalCompliance * 100),
      overall: results.score
    }
  };
  
  return results;
}

/**
 * Evaluates proposal against criteria
 */
function evaluateCriteria(content: string, criteria: any) {
  const lowerContent = content.toLowerCase();
  const results = {
    score: 0,
    findings: [] as string[],
    strengths: [] as string[],
    weaknesses: [] as string[],
    details: {} as any
  };
  
  // Evaluate each criterion
  const criteriaResults = Object.entries(criteria).map(([key, criterion]: [string, any]) => {
    // Simulate evaluation based on keyword presence and content analysis
    const keywords = criterion.description.toLowerCase().split(' ');
    const keywordMatches = keywords.filter(keyword => lowerContent.includes(keyword)).length;
    const keywordScore = Math.min(100, Math.round((keywordMatches / keywords.length) * 100));
    
    // Simulate content quality assessment
    const contentQualityScore = Math.floor(Math.random() * 30) + 70; // Random score between 70-100
    
    // Calculate criterion score
    const criterionScore = Math.round((keywordScore * 0.3) + (contentQualityScore * 0.7));
    
    // Generate feedback
    let feedback = '';
    if (criterionScore >= 90) {
      feedback = `Excellent coverage of ${criterion.description}`;
      results.strengths.push(`Strong ${criterion.description}`);
    } else if (criterionScore >= 70) {
      feedback = `Good coverage of ${criterion.description}`;
      results.strengths.push(`Adequate ${criterion.description}`);
    } else if (criterionScore >= 50) {
      feedback = `Adequate coverage of ${criterion.description}, but could be improved`;
      results.weaknesses.push(`${criterion.description} needs improvement`);
    } else {
      feedback = `Insufficient coverage of ${criterion.description}`;
      results.weaknesses.push(`Weak ${criterion.description}`);
      results.findings.push(`Criterion needs significant improvement: ${criterion.description}`);
    }
    
    return {
      criterion: criterion.description,
      score: criterionScore,
      weight: criterion.weight,
      feedback
    };
  });
  
  // Calculate weighted score
  results.score = Math.round(
    criteriaResults.reduce((sum, result) => sum + (result.score * result.weight), 0)
  );
  
  // Prepare detailed results
  results.details = {
    criteria_scores: criteriaResults,
    overall_score: results.score
  };
  
  return results;
}

/**
 * Generates a recommendation based on scores
 */
function generateRecommendation(overallScore: number, complianceScore: number, evaluationScore: number): string {
  if (complianceScore < 50) {
    return 'Reject - Does not meet mandatory requirements';
  }
  
  if (overallScore >= 90) {
    return 'Strong Accept - Excellent proposal';
  } else if (overallScore >= 80) {
    return 'Accept - Very good proposal';
  } else if (overallScore >= 70) {
    return 'Accept with Minor Revisions - Good proposal with minor issues';
  } else if (overallScore >= 60) {
    return 'Consider with Revisions - Adequate proposal requiring improvements';
  } else if (overallScore >= 50) {
    return 'Major Revisions Required - Significant issues to address';
  } else {
    return 'Reject - Poor quality proposal';
  }
}

/**
 * Generates insights from proposal content
 */
function generateInsights(content: string, criteria: any, requirements: any) {
  // In a real implementation, this would use AI to generate insights
  // For now, we'll generate some sample insights
  
  return {
    strengths: [
      'Clear understanding of project objectives',
      'Experienced team with relevant expertise',
      'Comprehensive approach to implementation'
    ],
    weaknesses: [
      'Timeline may be optimistic',
      'Budget allocation for testing seems insufficient',
      'Risk mitigation strategy could be more detailed'
    ],
    opportunities: [
      'Potential for knowledge transfer to client team',
      'Innovative approach could yield additional benefits',
      'Methodology could be applied to future projects'
    ],
    risks: [
      'Dependency on third-party components',
      'Tight timeline with limited buffer',
      'Resource availability during peak periods'
    ]
  };
}
