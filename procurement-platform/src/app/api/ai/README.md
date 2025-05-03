# AI API Documentation

This document provides information about the AI-powered APIs available in the AADF Procurement Platform.

## Overview

The platform includes several AI-powered APIs for analyzing tenders, proposals, and matching vendors to tenders. These APIs use natural language processing and machine learning techniques to provide insights and recommendations.

## Available Endpoints

### Analysis Endpoints

1. **Base AI API Information** (`GET /api/ai`)
2. **Document Validation** (`POST /api/ai/validate-document`)
3. **Tender Evaluation** (`POST /api/ai/evaluate-tender`)
4. **Vendor Matching** (`POST /api/ai/match-vendors`)
5. **Proposal Analysis** (`POST /api/ai/analyze-proposal`)

### Retrieval Endpoints

6. **Get Document Validation** (`GET /api/ai/analyses/document/[id]`)
7. **Get Tender Evaluation** (`GET /api/ai/analyses/tender/[id]`)
8. **Get Vendor Matches** (`GET /api/ai/analyses/matches/tender/[id]`)
9. **Get Proposal Analysis** (`GET /api/ai/analyses/proposal?proposalId=[id]&tenderId=[id]`)
10. **Get Tender Proposal Analyses** (`GET /api/ai/analyses/tender/[id]/proposals`)
11. **Get Vendor Proposal Analyses** (`GET /api/ai/analyses/vendor/[id]/proposals`)

### 1. Base AI API Information

**Endpoint:** `GET /api/ai`

Returns information about available AI endpoints.

**Response Example:**
```json
{
  "status": "online",
  "version": "1.0.0",
  "endpoints": [
    {
      "path": "/api/ai/validate-document",
      "description": "Validates procurement documents for compliance and completeness",
      "methods": ["POST"]
    },
    {
      "path": "/api/ai/evaluate-tender",
      "description": "Evaluates a tender against requirements and best practices",
      "methods": ["POST"]
    },
    {
      "path": "/api/ai/match-vendors",
      "description": "Finds the best vendor matches for a specific tender",
      "methods": ["POST"]
    },
    {
      "path": "/api/ai/analyze-proposal",
      "description": "Analyzes a vendor proposal against tender requirements",
      "methods": ["POST"]
    }
  ]
}
```

### 2. Document Validation API

**Endpoint:** `POST /api/ai/validate-document`

Validates procurement documents for compliance, completeness, and quality.

**Request Parameters:**
- `documentType` (required): Type of document to validate (e.g., "tender", "proposal", "contract")
- `content` (required): The full text content of the document
- `metadata` (optional): Additional metadata about the document

**Request Example:**
```json
{
  "documentType": "tender",
  "content": "Full text content of the tender document...",
  "metadata": {
    "title": "Web Application Development RFP",
    "category": "Information Technology",
    "budget": 75000
  }
}
```

**Response Example:**
```json
{
  "isValid": true,
  "score": 85,
  "issues": [
    {
      "type": "missing_element",
      "severity": "warning",
      "message": "Missing required element: timeline",
      "description": "Tender should include a timeline"
    }
  ],
  "suggestions": [
    "Add a timeline section to your document.",
    "Consider adding more detailed evaluation criteria to attract better proposals."
  ],
  "missingElements": ["timeline"],
  "compliance": {
    "legal": { "score": 90, "issues": [] },
    "procurement": { "score": 80, "issues": ["Document does not contain required content: Tender must specify submission deadline"] },
    "technical": { "score": 85, "issues": [] }
  }
}
```

### 3. Tender Evaluation API

**Endpoint:** `POST /api/ai/evaluate-tender`

Evaluates a tender against requirements and best practices.

**Request Parameters:**
- `tenderId` (optional): ID of the tender to evaluate (if stored in the database)
- `tenderContent` (required if tenderId not provided): The full text content of the tender
- `metadata` (optional): Additional metadata about the tender

**Request Example:**
```json
{
  "tenderContent": "Full text content of the tender document...",
  "metadata": {
    "title": "Web Application Development RFP",
    "category": "Information Technology",
    "budget": 75000,
    "deadline": "2023-06-30"
  }
}
```

