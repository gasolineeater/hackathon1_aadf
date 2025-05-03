/**
 * Utility functions for tender analysis
 */

/**
 * Extracts requirements from a tender document
 * @param tenderContent The content of the tender document
 * @param tenderMetadata Additional metadata about the tender
 * @returns Structured requirements extracted from the tender
 */
export function extractTenderRequirements(tenderContent: string, tenderMetadata: any = {}) {
  const lowerContent = tenderContent.toLowerCase();
  
  return {
    // Core requirements
    scope: extractScope(tenderContent),
    deliverables: extractDeliverables(tenderContent),
    timeline: extractTimeline(tenderContent, tenderMetadata),
    budget: extractBudget(tenderContent, tenderMetadata),
    
    // Technical requirements
    technicalRequirements: extractTechnicalRequirements(tenderContent),
    qualificationRequirements: extractQualificationRequirements(tenderContent),
    
    // Evaluation criteria
    evaluationCriteria: extractEvaluationCriteria(tenderContent),
    
    // Metadata
    keyTerms: extractKeyTerms(tenderContent),
    priority: determinePriority(tenderContent, tenderMetadata)
  };
}

/**
 * Extracts the scope of work from tender content
 */
function extractScope(content: string): { description: string, keywords: string[] } {
  const lowerContent = content.toLowerCase();
  
  // Look for scope section
  let scopeSection = '';
  const scopeRegex = /scope\s+of\s+work|scope|statement\s+of\s+work/i;
  
  if (scopeRegex.test(content)) {
    // Find the scope section (simplified approach)
    const contentParts = content.split(/\n\s*\n/); // Split by paragraph
    
    for (let i = 0; i < contentParts.length; i++) {
      if (scopeRegex.test(contentParts[i])) {
        scopeSection = contentParts[i];
        // Include the next paragraph if it's likely part of the scope
        if (i + 1 < contentParts.length && !contentParts[i + 1].match(/deliverables|requirements|timeline|budget/i)) {
          scopeSection += '\\n' + contentParts[i + 1];
        }
        break;
      }
    }
  }
  
  // Extract keywords from scope
  const keywords = [];
  const commonScopeTerms = [
    'develop', 'create', 'design', 'implement', 'provide', 'deliver',
    'maintain', 'support', 'analyze', 'evaluate', 'research', 'build'
  ];
  
  for (const term of commonScopeTerms) {
    if (lowerContent.includes(term)) {
      keywords.push(term);
    }
  }
  
  return {
    description: scopeSection || 'No explicit scope section found',
    keywords: keywords
  };
}

/**
 * Extracts deliverables from tender content
 */
function extractDeliverables(content: string): string[] {
  const lowerContent = content.toLowerCase();
  const deliverables = [];
  
  // Look for deliverables section
  const deliverablesRegex = /deliverables|expected\s+outputs|outputs|results/i;
  
  if (deliverablesRegex.test(content)) {
    // Find the deliverables section (simplified approach)
    const contentParts = content.split(/\n\s*\n/); // Split by paragraph
    
    for (let i = 0; i < contentParts.length; i++) {
      if (deliverablesRegex.test(contentParts[i])) {
        // Look for bullet points or numbered lists
        const listItems = contentParts[i].match(/[•\-*].*|^\d+\..*$/gm);
        
        if (listItems) {
          for (const item of listItems) {
            deliverables.push(item.replace(/^[•\-*]\s*|\d+\.\s*/, '').trim());
          }
        } else {
          // If no list items found, add the whole paragraph
          deliverables.push(contentParts[i].replace(/deliverables:?|expected\s+outputs:?|outputs:?|results:?/i, '').trim());
        }
        break;
      }
    }
  }
  
  // If no deliverables found, try to infer from content
  if (deliverables.length === 0) {
    const deliverablePatterns = [
      /provide\s+(?:a|an)\s+([^\.]+)/gi,
      /deliver\s+(?:a|an)\s+([^\.]+)/gi,
      /submit\s+(?:a|an)\s+([^\.]+)/gi,
      /produce\s+(?:a|an)\s+([^\.]+)/gi
    ];
    
    for (const pattern of deliverablePatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        if (match[1]) {
          deliverables.push(match[1].trim());
        }
      }
    }
  }
  
  return deliverables;
}

/**
 * Extracts timeline information from tender content
 */
