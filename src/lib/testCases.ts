// Test cases for AI evaluation features

// Test case 1: Proposal with high compliance but some missing details
export const testCase1 = {
  name: "High Compliance Proposal",
  description: "A proposal that addresses most requirements but has some missing details",
  tender: {
    id: "test-tender-1",
    title: "IT Infrastructure Upgrade",
    description: "Upgrading the IT infrastructure for AADF offices",
    requirements: [
      "Cloud-based solution",
      "Integration with existing systems",
      "Mobile-friendly interfaces",
      "Data migration from legacy systems",
      "Security compliance with industry standards"
    ],
    budget: 150000,
    evaluation_criteria: [
      { name: "Technical approach", weight: 0.4 },
      { name: "Experience and qualifications", weight: 0.3 },
      { name: "Cost", weight: 0.2 },
      { name: "Timeline", weight: 0.1 }
    ]
  },
  proposal: {
    id: "test-proposal-1",
    title: "IT Infrastructure Upgrade Proposal",
    vendor: "Tech Solutions Ltd",
    content: `
      # IT Infrastructure Upgrade Proposal
      
      ## Executive Summary
      Tech Solutions Ltd is pleased to submit this proposal for the IT Infrastructure Upgrade project. Our team of experts will deliver a comprehensive cloud-based solution that meets all requirements.
      
      ## Approach
      We will implement a cloud-based solution using AWS that integrates with your existing systems. Our approach includes:
      - Initial assessment and planning
      - Cloud infrastructure setup
      - Integration with existing systems
      - Mobile-friendly interface development
      - Data migration from legacy systems
      - Comprehensive testing
      
      ## Timeline
      The project will be completed in 6 months, with major milestones at months 2, 4, and 6.
      
      ## Budget
      The total cost for this project is €145,000, broken down as follows:
      - Cloud infrastructure: €50,000
      - Integration development: €40,000
      - Mobile interface development: €25,000
      - Data migration: €20,000
      - Testing: €10,000
      
      ## Team
      Our team consists of 5 senior cloud engineers, 2 mobile developers, and 1 project manager, all with over 5 years of experience in similar projects.
    `,
    amount: 145000
  },
  expectedResults: {
    overallScore: 85,
    complianceScore: 90,
    evaluationScore: 82,
    recommendation: "Accept",
    strengths: [
      "Comprehensive cloud-based solution",
      "Integration with existing systems addressed",
      "Mobile-friendly interfaces included",
      "Data migration plan provided",
      "Experienced team with relevant expertise"
    ],
    weaknesses: [
      "Security compliance not explicitly addressed",
      "Limited details on testing methodology",
      "Timeline could be more detailed"
    ]
  }
};

// Test case 2: Proposal with low compliance and over budget
export const testCase2 = {
  name: "Low Compliance Proposal",
  description: "A proposal that misses several requirements and exceeds the budget",
  tender: {
    id: "test-tender-2",
    title: "Website Redesign",
    description: "Redesign of the AADF website",
    requirements: [
      "Responsive design",
      "Content management system",
      "SEO optimization",
      "Accessibility compliance",
      "Integration with social media"
    ],
    budget: 50000,
    evaluation_criteria: [
      { name: "Design quality", weight: 0.4 },
      { name: "Technical approach", weight: 0.3 },
      { name: "Cost", weight: 0.2 },
      { name: "Timeline", weight: 0.1 }
    ]
  },
  proposal: {
    id: "test-proposal-2",
    title: "Website Redesign Proposal",
    vendor: "Basic Web Design",
    content: `
      # Website Redesign Proposal
      
      ## Executive Summary
      Basic Web Design is pleased to submit this proposal for the Website Redesign project. Our team will create a beautiful new website for AADF.
      
      ## Approach
      We will create a custom website design with the following features:
      - Modern design elements
      - Custom graphics and animations
      - Mobile-responsive layout
      - Contact forms
      
      ## Timeline
      The project will be completed in 3 months.
      
      ## Budget
      The total cost for this project is €60,000, broken down as follows:
      - Design: €25,000
      - Development: €30,000
      - Testing: €5,000
      
      ## Team
      Our team consists of 2 designers and 2 developers.
    `,
    amount: 60000
  },
  expectedResults: {
    overallScore: 55,
    complianceScore: 40,
    evaluationScore: 65,
    recommendation: "Reject",
    strengths: [
      "Modern design elements proposed",
      "Mobile-responsive layout included",
      "Reasonable timeline"
    ],
    weaknesses: [
      "No mention of content management system",
      "SEO optimization not addressed",
      "Accessibility compliance not mentioned",
      "Social media integration missing",
      "Exceeds budget by 20%",
      "Limited team expertise information"
    ]
  }
};