**Response Example:**
```json
{
  "score": 78,
  "quality": {
    "clarity": { "score": 85, "feedback": "The tender is clearly written with straightforward language and well-defined requirements." },
    "completeness": { "score": 70, "feedback": "Missing essential elements: timeline, question process." },
    "fairness": { "score": 90, "feedback": "The tender appears fair and unbiased with clear evaluation criteria." },
    "specificity": { "score": 75, "feedback": "Lacks specific numerical requirements and specifications." }
  },
  "issues": [
    {
      "type": "completeness",
      "severity": "warning",
      "message": "Completeness issues: Missing essential elements: timeline, question process."
    }
  ],
  "recommendations": [
    "Add missing essential elements to ensure a complete tender document.",
    "Replace vague terms with specific, measurable requirements."
  ],
  "strengths": [
    "Clear and well-articulated requirements",
    "Fair and unbiased evaluation criteria"
  ],
  "weaknesses": [
    "Missing important tender elements",
    "Requirements lack specific details"
  ]
}
```

### 4. Vendor Matching API

**Endpoint:** `POST /api/ai/match-vendors`

Finds the best vendor matches for a specific tender.

**Request Parameters:**
- `tenderId` (optional): ID of the tender to match vendors to (if stored in the database)
- `tenderContent` (required if tenderId not provided): The full text content of the tender
- `metadata` (optional): Additional metadata about the tender

**Request Example:**
```json
{
  "tenderId": "123456",
  "metadata": {
    "title": "Web Application Development RFP",
    "category": "Information Technology",
    "budget": 75000
  }
}
```

**Response Example:**
```json
{
  "tenderRequirements": {
    "categories": ["Information Technology"],
    "expertise": ["Web Development", "Cloud Computing"],
    "estimatedValue": 75000,
    "location": null,
    "duration": { "value": 6, "unit": "month" },
    "certifications": ["ISO 9001"]
  },
  "vendorMatches": [
    {
      "vendorId": "v123",
      "vendorName": "TechSolutions Inc.",
      "compatibilityScore": 92,
      "matchDetails": {
        "categoryMatch": 100,
        "expertiseMatch": 90,
        "capacityMatch": 85,
        "performanceMatch": 95,
        "locationMatch": 80
      },
      "strengths": [
        "Strong category alignment with tender requirements",
        "Excellent expertise match with tender requirements",
        "Strong past performance record"
      ],
      "weaknesses": [],
      "recommendation": {
        "recommendation": "Highly Recommended",
        "rationale": "Excellent match for tender requirements with strong capabilities and experience."
      }
    }
  ],
  "topMatches": [
    // Top 5 matches
  ],
  "matchSummary": {
    "totalVendors": 15,
    "highlyCompatible": 3,
    "moderatelyCompatible": 7,
    "lowCompatible": 5,
    "averageScore": 68,
    "competitiveness": "High",
    "summary": "Found 15 potential vendors, with 3 highly compatible matches."
  }
}
```

### 5. Proposal Analysis API

**Endpoint:** `POST /api/ai/analyze-proposal`

Analyzes a vendor proposal against tender requirements.

**Request Parameters:**
- `proposalId` (optional): ID of the proposal to analyze (if stored in the database)
- `proposalContent` (required if proposalId not provided): The full text content of the proposal
- `tenderId` (optional): ID of the tender to analyze against (if stored in the database)
- `tenderContent` (required if tenderId not provided): The full text content of the tender
- `proposalMetadata` (optional): Additional metadata about the proposal
- `tenderMetadata` (optional): Additional metadata about the tender

**Request Example:**
```json
{
  "proposalContent": "Full text content of the proposal...",
  "tenderContent": "Full text content of the tender...",
  "proposalMetadata": {
    "title": "TechSolutions Proposal",
    "vendor": "TechSolutions Inc.",
    "submitted_at": "2023-06-25"
  },
  "tenderMetadata": {
    "title": "Web Application Development RFP",
    "category": "Information Technology",
    "budget": 75000,
    "deadline": "2023-06-30"
  }
}
```

