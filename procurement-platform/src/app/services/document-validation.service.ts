import crypto from 'crypto';
import { Document } from '../types/procurement';

export interface ValidationResult {
  valid: boolean;
  integrity: boolean;
  format: { valid: boolean; errors: string[] };
  security: { clean: boolean; threats: string[] };
  metadata: { valid: boolean; errors: string[] };
  content?: { valid: boolean; errors: string[] };
  timestamp: number;
  validationId: string;
}

export class DocumentValidationService {
  /**
   * Validates a document's integrity by checking its hash
   */
  static validateIntegrity(document: Document, originalHash: string): boolean {
    const calculatedHash = this.calculateDocumentHash(document);
    return calculatedHash === originalHash;
  }

  /**
   * Calculates a document's hash for integrity verification
   */
  static calculateDocumentHash(document: Document): string {
    // In a real implementation, this would hash the actual file content
    // For now, we'll use a mock implementation
    const hash = crypto.createHash('sha256');
    hash.update(document.fileUrl + document.fileSize + document.fileType);
    return hash.digest('hex');
  }

  /**
   * Verifies a document's digital signature
   */
  static verifyDigitalSignature(document: Document, signature: string): boolean {
    // In a real implementation, this would use a digital signature verification library
    // For now, we'll use a mock implementation
    return true; // Mock successful verification
  }

  /**
   * Validates document format based on file type
   */
  static validateFormat(document: Document): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ];

    if (!document.fileType || !allowedTypes.includes(document.fileType)) {
      errors.push(`Invalid file type: ${document.fileType}. Allowed types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG`);
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (document.fileSize > maxSize) {
      errors.push(`File size exceeds maximum allowed (10MB): ${Math.round(document.fileSize / (1024 * 1024))}MB`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Scans document for malware (mock implementation)
   */
  static async scanForMalware(document: Document): Promise<{ clean: boolean; threats: string[] }> {
    // In a real implementation, this would integrate with a virus scanning API
    // For now, we'll use a mock implementation that randomly flags some documents
    // to demonstrate the functionality

    // Mock implementation - 99% of documents are clean
    const isMalicious = Math.random() < 0.01;

    return {
      clean: !isMalicious,
      threats: isMalicious ? ['Potential malware detected'] : []
    };
  }

  /**
   * Validates document content (mock implementation)
   * In a real implementation, this would analyze the content for completeness,
   * required sections, etc.
   */
  static validateContent(document: Document): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Mock implementation - randomly flag some documents with content issues
    // to demonstrate the functionality
    const hasContentIssue = Math.random() < 0.05;

    if (hasContentIssue) {
      // Simulate different types of content issues
      const issueTypes = [
        'Missing required section',
        'Incomplete information',
        'Inconsistent data',
        'Invalid formatting',
        'Corrupted content'
      ];

      const randomIssue = issueTypes[Math.floor(Math.random() * issueTypes.length)];
      errors.push(`Content validation issue: ${randomIssue}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Performs comprehensive validation on a document
   */
  static async validateDocument(document: Document, originalHash?: string): Promise<ValidationResult> {
    // Format validation
    const formatValidation = this.validateFormat(document);

    // Security scan
    const securityScan = await this.scanForMalware(document);

    // Integrity check
    const integrityValid = originalHash ? this.validateIntegrity(document, originalHash) : true;

    // Metadata validation
    const metadataValidation = this.validateMetadata(document);

    // Content validation
    const contentValidation = this.validateContent(document);

    // Generate a unique validation ID
    const validationId = crypto.randomBytes(16).toString('hex');

    // Overall validation result
    const isValid = formatValidation.valid &&
                   securityScan.clean &&
                   integrityValid &&
                   metadataValidation.valid &&
                   contentValidation.valid;

    return {
      valid: isValid,
      integrity: integrityValid,
      format: formatValidation,
      security: securityScan,
      metadata: metadataValidation,
      content: contentValidation,
      timestamp: Date.now(),
      validationId
    };
  }

  /**
   * Validates document metadata
   */
  static validateMetadata(document: Document): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required metadata
    if (!document.name) errors.push('Document name is required');
    if (!document.type) errors.push('Document type is required');
    if (!document.uploadedBy) errors.push('Document uploader information is required');
    if (!document.uploadedAt) errors.push('Document upload date is required');

    // Validate document name length
    if (document.name && (document.name.length < 3 || document.name.length > 100)) {
      errors.push('Document name must be between 3 and 100 characters');
    }

    // Validate document type
    const validTypes: string[] = [
      'tender_specification',
      'technical_requirements',
      'financial_offer',
      'contract',
      'proposal',
      'company_profile',
      'cv',
      'certificate',
      'reference',
      'other'
    ];

    if (document.type && !validTypes.includes(document.type)) {
      errors.push(`Invalid document type: ${document.type}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
