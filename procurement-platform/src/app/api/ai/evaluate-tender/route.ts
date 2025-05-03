import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Tender evaluation API
 * Evaluates a tender against requirements and best practices
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Required fields validation
    if (!body.tenderId && !body.tenderContent) {
      return NextResponse.json(
        { error: 'Missing required fields: either tenderId or tenderContent is required' },
        { status: 400 }
      );
    }
    
    let tenderContent = body.tenderContent;
    let tenderMetadata = body.metadata || {};
    
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
    
    // Evaluate the tender
    const evaluationResult = await evaluateTender(tenderContent, tenderMetadata);
    
    return NextResponse.json(evaluationResult);
  } catch (error: any) {
    console.error('Error evaluating tender:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Evaluates a tender based on its content and metadata
 */
async function evaluateTender(tenderContent: string, metadata: any) {
  // Initialize evaluation results
  const results = {
    score: 0,
    quality: {
      clarity: { score: 0, feedback: '' },
      completeness: { score: 0, feedback: '' },
      fairness: { score: 0, feedback: '' },
      specificity: { score: 0, feedback: '' }
    },
    issues: [] as any[],
    recommendations: [] as string[],
    strengths: [] as string[],
    weaknesses: [] as string[]
  };
  
  // Evaluate clarity
  const clarityAnalysis = evaluateClarity(tenderContent);
  results.quality.clarity = clarityAnalysis;
  
  // Evaluate completeness
  const completenessAnalysis = evaluateCompleteness(tenderContent, metadata);
  results.quality.completeness = completenessAnalysis;
  
  // Evaluate fairness
  const fairnessAnalysis = evaluateFairness(tenderContent);
  results.quality.fairness = fairnessAnalysis;
  
  // Evaluate specificity
  const specificityAnalysis = evaluateSpecificity(tenderContent);
  results.quality.specificity = specificityAnalysis;
  
  // Collect issues
  if (clarityAnalysis.score < 70) {
    results.issues.push({
      type: 'clarity',
      severity: clarityAnalysis.score < 50 ? 'critical' : 'warning',
      message: `Clarity issues: ${clarityAnalysis.feedback}`
    });
    
    results.weaknesses.push('Lacks clarity in requirements and expectations');
  } else {
    results.strengths.push('Clear and well-articulated requirements');
  }
  
  if (completenessAnalysis.score < 70) {
    results.issues.push({
      type: 'completeness',
      severity: completenessAnalysis.score < 50 ? 'critical' : 'warning',
      message: `Completeness issues: ${completenessAnalysis.feedback}`
    });
    
    results.weaknesses.push('Missing important tender elements');
  } else {
    results.strengths.push('Comprehensive tender documentation');
  }
  
  if (fairnessAnalysis.score < 70) {
    results.issues.push({
      type: 'fairness',
      severity: fairnessAnalysis.score < 50 ? 'critical' : 'warning',
      message: `Fairness issues: ${fairnessAnalysis.feedback}`
    });
    
    results.weaknesses.push('Potential bias in requirements or evaluation criteria');
  } else {
    results.strengths.push('Fair and unbiased evaluation criteria');
  }
  
  if (specificityAnalysis.score < 70) {
    results.issues.push({
      type: 'specificity',
      severity: specificityAnalysis.score < 50 ? 'critical' : 'warning',
      message: `Specificity issues: ${specificityAnalysis.feedback}`
    });
    
    results.weaknesses.push('Requirements lack specific details');
  } else {
    results.strengths.push('Detailed and specific requirements');
  }
  
  // Generate recommendations
  results.recommendations = generateRecommendations(results.issues, tenderContent, metadata);
  
  // Calculate overall score
  results.score = Math.round(
    (clarityAnalysis.score * 0.25) +
    (completenessAnalysis.score * 0.3) +
    (fairnessAnalysis.score * 0.2) +
    (specificityAnalysis.score * 0.25)
  );
  
  return results;
}

/**
 * Evaluates the clarity of tender content
 */
function evaluateClarity(content: string) {
  // This would be replaced with actual NLP/AI analysis
  // For now, we'll use a simple approach
  
  const lowerContent = content.toLowerCase();
  let score = 80; // Start with a good score and deduct for issues
  let feedback = '';
  
  // Check for jargon and complex language
  const complexTerms = [
    'aforementioned', 'hereinafter', 'notwithstanding', 'pursuant to',
    'in accordance with', 'as per', 'subject to the provisions of'
  ];
  
  let complexTermCount = 0;
  for (const term of complexTerms) {
    if (lowerContent.includes(term)) {
      complexTermCount++;
    }
  }
  
  if (complexTermCount > 3) {
    score -= 15;
    feedback += 'Uses excessive legal jargon that may confuse bidders. ';
  }
  
  // Check for long sentences
  const sentences = content.split(/[.!?]+/);
  const longSentences = sentences.filter(s => s.split(' ').length > 25).length;
  const longSentencePercentage = (longSentences / sentences.length) * 100;
  
  if (longSentencePercentage > 20) {
    score -= 10;
    feedback += 'Contains too many long, complex sentences. ';
  }
  
  // Check for passive voice (simplified check)
  const passiveVoiceIndicators = [
    ' is provided', ' are provided', ' will be provided', ' shall be provided',
    ' is required', ' are required', ' will be required', ' shall be required',
    ' is expected', ' are expected', ' will be expected', ' shall be expected'
  ];
  
  let passiveCount = 0;
  for (const indicator of passiveVoiceIndicators) {
    const regex = new RegExp(indicator, 'gi');
    const matches = content.match(regex);
    if (matches) {
      passiveCount += matches.length;
    }
  }
  
  if (passiveCount > 5) {
    score -= 10;
    feedback += 'Uses excessive passive voice, making responsibilities unclear. ';
  }
  
  // Check for ambiguous terms
  const ambiguousTerms = [
    'etc', 'and so on', 'and/or', 'as appropriate', 'if necessary',
    'as required', 'as applicable', 'reasonable', 'adequate', 'sufficient'
  ];
  
  let ambiguousCount = 0;
  for (const term of ambiguousTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      ambiguousCount += matches.length;
    }
  }
  
  if (ambiguousCount > 3) {
    score -= 15;
    feedback += 'Contains ambiguous terms that may lead to different interpretations. ';
  }
  
  // If no issues found, provide positive feedback
  if (feedback === '') {
    feedback = 'The tender is clearly written with straightforward language and well-defined requirements.';
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    feedback
  };
}

/**
 * Evaluates the completeness of tender content
 */
function evaluateCompleteness(content: string, metadata: any) {
  const lowerContent = content.toLowerCase();
  let score = 100; // Start with perfect score and deduct for missing elements
  let feedback = '';
  
  // Essential tender elements
  const essentialElements = [
    { name: 'scope of work', weight: 15 },
    { name: 'deliverables', weight: 15 },
    { name: 'timeline', weight: 10 },
    { name: 'evaluation criteria', weight: 15 },
    { name: 'submission requirements', weight: 10 },
    { name: 'budget', weight: 10 },
    { name: 'eligibility', weight: 10 },
    { name: 'contact information', weight: 5 },
    { name: 'question process', weight: 5 },
    { name: 'terms and conditions', weight: 5 }
  ];
  
  // Check for missing elements
  const missingElements = [];
  for (const element of essentialElements) {
    let found = false;
    
    // Check in content
    if (lowerContent.includes(element.name)) {
      found = true;
    }
    
    // Check in metadata for some elements
    if (!found && element.name === 'budget' && metadata.budget) {
      found = true;
    }
    
    if (!found && element.name === 'timeline' && metadata.deadline) {
      found = true;
    }
    
    if (!found) {
      score -= element.weight;
      missingElements.push(element.name);
    }
  }
  
  if (missingElements.length > 0) {
    feedback = `Missing essential elements: ${missingElements.join(', ')}. `;
  }
  
  // Check for section balance
  const sections = [
    { name: 'introduction', pattern: /introduction|overview|background/i },
    { name: 'scope', pattern: /scope|objectives|goals/i },
    { name: 'requirements', pattern: /requirements|specifications|deliverables/i },
    { name: 'evaluation', pattern: /evaluation|selection|criteria/i },
    { name: 'submission', pattern: /submission|how to apply|application/i },
    { name: 'terms', pattern: /terms|conditions|legal/i }
  ];
  
  const foundSections = sections.filter(section => section.pattern.test(content));
  
  if (foundSections.length < sections.length * 0.7) {
    score -= 10;
    feedback += 'Tender is missing several important sections. ';
  }
  
  // If no issues found, provide positive feedback
  if (feedback === '') {
    feedback = 'The tender is comprehensive and includes all essential elements.';
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    feedback
  };
}

/**
 * Evaluates the fairness of tender content
 */
function evaluateFairness(content: string) {
  const lowerContent = content.toLowerCase();
  let score = 90; // Start with a good score and deduct for issues
  let feedback = '';
  
  // Check for potentially biased language
  const biasedTerms = [
    'preferred vendor', 'preferred supplier', 'preferred provider',
    'previous experience with us', 'existing relationship',
    'specific brand', 'proprietary', 'exclusive'
  ];
  
  let biasCount = 0;
  for (const term of biasedTerms) {
    if (lowerContent.includes(term)) {
      biasCount++;
    }
  }
  
  if (biasCount > 0) {
    score -= biasCount * 10;
    feedback += 'Contains potentially biased language that may favor specific vendors. ';
  }
  
  // Check for unreasonable requirements
  const unreasonablePatterns = [
    /experience of (\d+) years/i,
    /minimum of (\d+) similar projects/i,
    /turnover of (\d+) million/i
  ];
  
  for (const pattern of unreasonablePatterns) {
    const match = content.match(pattern);
    if (match && match[1]) {
      const value = parseInt(match[1]);
      if (value > 10) {
        score -= 15;
        feedback += `Potentially excessive requirement: ${match[0]}. `;
      }
    }
  }
  
  // Check for transparency in evaluation
  if (!lowerContent.includes('evaluation criteria') && !lowerContent.includes('selection criteria')) {
    score -= 20;
    feedback += 'No clear evaluation criteria provided. ';
  }
  
  // Check for equal opportunity language
  const equalOpportunityTerms = [
    'equal opportunity', 'non-discrimination', 'diversity',
    'inclusive', 'all qualified', 'regardless of'
  ];
  
  let equalOpportunityCount = 0;
  for (const term of equalOpportunityTerms) {
    if (lowerContent.includes(term)) {
      equalOpportunityCount++;
    }
  }
  
  if (equalOpportunityCount === 0) {
    score -= 5;
    feedback += 'No explicit equal opportunity language. ';
  }
  
  // If no issues found, provide positive feedback
  if (feedback === '') {
    feedback = 'The tender appears fair and unbiased with clear evaluation criteria.';
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    feedback
  };
}

/**
 * Evaluates the specificity of tender content
 */
function evaluateSpecificity(content: string) {
  const lowerContent = content.toLowerCase();
  let score = 85; // Start with a good score and deduct for issues
  let feedback = '';
  
  // Check for vague requirements
  const vagueTerms = [
    'appropriate', 'reasonable', 'satisfactory', 'adequate',
    'suitable', 'sufficient', 'as needed', 'as required',
    'high quality', 'best practice', 'state of the art'
  ];
  
  let vagueCount = 0;
  for (const term of vagueTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      vagueCount += matches.length;
    }
  }
  
  if (vagueCount > 5) {
    score -= 15;
    feedback += 'Contains too many vague terms without specific definitions. ';
  }
  
  // Check for measurable criteria
  const measurableTerms = [
    'measure', 'metric', 'percentage', 'quantity', 'number',
    'frequency', 'duration', 'size', 'weight', 'volume',
    'accuracy', 'precision', 'tolerance'
  ];
  
  let measurableCount = 0;
  for (const term of measurableTerms) {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const matches = content.match(regex);
    if (matches) {
      measurableCount += matches.length;
    }
  }
  
  if (measurableCount < 3) {
    score -= 10;
    feedback += 'Lacks measurable criteria and specific metrics. ';
  }
  
  // Check for detailed specifications
  const specificationPatterns = [
    /\d+ (days|weeks|months|years)/i,
    /\d+ (percent|%)/i,
    /\$\d+/i,
    /\d+ (units|pieces|items)/i,
    /\d+ (square meters|sq\. m|m2)/i
  ];
  
  let specificationsCount = 0;
  for (const pattern of specificationPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      specificationsCount += matches.length;
    }
  }
  
  if (specificationsCount < 5) {
    score -= 10;
    feedback += 'Lacks specific numerical requirements and specifications. ';
  }
  
  // Check for detailed deliverables
  if (!lowerContent.includes('deliverable') && !lowerContent.includes('output') && !lowerContent.includes('result')) {
    score -= 15;
    feedback += 'No clear definition of deliverables. ';
  }
  
  // If no issues found, provide positive feedback
  if (feedback === '') {
    feedback = 'The tender provides specific, measurable requirements with clear deliverables.';
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    feedback
  };
}