function extractTimeline(content: string, metadata: any): { 
  deadline?: string, 
  duration?: { value: number, unit: string },
  milestones: { description: string, date?: string }[]
} {
  const lowerContent = content.toLowerCase();
  const result: any = {
    milestones: []
  };
  
  // Use deadline from metadata if available
  if (metadata.deadline) {
    result.deadline = metadata.deadline;
  } else {
    // Look for deadline in content
    const deadlinePatterns = [
      /deadline:?\s*([^\.]+)/i,
      /due\s+by:?\s*([^\.]+)/i,
      /submit\s+by:?\s*([^\.]+)/i,
      /no\s+later\s+than:?\s*([^\.]+)/i
    ];
    
    for (const pattern of deadlinePatterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        result.deadline = match[1].trim();
        break;
      }
    }
  }
  
  // Look for project duration
  const durationPatterns = [
    /duration\s+of\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)/i,
    /period\s+of\s+(\d+)\s+(day|days|week|weeks|month|months|year|years)/i,
    /(\d+)[\-\s]+(day|days|week|weeks|month|months|year|years)\s+project/i,
    /project\s+duration:?\s*(\d+)\s+(day|days|week|weeks|month|months|year|years)/i
  ];
  
  for (const pattern of durationPatterns) {
    const match = content.match(pattern);
    if (match && match[1] && match[2]) {
      result.duration = {
        value: parseInt(match[1]),
        unit: match[2].toLowerCase().replace(/s$/, '') // Normalize to singular
      };
      break;
    }
  }
  
  // Look for milestones
  const milestonePatterns = [
    /milestone:?\s*([^\.]+)/gi,
    /phase\s+\d+:?\s*([^\.]+)/gi,
    /stage\s+\d+:?\s*([^\.]+)/gi,
    /deliverable\s+\d+:?\s*([^\.]+)/gi
  ];
  
  for (const pattern of milestonePatterns) {
    const matches = content.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        // Try to extract date from milestone
        const dateMatch = match[1].match(/by\s+([^,\.]+)/i);
        
        result.milestones.push({
          description: match[1].trim(),
          date: dateMatch ? dateMatch[1].trim() : undefined
        });
      }
    }
  }
  
  return result;
}

/**
 * Extracts budget information from tender content
 */
function extractBudget(content: string, metadata: any): {
  amount?: number,
  currency?: string,
  range?: { min: number, max: number }
} {
  const result: any = {};
  
  // Use budget from metadata if available
  if (metadata.budget) {
    if (typeof metadata.budget === 'number') {
      result.amount = metadata.budget;
      result.currency = metadata.currency || 'USD';
    } else if (typeof metadata.budget === 'string') {
      // Try to parse budget string
      const budgetMatch = metadata.budget.match(/(\$|€|£|¥)?(\d+[,\d]*)/);
      if (budgetMatch) {
        result.amount = parseInt(budgetMatch[2].replace(/,/g, ''));
        result.currency = budgetMatch[1] || 'USD';
      }
    }
  }
  
  // If budget not found in metadata, look in content
  if (!result.amount) {
    // Look for budget in content
    const budgetPatterns = [
      /budget:?\s*(\$|€|£|¥)?(\d+[,\d]*)/i,
      /budget\s+of\s*(\$|€|£|¥)?(\d+[,\d]*)/i,
      /estimated\s+value:?\s*(\$|€|£|¥)?(\d+[,\d]*)/i,
      /contract\s+value:?\s*(\$|€|£|¥)?(\d+[,\d]*)/i,
      /not\s+to\s+exceed\s*(\$|€|£|¥)?(\d+[,\d]*)/i
    ];
    
    for (const pattern of budgetPatterns) {
      const match = content.match(pattern);
      if (match && match[2]) {
        result.amount = parseInt(match[2].replace(/,/g, ''));
        result.currency = match[1] || 'USD';
        break;
      }
    }
    
    // Look for budget range
    const rangePatterns = [
      /budget\s+range:?\s*(\$|€|£|¥)?(\d+[,\d]*)\s*-\s*(\$|€|£|¥)?(\d+[,\d]*)/i,
      /between\s*(\$|€|£|¥)?(\d+[,\d]*)\s*and\s*(\$|€|£|¥)?(\d+[,\d]*)/i
    ];
    
    for (const pattern of rangePatterns) {
      const match = content.match(pattern);
      if (match && match[2] && match[4]) {
        result.range = {
          min: parseInt(match[2].replace(/,/g, '')),
          max: parseInt(match[4].replace(/,/g, ''))
        };
        result.currency = match[1] || match[3] || 'USD';
        break;
      }
    }
  }
  
  return result;
}

/**
 * Extracts technical requirements from tender content
 */