// Test case 3: Perfect compliance proposal with innovative approach
export const testCase3 = {
  name: "Perfect Compliance Proposal",
  description: "A proposal that addresses all requirements with an innovative approach",
  tender: {
    id: "test-tender-3",
    title: "Digital Transformation Project",
    description: "Digital transformation of internal processes",
    requirements: [
      "Process automation",
      "Digital workflow implementation",
      "Training and knowledge transfer",
      "Change management support",
      "Integration with existing systems"
    ],
    budget: 200000,
    evaluation_criteria: [
      { name: "Technical approach", weight: 0.35 },
      { name: "Experience and qualifications", weight: 0.25 },
      { name: "Cost", weight: 0.2 },
      { name: "Timeline", weight: 0.1 },
      { name: "Innovation", weight: 0.1 }
    ]
  },
  proposal: {
    id: "test-proposal-3",
    title: "Digital Transformation Proposal",
    vendor: "Digital Innovators",
    content: `
      # Digital Transformation Proposal
      
      ## Executive Summary
      Digital Innovators is excited to submit this proposal for the Digital Transformation Project. Our team will deliver a comprehensive solution that transforms your internal processes using cutting-edge AI and automation technologies.
      
      ## Approach
      Our innovative approach includes:
      
      ### Process Automation
      We will implement AI-powered process automation using our proprietary DigiFlow platform, which can automate up to 80% of manual processes.
      
      ### Digital Workflow Implementation
      Our team will design and implement digital workflows that streamline operations and improve efficiency. These workflows will be customized to your specific needs and integrated with your existing systems.
      
      ### Training and Knowledge Transfer
      We provide comprehensive training programs for all staff levels, including:
      - Executive workshops
      - Department-specific training
      - End-user training
      - Train-the-trainer sessions
      
      ### Change Management Support
      Our change management experts will guide your organization through the transformation with:
      - Stakeholder analysis
      - Communication planning
      - Resistance management
      - Adoption monitoring
      
      ### Integration with Existing Systems
      We will seamlessly integrate with your existing systems using our advanced API framework and custom connectors.
      
      ## Innovation
      Our solution incorporates several innovative elements:
      - AI-powered process optimization
      - Predictive analytics for workflow improvements
      - Natural language processing for document analysis
      - Machine learning for continuous improvement
      
      ## Timeline
      The project will be completed in 8 months, with the following phases:
      - Month 1-2: Assessment and planning
      - Month 3-4: Process automation implementation
      - Month 5-6: Digital workflow implementation
      - Month 7: Training and knowledge transfer
      - Month 8: Change management and final deployment
      
      ## Budget
      The total cost for this project is €195,000, broken down as follows:
      - Process automation: €70,000
      - Digital workflow implementation: €60,000
      - Training and knowledge transfer: €25,000
      - Change management support: €25,000
      - Integration with existing systems: €15,000
      
      ## Team
      Our team consists of:
      - 3 Digital transformation consultants (10+ years experience)
      - 4 Process automation specialists (7+ years experience)
      - 2 Change management experts (8+ years experience)
      - 3 Integration developers (5+ years experience)
      - 1 Project manager (12 years experience)
      
      All team members are certified in relevant technologies and methodologies, including PMP, Agile, ITIL, and Six Sigma.
    `,
    amount: 195000
  },
  expectedResults: {
    overallScore: 95,
    complianceScore: 100,
    evaluationScore: 92,
    recommendation: "Accept",
    strengths: [
      "Addresses all requirements comprehensively",
      "Innovative AI-powered approach",
      "Detailed timeline with clear phases",
      "Highly experienced and certified team",
      "Comprehensive training and change management",
      "Within budget with good value for money"
    ],
    weaknesses: [
      "Timeline slightly longer than competitors",
      "Could provide more details on post-implementation support"
    ]
  }
};

