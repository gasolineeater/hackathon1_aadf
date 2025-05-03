/**
 * Generates recommendations based on proposal analysis
 */

/**
 * Generates recommendations for improving a proposal
 * @param complianceResults Compliance check results
 * @param scoringResults Scoring results
 * @returns Array of recommendations
 */
export function generateProposalRecommendations(
  complianceResults: {
    compliant: boolean;
    complianceScore: number;
    requirementResults: {
      requirement: string;
      addressed: boolean;
      confidence: number;
    }[];
  },
  scoringResults: {
    totalScore: number;
    criteriaScores: {
      criterion: string;
      score: number;
      weight: number;
    }[];
  }
): string[] {
  const recommendations: string[] = [];
  
  // Recommendations based on compliance
  if (!complianceResults.compliant) {
    recommendations.push('Ensure all tender requirements are explicitly addressed in the proposal.');
    
    // Add specific recommendations for unaddressed requirements
    const unaddressedRequirements = complianceResults.requirementResults
      .filter(r => !r.addressed)
      .map(r => r.requirement);
    
    if (unaddressedRequirements.length > 0) {
      if (unaddressedRequirements.length <= 3) {
        // List specific requirements if there are only a few
        recommendations.push(`Address these specific requirements: ${unaddressedRequirements.join(', ')}.`);
      } else {
        // Summarize if there are many
        recommendations.push(`Address the ${unaddressedRequirements.length} missing requirements, particularly focusing on the key tender objectives.`);
      }
    }
  }
  
  // Recommendations based on scoring
  if (scoringResults.totalScore < 75) {
    // Find the lowest scoring criteria
    const sortedCriteria = [...scoringResults.criteriaScores]
      .sort((a, b) => a.score - b.score);
    
    const lowScoringCriteria = sortedCriteria
      .filter(c => c.score < 60)
      .slice(0, 3); // Take up to 3 lowest
    
    if (lowScoringCriteria.length > 0) {
      recommendations.push('Improve the proposal\'s response to these evaluation criteria:');
      
      for (const criterion of lowScoringCriteria) {
        const recommendationByCriterion = getRecommendationForCriterion(criterion.criterion, criterion.score);
        recommendations.push(`- ${criterion.criterion}: ${recommendationByCriterion}`);
      }
    }
    
    // General recommendations for medium scores
    if (scoringResults.totalScore >= 50 && scoringResults.totalScore < 75) {
      recommendations.push('Provide more specific examples and quantifiable outcomes to strengthen the proposal.');
      recommendations.push('Ensure alignment with the tender\'s strategic objectives throughout the proposal.');
    }
    
    // Recommendations for low scores
    if (scoringResults.totalScore < 50) {
      recommendations.push('Significantly restructure the proposal to directly address each evaluation criterion.');
      recommendations.push('Include detailed methodology, timeline, and resource allocation plans.');
      recommendations.push('Clearly demonstrate understanding of the tender requirements and objectives.');
    }
  }
  
  // Add general recommendations if few specific ones were generated
  if (recommendations.length < 2) {
    if (scoringResults.totalScore >= 75) {
      recommendations.push('The proposal is strong overall, but consider adding more specific metrics to measure success.');
      recommendations.push('Enhance the executive summary to highlight key differentiators and value proposition.');
    } else {
      recommendations.push('Ensure all sections of the proposal are well-balanced and aligned with the tender priorities.');
      recommendations.push('Strengthen the proposal with more concrete examples of past successes and specific approaches.');
    }
  }
  
  return recommendations;
}

/**
 * Generates a recommendation for a specific criterion based on its score
 * @param criterion The criterion text
 * @param score The score for this criterion
 * @returns Recommendation text
 */
