import { calculateTextSimilarity, extractWords } from './textAnalysis';

/**
 * Checks if a proposal addresses a specific requirement
 * @param requirement The requirement text to check for
 * @param proposalContent The full proposal content
 * @returns Object with match information
 */
export function checkRequirementMatch(requirement: string, proposalContent: string): {
  addressed: boolean;
  confidence: number;
  relevantSection?: string;
} {
  // Convert to lowercase for better matching
  const lowerRequirement = requirement.toLowerCase();
  const lowerProposal = proposalContent.toLowerCase();
  
  // Extract key terms from the requirement
  const requirementWords = Array.from(extractWords(lowerRequirement));
  const keyTerms = requirementWords.filter(word => word.length > 3);
  
  // Check if key terms are present in the proposal
  let matchCount = 0;
  for (const term of keyTerms) {
    if (lowerProposal.includes(term)) {
      matchCount++;
    }
  }
  
  // Calculate match confidence
  const confidence = keyTerms.length > 0 ? matchCount / keyTerms.length : 0;
  
  // Find the most relevant section
  let relevantSection = '';
  if (confidence > 0) {
    relevantSection = findRelevantSection(requirement, proposalContent);
  }
  
  return {
    addressed: confidence > 0.5, // Consider it addressed if more than half of key terms are found
    confidence,
    relevantSection: relevantSection || undefined
  };
}

/**
 * Finds the most relevant section in the proposal for a requirement
 * @param requirement The requirement to find a match for
 * @param proposalContent The full proposal content
 * @returns The most relevant section of the proposal
 */
function findRelevantSection(requirement: string, proposalContent: string): string {
  // Split proposal into paragraphs
  const paragraphs = proposalContent.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // Calculate similarity between requirement and each paragraph
  const similarities = paragraphs.map(paragraph => ({
    paragraph,
    similarity: calculateTextSimilarity(requirement, paragraph)
  }));
  
  // Sort by similarity (highest first)
  similarities.sort((a, b) => b.similarity - a.similarity);
  
  // Return the most similar paragraph if it has reasonable similarity
  if (similarities.length > 0 && similarities[0].similarity > 0.1) {
    return similarities[0].paragraph;
  }
  
  // If no good match found, try to find sentences containing key terms
  const requirementWords = Array.from(extractWords(requirement.toLowerCase()));
  const keyTerms = requirementWords.filter(word => word.length > 3);
  
  // Split proposal into sentences
  const sentences = proposalContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Find sentences containing key terms
  const relevantSentences = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return keyTerms.some(term => lowerSentence.includes(term));
  });
  
  // Return up to 3 relevant sentences joined together
  if (relevantSentences.length > 0) {
    return relevantSentences.slice(0, 3).join('. ') + '.';
  }
  
  return '';
}