// Test case 4: Vendor-Tender compatibility test
export const testCase4 = {
  name: "Vendor-Tender Compatibility",
  description: "Test the AI's ability to match vendors to tenders based on expertise and requirements",
  tender: {
    id: "test-tender-4",
    title: "Cybersecurity Assessment",
    description: "Comprehensive cybersecurity assessment of AADF systems",
    requirements: [
      "Vulnerability scanning",
      "Penetration testing",
      "Security policy review",
      "Risk assessment",
      "Remediation recommendations"
    ],
    budget: 75000
  },
  vendors: [
    {
      id: "test-vendor-1",
      name: "SecureTech Solutions",
      expertise: ["Cybersecurity", "Penetration Testing", "Risk Assessment", "Security Auditing"],
      pastProjects: [
        "Government Security Audit",
        "Financial Institution Penetration Testing",
        "Healthcare Security Assessment"
      ],
      certifications: ["ISO 27001", "CISSP", "CEH", "CISM"]
    },
    {
      id: "test-vendor-2",
      name: "General IT Consultants",
      expertise: ["IT Infrastructure", "Cloud Computing", "Network Management", "Basic Security"],
      pastProjects: [
        "Office Network Setup",
        "Cloud Migration",
        "IT Support Services"
      ],
      certifications: ["CompTIA A+", "Microsoft Certified"]
    },
    {
      id: "test-vendor-3",
      name: "Digital Marketing Agency",
      expertise: ["Web Design", "SEO", "Content Marketing", "Social Media"],
      pastProjects: [
        "Corporate Website Redesign",
        "E-commerce Platform",
        "Digital Marketing Campaign"
      ],
      certifications: ["Google Analytics", "HubSpot"]
    }
  ],
  expectedResults: [
    {
      vendorId: "test-vendor-1",
      compatibilityScore: 90,
      strengths: [
        "Directly relevant cybersecurity expertise",
        "Experience with similar security assessments",
        "Strong security certifications",
        "All required skills covered"
      ]
    },
    {
      vendorId: "test-vendor-2",
      compatibilityScore: 45,
      strengths: [
        "Some basic security knowledge",
        "IT infrastructure experience"
      ],
      weaknesses: [
        "Limited specialized security expertise",
        "No penetration testing experience",
        "Lacks security certifications"
      ]
    },
    {
      vendorId: "test-vendor-3",
      compatibilityScore: 10,
      strengths: [],
      weaknesses: [
        "No relevant security expertise",
        "No security certifications",
        "Completely different focus area"
      ]
    }
  ]
};

