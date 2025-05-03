import { createOrUpdateCompatibilityScore } from '../lib/supabase';

interface Tender {
  id: string;
  title: string;
  description: string;
  category: string;
  requirements: any;
  evaluation_criteria: any;
}

interface Vendor {
  id: string;
  name: string;
  description: string;
  industry: string[];
  expertise: string[];
  years_in_business: number;
  company_size: string;
  previous_projects: any[];
  certifications: string[];
}

interface CompatibilityFactor {
  name: string;
  score: number;
  weight: number;
  explanation: string;
}

interface CompatibilityResult {
  score: number;
  factors: CompatibilityFactor[];
}

export class AICompatibilityService {
  /**
   * Analyze the compatibility between a tender and a vendor
   */
  static async analyzeCompatibility(tender: Tender, vendor: Vendor): Promise<CompatibilityResult> {
    try {
      // In a real implementation, this would call the OpenAI API
      // For now, we'll use a mock implementation that simulates AI analysis
      
      // Calculate compatibility factors
      const factors: CompatibilityFactor[] = [
        this.analyzeIndustryMatch(tender, vendor),
        this.analyzeExpertiseMatch(tender, vendor),
        this.analyzeExperienceMatch(tender, vendor),
        this.analyzeCapacityMatch(tender, vendor),
        this.analyzeCertificationMatch(tender, vendor)
      ];
      
      // Calculate overall score (weighted average)
      const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
      const weightedScore = factors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0);
      const overallScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
      
      // Round to 2 decimal places
      const finalScore = Math.round(overallScore * 100) / 100;
      
      return {
        score: finalScore,
        factors
      };
    } catch (error) {
      console.error('Error analyzing compatibility:', error);
      throw error;
    }
  }
  
  /**
   * Save compatibility analysis to the database
   */
  static async saveCompatibilityAnalysis(tenderId: string, vendorId: string, result: CompatibilityResult) {
    try {
      await createOrUpdateCompatibilityScore({
        tender_id: tenderId,
        vendor_id: vendorId,
        score: result.score,
        factors: result.factors
      });
      
      return true;
    } catch (error) {
      console.error('Error saving compatibility analysis:', error);
      return false;
    }
  }
  
  /**
   * Analyze industry match between tender and vendor
   */
  private static analyzeIndustryMatch(tender: Tender, vendor: Vendor): CompatibilityFactor {
    // Extract industry from tender category and requirements
    const tenderIndustries = [tender.category];
    if (tender.requirements?.industry) {
      if (Array.isArray(tender.requirements.industry)) {
        tenderIndustries.push(...tender.requirements.industry);
      } else {
        tenderIndustries.push(tender.requirements.industry);
      }
    }
    
    // Count matches
    const vendorIndustries = vendor.industry || [];
    const matches = tenderIndustries.filter(industry => 
      vendorIndustries.some(vendorIndustry => 
        vendorIndustry.toLowerCase().includes(industry.toLowerCase()) || 
        industry.toLowerCase().includes(vendorIndustry.toLowerCase())
      )
    );
    
    // Calculate score
    const score = tenderIndustries.length > 0 ? matches.length / tenderIndustries.length : 0;
    
    return {
      name: 'Industry Match',
      score: score,
      weight: 0.25,
      explanation: matches.length > 0 
        ? `Vendor has experience in ${matches.length} of ${tenderIndustries.length} relevant industries.`
        : 'Vendor does not have experience in the required industries.'
    };
  }
  
  /**
   * Analyze expertise match between tender and vendor
   */
  private static analyzeExpertiseMatch(tender: Tender, vendor: Vendor): CompatibilityFactor {
    // Extract required expertise from tender
    const requiredExpertise: string[] = [];
    if (tender.requirements?.expertise) {
      if (Array.isArray(tender.requirements.expertise)) {
        requiredExpertise.push(...tender.requirements.expertise);
      } else {
        requiredExpertise.push(tender.requirements.expertise);
      }
    }
    
    // Extract keywords from tender description
    const descriptionKeywords = this.extractKeywords(tender.description);
    requiredExpertise.push(...descriptionKeywords);
    
    // Count matches
    const vendorExpertise = vendor.expertise || [];
    const matches = requiredExpertise.filter(expertise => 
      vendorExpertise.some(vendorExp => 
        vendorExp.toLowerCase().includes(expertise.toLowerCase()) || 
        expertise.toLowerCase().includes(vendorExp.toLowerCase())
      )
    );
    
    // Calculate score
    const score = requiredExpertise.length > 0 ? matches.length / requiredExpertise.length : 0;
    
    return {
      name: 'Expertise Match',
      score: score,
      weight: 0.3,
      explanation: matches.length > 0 
        ? `Vendor has ${matches.length} of ${requiredExpertise.length} required expertise areas.`
        : 'Vendor does not have the required expertise.'
    };
  }
  
  /**
   * Analyze experience match between tender and vendor
   */
  private static analyzeExperienceMatch(tender: Tender, vendor: Vendor): CompatibilityFactor {
    // Check years in business
    const requiredYears = tender.requirements?.years_experience || 0;
    const vendorYears = vendor.years_in_business || 0;
    
    // Check previous projects
    const vendorProjects = vendor.previous_projects || [];
    const relevantProjects = vendorProjects.filter(project => 
      project.category === tender.category || 
      project.description?.toLowerCase().includes(tender.category.toLowerCase())
    );
    
    // Calculate score
    let score = 0;
    
    // Years experience score (50% of total)
    const yearsScore = requiredYears > 0 ? Math.min(vendorYears / requiredYears, 1) : 1;
    
    // Projects score (50% of total)
    const projectsScore = relevantProjects.length > 0 ? Math.min(relevantProjects.length / 3, 1) : 0;
    
    score = (yearsScore * 0.5) + (projectsScore * 0.5);
    
    return {
      name: 'Experience Match',
      score: score,
      weight: 0.2,
      explanation: `Vendor has ${vendorYears} years in business and ${relevantProjects.length} relevant projects.`
    };
  }
  
  /**
   * Analyze capacity match between tender and vendor
   */
  private static analyzeCapacityMatch(tender: Tender, vendor: Vendor): CompatibilityFactor {
    // Extract required company size from tender
    const requiredSize = tender.requirements?.company_size || 'any';
    const vendorSize = vendor.company_size || 'small';
    
    // Map company sizes to numeric values
    const sizeMap: Record<string, number> = {
      'micro': 1,
      'small': 2,
      'medium': 3,
      'large': 4,
      'enterprise': 5,
      'any': 0
    };
    
    // Calculate score
    let score = 1; // Default to perfect match
    
    if (requiredSize !== 'any') {
      const requiredSizeValue = sizeMap[requiredSize.toLowerCase()] || 0;
      const vendorSizeValue = sizeMap[vendorSize.toLowerCase()] || 0;
      
      if (requiredSizeValue > 0 && vendorSizeValue > 0) {
        // If vendor is smaller than required, penalize more
        if (vendorSizeValue < requiredSizeValue) {
          score = vendorSizeValue / requiredSizeValue;
        } else {
          // If vendor is larger than required, small penalty
          score = 1 - (0.1 * (vendorSizeValue - requiredSizeValue));
        }
        
        // Ensure score is between 0 and 1
        score = Math.max(0, Math.min(1, score));
      }
    }
    
    return {
      name: 'Capacity Match',
      score: score,
      weight: 0.15,
      explanation: `Vendor size (${vendorSize}) ${score === 1 ? 'matches' : 'partially matches'} the required capacity.`
    };
  }
  
  /**
   * Analyze certification match between tender and vendor
   */
  private static analyzeCertificationMatch(tender: Tender, vendor: Vendor): CompatibilityFactor {
    // Extract required certifications from tender
    const requiredCertifications: string[] = [];
    if (tender.requirements?.certifications) {
      if (Array.isArray(tender.requirements.certifications)) {
        requiredCertifications.push(...tender.requirements.certifications);
      } else {
        requiredCertifications.push(tender.requirements.certifications);
      }
    }
    
    // Count matches
    const vendorCertifications = vendor.certifications || [];
    const matches = requiredCertifications.filter(cert => 
      vendorCertifications.some(vendorCert => 
        vendorCert.toLowerCase().includes(cert.toLowerCase()) || 
        cert.toLowerCase().includes(vendorCert.toLowerCase())
      )
    );
    
    // Calculate score
    const score = requiredCertifications.length > 0 ? matches.length / requiredCertifications.length : 1;
    
    return {
      name: 'Certification Match',
      score: score,
      weight: 0.1,
      explanation: requiredCertifications.length > 0
        ? `Vendor has ${matches.length} of ${requiredCertifications.length} required certifications.`
        : 'No specific certifications required.'
    };
  }
  
  /**
   * Extract keywords from text
   */
  private static extractKeywords(text: string): string[] {
    // In a real implementation, this would use NLP techniques
    // For now, we'll use a simple approach
    
    // Remove common words and punctuation
    const cleanText = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Split into words
    const words = cleanText.split(' ');
    
    // Filter out common words
    const commonWords = ['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'of', 'is', 'are', 'was', 'were'];
    const filteredWords = words.filter(word => !commonWords.includes(word) && word.length > 3);
    
    // Get unique words
    const uniqueWords = [...new Set(filteredWords)];
    
    // Return top 5 keywords
    return uniqueWords.slice(0, 5);
  }
}
