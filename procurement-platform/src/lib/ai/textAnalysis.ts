/**
 * Basic text analysis utilities for AI evaluation
 */

/**
 * Calculates the similarity between two texts
 * @param text1 First text to compare
 * @param text2 Second text to compare
 * @returns Similarity score between 0 and 1
 */
export function calculateTextSimilarity(text1: string, text2: string): number {
  // Convert to lowercase for better comparison
  const t1 = text1.toLowerCase();
  const t2 = text2.toLowerCase();
  
  // Extract words from both texts
  const words1 = extractWords(t1);
  const words2 = extractWords(t2);
  
  // Calculate Jaccard similarity (intersection over union)
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Extracts words from text, removing punctuation and common stop words
 * @param text Text to process
 * @returns Set of words from the text
 */
export function extractWords(text: string): Set<string> {
  // Remove punctuation and split into words
  const words = text
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  // Remove common stop words
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
    'be', 'been', 'being', 'to', 'of', 'for', 'in', 'on', 'at', 'by',
    'with', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'from', 'up', 'down', 'this',
    'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their'
  ]);
  
  return new Set(words.filter(word => !stopWords.has(word)));
}

/**
 * Calculates the readability score of text (simplified Flesch-Kincaid)
 * @param text Text to analyze
 * @returns Readability score (higher is more complex)
 */
export function calculateReadabilityScore(text: string): number {
  // Count sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  
  // Count words
  const words = text.split(/\s+/).filter(w => w.match(/[a-zA-Z]/));
  const wordCount = words.length;
  
  // Count syllables (simplified)
  const syllableCount = words.reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);
  
  // Avoid division by zero
  if (sentenceCount === 0 || wordCount === 0) {
    return 0;
  }
  
  // Simplified Flesch-Kincaid formula
  return 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;
}

/**
 * Counts syllables in a word (simplified approach)
 * @param word Word to count syllables for
 * @returns Estimated syllable count
 */
function countSyllables(word: string): number {
  word = word.toLowerCase();
  
  // Remove endings
  if (word.length > 3) {
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
  }
  
  // Count vowel groups
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

/**
 * Extracts key phrases from text
 * @param text Text to analyze
 * @param count Maximum number of phrases to extract
 * @returns Array of key phrases
 */
export function extractKeyPhrases(text: string, count: number = 5): string[] {
  // Split text into sentences
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Score sentences based on word frequency
  const wordFrequency = calculateWordFrequency(text);
  const sentenceScores = sentences.map(sentence => {
    const words = extractWords(sentence.toLowerCase());
    let score = 0;
    
    for (const word of words) {
      score += wordFrequency[word] || 0;
    }
    
    // Normalize by sentence length with a slight bias toward medium-length sentences
    const length = words.size;
    const lengthFactor = Math.exp(-(Math.pow(length - 10, 2) / 100));
    
    return { sentence, score: score * lengthFactor };
  });
  
  // Sort sentences by score and take the top ones
  const topSentences = sentenceScores
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(item => item.sentence.trim());
  
  return topSentences;
}

/**
 * Calculates word frequency in text
 * @param text Text to analyze
 * @returns Object mapping words to their frequency
 */
function calculateWordFrequency(text: string): Record<string, number> {
  const words = Array.from(extractWords(text.toLowerCase()));
  const frequency: Record<string, number> = {};
  
  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;
  }
  
  return frequency;
}

/**
 * Detects the sentiment of text (very simplified)
 * @param text Text to analyze
 * @returns Sentiment score between -1 (negative) and 1 (positive)
 */
export function detectSentiment(text: string): number {
  const lowerText = text.toLowerCase();
  
  // Very simplified sentiment analysis using keyword matching
  const positiveWords = [
    'good', 'great', 'excellent', 'outstanding', 'exceptional',
    'best', 'superior', 'impressive', 'amazing', 'wonderful',
    'positive', 'successful', 'effective', 'efficient', 'reliable',
    'quality', 'innovative', 'advanced', 'proven', 'experienced'
  ];
  
  const negativeWords = [
    'bad', 'poor', 'inadequate', 'insufficient', 'limited',
    'worst', 'inferior', 'disappointing', 'terrible', 'horrible',
    'negative', 'unsuccessful', 'ineffective', 'inefficient', 'unreliable',
    'problem', 'issue', 'concern', 'risk', 'failure'
  ];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  // Count positive and negative words
  for (const word of positiveWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      positiveCount += matches.length;
    }
  }
  
  for (const word of negativeWords) {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      negativeCount += matches.length;
    }
  }
  
  // Calculate sentiment score
  const totalWords = positiveCount + negativeCount;
  if (totalWords === 0) {
    return 0; // Neutral if no sentiment words found
  }
  
  return (positiveCount - negativeCount) / totalWords;
}
