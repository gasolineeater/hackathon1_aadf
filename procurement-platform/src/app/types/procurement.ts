// Procurement Types

export type TenderStatus = 
  | 'draft' 
  | 'published' 
  | 'evaluation' 
  | 'awarded' 
  | 'cancelled' 
  | 'completed';

export type ProposalStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'shortlisted' 
  | 'selected' 
  | 'rejected';

export type EvaluationStatus = 
  | 'pending' 
  | 'in_progress' 
  | 'completed';

export type ContractStatus = 
  | 'draft' 
  | 'pending_signature' 
  | 'active' 
  | 'completed' 
  | 'terminated';

export type DocumentType = 
  | 'tender_specification' 
  | 'technical_requirements' 
  | 'proposal' 
  | 'financial_offer' 
  | 'company_profile' 
  | 'contract' 
  | 'evaluation_report' 
  | 'other';

export type UserRole = 
  | 'admin' 
  | 'procurement_officer' 
  | 'evaluator' 
  | 'vendor' 
  | 'guest';

// Main Interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organization?: string;
  position?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tender {
  id: string;
  title: string;
  reference: string;
  description: string;
  status: TenderStatus;
  category: string[];
  budget?: {
    amount: number;
    currency: string;
  };
  timeline: {
    publicationDate: Date;
    submissionDeadline: Date;
    evaluationStartDate?: Date;
    evaluationEndDate?: Date;
    awardDate?: Date;
  };
  eligibilityCriteria: string[];
  evaluationCriteria: EvaluationCriterion[];
  documents: Document[];
  createdBy: string; // User ID
  createdAt: Date;
  updatedAt: Date;
  proposals?: Proposal[];
  evaluation?: Evaluation;
  contract?: Contract;
}

export interface EvaluationCriterion {
  id: string;
  name: string;
  description: string;
  weight: number; // Percentage weight in the evaluation
  minScore: number;
  maxScore: number;
  scoringGuidelines?: string;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string; // User ID
  uploadedAt: Date;
  description?: string;
  isPublic: boolean;
}

