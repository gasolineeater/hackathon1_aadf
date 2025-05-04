// Mock data for the application

// Mock user data
export const mockUsers = [
  {
    id: '1',
    email: 'admin@aadf.org',
    password: 'admin123',
    role: 'admin',
    full_name: 'AADF Admin',
    organization: 'AADF'
  },
  {
    id: '2',
    email: 'evaluator@aadf.org',
    password: 'evaluator123',
    role: 'evaluator',
    full_name: 'AADF Evaluator',
    organization: 'AADF'
  },
  {
    id: '3',
    email: 'vendor@example.com',
    password: 'vendor123',
    role: 'vendor',
    full_name: 'Vendor User',
    organization: 'Example Vendor'
  }
];

// Mock tenders
export const mockTenders = [
  {
    id: 'tender-001',
    title: 'IT Infrastructure Upgrade',
    description: 'Upgrading the IT infrastructure for AADF offices',
    budget: 150000,
    deadline: '2023-06-30',
    status: 'open',
    created_at: '2023-05-01',
    updated_at: '2023-05-01',
    requirements: [
      'Cloud-based solution',
      'Integration with existing systems',
      'Mobile-friendly interfaces',
      'Data migration from legacy systems',
      'Security compliance with industry standards'
    ],
    evaluation_criteria: [
      { name: 'Technical approach', weight: 40 },
      { name: 'Experience and qualifications', weight: 30 },
      { name: 'Cost', weight: 20 },
      { name: 'Timeline', weight: 10 }
    ]
  },
  {
    id: 'tender-002',
    title: 'Digital Transformation Project',
    description: 'Digital transformation of internal processes',
    budget: 200000,
    deadline: '2023-07-15',
    status: 'open',
    created_at: '2023-05-05',
    updated_at: '2023-05-05',
    requirements: [
      'Process automation',
      'Digital workflow implementation',
      'Training and knowledge transfer',
      'Change management support',
      'Integration with existing systems'
    ],
    evaluation_criteria: [
      { name: 'Technical approach', weight: 35 },
      { name: 'Experience and qualifications', weight: 25 },
      { name: 'Cost', weight: 20 },
      { name: 'Timeline', weight: 10 },
      { name: 'Innovation', weight: 10 }
    ]
  },
  {
    id: 'tender-003',
    title: 'Website Redesign',
    description: 'Redesign of the AADF website',
    budget: 50000,
    deadline: '2023-06-15',
    status: 'open',
    created_at: '2023-05-10',
    updated_at: '2023-05-10',
    requirements: [
      'Responsive design',
      'Content management system',
      'SEO optimization',
      'Accessibility compliance',
      'Integration with social media'
    ],
    evaluation_criteria: [
      { name: 'Design quality', weight: 40 },
      { name: 'Technical approach', weight: 30 },
      { name: 'Cost', weight: 20 },
      { name: 'Timeline', weight: 10 }
    ]
  }
];

// Mock vendors
export const mockVendors = [
  {
    id: 'vendor-001',
    name: 'Tech Solutions Ltd',
    email: 'contact@techsolutions.com',
    phone: '+355 69 123 4567',
    address: 'Tirana, Albania',
    industry: 'IT Services',
    expertise: ['Cloud Computing', 'IT Infrastructure', 'Software Development'],
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 'vendor-002',
    name: 'Digital Innovators',
    email: 'info@digitalinnovators.al',
    phone: '+355 69 765 4321',
    address: 'Tirana, Albania',
    industry: 'Digital Transformation',
    expertise: ['Process Automation', 'Digital Strategy', 'Change Management'],
    created_at: '2023-01-15',
    updated_at: '2023-01-15'
  },
  {
    id: 'vendor-003',
    name: 'Creative Web Design',
    email: 'hello@creativewebdesign.al',
    phone: '+355 69 987 6543',
    address: 'Tirana, Albania',
    industry: 'Web Design',
    expertise: ['UI/UX Design', 'Web Development', 'Graphic Design'],
    created_at: '2023-02-01',
    updated_at: '2023-02-01'
  }
];