function extractTechnicalRequirements(content: string): string[] {
  const lowerContent = content.toLowerCase();
  const requirements = [];
  
  // Look for technical requirements section
  const techReqRegex = /technical\s+requirements|technical\s+specifications|specifications|system\s+requirements/i;
  
  if (techReqRegex.test(content)) {
    // Find the technical requirements section (simplified approach)
    const contentParts = content.split(/\n\s*\n/); // Split by paragraph
    
    for (let i = 0; i < contentParts.length; i++) {
      if (techReqRegex.test(contentParts[i])) {
        // Look for bullet points or numbered lists
        const listItems = contentParts[i].match(/[•\-*].*|^\d+\..*$/gm);
        
        if (listItems) {
          for (const item of listItems) {
            requirements.push(item.replace(/^[•\-*]\s*|\d+\.\s*/, '').trim());
          }
        } else {
          // If no list items found, add the whole paragraph
          requirements.push(contentParts[i].replace(/technical\s+requirements:?|technical\s+specifications:?|specifications:?|system\s+requirements:?/i, '').trim());
        }
        
        // Include the next paragraph if it's likely part of the requirements
        if (i + 1 < contentParts.length && !contentParts[i + 1].match(/deliverables|timeline|budget|qualifications/i)) {
          const nextListItems = contentParts[i + 1].match(/[•\-*].*|^\d+\..*$/gm);
          
          if (nextListItems) {
            for (const item of nextListItems) {
              requirements.push(item.replace(/^[•\-*]\s*|\d+\.\s*/, '').trim());
            }
          }
        }
        
        break;
      }
    }
  }
  
  // If no technical requirements found, try to infer from content
  if (requirements.length === 0) {
    const techTerms = [
      'software', 'hardware', 'platform', 'system', 'application',
      'database', 'server', 'cloud', 'API', 'interface', 'framework',
      'programming language', 'technology', 'architecture', 'infrastructure'
    ];
    
    for (const term of techTerms) {
      if (lowerContent.includes(term)) {
        // Find sentences containing the term
        const sentences = content.match(new RegExp(`[^.!?]*${term}[^.!?]*[.!?]`, 'gi'));
        if (sentences) {
          for (const sentence of sentences) {
            if (sentence.match(/must|should|shall|require|need|expect/i)) {
              requirements.push(sentence.trim());
            }
          }
        }
      }
    }
  }
  
  return requirements;
}

/**
 * Extracts qualification requirements from tender content
 */
function extractQualificationRequirements(content: string): string[] {
  const lowerContent = content.toLowerCase();
  const qualifications = [];
  
  // Look for qualification requirements section
  const qualRegex = /qualifications|eligibility|requirements for vendors|vendor requirements|bidder requirements/i;
  
  if (qualRegex.test(content)) {
    // Find the qualifications section (simplified approach)
    const contentParts = content.split(/\n\s*\n/); // Split by paragraph
    
    for (let i = 0; i < contentParts.length; i++) {
      if (qualRegex.test(contentParts[i])) {
        // Look for bullet points or numbered lists
        const listItems = contentParts[i].match(/[•\-*].*|^\d+\..*$/gm);
        
        if (listItems) {
          for (const item of listItems) {
            qualifications.push(item.replace(/^[•\-*]\s*|\d+\.\s*/, '').trim());
          }
        } else {
          // If no list items found, add the whole paragraph
          qualifications.push(contentParts[i].replace(/qualifications:?|eligibility:?|requirements for vendors:?|vendor requirements:?|bidder requirements:?/i, '').trim());
        }
        break;
      }
    }
  }
  
  // If no qualifications found, try to infer from content
  if (qualifications.length === 0) {
    const qualPatterns = [
      /must have (\d+)[\+]? years? of experience/gi,
      /minimum of (\d+) years? experience/gi,
      /must be certified in ([^\.]+)/gi,
      /must have completed at least (\d+) similar projects/gi,
      /must have a ([^\.]+) degree/gi,
      /must be a ([^\.]+) provider/gi
    ];
    
    for (const pattern of qualPatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        qualifications.push(match[0].trim());
      }
    }
  }
  
  return qualifications;
}

/**
 * Extracts evaluation criteria from tender content
 */