// Test case 5: Document validation test
export const testCase5 = {
  name: "Document Validation",
  description: "Test the AI's ability to validate procurement documents for compliance and completeness",
  documents: [
    {
      id: "test-doc-1",
      name: "Complete Technical Proposal",
      content: `
        # Technical Proposal for IT Infrastructure Upgrade
        
        ## Executive Summary
        This proposal outlines our approach to upgrading the IT infrastructure for AADF.
        
        ## Company Information
        Company Name: Tech Solutions Ltd
        Registration Number: 12345678
        Tax ID: ALB987654321
        Address: Tirana, Albania
        Contact: John Smith, CEO
        Email: john@techsolutions.com
        Phone: +355 69 123 4567
        
        ## Approach
        Our approach includes cloud migration, system integration, and data migration.
        
        ## Timeline
        The project will be completed in 6 months.
        
        ## Team
        Our team consists of 5 senior engineers with relevant certifications.
        
        ## References
        We have completed similar projects for Organization A, Organization B, and Organization C.
        
        ## Certifications
        Our company holds ISO 9001, ISO 27001, and Microsoft Gold Partner certifications.
      `,
      type: "technical_proposal",
      expectedValidation: {
        valid: true,
        score: 95,
        requiredSections: [
          { name: "Executive Summary", present: true },
          { name: "Company Information", present: true },
          { name: "Approach", present: true },
          { name: "Timeline", present: true },
          { name: "Team", present: true }
        ],
        issues: []
      }
    },
    {
      id: "test-doc-2",
      name: "Incomplete Financial Proposal",
      content: `
        # Financial Proposal
        
        ## Price Summary
        Total Price: €145,000
        
        ## Payment Terms
        Payment will be made in 3 installments.
        
        ## Validity
        This proposal is valid for 60 days.
      `,
      type: "financial_proposal",
      expectedValidation: {
        valid: false,
        score: 40,
        requiredSections: [
          { name: "Price Summary", present: true },
          { name: "Detailed Budget Breakdown", present: false },
          { name: "Payment Terms", present: true },
          { name: "Validity", present: true },
          { name: "Tax Information", present: false }
        ],
        issues: [
          "Missing detailed budget breakdown",
          "Missing tax information",
          "Insufficient payment terms details"
        ]
      }
    },
    {
      id: "test-doc-3",
      name: "Invalid Company Registration",
      content: `
        # Company Registration
        
        Company Name: New Startup Ltd
        Founded: 2023
        
        ## Directors
        John Smith - CEO
        
        ## Address
        Tirana, Albania
      `,
      type: "company_registration",
      expectedValidation: {
        valid: false,
        score: 25,
        requiredSections: [
          { name: "Company Name", present: true },
          { name: "Registration Number", present: false },
          { name: "Tax ID", present: false },
          { name: "Legal Status", present: false },
          { name: "Directors", present: true },
          { name: "Address", present: true },
          { name: "Registration Date", present: false }
        ],
        issues: [
          "Missing registration number",
          "Missing tax ID",
          "Missing legal status",
          "Missing registration date",
          "Insufficient company details"
        ]
      }
    }
  ]
};

// Test case 6: Proposal analysis with conflicting information
export const testCase6 = {
  name: "Conflicting Information Analysis",
  description: "Test the AI's ability to identify and flag conflicting information in a proposal",
  tender: {
    id: "test-tender-6",
    title: "Mobile App Development",
    description: "Development of a mobile app for AADF programs",
    requirements: [
      "iOS and Android versions",
      "User authentication",
      "Content management",
      "Push notifications",
      "Offline functionality"
    ],
    budget: 80000,
    timeline: "4 months"
  },
  proposal: {
    id: "test-proposal-6",
    title: "Mobile App Development Proposal",
    vendor: "App Developers Inc",
    content: `
      # Mobile App Development Proposal
      
      ## Executive Summary
      App Developers Inc is pleased to submit this proposal for the Mobile App Development project. Our team will deliver a high-quality mobile app for both iOS and Android platforms.
      
      ## Approach
      We will develop native apps for both iOS and Android with the following features:
      - User authentication
      - Content management
      - Push notifications
      - Offline functionality
      
      ## Timeline
      The project will be completed in 3 months.
      
      ## Team
      Our team consists of 4 senior developers with experience in mobile app development.
      
      ## Technical Details
      We will use React Native to develop the app, which will allow us to maintain a single codebase for both iOS and Android.
      
      ## Budget
      The total cost for this project is €75,000.
      
      ## Timeline Details
      The development timeline is as follows:
      - Month 1: Design and planning
      - Month 2: Development of core features
      - Month 3: Development of additional features
      - Month 4: Testing and deployment
      
      ## Deliverables
      We will deliver the following:
      - iOS app
      - Android app
      - Admin panel
      - Documentation
    `,
    amount: 75000
  },
  expectedResults: {
    overallScore: 75,
    complianceScore: 85,
    evaluationScore: 70,
    recommendation: "Accept with Clarification",
    strengths: [
      "Addresses all technical requirements",
      "Within budget",
      "Experienced team"
    ],
    weaknesses: [
      "Conflicting timeline information (3 months in one section, 4 months in another)",
      "Claims to use React Native but also mentions native apps",
      "Insufficient details on content management implementation"
    ],
    conflicts: [
      {
        type: "Timeline",
        statements: [
          "The project will be completed in 3 months.",
          "Month 4: Testing and deployment"
        ],
        recommendation: "Clarify actual project timeline"
      },
      {
        type: "Development Approach",
        statements: [
          "We will develop native apps for both iOS and Android",
          "We will use React Native to develop the app"
        ],
        recommendation: "Clarify whether the approach is native or cross-platform"
      }
    ]
  }
};