/**
 * Generates recommendations based on identified issues
 */
function generateRecommendations(issues: any[], content: string, metadata: any) {
  const recommendations: string[] = [];
  
  // Generate recommendations based on issue type and severity
  for (const issue of issues) {
    if (issue.type === 'clarity' && issue.severity === 'critical') {
      recommendations.push('Simplify language and reduce jargon to improve clarity.');
      recommendations.push('Break down complex sentences into shorter, clearer statements.');
    } else if (issue.type === 'completeness' && issue.severity === 'critical') {
      recommendations.push('Add missing essential elements to ensure a complete tender document.');
    } else if (issue.type === 'fairness' && issue.severity === 'critical') {
      recommendations.push('Remove potentially biased language and ensure equal opportunity for all vendors.');
      recommendations.push('Provide transparent evaluation criteria with clear weightings.');
    } else if (issue.type === 'specificity' && issue.severity === 'critical') {
      recommendations.push('Replace vague terms with specific, measurable requirements.');
      recommendations.push('Define clear deliverables with acceptance criteria.');
    }
  }
  
  // Add general recommendations if few specific ones were generated
  if (recommendations.length < 2) {
    recommendations.push('Consider including examples or case studies to clarify expectations.');
    recommendations.push('Add a Q&A period to allow vendors to seek clarification.');
  }
  
  // Add recommendation about budget if not specified
  if (!metadata.budget && !content.toLowerCase().includes('budget')) {
    recommendations.push('Include budget information to help vendors tailor their proposals appropriately.');
  }
  
  return recommendations;
}