**Response Example:**
```json
{
  "summary": {
    "proposalTitle": "TechSolutions Proposal",
    "tenderTitle": "Web Application Development RFP",
    "overallScore": 85,
    "complianceScore": 90,
    "evaluationScore": 82,
    "recommendation": "Accept",
    "keyFindings": [
      "Proposal addresses 90% of tender requirements.",
      "Strong overall proposal with evaluation score of 82/100.",
      "Proposal is within the specified budget constraints.",
      "Strongest in \"Technical approach and methodology\" (92/100).",
      "Weakest in \"Cost effectiveness\" (70/100)."
    ]
  },
  "compliance": {
    "compliant": true,
    "complianceScore": 90,
    "requirementResults": [
      // Detailed requirement results
    ],
    "mandatoryRequirements": {
      "meetsAllMandatory": true,
      "missingRequirements": [],
      "results": [
        // Detailed mandatory requirement results
      ]
    },
    "budgetCompliance": {
      "withinBudget": true,
      "proposedAmount": 68500,
      "difference": 6500,
      "percentageDifference": 9
    }
  },
  "evaluation": {
    "totalScore": 82,
    "criteriaScores": [
      {
        "criterion": "Technical approach and methodology",
        "score": 92,
        "weight": 40,
        "weightedScore": 36.8,
        "justification": "Excellent response that fully addresses the criterion with clear, specific details."
      },
      // Other criteria scores
    ]
  },
  "insights": {
    "strengths": [
      "Strong Technical approach and methodology (92/100)",
      "Comprehensive and well-structured proposal",
      "Clear understanding of tender requirements"
    ],
    "weaknesses": [
      "Weak Cost effectiveness (70/100)"
    ],
    "keyPhrases": [
      // Key phrases from the proposal
    ],
    "recommendations": [
      "Add more detail on cost-saving measures and efficiency improvements.",
      "Enhance the executive summary to highlight key differentiators and value proposition."
    ]
  },
  "recommendation": {
    "recommendation": "Accept",
    "confidence": 85,
    "justification": "The proposal fully addresses the tender requirements with high-quality responses to evaluation criteria."
  },
  "tenderRequirements": {
    // Extracted tender requirements
  }
}
```

### 6. Get Document Validation API

**Endpoint:** `GET /api/ai/analyses/document/[id]`

Retrieves the most recent document validation result for a specific document.

**Path Parameters:**
- `id` (required): The ID of the document

**Response Example:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "document_type": "tender",
  "document_id": "123456",
  "content_hash": "a1b2c3d4e5f6...",
  "is_valid": true,
  "score": 85,
  "issues": [
    {
      "type": "missing_element",
      "severity": "warning",
      "message": "Missing required element: timeline"
    }
  ],
  "suggestions": [
    "Add a timeline section to your document."
  ],
  "missing_elements": ["timeline"],
  "compliance": {
    "legal": { "score": 90, "issues": [] },
    "procurement": { "score": 80, "issues": ["Document does not contain required content: Tender must specify submission deadline"] },
    "technical": { "score": 85, "issues": [] }
  },
  "created_at": "2023-11-20T12:34:56.789Z"
}
```

### 7. Get Tender Evaluation API

**Endpoint:** `GET /api/ai/analyses/tender/[id]`

Retrieves the most recent tender evaluation result for a specific tender.

**Path Parameters:**
- `id` (required): The ID of the tender

**Response Example:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "tender_id": "123456",
  "content_hash": "a1b2c3d4e5f6...",
  "score": 78,
  "quality": {
    "clarity": { "score": 85, "feedback": "The tender is clearly written with straightforward language and well-defined requirements." },
    "completeness": { "score": 70, "feedback": "Missing essential elements: timeline, question process." },
    "fairness": { "score": 90, "feedback": "The tender appears fair and unbiased with clear evaluation criteria." },
    "specificity": { "score": 75, "feedback": "Lacks specific numerical requirements and specifications." }
  },
  "issues": [
    {
      "type": "completeness",
      "severity": "warning",
      "message": "Completeness issues: Missing essential elements: timeline, question process."
    }
  ],
  "recommendations": [
    "Add missing essential elements to ensure a complete tender document.",
    "Replace vague terms with specific, measurable requirements."
  ],
  "strengths": [
    "Clear and well-articulated requirements",
    "Fair and unbiased evaluation criteria"
  ],
  "weaknesses": [
    "Missing important tender elements",
    "Requirements lack specific details"
  ],
  "created_at": "2023-11-20T12:34:56.789Z"
}
```

### 8. Get Vendor Matches API

**Endpoint:** `GET /api/ai/analyses/matches/tender/[id]`

Retrieves vendor matching results for a specific tender.

**Path Parameters:**
- `id` (required): The ID of the tender