export interface Proposal {
  id: string;
  tenderId: string;
  vendorId: string; // User ID
  vendorName: string;
  status: ProposalStatus;
  submissionDate: Date;
  technicalProposal: string;
  financialProposal: {
    amount: number;
    currency: string;
    breakdown?: any;
  };
  documents: Document[];
  evaluationScores?: {
    criterionId: string;
    score: number;
    comments?: string;
  }[];
  totalScore?: number;
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Evaluation {
  id: string;
  tenderId: string;
  status: EvaluationStatus;
  committee: {
    userId: string;
    name: string;
    role: string;
  }[];
  startDate: Date;
  endDate?: Date;
  evaluationMatrix: {
    proposalId: string;
    scores: {
      criterionId: string;
      evaluatorId: string;
      score: number;
      comments?: string;
    }[];
  }[];
  finalRanking?: {
    proposalId: string;
    vendorName: string;
    totalScore: number;
    rank: number;
  }[];
  winningProposalId?: string;
  report?: Document;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contract {
  id: string;
  tenderId: string;
  proposalId: string;
  vendorId: string;
  status: ContractStatus;
  title: string;
  reference: string;
  value: {
    amount: number;
    currency: string;
  };
  startDate: Date;
  endDate: Date;
  terms: string;
  documents: Document[];
  milestones?: {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    status: 'pending' | 'completed' | 'delayed';
    completionDate?: Date;
    paymentAmount?: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date;
  attachments?: Document[];
  parentId?: string; // For threaded comments
}

// Mock Data Generator Functions

export function generateMockTenders(count: number = 10): Tender[] {
  const tenders: Tender[] = [];
  const statuses: TenderStatus[] = ['draft', 'published', 'evaluation', 'awarded', 'completed'];
  const categories = [
    'IT Services', 
    'Consulting', 
    'Construction', 
    'Office Supplies', 
    'Marketing Services',
    'Training Services',
    'Research',
    'Equipment'
  ];

  for (let i = 0; i < count; i++) {
    const publicationDate = new Date();
    publicationDate.setDate(publicationDate.getDate() - Math.floor(Math.random() * 30));
    
    const submissionDeadline = new Date(publicationDate);
    submissionDeadline.setDate(submissionDeadline.getDate() + 14 + Math.floor(Math.random() * 30));
    
    const evaluationStartDate = new Date(submissionDeadline);
    evaluationStartDate.setDate(evaluationStartDate.getDate() + 1);
    
    const evaluationEndDate = new Date(evaluationStartDate);
    evaluationEndDate.setDate(evaluationEndDate.getDate() + 7 + Math.floor(Math.random() * 14));
    
    const awardDate = new Date(evaluationEndDate);
    awardDate.setDate(awardDate.getDate() + 3);

    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const tender: Tender = {
      id: `TEN-${1000 + i}`,
      title: `Tender for ${categories[Math.floor(Math.random() * categories.length)]} - ${1000 + i}`,
      reference: `REF-${2023}-${1000 + i}`,
      description: `This is a tender for the procurement of ${categories[Math.floor(Math.random() * categories.length)].toLowerCase()} services for AADF.`,
      status,
      category: [categories[Math.floor(Math.random() * categories.length)]],
      budget: {
        amount: 10000 + Math.floor(Math.random() * 90000),
        currency: 'EUR',
      },
      timeline: {
        publicationDate,
        submissionDeadline,
        evaluationStartDate,
        evaluationEndDate,
        awardDate: status === 'awarded' || status === 'completed' ? awardDate : undefined,
      },
      eligibilityCriteria: [
        'Registered business entity',
        'Minimum 3 years of experience',
        'No conflicts of interest',
        'Financial stability',
      ],
      evaluationCriteria: [
        {
          id: `EC-${1000 + i}-1`,
          name: 'Technical Capability',
          description: 'Assessment of technical approach and methodology',
          weight: 40,
          minScore: 0,
          maxScore: 10,
        },
        {
          id: `EC-${1000 + i}-2`,
          name: 'Experience',
          description: 'Relevant experience in similar projects',
          weight: 30,
          minScore: 0,
          maxScore: 10,
        },
        {
          id: `EC-${1000 + i}-3`,
          name: 'Price',
          description: 'Competitiveness of the financial proposal',
          weight: 30,
          minScore: 0,
          maxScore: 10,
        },
      ],
      documents: [
        {
          id: `DOC-${1000 + i}-1`,
          name: 'Tender Specifications',
          type: 'tender_specification',
          fileUrl: '/documents/tender-spec.pdf',
          fileSize: 1024 * 1024 * 2, // 2MB
          fileType: 'application/pdf',
          uploadedBy: 'user-1',
          uploadedAt: publicationDate,
          isPublic: true,
        },
        {
          id: `DOC-${1000 + i}-2`,
          name: 'Technical Requirements',
          type: 'technical_requirements',
          fileUrl: '/documents/tech-req.pdf',
          fileSize: 1024 * 1024, // 1MB
          fileType: 'application/pdf',
          uploadedBy: 'user-1',
          uploadedAt: publicationDate,
          isPublic: true,
        },
      ],
      createdBy: 'user-1',
      createdAt: new Date(publicationDate.getTime() - 86400000 * 2), // 2 days before publication
      updatedAt: new Date(publicationDate.getTime() - 86400000), // 1 day before publication
    };
    
    tenders.push(tender);
  }
  
  return tenders;
}

export function generateMockProposals(tenderId: string, count: number = 5): Proposal[] {
  const proposals: Proposal[] = [];
  const statuses: ProposalStatus[] = ['submitted', 'under_review', 'shortlisted', 'selected', 'rejected'];
  
  for (let i = 0; i < count; i++) {
    const submissionDate = new Date();
    submissionDate.setDate(submissionDate.getDate() - Math.floor(Math.random() * 10));
    
    const proposal: Proposal = {
      id: `PROP-${tenderId}-${i + 1}`,
      tenderId,
      vendorId: `vendor-${i + 1}`,
      vendorName: `Vendor Company ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      submissionDate,
      technicalProposal: `Technical proposal for tender ${tenderId} from Vendor ${i + 1}`,
      financialProposal: {
        amount: 10000 + Math.floor(Math.random() * 50000),
        currency: 'EUR',
      },
      documents: [
        {
          id: `DOC-PROP-${tenderId}-${i + 1}-1`,
          name: 'Technical Proposal',
          type: 'proposal',
          fileUrl: `/documents/proposal-${i + 1}-tech.pdf`,
          fileSize: 1024 * 1024 * 1.5, // 1.5MB
          fileType: 'application/pdf',
          uploadedBy: `vendor-${i + 1}`,
          uploadedAt: submissionDate,
          isPublic: false,
        },
        {
          id: `DOC-PROP-${tenderId}-${i + 1}-2`,
          name: 'Financial Offer',
          type: 'financial_offer',
          fileUrl: `/documents/proposal-${i + 1}-fin.pdf`,
          fileSize: 1024 * 512, // 0.5MB
          fileType: 'application/pdf',
          uploadedBy: `vendor-${i + 1}`,
          uploadedAt: submissionDate,
          isPublic: false,
        },
        {
          id: `DOC-PROP-${tenderId}-${i + 1}-3`,
          name: 'Company Profile',
          type: 'company_profile',
          fileUrl: `/documents/proposal-${i + 1}-profile.pdf`,
          fileSize: 1024 * 1024, // 1MB
          fileType: 'application/pdf',
          uploadedBy: `vendor-${i + 1}`,
          uploadedAt: submissionDate,
          isPublic: false,
        },
      ],
      createdAt: new Date(submissionDate.getTime() - 86400000), // 1 day before submission
      updatedAt: submissionDate,
    };
    
    proposals.push(proposal);
  }
  
  return proposals;
}

export function generateMockEvaluation(tenderId: string, proposals: Proposal[]): Evaluation {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 5);
  
  const endDate = new Date();
  endDate.setDate(endDate.getDate() - 1);
  
  const committee = [
    { userId: 'user-2', name: 'John Evaluator', role: 'Committee Chair' },
    { userId: 'user-3', name: 'Jane Expert', role: 'Technical Expert' },
    { userId: 'user-4', name: 'Bob Reviewer', role: 'Financial Expert' },
  ];
  
  const evaluationMatrix = proposals.map(proposal => {
    const scores = [
      {
        criterionId: 'EC-1001-1', // Technical Capability
        evaluatorId: 'user-2',
        score: 5 + Math.floor(Math.random() * 6), // 5-10
        comments: 'Good technical approach with some innovative elements.',
      },
      {
        criterionId: 'EC-1001-1', // Technical Capability
        evaluatorId: 'user-3',
        score: 5 + Math.floor(Math.random() * 6), // 5-10
        comments: 'Methodology is well-defined and appropriate.',
      },
      {
        criterionId: 'EC-1001-2', // Experience
        evaluatorId: 'user-2',
        score: 5 + Math.floor(Math.random() * 6), // 5-10
        comments: 'Vendor has relevant experience in similar projects.',
      },
      {
        criterionId: 'EC-1001-2', // Experience
        evaluatorId: 'user-3',
        score: 5 + Math.floor(Math.random() * 6), // 5-10
        comments: 'Team composition is appropriate for the project.',
      },
      {
        criterionId: 'EC-1001-3', // Price
        evaluatorId: 'user-4',
        score: 5 + Math.floor(Math.random() * 6), // 5-10
        comments: 'Competitive pricing with good value for money.',
      },
    ];
    
    return {
      proposalId: proposal.id,
      scores,
    };
  });
  
  // Calculate final ranking
  const finalRanking = proposals.map((proposal, index) => {
    const proposalScores = evaluationMatrix.find(em => em.proposalId === proposal.id)?.scores || [];
    const totalScore = proposalScores.reduce((sum, score) => sum + score.score, 0) / proposalScores.length;
    
    return {
      proposalId: proposal.id,
      vendorName: proposal.vendorName,
      totalScore,
      rank: 0, // Will be set after sorting
    };
  }).sort((a, b) => b.totalScore - a.totalScore);
  
  // Set ranks
  finalRanking.forEach((ranking, index) => {
    ranking.rank = index + 1;
  });
  
  const winningProposalId = finalRanking[0]?.proposalId;
  
  return {
    id: `EVAL-${tenderId}`,
    tenderId,
    status: 'completed',
    committee,
    startDate,
    endDate,
    evaluationMatrix,
    finalRanking,
    winningProposalId,
    report: {
      id: `DOC-EVAL-${tenderId}`,
      name: 'Evaluation Report',
      type: 'evaluation_report',
      fileUrl: `/documents/evaluation-${tenderId}.pdf`,
      fileSize: 1024 * 1024 * 2, // 2MB
      fileType: 'application/pdf',
      uploadedBy: 'user-2',
      uploadedAt: endDate,
      isPublic: false,
    },
    createdAt: startDate,
    updatedAt: endDate,
  };
}

export function generateMockContract(tenderId: string, proposalId: string, vendorId: string): Contract {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 10);
  
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 6);
  
  return {
    id: `CONT-${tenderId}`,
    tenderId,
    proposalId,
    vendorId,
    status: 'draft',
    title: `Contract for Tender ${tenderId}`,
    reference: `CONT-REF-${tenderId}`,
    value: {
      amount: 50000 + Math.floor(Math.random() * 50000),
      currency: 'EUR',
    },
    startDate,
    endDate,
    terms: 'Standard contract terms and conditions apply.',
    documents: [
      {
        id: `DOC-CONT-${tenderId}`,
        name: 'Contract Draft',
        type: 'contract',
        fileUrl: `/documents/contract-${tenderId}.pdf`,
        fileSize: 1024 * 1024 * 3, // 3MB
        fileType: 'application/pdf',
        uploadedBy: 'user-1',
        uploadedAt: new Date(),
        isPublic: false,
      },
    ],
    milestones: [
      {
        id: `MILE-${tenderId}-1`,
        title: 'Project Initiation',
        description: 'Kickoff meeting and initial planning',
        dueDate: new Date(startDate.getTime() + 86400000 * 14), // 14 days after start
        status: 'pending',
        paymentAmount: 10000,
      },
      {
        id: `MILE-${tenderId}-2`,
        title: 'First Deliverable',
        description: 'Completion of first project phase',
        dueDate: new Date(startDate.getTime() + 86400000 * 60), // 60 days after start
        status: 'pending',
        paymentAmount: 20000,
      },
      {
        id: `MILE-${tenderId}-3`,
        title: 'Final Delivery',
        description: 'Project completion and final deliverables',
        dueDate: new Date(endDate.getTime() - 86400000 * 14), // 14 days before end
        status: 'pending',
        paymentAmount: 20000,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