// Mock proposals
export const mockProposals = [
  {
    id: 'proposal-001',
    tender_id: 'tender-001',
    vendor_id: 'vendor-001',
    title: 'IT Infrastructure Upgrade Proposal',
    description: 'Comprehensive solution for upgrading AADF IT infrastructure',
    amount: 145000,
    status: 'submitted',
    created_at: '2023-05-15',
    updated_at: '2023-05-15',
    documents: [
      { id: 'doc-1', name: 'Technical Proposal', type: 'pdf' },
      { id: 'doc-2', name: 'Financial Proposal', type: 'pdf' },
      { id: 'doc-3', name: 'Company Profile', type: 'pdf' }
    ]
  },
  {
    id: 'proposal-002',
    tender_id: 'tender-002',
    vendor_id: 'vendor-002',
    title: 'Digital Transformation Proposal',
    description: 'Innovative approach to digital transformation',
    amount: 195000,
    status: 'submitted',
    created_at: '2023-05-20',
    updated_at: '2023-05-20',
    documents: [
      { id: 'doc-4', name: 'Technical Proposal', type: 'pdf' },
      { id: 'doc-5', name: 'Financial Proposal', type: 'pdf' },
      { id: 'doc-6', name: 'Company Profile', type: 'pdf' }
    ]
  },
  {
    id: 'proposal-003',
    tender_id: 'tender-003',
    vendor_id: 'vendor-003',
    title: 'Website Redesign Proposal',
    description: 'Creative approach to redesigning the AADF website',
    amount: 48000,
    status: 'submitted',
    created_at: '2023-05-25',
    updated_at: '2023-05-25',
    documents: [
      { id: 'doc-7', name: 'Design Proposal', type: 'pdf' },
      { id: 'doc-8', name: 'Financial Proposal', type: 'pdf' },
      { id: 'doc-9', name: 'Portfolio', type: 'pdf' }
    ]
  }
];

// Mock compatibility scores
export const mockCompatibilityScores = [
  {
    id: 'comp-001',
    tender_id: 'tender-001',
    vendor_id: 'vendor-001',
    score: 85,
    factors: [
      { name: 'Industry Match', score: 90 },
      { name: 'Expertise Match', score: 85 },
      { name: 'Experience Match', score: 80 },
      { name: 'Capacity Match', score: 85 },
      { name: 'Certification Match', score: 85 }
    ],
    created_at: '2023-05-15',
    updated_at: '2023-05-15'
  },
  {
    id: 'comp-002',
    tender_id: 'tender-001',
    vendor_id: 'vendor-002',
    score: 75,
    factors: [
      { name: 'Industry Match', score: 70 },
      { name: 'Expertise Match', score: 75 },
      { name: 'Experience Match', score: 80 },
      { name: 'Capacity Match', score: 75 },
      { name: 'Certification Match', score: 75 }
    ],
    created_at: '2023-05-15',
    updated_at: '2023-05-15'
  },
  {
    id: 'comp-003',
    tender_id: 'tender-001',
    vendor_id: 'vendor-003',
    score: 60,
    factors: [
      { name: 'Industry Match', score: 50 },
      { name: 'Expertise Match', score: 60 },
      { name: 'Experience Match', score: 70 },
      { name: 'Capacity Match', score: 60 },
      { name: 'Certification Match', score: 60 }
    ],
    created_at: '2023-05-15',
    updated_at: '2023-05-15'
  },
  {
    id: 'comp-004',
    tender_id: 'tender-002',
    vendor_id: 'vendor-001',
    score: 70,
    factors: [
      { name: 'Industry Match', score: 65 },
      { name: 'Expertise Match', score: 70 },
      { name: 'Experience Match', score: 75 },
      { name: 'Capacity Match', score: 70 },
      { name: 'Certification Match', score: 70 }
    ],
    created_at: '2023-05-20',
    updated_at: '2023-05-20'
  },
  {
    id: 'comp-005',
    tender_id: 'tender-002',
    vendor_id: 'vendor-002',
    score: 90,
    factors: [
      { name: 'Industry Match', score: 95 },
      { name: 'Expertise Match', score: 90 },
      { name: 'Experience Match', score: 85 },
      { name: 'Capacity Match', score: 90 },
      { name: 'Certification Match', score: 90 }
    ],
    created_at: '2023-05-20',
    updated_at: '2023-05-20'
  },
  {
    id: 'comp-006',
    tender_id: 'tender-002',
    vendor_id: 'vendor-003',
    score: 65,
    factors: [
      { name: 'Industry Match', score: 60 },
      { name: 'Expertise Match', score: 65 },
      { name: 'Experience Match', score: 70 },
      { name: 'Capacity Match', score: 65 },
      { name: 'Certification Match', score: 65 }
    ],
    created_at: '2023-05-20',
    updated_at: '2023-05-20'
  },
  {
    id: 'comp-007',
    tender_id: 'tender-003',
    vendor_id: 'vendor-001',
    score: 65,
    factors: [
      { name: 'Industry Match', score: 60 },
      { name: 'Expertise Match', score: 65 },
      { name: 'Experience Match', score: 70 },
      { name: 'Capacity Match', score: 65 },
      { name: 'Certification Match', score: 65 }
    ],
    created_at: '2023-05-25',
    updated_at: '2023-05-25'
  },
  {
    id: 'comp-008',
    tender_id: 'tender-003',
    vendor_id: 'vendor-002',
    score: 70,
    factors: [
      { name: 'Industry Match', score: 65 },
      { name: 'Expertise Match', score: 70 },
      { name: 'Experience Match', score: 75 },
      { name: 'Capacity Match', score: 70 },
      { name: 'Certification Match', score: 70 }
    ],
    created_at: '2023-05-25',
    updated_at: '2023-05-25'
  },
  {
    id: 'comp-009',
    tender_id: 'tender-003',
    vendor_id: 'vendor-003',
    score: 95,
    factors: [
      { name: 'Industry Match', score: 100 },
      { name: 'Expertise Match', score: 95 },
      { name: 'Experience Match', score: 90 },
      { name: 'Capacity Match', score: 95 },
      { name: 'Certification Match', score: 95 }
    ],
    created_at: '2023-05-25',
    updated_at: '2023-05-25'
  }
];