function getRecommendationForCriterion(criterion: string, score: number): string {
  const lowerCriterion = criterion.toLowerCase();
  
  // Technical approach recommendations
  if (lowerCriterion.includes('technical') || 
      lowerCriterion.includes('approach') || 
      lowerCriterion.includes('methodology')) {
    if (score < 40) {
      return 'Provide a detailed methodology with specific approaches, tools, and techniques.';
    } else if (score < 60) {
      return 'Strengthen the technical approach with more specific details and alignment to project requirements.';
    } else {
      return 'Add more innovative approaches and best practices to enhance the technical methodology.';
    }
  }
  
  // Experience recommendations
  if (lowerCriterion.includes('experience') || 
      lowerCriterion.includes('qualification') || 
      lowerCriterion.includes('expertise')) {
    if (score < 40) {
      return 'Include specific examples of relevant past projects with quantifiable outcomes.';
    } else if (score < 60) {
      return 'Highlight more relevant experience and strengthen the connection to this specific project.';
    } else {
      return 'Add more details about team qualifications and specific roles in the project.';
    }
  }
  
  // Cost/budget recommendations
  if (lowerCriterion.includes('cost') || 
      lowerCriterion.includes('budget') || 
      lowerCriterion.includes('price') ||
      lowerCriterion.includes('financial')) {
    if (score < 40) {
      return 'Provide a more detailed budget breakdown with clear justification for costs.';
    } else if (score < 60) {
      return 'Improve cost-effectiveness and provide better value justification.';
    } else {
      return 'Add more detail on cost-saving measures and efficiency improvements.';
    }
  }
  
  // Timeline recommendations
  if (lowerCriterion.includes('timeline') || 
      lowerCriterion.includes('schedule') || 
      lowerCriterion.includes('delivery')) {
    if (score < 40) {
      return 'Develop a detailed timeline with specific milestones and deliverables.';
    } else if (score < 60) {
      return 'Provide more detail on project phases and resource allocation over time.';
    } else {
      return 'Add contingency planning and risk mitigation strategies to the timeline.';
    }
  }
  
  // Generic recommendations for other criteria
  if (score < 40) {
    return 'Significantly expand this section with specific details and examples.';
  } else if (score < 60) {
    return 'Provide more specific information and strengthen alignment with requirements.';
  } else {
    return 'Add more supporting evidence and specific details to further improve this section.';
  }
}

/**
 * Generates an overall recommendation for a proposal
 * @param complianceScore Compliance score (0-100)
 * @param totalScore Total evaluation score (0-100)
 * @returns Recommendation object
 */
export function generateOverallRecommendation(
  complianceScore: number,
  totalScore: number
): {
  recommendation: 'Accept' | 'Consider with Revisions' | 'Request Major Revisions' | 'Reject';
  confidence: number;
  justification: string;
} {
  // Calculate combined score (weighted 40% compliance, 60% evaluation)
  const combinedScore = (complianceScore * 0.4) + (totalScore * 0.6);
  
  // Determine recommendation based on combined score
  let recommendation: 'Accept' | 'Consider with Revisions' | 'Request Major Revisions' | 'Reject';
  let justification: string;
  let confidence: number;
  
  if (combinedScore >= 80) {
    recommendation = 'Accept';
    confidence = (combinedScore - 80) * 5; // 0-100 confidence scale
    justification = 'The proposal fully addresses the tender requirements with high-quality responses to evaluation criteria.';
  } else if (combinedScore >= 65) {
    recommendation = 'Consider with Revisions';
    confidence = (combinedScore - 65) * 6.67; // 0-100 confidence scale
    justification = 'The proposal addresses most requirements adequately but needs some improvements in specific areas.';
  } else if (combinedScore >= 50) {
    recommendation = 'Request Major Revisions';
    confidence = (combinedScore - 50) * 6.67; // 0-100 confidence scale
    justification = 'The proposal has significant gaps in addressing requirements and needs substantial improvement.';
  } else {
    recommendation = 'Reject';
    confidence = 100 - (combinedScore * 2); // 0-100 confidence scale
    justification = 'The proposal fails to address critical requirements and does not meet the minimum quality standards.';
  }
  
  return {
    recommendation,
    confidence: Math.round(confidence),
    justification
  };
}
