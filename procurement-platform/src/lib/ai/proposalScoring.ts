import { calculateReadabilityScore, detectSentiment, extractKeyPhrases } from './textAnalysis';
import { checkRequirementMatch } from './requirementMatching';

/**
 * Scores a proposal against evaluation criteria
 * @param criteria Array of evaluation criteria
 * @param proposalContent The full proposal content
 * @returns Scoring results
 */
export function scoreProposal(
  criteria: { criterion: string; weight?: number }[],
  proposalContent: string
): {
  totalScore: number;
  criteriaScores: {
    criterion: string;
    score: number;
    weight: number;
    weightedScore: number;
    justification: string;
  }[];
} {
  // Normalize weights if not provided
  const normalizedCriteria = normalizeCriteriaWeights(criteria);
  
  // Score each criterion
  const criteriaScores = normalizedCriteria.map(criterion => {
    const { score, justification } = scoreCriterion(criterion.criterion, proposalContent);
    
    return {
      criterion: criterion.criterion,
      score,
      weight: criterion.weight,
      weightedScore: score * criterion.weight / 100,
      justification
    };
  });
  
  // Calculate total score
  const totalScore = criteriaScores.reduce((sum, item) => sum + item.weightedScore, 0);
  
  return {
    totalScore: Math.round(totalScore * 100) / 100, // Round to 2 decimal places
    criteriaScores
  };
}

/**
 * Normalizes criteria weights to ensure they sum to 100%
 * @param criteria Array of evaluation criteria
 * @returns Normalized criteria with weights
 */
function normalizeCriteriaWeights(
  criteria: { criterion: string; weight?: number }[]
): { criterion: string; weight: number }[] {
  // If all weights are provided, normalize them to sum to 100
  const allWeightsProvided = criteria.every(c => c.weight !== undefined);
  
  if (allWeightsProvided) {
    const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
    
    return criteria.map(c => ({
      criterion: c.criterion,
      weight: ((c.weight || 0) / totalWeight) * 100
    }));
  }
  
  // If no weights are provided, distribute evenly
  const evenWeight = 100 / criteria.length;
  
  return criteria.map(c => ({
    criterion: c.criterion,
    weight: c.weight !== undefined ? c.weight : evenWeight
  }));
}

/**
 * Scores a single criterion
 * @param criterion The criterion to score
 * @param proposalContent The full proposal content
 * @returns Score and justification
 */
function scoreCriterion(
  criterion: string,
  proposalContent: string
): { score: number; justification: string } {
  // Check if the criterion is addressed
  const match = checkRequirementMatch(criterion, proposalContent);
  
  // Base score on whether the criterion is addressed
  let score = match.confidence * 70; // Up to 70 points for addressing the criterion
  
  // Extract the relevant section for further analysis
  const relevantSection = match.relevantSection || '';
  
  // Add points for quality factors
  if (relevantSection) {
    // Check readability (clear communication)
    const readability = calculateReadabilityScore(relevantSection);
    const readabilityScore = readability > 5 && readability < 15 ? 10 : 5;
    score += readabilityScore;
    
    // Check sentiment (positive approach)
    const sentiment = detectSentiment(relevantSection);
    const sentimentScore = sentiment > 0.2 ? 10 : sentiment > 0 ? 5 : 0;
    score += sentimentScore;
    
    // Check specificity (detail level)
    const specificity = calculateSpecificity(relevantSection);
    const specificityScore = specificity > 0.7 ? 10 : specificity > 0.4 ? 5 : 0;
    score += specificityScore;
  }
  
  // Cap score at 100
  score = Math.min(100, score);
  
  // Generate justification
  let justification = '';
  
  if (score >= 90) {
    justification = 'Excellent response that fully addresses the criterion with clear, specific details.';
  } else if (score >= 75) {
    justification = 'Good response that addresses the criterion well with adequate details.';
  } else if (score >= 60) {
    justification = 'Satisfactory response that addresses the criterion but could provide more details.';
  } else if (score >= 40) {
    justification = 'Partial response that somewhat addresses the criterion but lacks specificity.';
  } else if (score >= 20) {
    justification = 'Minimal response that barely addresses the criterion.';
  } else {
    justification = 'Inadequate response that fails to address the criterion.';
  }
  
  return {
    score: Math.round(score),
    justification
  };
}

/**
 * Calculates the specificity of text (how detailed it is)
 * @param text Text to analyze
 * @returns Specificity score between 0 and 1
 */
function calculateSpecificity(text: string): number {
  // Count specific indicators
  const specificityIndicators = [
    // Numbers and measurements
    /\d+%/g,
    /\d+\s+(?:days|weeks|months|years)/gi,
    /\$\d+/g,
    
    // Specific terms
    /specific/gi,
    /detailed/gi,
    /precisely/gi,
    /exactly/gi,
    
    // Examples
    /for example/gi,
    /such as/gi,
    /e\.g\./gi,
    /i\.e\./gi,
    
    // Proper nouns (simplified check)
    /[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+/g
  ];
  
  let indicatorCount = 0;
  for (const pattern of specificityIndicators) {
    const matches = text.match(pattern);
    if (matches) {
      indicatorCount += matches.length;
    }
  }
  
  // Normalize by text length
  const wordCount = text.split(/\s+/).length;
  const normalizedCount = wordCount > 0 ? indicatorCount / (wordCount / 20) : 0;
  
  // Cap at 1.0
  return Math.min(1.0, normalizedCount);
}