**Response Example:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "tender_id": "123456",
    "vendor_id": "v123",
    "compatibility_score": 92,
    "match_details": {
      "categoryMatch": 100,
      "expertiseMatch": 90,
      "capacityMatch": 85,
      "performanceMatch": 95,
      "locationMatch": 80
    },
    "strengths": [
      "Strong category alignment with tender requirements",
      "Excellent expertise match with tender requirements",
      "Strong past performance record"
    ],
    "weaknesses": [],
    "recommendation": "Highly Recommended",
    "created_at": "2023-11-20T12:34:56.789Z",
    "updated_at": "2023-11-20T12:34:56.789Z",
    "vendors": {
      "id": "v123",
      "name": "TechSolutions Inc.",
      "contact_person": "John Doe",
      "contact_email": "john@techsolutions.com"
    }
  }
]
```

### 9. Get Proposal Analysis API

**Endpoint:** `GET /api/ai/analyses/proposal?proposalId=[id]&tenderId=[id]`

Retrieves the most recent proposal analysis result for a specific proposal and tender.

**Query Parameters:**
- `proposalId` (required): The ID of the proposal
- `tenderId` (required): The ID of the tender

**Response Example:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440003",
  "proposal_id": "p123",
  "tender_id": "123456",
  "content_hash": "a1b2c3d4e5f6...",
  "overall_score": 85,
  "compliance_score": 90,
  "evaluation_score": 82,
  "recommendation": "Accept",
  "key_findings": [
    "Proposal addresses 90% of tender requirements.",
    "Strong overall proposal with evaluation score of 82/100."
  ],
  "compliance": {
    "compliant": true,
    "complianceScore": 90,
    "requirementResults": [
      // Detailed requirement results
    ],
    "mandatoryRequirements": {
      "meetsAllMandatory": true,
      "missingRequirements": []
    },
    "budgetCompliance": {
      "withinBudget": true,
      "proposedAmount": 68500
    }
  },
  "evaluation": {
    "totalScore": 82,
    "criteriaScores": [
      {
        "criterion": "Technical approach and methodology",
        "score": 92,
        "weight": 40,
        "weightedScore": 36.8,
        "justification": "Excellent response that fully addresses the criterion with clear, specific details."
      }
    ]
  },
  "insights": {
    "strengths": [
      "Strong Technical approach and methodology (92/100)",
      "Comprehensive and well-structured proposal"
    ],
    "weaknesses": [
      "Weak Cost effectiveness (70/100)"
    ],
    "recommendations": [
      "Add more detail on cost-saving measures and efficiency improvements."
    ]
  },
  "created_at": "2023-11-20T12:34:56.789Z",
  "updated_at": "2023-11-20T12:34:56.789Z"
}
```

### 10. Get Tender Proposal Analyses API

**Endpoint:** `GET /api/ai/analyses/tender/[id]/proposals`

Retrieves all proposal analyses for a specific tender.

**Path Parameters:**
- `id` (required): The ID of the tender

**Response Example:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "proposal_id": "p123",
    "tender_id": "123456",
    "overall_score": 85,
    "compliance_score": 90,
    "evaluation_score": 82,
    "recommendation": "Accept",
    "created_at": "2023-11-20T12:34:56.789Z",
    "proposals": {
      "id": "p123",
      "title": "Web Application Development Proposal",
      "vendor_id": "v123",
      "vendors": {
        "id": "v123",
        "name": "TechSolutions Inc."
      }
    }
  },
  // Additional proposal analyses
]
```

### 11. Get Vendor Proposal Analyses API

**Endpoint:** `GET /api/ai/analyses/vendor/[id]/proposals`

Retrieves all proposal analyses for a specific vendor.

**Path Parameters:**
- `id` (required): The ID of the vendor

**Response Example:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "proposal_id": "p123",
    "tender_id": "123456",
    "overall_score": 85,
    "compliance_score": 90,
    "evaluation_score": 82,
    "recommendation": "Accept",
    "created_at": "2023-11-20T12:34:56.789Z",
    "proposals": {
      "id": "p123",
      "title": "Web Application Development Proposal",
      "submitted_at": "2023-06-25T10:30:00.000Z"
    },
    "tenders": {
      "id": "123456",
      "title": "Web Application Development RFP",
      "submission_deadline": "2023-06-30T23:59:59.000Z"
    }
  },
  // Additional proposal analyses
]
```

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200 OK`: Request successful
- `400 Bad Request`: Missing or invalid parameters
- `404 Not Found`: Resource not found (e.g., tender or proposal not found)
- `500 Internal Server Error`: Server-side error

Error responses include an `error` field with a description and optional `details` field with more information.

**Error Response Example:**
```json
{
  "error": "Missing required fields",
  "details": "Either proposalId or proposalContent, and either tenderId or tenderContent are required"
}
```

## Rate Limiting

The AI APIs are subject to rate limiting to prevent abuse. The current limits are:

- 100 requests per hour per IP address
- 1000 requests per day per IP address

Exceeding these limits will result in a `429 Too Many Requests` response.

## Authentication

All AI API endpoints require authentication. Requests must include a valid authentication token in the `Authorization` header.

```
Authorization: Bearer <token>
```

Unauthenticated requests will receive a `401 Unauthorized` response.

## Support

For questions or issues with the AI APIs, please contact support@aadf.org.