// Test case 7: Proposal with innovative but risky approach
export const testCase7 = {
  name: "Innovative but Risky Approach",
  description: "Test the AI's ability to evaluate a proposal with an innovative but potentially risky approach",
  tender: {
    id: "test-tender-7",
    title: "Data Analytics Platform",
    description: "Development of a data analytics platform for AADF programs",
    requirements: [
      "Data collection from multiple sources",
      "Data visualization",
      "Reporting capabilities",
      "User-friendly interface",
      "Access control"
    ],
    budget: 120000
  },
  proposal: {
    id: "test-proposal-7",
    title: "AI-Powered Data Analytics Platform",
    vendor: "DataAI Solutions",
    content: `
      # AI-Powered Data Analytics Platform Proposal
      
      ## Executive Summary
      DataAI Solutions proposes an innovative, AI-powered data analytics platform that will revolutionize how AADF analyzes program data.
      
      ## Approach
      Our approach leverages cutting-edge AI technologies:
      - Automated data collection using our proprietary AI agents
      - Real-time data processing with neural networks
      - Predictive analytics using machine learning
      - Natural language query interface
      - Automated report generation
      
      ## Innovation
      Our solution uses experimental quantum-inspired algorithms for data processing, which can analyze complex datasets 10x faster than traditional methods. This is a new technology that we've been developing for the past year.
      
      ## Timeline
      The project will be completed in 5 months:
      - Month 1: Requirements and design
      - Month 2-3: Core platform development
      - Month 4: AI model training and integration
      - Month 5: Testing and deployment
      
      ## Budget
      The total cost for this project is €115,000.
      
      ## Team
      Our team includes 3 AI researchers with PhDs, 2 data scientists, and 3 full-stack developers.
      
      ## Risk Mitigation
      While our approach uses experimental technology, we have a fallback plan to implement traditional data analytics methods if needed, which would still meet all requirements but without the performance benefits.
    `,
    amount: 115000
  },
  expectedResults: {
    overallScore: 80,
    complianceScore: 90,
    evaluationScore: 75,
    recommendation: "Accept with Risk Management",
    strengths: [
      "Innovative AI-powered approach",
      "Potential for superior performance",
      "Highly qualified team",
      "Within budget",
      "Addresses all requirements"
    ],
    weaknesses: [
      "Experimental technology with limited track record",
      "Potential implementation risks",
      "Longer timeline than some competitors"
    ],
    risks: [
      {
        type: "Technology Risk",
        description: "Quantum-inspired algorithms are experimental and may not perform as expected",
        severity: "High",
        mitigation: "Fallback plan to traditional methods is provided"
      },
      {
        type: "Timeline Risk",
        description: "AI model training may take longer than anticipated",
        severity: "Medium",
        mitigation: "Timeline includes buffer for testing"
      }
    ],
    recommendations: [
      "Request proof of concept demonstration",
      "Include performance guarantees in contract",
      "Establish clear milestones for go/no-go decisions on experimental features",
      "Ensure fallback plan is fully documented"
    ]
  }
};

// Export all test cases
export const allTestCases = [
  testCase1,
  testCase2,
  testCase3,
  testCase4,
  testCase5,
  testCase6,
  testCase7
];