// Mock document validations
export const mockDocumentValidations = [
  {
    id: 'val-1',
    document_id: 'doc-1',
    status: 'valid',
    issues: [],
    created_at: '2023-05-15',
    updated_at: '2023-05-15'
  },
  {
    id: 'val-2',
    document_id: 'doc-2',
    status: 'valid',
    issues: [],
    created_at: '2023-05-15',
    updated_at: '2023-05-15'
  },
  {
    id: 'val-3',
    document_id: 'doc-3',
    status: 'valid',
    issues: [],
    created_at: '2023-05-15',
    updated_at: '2023-05-15'
  },
  {
    id: 'val-4',
    document_id: 'doc-4',
    status: 'valid',
    issues: [],
    created_at: '2023-05-20',
    updated_at: '2023-05-20'
  },
  {
    id: 'val-5',
    document_id: 'doc-5',
    status: 'valid',
    issues: [],
    created_at: '2023-05-20',
    updated_at: '2023-05-20'
  },
  {
    id: 'val-6',
    document_id: 'doc-6',
    status: 'invalid',
    issues: [
      { type: 'missing_information', description: 'Missing company registration information' },
      { type: 'format_error', description: 'Incorrect format for financial data' }
    ],
    created_at: '2023-05-20',
    updated_at: '2023-05-20'
  },
  {
    id: 'val-7',
    document_id: 'doc-7',
    status: 'valid',
    issues: [],
    created_at: '2023-05-25',
    updated_at: '2023-05-25'
  },
  {
    id: 'val-8',
    document_id: 'doc-8',
    status: 'valid',
    issues: [],
    created_at: '2023-05-25',
    updated_at: '2023-05-25'
  },
  {
    id: 'val-9',
    document_id: 'doc-9',
    status: 'valid',
    issues: [],
    created_at: '2023-05-25',
    updated_at: '2023-05-25'
  }
];

