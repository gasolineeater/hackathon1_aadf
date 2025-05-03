import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

/**
 * Generates a content hash for tracking changes to documents
 * @param content The content to hash
 * @returns SHA-256 hash of the content
 */
export function generateContentHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Stores document validation results in the database
 * @param documentType Type of document (tender, proposal, contract)
 * @param content Document content
 * @param documentId Optional document ID
 * @param validationResult Validation result object
 * @returns Result of the database operation
 */
export async function storeDocumentValidation(
  documentType: string,
  content: string,
  validationResult: any,
  documentId?: string
) {
  try {
    const contentHash = generateContentHash(content);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('document_validations')
      .upsert({
        document_type: documentType,
        document_id: documentId,
        content_hash: contentHash,
        is_valid: validationResult.isValid,
        score: validationResult.score,
        issues: validationResult.issues,
        suggestions: validationResult.suggestions,
        missing_elements: validationResult.missingElements,
        compliance: validationResult.compliance,
        created_by: user?.id
      }, {
        onConflict: 'document_id, content_hash',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error('Error storing document validation:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error storing document validation:', error);
    return { error };
  }
}

/**
 * Retrieves document validation results from the database
 * @param documentId Document ID
 * @returns The most recent validation result
 */
export async function getDocumentValidation(documentId: string) {
  try {
    const { data, error } = await supabase
      .from('document_validations')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error retrieving document validation:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error retrieving document validation:', error);
    return { error };
  }
}

/**
 * Stores tender evaluation results in the database
 * @param tenderId Tender ID
 * @param content Tender content
 * @param evaluationResult Evaluation result object
 * @returns Result of the database operation
 */
export async function storeTenderEvaluation(
  tenderId: string,
  content: string,
  evaluationResult: any
) {
  try {
    const contentHash = generateContentHash(content);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('tender_evaluations')
      .upsert({
        tender_id: tenderId,
        content_hash: contentHash,
        score: evaluationResult.score,
        quality: evaluationResult.quality,
        issues: evaluationResult.issues,
        recommendations: evaluationResult.recommendations,
        strengths: evaluationResult.strengths,
        weaknesses: evaluationResult.weaknesses,
        created_by: user?.id
      }, {
        onConflict: 'tender_id, content_hash',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error('Error storing tender evaluation:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error storing tender evaluation:', error);
    return { error };
  }
}

/**
 * Retrieves tender evaluation results from the database
 * @param tenderId Tender ID
 * @returns The most recent evaluation result
 */
export async function getTenderEvaluation(tenderId: string) {
  try {
    const { data, error } = await supabase
      .from('tender_evaluations')
      .select('*')
      .eq('tender_id', tenderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error retrieving tender evaluation:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error retrieving tender evaluation:', error);
    return { error };
  }
}

/**
 * Stores vendor matching results in the database
 * @param tenderId Tender ID
 * @param vendorMatches Array of vendor match results
 * @returns Result of the database operation
 */
export async function storeVendorMatches(
  tenderId: string,
  vendorMatches: any[]
) {
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
      updated_at: new Date().toISOString()
    }));
    
    const { data, error } = await supabase
      .from('tender_vendor_matches')
      .insert(matchesToInsert);
    
    if (error) {
      console.error('Error storing vendor matches:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error storing vendor matches:', error);
    return { error };
  }
}

/**
 * Retrieves vendor matching results from the database
 * @param tenderId Tender ID
 * @returns Array of vendor matches
 */
export async function getVendorMatches(tenderId: string) {
  try {
    const { data, error } = await supabase
      .from('tender_vendor_matches')
      .select(`
        *,
        vendors (
          id,
          name,
          contact_person,
          contact_email
        )
      `)
      .eq('tender_id', tenderId)
      .order('compatibility_score', { ascending: false });
    
    if (error) {
      console.error('Error retrieving vendor matches:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error retrieving vendor matches:', error);
    return { error };
  }
}

/**
 * Stores proposal analysis results in the database
 * @param tenderId Tender ID
 * @param proposalId Proposal ID
 * @param proposalContent Proposal content
 * @param tenderContent Tender content
 * @param analysisResult Analysis result object
 * @returns Result of the database operation
 */
export async function storeProposalAnalysis(
  tenderId: string,
  proposalId: string,
  proposalContent: string,
  tenderContent: string,
  analysisResult: any
) {
  try {
    // Generate content hash from both proposal and tender content
    const contentHash = generateContentHash(proposalContent + tenderContent);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase
      .from('proposal_analyses')
      .upsert({
        proposal_id: proposalId,
        tender_id: tenderId,
        content_hash: contentHash,
        overall_score: analysisResult.summary.overallScore,
        compliance_score: analysisResult.summary.complianceScore,
        evaluation_score: analysisResult.summary.evaluationScore,
        recommendation: analysisResult.recommendation.recommendation,
        key_findings: analysisResult.summary.keyFindings,
        compliance: analysisResult.compliance,
        evaluation: analysisResult.evaluation,
        insights: analysisResult.insights,
        recommendation_details: analysisResult.recommendation,
        updated_at: new Date().toISOString(),
        created_by: user?.id
      }, {
        onConflict: 'proposal_id, tender_id, content_hash',
        ignoreDuplicates: false
      });
    
    if (error) {
      console.error('Error storing proposal analysis:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error storing proposal analysis:', error);
    return { error };
  }
}

/**
 * Retrieves proposal analysis results from the database
 * @param proposalId Proposal ID
 * @param tenderId Tender ID
 * @returns The most recent analysis result
 */
export async function getProposalAnalysis(proposalId: string, tenderId: string) {
  try {
    const { data, error } = await supabase
      .from('proposal_analyses')
      .select('*')
      .eq('proposal_id', proposalId)
      .eq('tender_id', tenderId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error retrieving proposal analysis:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error retrieving proposal analysis:', error);
    return { error };
  }
}

/**
 * Retrieves all proposal analyses for a tender
 * @param tenderId Tender ID
 * @returns Array of proposal analyses
 */
export async function getTenderProposalAnalyses(tenderId: string) {
  try {
    const { data, error } = await supabase
      .from('proposal_analyses')
      .select(`
        *,
        proposals (
          id,
          title,
          vendor_id,
          vendors (
            id,
            name
          )
        )
      `)
      .eq('tender_id', tenderId)
      .order('overall_score', { ascending: false });
    
    if (error) {
      console.error('Error retrieving tender proposal analyses:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error retrieving tender proposal analyses:', error);
    return { error };
  }
}

/**
 * Retrieves all proposal analyses for a vendor
 * @param vendorId Vendor ID
 * @returns Array of proposal analyses
 */
export async function getVendorProposalAnalyses(vendorId: string) {
  try {
    const { data, error } = await supabase
      .from('proposal_analyses')
      .select(`
        *,
        proposals (
          id,
          title,
          submitted_at
        ),
        tenders (
          id,
          title,
          submission_deadline
        )
      `)
      .eq('proposals.vendor_id', vendorId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error retrieving vendor proposal analyses:', error);
      return { error };
    }
    
    return { data };
  } catch (error) {
    console.error('Error retrieving vendor proposal analyses:', error);
    return { error };
  }
}
