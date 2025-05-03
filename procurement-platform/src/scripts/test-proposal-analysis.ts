/**
 * Test script for the proposal analysis API
 * 
 * Run with: npx ts-node -r tsconfig-paths/register src/scripts/test-proposal-analysis.ts
 */

// Sample tender content
const tenderContent = `
# Request for Proposal: Web Application Development

## Overview
AADF is seeking proposals for the development of a new web application to manage our procurement processes. The application should streamline the tender creation, submission, and evaluation processes.

## Scope of Work
The selected vendor will be responsible for:
- Designing and developing a web-based procurement management system
- Implementing user authentication and role-based access control
- Creating interfaces for tender creation, submission, and evaluation
- Developing an AI-powered evaluation system for proposals
- Providing documentation and training

## Technical Requirements
- The application must be developed using modern web technologies
- The system must be responsive and work on desktop and mobile devices
- The application must integrate with our existing database systems
- The system must include robust security features
- The application must be accessible according to WCAG 2.1 AA standards

## Qualifications
- Minimum of 5 years experience in web application development
- Experience with procurement systems is preferred
- Strong portfolio of similar projects
- Expertise in AI and machine learning technologies

## Evaluation Criteria
- Technical approach and methodology (40%)
- Qualifications and experience (25%)
- Project timeline and management approach (20%)
- Cost effectiveness (15%)

## Budget
The budget for this project is $50,000 - $75,000.

## Timeline
- Proposal submission deadline: June 30, 2023
- Project start date: July 15, 2023
- Expected completion: December 15, 2023

## Submission Requirements
Proposals must include:
- Company profile and qualifications
- Detailed technical approach
- Project timeline and milestones
- Budget breakdown
- References from similar projects
`;

// Sample proposal content
const proposalContent = `
# Web Application Development Proposal

## Executive Summary
Our company, TechSolutions, is pleased to submit this proposal for the development of AADF's procurement management web application. With our 8 years of experience in web application development and expertise in AI technologies, we are well-positioned to deliver a high-quality solution that meets all your requirements.

## Company Profile
TechSolutions has been developing web applications since 2015, with a focus on business process automation and AI-powered systems. We have successfully completed over 30 similar projects, including procurement systems for government agencies and private corporations.

## Technical Approach
We propose developing the procurement management system using the following technologies:
- Frontend: React.js with TypeScript for a responsive and modern user interface
- Backend: Node.js with Express for a robust API layer
- Database: PostgreSQL for reliable data storage
- AI Components: TensorFlow.js for proposal evaluation algorithms

Our development approach will follow these phases:
1. Requirements gathering and analysis
2. System architecture design
3. UI/UX design
4. Frontend and backend development
5. AI model development and integration
6. Testing and quality assurance
7. Deployment and training

## Key Features
- Secure user authentication with role-based access control
- Intuitive tender creation and management interface
- Vendor portal for proposal submission
- AI-powered proposal evaluation system
- Comprehensive reporting and analytics
- Mobile-responsive design

## Project Timeline
- Requirements and Design Phase: 4 weeks
- Development Phase: 12 weeks
- Testing and Refinement: 4 weeks
- Deployment and Training: 2 weeks

Total project duration: 22 weeks (completion by December 10, 2023)

## Budget
Our proposed budget for this project is $68,500, broken down as follows:
- Requirements and Design: $12,000
- Development: $38,000
- AI Model Development: $8,500
- Testing and QA: $6,000
- Deployment and Training: $4,000

## Team
Our project team will consist of:
- 1 Project Manager
- 2 Senior Developers
- 1 UI/UX Designer
- 1 AI Specialist
- 1 QA Engineer

## References
1. Department of Administration - Procurement System (2022)
2. Global Enterprises Inc. - Vendor Management Platform (2021)
3. City of Metropolis - Municipal Procurement Portal (2020)

We are confident that our expertise in web application development and AI technologies makes us the ideal partner for this project. We look forward to the opportunity to work with AADF on this important initiative.
`;

// Function to test the API
async function testProposalAnalysis() {
  try {
    console.log('Testing proposal analysis API...');
    
    const response = await fetch('http://localhost:3000/api/ai/analyze-proposal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tenderContent,
        proposalContent,
        tenderMetadata: {
          title: 'Web Application Development RFP',
          category: 'Information Technology',
          budget: 75000,
          deadline: '2023-06-30'
        },
        proposalMetadata: {
          title: 'TechSolutions Proposal',
          vendor: 'TechSolutions Inc.',
          submitted_at: '2023-06-25'
        }
      }),
    });
    
    const result = await response.json();
    
    console.log('\n=== PROPOSAL ANALYSIS RESULTS ===\n');
    console.log('Overall Score:', result.summary?.overallScore || 'N/A');
    console.log('Compliance Score:', result.summary?.complianceScore || 'N/A');
    console.log('Evaluation Score:', result.summary?.evaluationScore || 'N/A');
    console.log('Recommendation:', result.recommendation?.recommendation || 'N/A');
    
    console.log('\nKey Findings:');
    if (result.summary?.keyFindings) {
      result.summary.keyFindings.forEach((finding: string, index: number) => {
        console.log(`${index + 1}. ${finding}`);
      });
    }
    
    console.log('\nStrengths:');
    if (result.insights?.strengths) {
      result.insights.strengths.forEach((strength: string, index: number) => {
        console.log(`${index + 1}. ${strength}`);
      });
    }
    
    console.log('\nWeaknesses:');
    if (result.insights?.weaknesses) {
      result.insights.weaknesses.forEach((weakness: string, index: number) => {
        console.log(`${index + 1}. ${weakness}`);
      });
    }
    
    console.log('\nRecommendations:');
    if (result.insights?.recommendations) {
      result.insights.recommendations.forEach((recommendation: string, index: number) => {
        console.log(`${index + 1}. ${recommendation}`);
      });
    }
    
    console.log('\nDetailed Criteria Scores:');
    if (result.evaluation?.criteriaScores) {
      result.evaluation.criteriaScores.forEach((criteriaScore: any) => {
        console.log(`- ${criteriaScore.criterion}: ${criteriaScore.score}/100 (Weight: ${criteriaScore.weight}%)`);
      });
    }
    
    console.log('\n=== END OF ANALYSIS ===\n');
    
  } catch (error) {
    console.error('Error testing proposal analysis API:', error);
  }
}

// Run the test
testProposalAnalysis();