// Mock proposal analyses
export const mockProposalAnalyses = [
  {
    id: 'analysis-1',
    proposal_id: 'proposal-1',
    tender_id: 'tender-1',
    vendor_id: 'vendor-1',
    summary: {
      overallScore: 85,
      complianceScore: 90,
      evaluationScore: 82,
      recommendation: 'Accept',
      keyFindings: [
        'Proposal addresses 90% of tender requirements.',
        'Strong overall proposal with evaluation score of 82/100.',
        'Proposal is within the specified budget constraints.',
        'Strongest in "Technical approach" (88/100).',
        'Weakest in "Timeline" (75/100).'
      ]
    },
    compliance: {
      compliant: true,
      requirementResults: [
        { requirement: 'Cloud-based solution', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Integration with existing systems', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Mobile-friendly interfaces', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Data migration from legacy systems', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Security compliance', addressed: false, relevantSections: [] }
      ],
      budgetCompliance: {
        withinBudget: true,
        proposedAmount: 145000,
        budgetLimit: 150000,
        difference: 5000,
        percentageOfBudget: 97
      }
    },
    evaluation: {
      totalScore: 82,
      criteriaScores: [
        { criterion: 'Technical approach', score: 88, weight: 40, justification: 'Comprehensive approach with agile methodology' },
        { criterion: 'Experience and qualifications', score: 85, weight: 30, justification: 'Team exceeds minimum requirements' },
        { criterion: 'Cost', score: 85, weight: 20, justification: 'Within budget and good value for money' },
        { criterion: 'Timeline', score: 75, weight: 10, justification: 'Timeline is reasonable but could be more detailed' }
      ]
    },
    insights: {
      strengths: [
        'Strong technical approach with agile methodology',
        'Experienced team with relevant certifications',
        'Comprehensive testing strategy',
        'Clear budget breakdown'
      ],
      weaknesses: [
        'Security compliance not explicitly addressed',
        'Timeline could be more detailed',
        'Limited information on knowledge transfer',
        'No mention of post-implementation support'
      ],
      recommendations: [
        'Request additional information on security compliance',
        'Ask for a more detailed timeline with specific milestones',
        'Clarify knowledge transfer approach',
        'Discuss post-implementation support options'
      ]
    },
    created_at: '2023-05-16',
    updated_at: '2023-05-16'
  },
  {
    id: 'analysis-2',
    proposal_id: 'proposal-2',
    tender_id: 'tender-2',
    vendor_id: 'vendor-2',
    summary: {
      overallScore: 90,
      complianceScore: 95,
      evaluationScore: 87,
      recommendation: 'Accept',
      keyFindings: [
        'Proposal addresses 100% of tender requirements.',
        'Excellent overall proposal with evaluation score of 87/100.',
        'Proposal is within the specified budget constraints.',
        'Strongest in "Innovation" (95/100).',
        'Weakest in "Timeline" (80/100).'
      ]
    },
    compliance: {
      compliant: true,
      requirementResults: [
        { requirement: 'Process automation', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Digital workflow implementation', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Training and knowledge transfer', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Change management support', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Integration with existing systems', addressed: true, relevantSections: ['Approach'] }
      ],
      budgetCompliance: {
        withinBudget: true,
        proposedAmount: 195000,
        budgetLimit: 200000,
        difference: 5000,
        percentageOfBudget: 98
      }
    },
    evaluation: {
      totalScore: 87,
      criteriaScores: [
        { criterion: 'Technical approach', score: 85, weight: 35, justification: 'Comprehensive approach with innovative methodology' },
        { criterion: 'Experience and qualifications', score: 90, weight: 25, justification: 'Team exceeds minimum requirements' },
        { criterion: 'Cost', score: 85, weight: 20, justification: 'Within budget and good value for money' },
        { criterion: 'Timeline', score: 80, weight: 10, justification: 'Timeline is reasonable but could be more detailed' },
        { criterion: 'Innovation', score: 95, weight: 10, justification: 'Highly innovative approach with cutting-edge technologies' }
      ]
    },
    insights: {
      strengths: [
        'Innovative approach with cutting-edge technologies',
        'Experienced team with relevant certifications',
        'Comprehensive change management strategy',
        'Clear budget breakdown'
      ],
      weaknesses: [
        'Timeline could be more detailed',
        'Limited information on risk management',
        'No mention of post-implementation support'
      ],
      recommendations: [
        'Ask for a more detailed timeline with specific milestones',
        'Request additional information on risk management',
        'Discuss post-implementation support options'
      ]
    },
    created_at: '2023-05-21',
    updated_at: '2023-05-21'
  },
  {
    id: 'analysis-3',
    proposal_id: 'proposal-3',
    tender_id: 'tender-3',
    vendor_id: 'vendor-3',
    summary: {
      overallScore: 95,
      complianceScore: 100,
      evaluationScore: 92,
      recommendation: 'Accept',
      keyFindings: [
        'Proposal addresses 100% of tender requirements.',
        'Excellent overall proposal with evaluation score of 92/100.',
        'Proposal is within the specified budget constraints.',
        'Strongest in "Design quality" (95/100).',
        'All criteria scored above 85/100.'
      ]
    },
    compliance: {
      compliant: true,
      requirementResults: [
        { requirement: 'Responsive design', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Content management system', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'SEO optimization', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Accessibility compliance', addressed: true, relevantSections: ['Approach'] },
        { requirement: 'Integration with social media', addressed: true, relevantSections: ['Approach'] }
      ],
      budgetCompliance: {
        withinBudget: true,
        proposedAmount: 48000,
        budgetLimit: 50000,
        difference: 2000,
        percentageOfBudget: 96
      }
    },
    evaluation: {
      totalScore: 92,
      criteriaScores: [
        { criterion: 'Design quality', score: 95, weight: 40, justification: 'Excellent design with modern aesthetics' },
        { criterion: 'Technical approach', score: 90, weight: 30, justification: 'Comprehensive approach with innovative methodology' },
        { criterion: 'Cost', score: 90, weight: 20, justification: 'Within budget and excellent value for money' },
        { criterion: 'Timeline', score: 85, weight: 10, justification: 'Detailed timeline with clear milestones' }
      ]
    },
    insights: {
      strengths: [
        'Excellent design with modern aesthetics',
        'Comprehensive technical approach',
        'Detailed timeline with clear milestones',
        'Excellent value for money'
      ],
      weaknesses: [
        'Limited information on content migration',
        'No mention of post-implementation support'
      ],
      recommendations: [
        'Request additional information on content migration',
        'Discuss post-implementation support options'
      ]
    },
    created_at: '2023-05-26',
    updated_at: '2023-05-26'
  }
];

