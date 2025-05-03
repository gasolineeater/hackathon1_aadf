import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Vendor matching API
 * Finds the best vendor matches for a specific tender
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
    let tenderId = body.tenderId;
    
    // If tenderId is provided, fetch the tender from the database
    if (tenderId && !tenderContent) {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .eq('id', tenderId)
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
    
    // Fetch vendors from the database
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select(`
        *,
        vendor_categories(category),
        vendor_expertise(expertise),
        vendor_past_performance(
          project_title,
          client,
          completion_date,
          contract_value,
          performance_score
        )
      `);
    
    if (vendorsError) {
      return NextResponse.json(
        { error: 'Error fetching vendors', details: vendorsError.message },
        { status: 500 }
      );
    }
    
    // Match vendors to the tender
    const matchResults = await matchVendorsToTender(vendors, tenderContent, tenderMetadata, tenderId);
    
    return NextResponse.json(matchResults);
  } catch (error: any) {
    console.error('Error matching vendors:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Matches vendors to a tender based on compatibility
 */
async function matchVendorsToTender(vendors: any[], tenderContent: string, tenderMetadata: any, tenderId?: string) {
  // Extract key requirements from tender
  const requirements = extractTenderRequirements(tenderContent, tenderMetadata);
  
  // Calculate compatibility scores for each vendor
  const vendorMatches = vendors.map(vendor => {
    const compatibilityScore = calculateCompatibilityScore(vendor, requirements);
    const strengthsAndWeaknesses = identifyStrengthsAndWeaknesses(vendor, requirements);
    
    return {
      vendorId: vendor.id,
      vendorName: vendor.name,
      compatibilityScore,
      matchDetails: {
        categoryMatch: calculateCategoryMatch(vendor, requirements.categories),
        expertiseMatch: calculateExpertiseMatch(vendor, requirements.expertise),
        capacityMatch: calculateCapacityMatch(vendor, requirements.estimatedValue),
        performanceMatch: calculatePerformanceMatch(vendor),
        locationMatch: calculateLocationMatch(vendor, requirements.location)
      },
      strengths: strengthsAndWeaknesses.strengths,
      weaknesses: strengthsAndWeaknesses.weaknesses,
      recommendation: generateVendorRecommendation(compatibilityScore, strengthsAndWeaknesses)
    };
  });
  
  // Sort vendors by compatibility score
  const sortedMatches = vendorMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  
  // If tenderId is provided, store the match results in the database
  if (tenderId) {
    await storeMatchResults(tenderId, sortedMatches);
  }
  
  return {
    tenderRequirements: requirements,
    vendorMatches: sortedMatches,
    topMatches: sortedMatches.slice(0, 5),
    matchSummary: generateMatchSummary(sortedMatches)
  };
}

/**
 * Extracts key requirements from tender content
 */
function extractTenderRequirements(content: string, metadata: any) {
  const lowerContent = content.toLowerCase();
  
  // Extract categories
  const categories = extractCategories(content, metadata);
  
  // Extract expertise areas
  const expertise = extractExpertise(content);
  
  // Extract estimated value/budget
  let estimatedValue = metadata.budget || null;
  if (!estimatedValue) {
    const budgetMatch = content.match(/budget of \$?(\d+[,\d]*)/i) || 
                        content.match(/estimated value of \$?(\d+[,\d]*)/i) ||
                        content.match(/contract value of \$?(\d+[,\d]*)/i);
    
    if (budgetMatch && budgetMatch[1]) {
      estimatedValue = parseInt(budgetMatch[1].replace(/,/g, ''));
    }
  }
  
  // Extract location
  let location = metadata.location || null;
  if (!location) {
    const locationMatch = content.match(/location: ([^\.]+)/i) ||
                          content.match(/based in ([^\.]+)/i) ||
                          content.match(/located in ([^\.]+)/i);
    
    if (locationMatch && locationMatch[1]) {
      location = locationMatch[1].trim();
    }
  }
  
  // Extract duration
  let duration = metadata.duration || null;
  if (!duration) {
    const durationMatch = content.match(/duration of (\d+) (days|weeks|months|years)/i) ||
                          content.match(/period of (\d+) (days|weeks|months|years)/i) ||
                          content.match(/timeframe of (\d+) (days|weeks|months|years)/i);
    
    if (durationMatch && durationMatch[1] && durationMatch[2]) {
      duration = {
        value: parseInt(durationMatch[1]),
        unit: durationMatch[2].toLowerCase()
      };
    }
  }
  
  // Extract required certifications
  const certifications = [];
  const certificationPatterns = [
    /ISO (\d+)/i,
    /certified in ([^\.]+)/i,
    /certification in ([^\.]+)/i,
    /certified ([^\.]+) provider/i
  ];
  
  for (const pattern of certificationPatterns) {
    const matches = content.match(pattern);
    if (matches && matches[1]) {
      certifications.push(matches[1].trim());
    }
  }
  
  return {
    categories,
    expertise,
    estimatedValue,
    location,
    duration,
    certifications,
    teamSize: extractTeamSize(content),
    specialRequirements: extractSpecialRequirements(content)
  };
}

/**
 * Extracts categories from tender content
 */
function extractCategories(content: string, metadata: any) {
  if (metadata.category) {
    return [metadata.category];
  }
  
  const lowerContent = content.toLowerCase();
  const categories = [];
  
  // Common procurement categories
  const categoryPatterns = [
    { pattern: /IT|information technology|software|hardware|computer/i, category: 'Information Technology' },
    { pattern: /construction|building|infrastructure|facility/i, category: 'Construction' },
    { pattern: /consulting|advisory|strategy|management consult/i, category: 'Consulting' },
    { pattern: /training|education|learning|teaching|workshop/i, category: 'Training & Education' },
    { pattern: /marketing|advertising|promotion|branding|PR|public relations/i, category: 'Marketing & Communications' },
    { pattern: /research|study|analysis|survey|data collection/i, category: 'Research & Development' },
    { pattern: /legal|law|attorney|counsel/i, category: 'Legal Services' },
    { pattern: /financial|accounting|audit|tax/i, category: 'Financial Services' },
    { pattern: /medical|healthcare|health|clinical|hospital/i, category: 'Healthcare' },
    { pattern: /transport|logistics|shipping|freight|delivery/i, category: 'Transportation & Logistics' }
  ];
  
  for (const { pattern, category } of categoryPatterns) {
    if (pattern.test(content)) {
      categories.push(category);
    }
  }
  
  return categories;
}

/**
 * Extracts expertise areas from tender content
 */
function extractExpertise(content: string) {
  const lowerContent = content.toLowerCase();
  const expertise = [];
  
  // Common expertise areas
  const expertisePatterns = [
    { pattern: /web development|website|web application/i, expertise: 'Web Development' },
    { pattern: /mobile app|android|ios|mobile application/i, expertise: 'Mobile Development' },
    { pattern: /data analysis|analytics|big data|data science/i, expertise: 'Data Analysis' },
    { pattern: /cloud|aws|azure|google cloud/i, expertise: 'Cloud Computing' },
    { pattern: /security|cybersecurity|encryption|firewall/i, expertise: 'Cybersecurity' },
    { pattern: /UI\/UX|user interface|user experience|usability/i, expertise: 'UI/UX Design' },
    { pattern: /project management|PMO|PRINCE2|PMP|agile|scrum/i, expertise: 'Project Management' },
    { pattern: /translation|interpreter|language/i, expertise: 'Translation Services' },
    { pattern: /graphic design|design|illustration|branding/i, expertise: 'Graphic Design' },
    { pattern: /video|film|production|editing|animation/i, expertise: 'Video Production' },
    { pattern: /social media|facebook|twitter|instagram|linkedin/i, expertise: 'Social Media' },
    { pattern: /SEO|search engine optimization|SEM|search marketing/i, expertise: 'SEO/SEM' },
    { pattern: /content|copywriting|writing|blog|article/i, expertise: 'Content Creation' },
    { pattern: /event|conference|exhibition|workshop organization/i, expertise: 'Event Management' }
  ];
  
  for (const { pattern, expertise: exp } of expertisePatterns) {
    if (pattern.test(content)) {
      expertise.push(exp);
    }
  }
  
  return expertise;
}

/**
 * Extracts team size requirements from tender content
 */
function extractTeamSize(content: string) {
  const teamSizeMatch = content.match(/team of (\d+)/i) ||
                        content.match(/(\d+) team members/i) ||
                        content.match(/(\d+) staff/i) ||
                        content.match(/(\d+) personnel/i);
  
  if (teamSizeMatch && teamSizeMatch[1]) {
    return parseInt(teamSizeMatch[1]);
  }
  
  return null;
}

/**
 * Extracts special requirements from tender content
 */
function extractSpecialRequirements(content: string) {
  const lowerContent = content.toLowerCase();
  const specialRequirements = [];
  
  // Common special requirements
  const requirementPatterns = [
    { pattern: /security clearance/i, requirement: 'Security Clearance' },
    { pattern: /government experience/i, requirement: 'Government Experience' },
    { pattern: /international experience/i, requirement: 'International Experience' },
    { pattern: /multilingual|multiple languages/i, requirement: 'Multilingual Capability' },
    { pattern: /24\/7|around the clock|continuous/i, requirement: '24/7 Availability' },
    { pattern: /on-site|onsite/i, requirement: 'On-site Presence' },
    { pattern: /remote|virtual/i, requirement: 'Remote Work Capability' },
    { pattern: /urgent|immediate|quick/i, requirement: 'Urgent Delivery' },
    { pattern: /compliance|compliant with/i, requirement: 'Regulatory Compliance' },
    { pattern: /accessibility|accessible/i, requirement: 'Accessibility Compliance' }
  ];
  
  for (const { pattern, requirement } of requirementPatterns) {
    if (pattern.test(content)) {
      specialRequirements.push(requirement);
    }
  }
  
  return specialRequirements;
}

/**
 * Calculates overall compatibility score between vendor and tender
 */
function calculateCompatibilityScore(vendor: any, requirements: any) {
  // Calculate individual match scores
  const categoryMatchScore = calculateCategoryMatch(vendor, requirements.categories);
  const expertiseMatchScore = calculateExpertiseMatch(vendor, requirements.expertise);
  const capacityMatchScore = calculateCapacityMatch(vendor, requirements.estimatedValue);
  const performanceMatchScore = calculatePerformanceMatch(vendor);
  const locationMatchScore = calculateLocationMatch(vendor, requirements.location);
  
  // Calculate weighted average
  const weightedScore = (
    (categoryMatchScore * 0.25) +
    (expertiseMatchScore * 0.3) +
    (capacityMatchScore * 0.15) +
    (performanceMatchScore * 0.2) +
    (locationMatchScore * 0.1)
  );
  
  return Math.round(weightedScore);
}

/**
 * Calculates category match score
 */
function calculateCategoryMatch(vendor: any, tenderCategories: string[]) {
  if (!tenderCategories || tenderCategories.length === 0) {
    return 100; // No specific categories required
  }
  
  if (!vendor.vendor_categories || vendor.vendor_categories.length === 0) {
    return 0; // Vendor has no categories
  }
  
  // Extract vendor categories
  const vendorCategories = vendor.vendor_categories.map((vc: any) => vc.category);
  
  // Count matching categories
  let matchCount = 0;
  for (const category of tenderCategories) {
    if (vendorCategories.some((vc: string) => vc.toLowerCase() === category.toLowerCase())) {
      matchCount++;
    }
  }
  
  return Math.round((matchCount / tenderCategories.length) * 100);
}

/**
 * Calculates expertise match score
 */
function calculateExpertiseMatch(vendor: any, tenderExpertise: string[]) {
  if (!tenderExpertise || tenderExpertise.length === 0) {
    return 100; // No specific expertise required
  }
  
  if (!vendor.vendor_expertise || vendor.vendor_expertise.length === 0) {
    return 0; // Vendor has no expertise
  }
  
  // Extract vendor expertise
  const vendorExpertise = vendor.vendor_expertise.map((ve: any) => ve.expertise);
  
  // Count matching expertise areas
  let matchCount = 0;
  for (const expertise of tenderExpertise) {
    if (vendorExpertise.some((ve: string) => ve.toLowerCase() === expertise.toLowerCase())) {
      matchCount++;
    }
  }
  
  return Math.round((matchCount / tenderExpertise.length) * 100);
}

/**
 * Calculates capacity match score based on estimated value
 */
function calculateCapacityMatch(vendor: any, estimatedValue: number | null) {
  if (!estimatedValue) {
    return 100; // No specific budget requirement
  }
  
  // Check if vendor has capacity information
  if (!vendor.annual_revenue || !vendor.max_contract_value) {
    return 50; // Neutral score if capacity info is missing
  }
  
  // Check if the estimated value is within vendor's capacity
  if (estimatedValue <= vendor.max_contract_value) {
    // Calculate how well the contract fits the vendor's capacity
    const contractToRevenueRatio = estimatedValue / vendor.annual_revenue;
    
    if (contractToRevenueRatio <= 0.05) {
      return 100; // Contract is small relative to vendor's capacity
    } else if (contractToRevenueRatio <= 0.2) {
      return 90; // Contract is a good fit for vendor's capacity
    } else if (contractToRevenueRatio <= 0.4) {
      return 70; // Contract is significant but manageable
    } else if (contractToRevenueRatio <= 0.6) {
      return 50; // Contract is large relative to vendor's capacity
    } else {
      return 30; // Contract is very large relative to vendor's capacity
    }
  } else {
    return 0; // Contract exceeds vendor's maximum capacity
  }
}

/**
 * Calculates performance match score based on past performance
 */
function calculatePerformanceMatch(vendor: any) {
  if (!vendor.vendor_past_performance || vendor.vendor_past_performance.length === 0) {
    return 50; // Neutral score if no past performance data
  }
  
  // Calculate average performance score
  const performanceScores = vendor.vendor_past_performance.map((pp: any) => pp.performance_score);
  const averageScore = performanceScores.reduce((sum: number, score: number) => sum + score, 0) / performanceScores.length;
  
  // Convert to 0-100 scale (assuming performance_score is on a 1-5 scale)
  return Math.round((averageScore / 5) * 100);
}

/**
 * Calculates location match score
 */
function calculateLocationMatch(vendor: any, tenderLocation: string | null) {
  if (!tenderLocation) {
    return 100; // No specific location requirement
  }
  
  if (!vendor.location) {
    return 50; // Neutral score if vendor location is unknown
  }
  
  // Simple string matching for now
  // In a real implementation, this would use geocoding and distance calculation
  if (vendor.location.toLowerCase().includes(tenderLocation.toLowerCase()) ||
      tenderLocation.toLowerCase().includes(vendor.location.toLowerCase())) {
    return 100;
  }
  
  // Check for country/region match
  const vendorLocationParts = vendor.location.toLowerCase().split(/,|\s+/);
  const tenderLocationParts = tenderLocation.toLowerCase().split(/,|\s+/);
  
  for (const part of vendorLocationParts) {
    if (part.length > 2 && tenderLocationParts.includes(part)) {
      return 80; // Partial location match
    }
  }
  
  return 50; // Default to neutral score
}

/**
 * Identifies strengths and weaknesses of a vendor for a specific tender
 */
function identifyStrengthsAndWeaknesses(vendor: any, requirements: any) {
  const strengths = [];
  const weaknesses = [];
  
  // Category match
  const categoryMatchScore = calculateCategoryMatch(vendor, requirements.categories);
  if (categoryMatchScore >= 80) {
    strengths.push('Strong category alignment with tender requirements');
  } else if (categoryMatchScore <= 30) {
    weaknesses.push('Limited experience in the required categories');
  }
  
  // Expertise match
  const expertiseMatchScore = calculateExpertiseMatch(vendor, requirements.expertise);
  if (expertiseMatchScore >= 80) {
    strengths.push('Excellent expertise match with tender requirements');
  } else if (expertiseMatchScore <= 30) {
    weaknesses.push('Limited expertise in the required areas');
  }
  
  // Capacity match
  const capacityMatchScore = calculateCapacityMatch(vendor, requirements.estimatedValue);
  if (capacityMatchScore >= 80) {
    strengths.push('Well-suited capacity for the project size');
  } else if (capacityMatchScore <= 30) {
    weaknesses.push('Project size may be challenging for vendor capacity');
  }
  
  // Performance match
  const performanceMatchScore = calculatePerformanceMatch(vendor);
  if (performanceMatchScore >= 80) {
    strengths.push('Strong past performance record');
  } else if (performanceMatchScore <= 30) {
    weaknesses.push('Limited or concerning past performance record');
  }
  
  // Location match
  const locationMatchScore = calculateLocationMatch(vendor, requirements.location);
  if (locationMatchScore >= 80) {
    strengths.push('Ideal location for project requirements');
  } else if (locationMatchScore <= 30) {
    weaknesses.push('Location may present challenges for project delivery');
  }
  
  // Check for certifications
  if (requirements.certifications && requirements.certifications.length > 0) {
    const vendorCertifications = vendor.certifications || [];
    const matchingCertifications = requirements.certifications.filter((cert: string) => 
      vendorCertifications.some((vc: string) => vc.toLowerCase().includes(cert.toLowerCase()))
    );
    
    if (matchingCertifications.length === requirements.certifications.length) {
      strengths.push('Has all required certifications');
    } else if (matchingCertifications.length === 0) {
      weaknesses.push('Missing required certifications');
    } else {
      weaknesses.push('Missing some required certifications');
    }
  }
  
  // Check for special requirements
  if (requirements.specialRequirements && requirements.specialRequirements.length > 0) {
    // This would need to be expanded with actual vendor capabilities data
    if (vendor.special_capabilities) {
      const matchingCapabilities = requirements.specialRequirements.filter((req: string) => 
        vendor.special_capabilities.some((cap: string) => cap.toLowerCase().includes(req.toLowerCase()))
      );
      
      if (matchingCapabilities.length > 0) {
        strengths.push('Meets special project requirements');
      } else {
        weaknesses.push('May not meet special project requirements');
      }
    } else {
      weaknesses.push('Unknown capability for special project requirements');
    }
  }
  
  return { strengths, weaknesses };
}

/**
 * Generates a recommendation for a vendor based on compatibility
 */
function generateVendorRecommendation(compatibilityScore: number, strengthsAndWeaknesses: any) {
  if (compatibilityScore >= 85) {
    return {
      recommendation: 'Highly Recommended',
      rationale: 'Excellent match for tender requirements with strong capabilities and experience.'
    };
  } else if (compatibilityScore >= 70) {
    return {
      recommendation: 'Recommended',
      rationale: 'Good overall match with some notable strengths for this tender.'
    };
  } else if (compatibilityScore >= 50) {
    return {
      recommendation: 'Consider',
      rationale: 'Acceptable match but with some limitations or areas of concern.'
    };
  } else {
    return {
      recommendation: 'Not Recommended',
      rationale: 'Significant gaps between vendor capabilities and tender requirements.'
    };
  }
}

/**
 * Generates a summary of the match results
 */
function generateMatchSummary(vendorMatches: any[]) {
  const totalVendors = vendorMatches.length;
  const highlyCompatible = vendorMatches.filter(v => v.compatibilityScore >= 85).length;
  const moderatelyCompatible = vendorMatches.filter(v => v.compatibilityScore >= 70 && v.compatibilityScore < 85).length;
  const lowCompatible = vendorMatches.filter(v => v.compatibilityScore < 70).length;
  
  const averageScore = vendorMatches.reduce((sum, v) => sum + v.compatibilityScore, 0) / totalVendors;
  
  return {
    totalVendors,
    highlyCompatible,
    moderatelyCompatible,
    lowCompatible,
    averageScore: Math.round(averageScore),
    competitiveness: totalVendors > 5 ? 'High' : totalVendors > 2 ? 'Moderate' : 'Low',
    summary: `Found ${totalVendors} potential vendors, with ${highlyCompatible} highly compatible matches.`
  };
}

/**
 * Stores match results in the database
 */
async function storeMatchResults(tenderId: string, vendorMatches: any[]) {
  try {
    // Delete existing matches for this tender
    await supabase
      .from('tender_vendor_matches')
      .delete()
      .eq('tender_id', tenderId);
    
    // Insert new matches
    const matchesToInsert = vendorMatches.map(match => ({
      tender_id: tenderId,
      vendor_id: match.vendorId,
      compatibility_score: match.compatibilityScore,
      match_details: match.matchDetails,
      strengths: match.strengths,
      weaknesses: match.weaknesses,
      recommendation: match.recommendation.recommendation,
      created_at: new Date().toISOString()
    }));
    
    const { error } = await supabase
      .from('tender_vendor_matches')
      .insert(matchesToInsert);
    
    if (error) {
      console.error('Error storing match results:', error);
    }
  } catch (error) {
    console.error('Error storing match results:', error);
  }
}
