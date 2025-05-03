import { extractTenderRequirements } from './tenderAnalysis';
import { checkCompliance, checkMandatoryRequirements, checkBudgetCompliance } from './complianceChecking';
import { scoreProposal } from './proposalScoring';
import { generateProposalRecommendations, generateOverallRecommendation } from './recommendationGenerator';
import { extractKeyPhrases } from './textAnalysis';

/**
 * Analyzes a proposal against tender requirements
 * @param proposalContent The full proposal content
 * @param tenderContent The full tender content
 * @param proposalMetadata Additional metadata about the proposal
 * @param tenderMetadata Additional metadata about the tender
 * @returns Comprehensive analysis results
 */
export async function analyzeProposal(
  proposalContent: string,
  tenderContent: string,
  proposalMetadata: any = {},
  tenderMetadata: any = {}
) {
  // Extract tender requirements
  const tenderRequirements = extractTenderRequirements(tenderContent, tenderMetadata);

  // Extract key phrases from the proposal
  const proposalKeyPhrases = extractKeyPhrases(proposalContent, 5);

  // Check compliance with requirements
  const allRequirements = [
    ...(tenderRequirements.technicalRequirements || []),
    ...(tenderRequirements.qualificationRequirements || [])
  ];

  const complianceResults = checkCompliance(allRequirements, proposalContent);

  // Check mandatory requirements
  const mandatoryRequirements = tenderRequirements.qualificationRequirements || [];
  const mandatoryResults = checkMandatoryRequirements(mandatoryRequirements, proposalContent);

  // Check budget compliance
  const budgetCompliance = checkBudgetCompliance(tenderRequirements.budget || {}, proposalContent);

  // Score proposal against evaluation criteria
  const scoringResults = scoreProposal(
    tenderRequirements.evaluationCriteria || [],
    proposalContent
  );

  // Generate recommendations
  const recommendations = generateProposalRecommendations(complianceResults, scoringResults);

  // Generate overall recommendation
  const overallRecommendation = generateOverallRecommendation(
    complianceResults.complianceScore,
    scoringResults.totalScore
  );

  // Compile analysis results
  return {
    summary: {
      proposalTitle: proposalMetadata.title || 'Untitled Proposal',
      tenderTitle: tenderMetadata.title || 'Untitled Tender',
      overallScore: Math.round((complianceResults.complianceScore * 0.4) + (scoringResults.totalScore * 0.6)),
      complianceScore: complianceResults.complianceScore,
      evaluationScore: scoringResults.totalScore,
      recommendation: overallRecommendation.recommendation,
      keyFindings: generateKeyFindings(complianceResults, scoringResults, budgetCompliance)
    },
    compliance: {
      compliant: complianceResults.compliant,
      complianceScore: complianceResults.complianceScore,
      requirementResults: complianceResults.requirementResults,
      mandatoryRequirements: mandatoryResults,
      budgetCompliance
    },
    evaluation: {
      totalScore: scoringResults.totalScore,
      criteriaScores: scoringResults.criteriaScores
    },
    insights: {
      strengths: identifyStrengths(scoringResults),
      weaknesses: identifyWeaknesses(complianceResults, scoringResults),
      keyPhrases: proposalKeyPhrases,
      recommendations
    },
    recommendation: overallRecommendation,
    tenderRequirements
  };
}

/**
 * Generates key findings from analysis results
 * @param complianceResults Compliance check results
 * @param scoringResults Scoring results
 * @param budgetCompliance Budget compliance results
 * @returns Array of key findings
 */
function generateKeyFindings(
  complianceResults: any,
  scoringResults: any,
  budgetCompliance: any
): string[] {
  const findings: string[] = [];

  // Compliance findings
  if (complianceResults.compliant) {
    findings.push(`Proposal addresses ${complianceResults.complianceScore}% of tender requirements.`);
  } else {
    const missingCount = complianceResults.requirementResults.filter((r: any) => !r.addressed).length;
    findings.push(`Proposal fails to address ${missingCount} tender requirements.`);
  }

  // Evaluation findings
  if (scoringResults.totalScore >= 80) {
    findings.push(`Strong overall proposal with evaluation score of ${scoringResults.totalScore}/100.`);
  } else if (scoringResults.totalScore >= 60) {
    findings.push(`Adequate proposal with evaluation score of ${scoringResults.totalScore}/100.`);
  } else {
    findings.push(`Weak proposal with evaluation score of ${scoringResults.totalScore}/100.`);
  }

  // Budget findings
  if (budgetCompliance.withinBudget) {
    findings.push('Proposal is within the specified budget constraints.');
  } else if (budgetCompliance.proposedAmount) {
    findings.push('Proposal exceeds the specified budget constraints.');
  }

  // Criteria findings
  const highestCriterion = [...scoringResults.criteriaScores]
    .sort((a, b) => b.score - a.score)[0];

  const lowestCriterion = [...scoringResults.criteriaScores]
    .sort((a, b) => a.score - b.score)[0];

  if (highestCriterion) {
    findings.push(`Strongest in "${highestCriterion.criterion}" (${highestCriterion.score}/100).`);
  }

  if (lowestCriterion && lowestCriterion.score < 60) {
    findings.push(`Weakest in "${lowestCriterion.criterion}" (${lowestCriterion.score}/100).`);
  }

  return findings;
}

/**
 * Identifies strengths from scoring results
 * @param scoringResults Scoring results
 * @returns Array of strengths
 */
function identifyStrengths(scoringResults: any): string[] {
  const strengths: string[] = [];

  // Identify high-scoring criteria
  const highScoringCriteria = scoringResults.criteriaScores
    .filter((c: any) => c.score >= 80)
    .sort((a: any, b: any) => b.score - a.score);

  for (const criterion of highScoringCriteria.slice(0, 3)) {
    strengths.push(`Strong ${criterion.criterion.toLowerCase()} (${criterion.score}/100)`);
  }

  // Add general strengths based on overall score
  if (scoringResults.totalScore >= 80) {
    strengths.push('Comprehensive and well-structured proposal');
  }

  if (scoringResults.totalScore >= 75) {
    strengths.push('Clear understanding of tender requirements');
  }

  return strengths;
}

/**
 * Identifies weaknesses from analysis results
 * @param complianceResults Compliance check results
 * @param scoringResults Scoring results
 * @returns Array of weaknesses
 */
function identifyWeaknesses(complianceResults: any, scoringResults: any): string[] {
  const weaknesses: string[] = [];

  // Identify low-scoring criteria
  const lowScoringCriteria = scoringResults.criteriaScores
    .filter((c: any) => c.score < 60)
    .sort((a: any, b: any) => a.score - b.score);

  for (const criterion of lowScoringCriteria.slice(0, 3)) {
    weaknesses.push(`Weak ${criterion.criterion.toLowerCase()} (${criterion.score}/100)`);
  }

  // Add compliance weaknesses
  if (!complianceResults.compliant) {
    const missingRequirements = complianceResults.requirementResults
      .filter((r: any) => !r.addressed)
      .slice(0, 3)
      .map((r: any) => r.requirement);

    if (missingRequirements.length > 0) {
      weaknesses.push(`Fails to address key requirements: ${missingRequirements.join(', ')}`);
    }
  }

  // Add general weaknesses based on overall score
  if (scoringResults.totalScore < 60) {
    weaknesses.push('Insufficient detail and specificity throughout the proposal');
  }

  if (scoringResults.totalScore < 50) {
    weaknesses.push('Poor alignment with tender objectives and requirements');
  }

  return weaknesses;
}