function extractEvaluationCriteria(content: string): { criterion: string, weight?: number }[] {
  const lowerContent = content.toLowerCase();
  const criteria = [];
  
  // Look for evaluation criteria section
  const evalRegex = /evaluation criteria|selection criteria|scoring|assessment criteria/i;
  
  if (evalRegex.test(content)) {
    // Find the evaluation criteria section (simplified approach)
    const contentParts = content.split(/\n\s*\n/); // Split by paragraph
    
    for (let i = 0; i < contentParts.length; i++) {
      if (evalRegex.test(contentParts[i])) {
        // Look for bullet points or numbered lists with potential weights
        const listItems = contentParts[i].match(/[•\-*].*|^\d+\..*$/gm);
        
        if (listItems) {
          for (const item of listItems) {
            const cleanItem = item.replace(/^[•\-*]\s*|\d+\.\s*/, '').trim();
            
            // Try to extract weight
            const weightMatch = cleanItem.match(/\((\d+)%\)|\[(\d+)%\]|(\d+)%|(\d+)\s+points/);
            
            if (weightMatch) {
              const weight = parseInt(weightMatch[1] || weightMatch[2] || weightMatch[3] || weightMatch[4]);
              criteria.push({
                criterion: cleanItem.replace(/\(\d+%\)|\[\d+%\]|\d+%|\d+\s+points/, '').trim(),
                weight
              });
            } else {
              criteria.push({ criterion: cleanItem });
            }
          }
        } else {
          // If no list items found, look for criteria in the text
          const criteriaMatches = contentParts[i].match(/([^:]+):\s*(\d+)%/g);
          
          if (criteriaMatches) {
            for (const match of criteriaMatches) {
              const [criterion, weightStr] = match.split(':');
              const weight = parseInt(weightStr.trim().replace('%', ''));
              
              criteria.push({
                criterion: criterion.trim(),
                weight: isNaN(weight) ? undefined : weight
              });
            }
          } else {
            // Just add the whole paragraph as a criterion
            criteria.push({
              criterion: contentParts[i].replace(/evaluation criteria:?|selection criteria:?|scoring:?|assessment criteria:?/i, '').trim()
            });
          }
        }
        break;
      }
    }
  }
  
  // If no criteria found, use common evaluation criteria
  if (criteria.length === 0) {
    criteria.push({ criterion: 'Technical approach and methodology' });
    criteria.push({ criterion: 'Qualifications and experience' });
    criteria.push({ criterion: 'Cost effectiveness' });
    criteria.push({ criterion: 'Timeline and delivery schedule' });
  }
  
  return criteria;
}

/**
 * Extracts key terms from tender content
 */
function extractKeyTerms(content: string): string[] {
  const lowerContent = content.toLowerCase();
  const keyTerms = new Set<string>();
  
  // Common important terms in tenders
  const importantTerms = [
    'deadline', 'budget', 'requirement', 'deliverable', 'timeline',
    'milestone', 'qualification', 'experience', 'criteria', 'evaluation',
    'submission', 'proposal', 'mandatory', 'optional', 'preferred',
    'must', 'should', 'shall', 'will', 'may', 'can', 'cannot',
    'minimum', 'maximum', 'at least', 'no more than', 'approximately'
  ];
  
  for (const term of importantTerms) {
    if (lowerContent.includes(term)) {
      // Find the term in context
      const regex = new RegExp(`[^.!?]*\\b${term}\\b[^.!?]*[.!?]`, 'gi');
      const matches = content.match(regex);
      
      if (matches) {
        for (const match of matches) {
          // Extract key phrases containing the term
          const words = match.split(/\s+/);
          const termIndex = words.findIndex(w => w.toLowerCase() === term);
          
          if (termIndex >= 0) {
            // Get a window of words around the term
            const start = Math.max(0, termIndex - 2);
            const end = Math.min(words.length, termIndex + 3);
            const phrase = words.slice(start, end).join(' ').replace(/[,.!?;:]$/, '');
            
            keyTerms.add(phrase);
          }
        }
      }
    }
  }
  
  return Array.from(keyTerms);
}

/**
 * Determines the priority level of requirements in the tender
 */
function determinePriority(content: string, metadata: any): 'high' | 'medium' | 'low' {
  const lowerContent = content.toLowerCase();
  
  // Check for explicit priority indicators
  if (lowerContent.includes('urgent') || 
      lowerContent.includes('high priority') || 
      lowerContent.includes('critical') ||
      lowerContent.includes('immediate attention')) {
    return 'high';
  }
  
  // Check deadline proximity if available
  if (metadata.deadline) {
    const deadline = new Date(metadata.deadline);
    const now = new Date();
    const daysDifference = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference <= 14) {
      return 'high';
    } else if (daysDifference <= 30) {
      return 'medium';
    }
  }
  
  // Check budget as an indicator
  if (metadata.budget && metadata.budget > 100000) {
    return 'high';
  }
  
  // Default to medium priority
  return 'medium';
}
