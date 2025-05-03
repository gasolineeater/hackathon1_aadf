import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Mock validation data store - in a real app, this would be a database
const mockValidationStore: Record<string, any> = {
  'val-1-1': {
    documentId: 'doc-1',
    documentName: 'Technical Proposal',
    documentType: 'proposal',
    fileHash: '8f4e7d6c5b4a3e2d1c0b9a8f7e6d5c4b3a2e1d0c9b8a7f6e5d4c3b2a1e0d9c8b7',
    validationResult: {
      valid: true,
      integrity: true,
      format: { valid: true, errors: [] },
      security: { clean: true, threats: [] },
      metadata: { valid: true, errors: [] },
      content: { valid: true, errors: [] },
      timestamp: Date.now() - 86400000 * 2, // 2 days ago
      validationId: 'val-1-1',
    },
    validatedBy: 'system',
    organization: 'AADF Procurement Platform',
  },
  'val-1-2': {
    documentId: 'doc-1',
    documentName: 'Technical Proposal',
    documentType: 'proposal',
    fileHash: '8f4e7d6c5b4a3e2d1c0b9a8f7e6d5c4b3a2e1d0c9b8a7f6e5d4c3b2a1e0d9c8b7',
    validationResult: {
      valid: false,
      integrity: true,
      format: { valid: true, errors: [] },
      security: { clean: false, threats: ['Potential malware detected'] },
      metadata: { valid: true, errors: [] },
      content: { valid: true, errors: [] },
      timestamp: Date.now() - 86400000 * 3, // 3 days ago
      validationId: 'val-1-2',
    },
    validatedBy: 'system',
    organization: 'AADF Procurement Platform',
  },
  'val-2-1': {
    documentId: 'doc-2',
    documentName: 'Financial Offer',
    documentType: 'financial_offer',
    fileHash: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1e2f',
    validationResult: {
      valid: true,
      integrity: true,
      format: { valid: true, errors: [] },
      security: { clean: true, threats: [] },
      metadata: { valid: true, errors: [] },
      content: { valid: true, errors: [] },
      timestamp: Date.now() - 86400000, // 1 day ago
      validationId: 'val-2-1',
    },
    validatedBy: 'system',
    organization: 'AADF Procurement Platform',
  },
  'val-3-1': {
    documentId: 'doc-3',
    documentName: 'Company Profile',
    documentType: 'company_profile',
    fileHash: '9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a3z2y1x0w9v8u',
    validationResult: {
      valid: false,
      integrity: true,
      format: { valid: true, errors: [] },
      security: { clean: true, threats: [] },
      metadata: { valid: true, errors: [] },
      content: { valid: false, errors: ['Missing required section'] },
      timestamp: Date.now() - 86400000 / 2, // 12 hours ago
      validationId: 'val-3-1',
    },
    validatedBy: 'system',
    organization: 'AADF Procurement Platform',
  },
  'val-3-2': {
    documentId: 'doc-3',
    documentName: 'Company Profile',
    documentType: 'company_profile',
    fileHash: '9z8y7x6w5v4u3t2s1r0q9p8o7n6m5l4k3j2i1h0g9f8e7d6c5b4a3z2y1x0w9v8u',
    validationResult: {
      valid: false,
      integrity: true,
      format: { valid: false, errors: ['Invalid file type: application/octet-stream. Allowed types: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG'] },
      security: { clean: true, threats: [] },
      metadata: { valid: true, errors: [] },
      timestamp: Date.now() - 86400000, // 1 day ago
      validationId: 'val-3-2',
    },
    validatedBy: 'system',
    organization: 'AADF Procurement Platform',
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const validationId = params.id;
  
  // Check if validation exists
  if (!mockValidationStore[validationId]) {
    return NextResponse.json(
      { error: 'Validation certificate not found' },
      { status: 404 }
    );
  }
  
  const validation = mockValidationStore[validationId];
  
  // Generate certificate HTML
  const certificateHtml = generateCertificateHtml(validation);
  
  // Return HTML response
  return new NextResponse(certificateHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}

function generateCertificateHtml(validation: any): string {
  const {
    documentId,
    documentName,
    documentType,
    fileHash,
    validationResult,
    validatedBy,
    organization,
  } = validation;
  
  const timestamp = new Date(validationResult.timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
  
  // Generate a verification code
  const verificationCode = crypto
    .createHash('sha256')
    .update(validationResult.validationId + fileHash)
    .digest('hex')
    .substring(0, 8)
    .toUpperCase();
  
  // Format document type
  const formatDocumentType = (type: string): string => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document Validation Certificate</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .certificate {
          border: 2px solid #0056a4;
          padding: 30px;
          position: relative;
          background-color: #f9f9f9;
        }
        .certificate::before {
          content: '';
          position: absolute;
          top: 5px;
          left: 5px;
          right: 5px;
          bottom: 5px;
          border: 1px solid #0056a4;
          pointer-events: none;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #0056a4;
          margin-bottom: 5px;
        }
        .header p {
          color: #666;
          font-size: 18px;
          margin-top: 0;
        }
        .content {
          margin-bottom: 30px;
        }
        .content h2 {
          color: #0056a4;
          border-bottom: 1px solid #ddd;
          padding-bottom: 5px;
        }
        .content p {
          margin: 5px 0;
        }
        .content .label {
          font-weight: bold;
          display: inline-block;
          width: 180px;
        }
        .validation-results {
          margin-top: 20px;
        }
        .validation-item {
          margin-bottom: 10px;
        }
        .validation-item .status {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: bold;
        }
        .status.pass {
          background-color: #d4edda;
          color: #155724;
        }
        .status.fail {
          background-color: #f8d7da;
          color: #721c24;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          font-size: 14px;
          color: #666;
        }
        .verification {
          text-align: center;
          margin-top: 30px;
          padding: 15px;
          background-color: #e9ecef;
          border-radius: 4px;
        }
        .verification-code {
          font-family: monospace;
          font-size: 18px;
          letter-spacing: 2px;
          font-weight: bold;
          color: #0056a4;
        }
        .seal {
          text-align: center;
          margin-top: 30px;
        }
        .seal svg {
          width: 100px;
          height: 100px;
        }
        .qr-code {
          text-align: center;
          margin-top: 20px;
        }
        .qr-code img {
          width: 150px;
          height: 150px;
        }
        @media print {
          body {
            padding: 0;
          }
          .certificate {
            border: none;
          }
          .certificate::before {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">
          <h1>Document Validation Certificate</h1>
          <p>AADF Procurement Platform</p>
        </div>
        
        <div class="content">
          <h2>Document Information</h2>
          <p><span class="label">Document Name:</span> ${documentName}</p>
          <p><span class="label">Document Type:</span> ${formatDocumentType(documentType)}</p>
          <p><span class="label">Document ID:</span> ${documentId}</p>
          <p><span class="label">File Hash:</span> ${fileHash}</p>
          <p><span class="label">Validation ID:</span> ${validationResult.validationId}</p>
          <p><span class="label">Validation Date:</span> ${timestamp}</p>
          <p><span class="label">Validated By:</span> ${validatedBy}</p>
          
          <div class="validation-results">
            <h2>Validation Results</h2>
            <p><span class="label">Overall Status:</span> 
              <span class="status ${validationResult.valid ? 'pass' : 'fail'}">
                ${validationResult.valid ? 'VALID' : 'INVALID'}
              </span>
            </p>
            
            <div class="validation-item">
              <p><span class="label">Integrity Check:</span> 
                <span class="status ${validationResult.integrity ? 'pass' : 'fail'}">
                  ${validationResult.integrity ? 'PASSED' : 'FAILED'}
                </span>
              </p>
            </div>
            
            <div class="validation-item">
              <p><span class="label">Format Validation:</span> 
                <span class="status ${validationResult.format.valid ? 'pass' : 'fail'}">
                  ${validationResult.format.valid ? 'PASSED' : 'FAILED'}
                </span>
              </p>
              ${!validationResult.format.valid && validationResult.format.errors.length > 0 ? `
                <ul>
                  ${validationResult.format.errors.map((error: string) => `<li>${error}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
            
            <div class="validation-item">
              <p><span class="label">Security Scan:</span> 
                <span class="status ${validationResult.security.clean ? 'pass' : 'fail'}">
                  ${validationResult.security.clean ? 'PASSED' : 'FAILED'}
                </span>
              </p>
              ${!validationResult.security.clean && validationResult.security.threats.length > 0 ? `
                <ul>
                  ${validationResult.security.threats.map((threat: string) => `<li>${threat}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
            
            <div class="validation-item">
              <p><span class="label">Metadata Validation:</span> 
                <span class="status ${validationResult.metadata.valid ? 'pass' : 'fail'}">
                  ${validationResult.metadata.valid ? 'PASSED' : 'FAILED'}
                </span>
              </p>
              ${!validationResult.metadata.valid && validationResult.metadata.errors.length > 0 ? `
                <ul>
                  ${validationResult.metadata.errors.map((error: string) => `<li>${error}</li>`).join('')}
                </ul>
              ` : ''}
            </div>
            
            ${validationResult.content ? `
              <div class="validation-item">
                <p><span class="label">Content Validation:</span> 
                  <span class="status ${validationResult.content.valid ? 'pass' : 'fail'}">
                    ${validationResult.content.valid ? 'PASSED' : 'FAILED'}
                  </span>
                </p>
                ${!validationResult.content.valid && validationResult.content.errors.length > 0 ? `
                  <ul>
                    ${validationResult.content.errors.map((error: string) => `<li>${error}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="verification">
          <p>Verification Code</p>
          <div class="verification-code">${verificationCode}</div>
          <p>You can verify this certificate at <strong>https://aadf.org/verify-document</strong></p>
        </div>
        
        <div class="seal">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#0056a4" stroke-width="2" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#0056a4" stroke-width="1" />
            <text x="50" y="45" text-anchor="middle" font-size="12" font-weight="bold" fill="#0056a4">AADF</text>
            <text x="50" y="60" text-anchor="middle" font-size="8" fill="#0056a4">DOCUMENT VALIDATION</text>
          </svg>
        </div>
        
        <div class="footer">
          <p>This certificate was automatically generated by the AADF Procurement Platform.</p>
          <p>© ${new Date().getFullYear()} Albanian-American Development Foundation. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
