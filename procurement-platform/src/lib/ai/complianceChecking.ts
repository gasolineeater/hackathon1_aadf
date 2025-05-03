import { checkRequirementMatch } from './requirementMatching';

/**
 * Checks if a proposal complies with tender requirements
 * @param requirements Array of requirements to check
 * @param proposalContent The full proposal content
 * @returns Compliance check results
 */
export function checkCompliance(
  requirements: string[], 
  proposalContent: string
): {
  compliant: boolean;
  complianceScore: number;
  requirementResults: {
    requirement: string;
    addressed: boolean;
    confidence: number;
    relevantSection?: string;
  }[];
} {
  // Check each requirement
  const requirementResults = requirements.map(requirement => {
    const match = checkRequirementMatch(requirement, proposalContent);
    return {
      requirement,
      ...match
    };
  });
  
  // Calculate overall compliance score
  const addressedCount = requirementResults.filter(r => r.addressed).length;
  const complianceScore = requirements.length > 0 
    ? (addressedCount / requirements.length) * 100 
    : 100;
  
  // Determine if proposal is compliant (at least 70% of requirements addressed)
  const compliant = complianceScore >= 70;
  
  return {
    compliant,
    complianceScore: Math.round(complianceScore),
    requirementResults
  };
}

/**
 * Checks if a proposal meets mandatory requirements
 * @param mandatoryRequirements Array of mandatory requirements
 * @param proposalContent The full proposal content
 * @returns Mandatory requirements check results
 */
export function checkMandatoryRequirements(
  mandatoryRequirements: string[],
  proposalContent: string
): {
  meetsAllMandatory: boolean;
  missingRequirements: string[];
  results: {
    requirement: string;
    met: boolean;
    confidence: number;
  }[];
} {
  // Check each mandatory requirement
  const results = mandatoryRequirements.map(requirement => {
    const match = checkRequirementMatch(requirement, proposalContent);
    return {
      requirement,
      met: match.addressed,
      confidence: match.confidence
    };
  });
  
  // Find missing requirements
  const missingRequirements = results
    .filter(r => !r.met)
    .map(r => r.requirement);
  
  // Determine if all mandatory requirements are met
  const meetsAllMandatory = missingRequirements.length === 0;
  
  return {
    meetsAllMandatory,
    missingRequirements,
    results
  };
}

/**
 * Checks if a proposal meets budget constraints
 * @param budgetConstraint The budget constraint object
 * @param proposalContent The full proposal content
 * @returns Budget compliance check results
 */
export function checkBudgetCompliance(
  budgetConstraint: { amount?: number; range?: { min: number; max: number } },
  proposalContent: string
): {
  withinBudget: boolean;
  proposedAmount?: number;
  difference?: number;
  percentageDifference?: number;
} {
  // Extract proposed amount from proposal
  const proposedAmount = extractProposedAmount(proposalContent);
  
  if (!proposedAmount) {
    return { withinBudget: false };
  }
  
  // Check if within budget
  let withinBudget = false;
  let difference: number | undefined;
  let percentageDifference: number | undefined;
  
  if (budgetConstraint.amount) {
    withinBudget = proposedAmount <= budgetConstraint.amount;
    difference = budgetConstraint.amount - proposedAmount;
    percentageDifference = (difference / budgetConstraint.amount) * 100;
  } else if (budgetConstraint.range) {
    withinBudget = proposedAmount >= budgetConstraint.range.min && 
                   proposedAmount <= budgetConstraint.range.max;
    
    if (proposedAmount > budgetConstraint.range.max) {
      difference = budgetConstraint.range.max - proposedAmount;
      percentageDifference = (difference / budgetConstraint.range.max) * 100;
    } else if (proposedAmount < budgetConstraint.range.min) {
      difference = budgetConstraint.range.min - proposedAmount;
      percentageDifference = (difference / budgetConstraint.range.min) * 100;
    }
  }
  
  return {
    withinBudget,
    proposedAmount,
    difference,
    percentageDifference: percentageDifference ? Math.round(percentageDifference) : undefined
  };
}

/**
 * Extracts the proposed amount from proposal content
 * @param proposalContent The full proposal content
 * @returns The extracted amount or undefined if not found
 */
function extractProposedAmount(proposalContent: string): number | undefined {
  // Look for budget/cost section
  const budgetSectionRegex = /budget|cost|price|financial|proposal amount|total cost/i;
  const paragraphs = proposalContent.split(/\n\s*\n/);
  
  for (const paragraph of paragraphs) {
    if (budgetSectionRegex.test(paragraph)) {
      // Look for amount patterns
      const amountPatterns = [
        /total\s+(?:cost|price|budget|amount)(?:\s+is)?(?:\s+of)?\s*(?:USD|EUR|GBP|\$|€|£)?\s*(\d+[,\d]*(?:\.\d+)?)/i,
        /(?:USD|EUR|GBP|\$|€|£)\s*(\d+[,\d]*(?:\.\d+)?)/i,
        /(\d+[,\d]*(?:\.\d+)?)\s*(?:USD|EUR|GBP|\$|€|£)/i,
        /amount\s+of\s*(?:USD|EUR|GBP|\$|€|£)?\s*(\d+[,\d]*(?:\.\d+)?)/i
      ];
      
      for (const pattern of amountPatterns) {
        const match = paragraph.match(pattern);
        if (match && match[1]) {
          return parseFloat(match[1].replace(/,/g, ''));
        }
      }
    }
  }
  
  // If no amount found in budget section, look throughout the document
  const amountPatterns = [
    /total\s+(?:cost|price|budget|amount)(?:\s+is)?(?:\s+of)?\s*(?:USD|EUR|GBP|\$|€|£)?\s*(\d+[,\d]*(?:\.\d+)?)/i,
    /(?:USD|EUR|GBP|\$|€|£)\s*(\d+[,\d]*(?:\.\d+)?)/i
  ];
  
  for (const pattern of amountPatterns) {
    const match = proposalContent.match(pattern);
    if (match && match[1]) {
      return parseFloat(match[1].replace(/,/g, ''));
    }
  }
  
  return undefined;
}
