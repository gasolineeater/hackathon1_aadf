import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { storeDocumentValidation } from '@/lib/ai/databaseStorage';

/**
 * Document validation API
 * Validates procurement documents for compliance, completeness, and quality
 */
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = userProfile?.role === 'admin';
    const isEvaluator = userProfile?.role === 'evaluator';

    // Only admins and evaluators can validate documents
    if (!isAdmin && !isEvaluator) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins and evaluators can validate documents' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check for document_id in the new API format
    if (body.document_id) {
      // New API format
      return await handleNewApiFormat(request, user.id);
    }

    // Legacy API format
    // Required fields validation
    if (!body.documentType || !body.content) {
      return NextResponse.json(
        { error: 'Missing required fields: documentType and content are required' },
        { status: 400 }
      );
    }

    // Extract data from request
    const { documentType, content, metadata } = body;

    // Validate document based on type
    const validationResult = await validateDocument(documentType, content, metadata);

    // Store validation result if document ID is provided
    if (metadata?.documentId) {
      await storeDocumentValidation(
        documentType,
        content,
        validationResult,
        metadata.documentId,
        user.id
      );

      // Create audit log
      await supabase
        .from('audit_logs')
        .insert({
          action: 'document.validate',
          resource_type: 'document',
          resource_id: metadata.documentId,
          user_id: user.id,
          details: {
            document_type: documentType,
            is_valid: validationResult.isValid
          }
        });
    }

    return NextResponse.json(validationResult);
  } catch (error: any) {
    console.error('Error validating document:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handles the new API format for document validation
 */
async function handleNewApiFormat(request: NextRequest, userId: string) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.document_id) {
      return NextResponse.json(
        { error: 'document_id is required' },
        { status: 400 }
      );
    }

    // Fetch document details
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', body.document_id)
      .single();

    if (documentError) {
      if (documentError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        );
      }

      console.error('Error fetching document:', documentError);
      return NextResponse.json(
        { error: 'Failed to fetch document', details: documentError.message },
        { status: 500 }
      );
    }

    // Get document content
    const { data: fileData, error: fileError } = await supabase.storage
      .from('documents')
      .download(document.file_path);

    if (fileError) {
      console.error('Error downloading document:', fileError);
      return NextResponse.json(
        { error: 'Failed to download document', details: fileError.message },
        { status: 500 }
      );
    }

    // Extract text from document
    let documentText = '';
    let documentType = 'generic';

    if (document.file_type === 'application/pdf') {
      // For PDF files, we would use a PDF parsing library
      // This is a simplified example
      documentText = 'PDF content would be extracted here';
    } else if (document.file_type.startsWith('text/')) {
      // For text files, we can read the content directly
      documentText = await fileData.text();
    } else if (document.file_type.includes('word') || document.file_type.includes('office')) {
      // For Word documents, we would use a Word parsing library
      // This is a simplified example
      documentText = 'Word document content would be extracted here';
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type for validation' },
        { status: 400 }
      );
    }

    // Determine document type based on metadata
    if (document.tender_id) {
      documentType = 'tender';
    } else if (document.proposal_id) {
      documentType = 'proposal';
    } else if (document.type) {
      documentType = document.type;
    }

    // Get validation requirements
    let requirements = body.requirements;

    if (!requirements && body.tender_id) {
      // If requirements not provided but tender_id is, get requirements from tender
      const { data: tender, error: tenderError } = await supabase
        .from('tenders')
        .select('requirements')
        .eq('id', body.tender_id)
        .single();

      if (!tenderError && tender && tender.requirements) {
        requirements = tender.requirements;
      }
    }

    // Validate document
    const validationResult = await validateDocument(documentType, documentText, {
      documentId: body.document_id,
      requirements
    });

    // Store validation result
    const { data: validation, error: validationError } = await supabase
      .from('document_validations')
      .insert({
        document_id: body.document_id,
        validator_id: userId,
        validation_type: 'ai',
        requirements: requirements,
        result: validationResult,
        is_valid: validationResult.isValid,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (validationError) {
      console.error('Error storing validation result:', validationError);
      return NextResponse.json(
        { error: 'Failed to store validation result', details: validationError.message },
        { status: 500 }
      );
    }

    // Update document validation status
    await supabase
      .from('documents')
      .update({
        validation_status: validationResult.isValid ? 'valid' : 'invalid',
        last_validated_at: new Date().toISOString()
      })
      .eq('id', body.document_id);

    // Create audit log
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        action: 'document.validate',
        resource_type: 'document',
        resource_id: body.document_id,
        user_id: userId,
        details: {
          validation_id: validation.id,
          is_valid: validationResult.isValid
        }
      });

    if (auditError) {
      console.error('Error creating audit log:', auditError);
      // Continue anyway, as the validation was completed successfully
    }

    return NextResponse.json({
      validation_id: validation.id,
      document_id: body.document_id,
      is_valid: validationResult.isValid,
      validation_result: validationResult
    });
  } catch (error: any) {
    console.error('Error in handleNewApiFormat:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Validates a document based on its type and content
 */
async function validateDocument(documentType: string, content: string, metadata?: any) {
  // Document type-specific validation rules
  const validationRules = getValidationRules(documentType);

  // Initialize validation results
  const results = {
    isValid: true,
    score: 0,
    issues: [] as any[],
    suggestions: [] as string[],
    missingElements: [] as string[],
    compliance: {
      legal: { score: 0, issues: [] as string[] },
      procurement: { score: 0, issues: [] as string[] },
      technical: { score: 0, issues: [] as string[] }
    }
  };

  // Perform content analysis
  const contentAnalysis = analyzeDocumentContent(documentType, content);

  // Check for required elements
  for (const rule of validationRules.requiredElements) {
    if (!contentAnalysis.elements.includes(rule.element)) {
      results.isValid = false;
      results.missingElements.push(rule.element);
      results.issues.push({
        type: 'missing_element',
        severity: rule.severity,
        message: `Missing required element: ${rule.element}`,
        description: rule.description
      });
    }
  }

  // Check for compliance issues
  for (const rule of validationRules.complianceRules) {
    const complianceCheck = checkCompliance(rule, content);
    if (!complianceCheck.compliant) {
      results.compliance[rule.category].issues.push(complianceCheck.issue);
      results.issues.push({
        type: 'compliance',
        category: rule.category,
        severity: rule.severity,
        message: complianceCheck.issue
      });

      if (rule.severity === 'critical') {
        results.isValid = false;
      }
    }
  }

  // Calculate scores
  results.compliance.legal.score = calculateCategoryScore(results.compliance.legal.issues, validationRules.complianceRules.filter(r => r.category === 'legal'));
  results.compliance.procurement.score = calculateCategoryScore(results.compliance.procurement.issues, validationRules.complianceRules.filter(r => r.category === 'procurement'));
  results.compliance.technical.score = calculateCategoryScore(results.compliance.technical.issues, validationRules.complianceRules.filter(r => r.category === 'technical'));

  // Calculate overall score
  results.score = (
    results.compliance.legal.score * 0.4 +
    results.compliance.procurement.score * 0.4 +
    results.compliance.technical.score * 0.2
  );

  // Generate suggestions
  results.suggestions = generateSuggestions(results.issues, documentType);

  return results;
}

/**
 * Returns validation rules for a specific document type
 */
function getValidationRules(documentType: string) {
  // Common rules for all document types
  const commonRules = {
    requiredElements: [
      {
        element: 'title',
        severity: 'critical',
        description: 'Document must have a clear title'
      },
      {
        element: 'date',
        severity: 'critical',
        description: 'Document must have a date'
      }
    ],
    complianceRules: [
      {
        id: 'legal_1',
        category: 'legal',
        severity: 'critical',
        check: 'contains',
        pattern: 'confidentiality',
        description: 'Document should mention confidentiality'
      },
      {
        id: 'procurement_1',
        category: 'procurement',
        severity: 'warning',
        check: 'contains',
        pattern: 'deadline',
        description: 'Document should specify deadlines'
      }
    ]
  };

  // Document type-specific rules
  switch (documentType) {
    case 'tender':
      return {
        requiredElements: [
          ...commonRules.requiredElements,
          {
            element: 'scope',
            severity: 'critical',
            description: 'Tender must define the scope of work'
          },
          {
            element: 'requirements',
            severity: 'critical',
            description: 'Tender must list requirements'
          },
          {
            element: 'evaluation_criteria',
            severity: 'critical',
            description: 'Tender must specify evaluation criteria'
          },
          {
            element: 'submission_instructions',
            severity: 'critical',
            description: 'Tender must provide submission instructions'
          }
        ],
        complianceRules: [
          ...commonRules.complianceRules,
          {
            id: 'tender_1',
            category: 'procurement',
            severity: 'critical',
            check: 'contains',
            pattern: 'submission deadline',
            description: 'Tender must specify submission deadline'
          },
          {
            id: 'tender_2',
            category: 'legal',
            severity: 'critical',
            check: 'contains',
            pattern: 'eligibility',
            description: 'Tender must specify eligibility criteria'
          },
          {
            id: 'tender_3',
            category: 'technical',
            severity: 'warning',
            check: 'contains',
            pattern: 'technical specifications',
            description: 'Tender should include technical specifications'
          }
        ]
      };

    case 'proposal':
      return {
        requiredElements: [
          ...commonRules.requiredElements,
          {
            element: 'executive_summary',
            severity: 'critical',
            description: 'Proposal must include an executive summary'
          },
          {
            element: 'approach',
            severity: 'critical',
            description: 'Proposal must describe the approach'
          },
          {
            element: 'timeline',
            severity: 'warning',
            description: 'Proposal should include a timeline'
          },
          {
            element: 'budget',
            severity: 'critical',
            description: 'Proposal must include a budget'
          }
        ],
        complianceRules: [
          ...commonRules.complianceRules,
          {
            id: 'proposal_1',
            category: 'procurement',
            severity: 'critical',
            check: 'contains',
            pattern: 'cost',
            description: 'Proposal must specify costs'
          },
          {
            id: 'proposal_2',
            category: 'technical',
            severity: 'warning',
            check: 'contains',
            pattern: 'methodology',
            description: 'Proposal should describe methodology'
          }
        ]
      };

    case 'contract':
      return {
        requiredElements: [
          ...commonRules.requiredElements,
          {
            element: 'parties',
            severity: 'critical',
            description: 'Contract must identify all parties'
          },
          {
            element: 'terms',
            severity: 'critical',
            description: 'Contract must specify terms'
          },
          {
            element: 'signatures',
            severity: 'critical',
            description: 'Contract must include signature blocks'
          }
        ],
        complianceRules: [
          ...commonRules.complianceRules,
          {
            id: 'contract_1',
            category: 'legal',
            severity: 'critical',
            check: 'contains',
            pattern: 'termination',
            description: 'Contract must include termination clauses'
          },
          {
            id: 'contract_2',
            category: 'legal',
            severity: 'critical',
            check: 'contains',
            pattern: 'dispute resolution',
            description: 'Contract must include dispute resolution process'
          }
        ]
      };

    default:
      return commonRules;
  }
}

/**
 * Analyzes document content to identify elements and structure
 */
function analyzeDocumentContent(documentType: string, content: string) {
  // This would be replaced with actual NLP/AI analysis
  // For now, we'll use a simple keyword-based approach

  const elements = [];

  // Check for common elements
  if (content.toLowerCase().includes('title') || content.match(/^.+\n/)) {
    elements.push('title');
  }

  if (content.toLowerCase().includes('date') || content.match(/\d{1,2}\/\d{1,2}\/\d{4}/)) {
    elements.push('date');
  }

  // Check for document type-specific elements
  switch (documentType) {
    case 'tender':
      if (content.toLowerCase().includes('scope') || content.toLowerCase().includes('scope of work')) {
        elements.push('scope');
      }

      if (content.toLowerCase().includes('requirements') || content.toLowerCase().includes('specifications')) {
        elements.push('requirements');
      }

      if (content.toLowerCase().includes('evaluation criteria') || content.toLowerCase().includes('selection criteria')) {
        elements.push('evaluation_criteria');
      }

      if (content.toLowerCase().includes('submission') || content.toLowerCase().includes('how to submit')) {
        elements.push('submission_instructions');
      }
      break;

    case 'proposal':
      if (content.toLowerCase().includes('executive summary') || content.toLowerCase().includes('overview')) {
        elements.push('executive_summary');
      }

      if (content.toLowerCase().includes('approach') || content.toLowerCase().includes('methodology')) {
        elements.push('approach');
      }

      if (content.toLowerCase().includes('timeline') || content.toLowerCase().includes('schedule')) {
        elements.push('timeline');
      }

      if (content.toLowerCase().includes('budget') || content.toLowerCase().includes('cost')) {
        elements.push('budget');
      }
      break;

    case 'contract':
      if (content.toLowerCase().includes('parties') || content.toLowerCase().includes('between')) {
        elements.push('parties');
      }

      if (content.toLowerCase().includes('terms') || content.toLowerCase().includes('conditions')) {
        elements.push('terms');
      }

      if (content.toLowerCase().includes('signature') || content.toLowerCase().includes('signed')) {
        elements.push('signatures');
      }
      break;
  }

  return {
    elements,
    wordCount: content.split(/\s+/).length,
    complexity: calculateTextComplexity(content)
  };
}

/**
 * Checks if content complies with a specific rule
 */
function checkCompliance(rule: any, content: string) {
  const lowerContent = content.toLowerCase();

  switch (rule.check) {
    case 'contains':
      if (!lowerContent.includes(rule.pattern.toLowerCase())) {
        return {
          compliant: false,
          issue: `Document does not contain required content: ${rule.description}`
        };
      }
      break;

    case 'not_contains':
      if (lowerContent.includes(rule.pattern.toLowerCase())) {
        return {
          compliant: false,
          issue: `Document contains prohibited content: ${rule.description}`
        };
      }
      break;

    case 'regex':
      const regex = new RegExp(rule.pattern, 'i');
      if (!regex.test(content)) {
        return {
          compliant: false,
          issue: `Document does not match required pattern: ${rule.description}`
        };
      }
      break;
  }

  return { compliant: true };
}

/**
 * Calculates a score for a specific compliance category
 */
function calculateCategoryScore(issues: string[], rules: any[]) {
  if (rules.length === 0) return 100;

  const criticalIssues = issues.filter(issue =>
    rules.some(rule => rule.severity === 'critical' && issue.includes(rule.description))
  ).length;

  const warningIssues = issues.filter(issue =>
    rules.some(rule => rule.severity === 'warning' && issue.includes(rule.description))
  ).length;

  const criticalRules = rules.filter(rule => rule.severity === 'critical').length;
  const warningRules = rules.filter(rule => rule.severity === 'warning').length;

  // Calculate score with critical issues having more weight
  let score = 100;

  if (criticalRules > 0) {
    score -= (criticalIssues / criticalRules) * 70;
  }

  if (warningRules > 0) {
    score -= (warningIssues / warningRules) * 30;
  }

  return Math.max(0, Math.round(score));
}

/**
 * Calculates text complexity using readability metrics
 */
function calculateTextComplexity(text: string) {
  // Simple implementation - would be replaced with actual readability metrics
  const words = text.split(/\s+/).length;
  const sentences = text.split(/[.!?]+/).length;
  const longWords = text.split(/\s+/).filter(word => word.length > 6).length;

  // Simple readability score (higher is more complex)
  const complexity = (words / sentences) + (longWords / words) * 100;

  return {
    score: Math.min(100, Math.round(complexity)),
    level: complexity > 25 ? 'high' : complexity > 15 ? 'medium' : 'low'
  };
}

/**
 * Generates improvement suggestions based on identified issues
 */
function generateSuggestions(issues: any[], documentType: string) {
  const suggestions: string[] = [];

  // Generate suggestions based on issue type and severity
  for (const issue of issues) {
    if (issue.type === 'missing_element') {
      suggestions.push(`Add a ${issue.message.split(':')[1].trim()} section to your document.`);
    } else if (issue.type === 'compliance' && issue.severity === 'critical') {
      suggestions.push(`Critical: ${issue.message}`);
    }
  }

  // Add document type-specific suggestions
  switch (documentType) {
    case 'tender':
      if (!issues.some(i => i.message.includes('evaluation criteria'))) {
        suggestions.push('Consider adding more detailed evaluation criteria to attract better proposals.');
      }
      break;

    case 'proposal':
      if (!issues.some(i => i.message.includes('executive summary'))) {
        suggestions.push('Strengthen your executive summary to highlight key benefits.');
      }
      break;

    case 'contract':
      if (!issues.some(i => i.message.includes('dispute resolution'))) {
        suggestions.push('Include a clear dispute resolution process to prevent future conflicts.');
      }
      break;
  }

  return suggestions;
}