// Mock dashboard data
export const mockDashboardData = {
  summary: {
    activeTenders: 3,
    submittedProposals: 9,
    ongoingEvaluations: 3,
    completedEvaluations: 0
  },
  activity: [
    { id: 1, type: 'tender_created', user: 'Admin User', item: 'IT Infrastructure Upgrade', time: '2023-05-01' },
    { id: 2, type: 'tender_created', user: 'Admin User', item: 'Digital Transformation Project', time: '2023-05-05' },
    { id: 3, type: 'tender_created', user: 'Admin User', item: 'Website Redesign', time: '2023-05-10' },
    { id: 4, type: 'proposal_submitted', user: 'Tech Solutions Ltd', item: 'IT Infrastructure Upgrade Proposal', time: '2023-05-15' },
    { id: 5, type: 'proposal_submitted', user: 'Digital Innovators', item: 'Digital Transformation Proposal', time: '2023-05-20' }
  ],
  insights: [
    { id: 1, type: 'compatibility', title: 'High Compatibility Match', description: 'Creative Web Design has 95% compatibility with Website Redesign tender', time: '2023-05-25' },
    { id: 2, type: 'compatibility', title: 'High Compatibility Match', description: 'Digital Innovators has 90% compatibility with Digital Transformation Project tender', time: '2023-05-20' },
    { id: 3, type: 'compatibility', title: 'High Compatibility Match', description: 'Tech Solutions Ltd has 85% compatibility with IT Infrastructure Upgrade tender', time: '2023-05-15' },
    { id: 4, type: 'document', title: 'Document Validation Issue', description: 'Company Profile document from Digital Innovators has validation issues', time: '2023-05-20' },
    { id: 5, type: 'proposal', title: 'Excellent Proposal', description: 'Website Redesign Proposal from Creative Web Design received a score of 95/100', time: '2023-05-26' }
  ]
};

// Mock notifications
export const mockNotifications = [
  { id: 1, type: 'tender', title: 'New Tender Published', description: 'IT Infrastructure Upgrade tender has been published', read: true, time: '2023-05-01' },
  { id: 2, type: 'tender', title: 'New Tender Published', description: 'Digital Transformation Project tender has been published', read: true, time: '2023-05-05' },
  { id: 3, type: 'tender', title: 'New Tender Published', description: 'Website Redesign tender has been published', read: true, time: '2023-05-10' },
  { id: 4, type: 'proposal', title: 'New Proposal Submitted', description: 'Tech Solutions Ltd has submitted a proposal for IT Infrastructure Upgrade', read: false, time: '2023-05-15' },
  { id: 5, type: 'proposal', title: 'New Proposal Submitted', description: 'Digital Innovators has submitted a proposal for Digital Transformation Project', read: false, time: '2023-05-20' },
  { id: 6, type: 'proposal', title: 'New Proposal Submitted', description: 'Creative Web Design has submitted a proposal for Website Redesign', read: false, time: '2023-05-25' },
  { id: 7, type: 'document', title: 'Document Validation Issue', description: 'Company Profile document from Digital Innovators has validation issues', read: false, time: '2023-05-20' },
  { id: 8, type: 'compatibility', title: 'High Compatibility Match', description: 'Creative Web Design has 95% compatibility with Website Redesign tender', read: false, time: '2023-05-25' },
  { id: 9, type: 'analysis', title: 'Proposal Analysis Complete', description: 'Analysis of Website Redesign Proposal from Creative Web Design is complete', read: false, time: '2023-05-26' }
];
