// Tender Types
export interface Tender {
  id: number;
  title: string;
  description: string;
  requirements: string;
  deadline: string;
  status: TenderStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  documents: TenderDocument[];
  evaluationCriteria: EvaluationCriteria[];
}

export type TenderStatus = 'Draft' | 'Open' | 'Closed' | 'Awarded' | 'Cancelled';

export interface TenderDocument {
  id: number;
  tenderId: number;
  name: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

// Proposal Types
export interface Proposal {
  id: number;
  tenderId: number;
  vendorId: number;
  title: string;
  description: string;
  price: number;
  timeline: number;
  status: ProposalStatus;
  submittedAt: string;
  documents: ProposalDocument[];
  evaluations: Evaluation[];
}

export type ProposalStatus = 'Draft' | 'Submitted' | 'In Evaluation' | 'Evaluated' | 'Selected' | 'Rejected';

export interface ProposalDocument {
  id: number;
  proposalId: number;
  name: string;
  fileUrl: string;
  fileType: string;
  category: DocumentCategory;
  uploadedAt: string;
}

export type DocumentCategory = 'Technical' | 'Financial' | 'Supporting';

// Evaluation Types
export interface EvaluationCriteria {
  id: number;
  tenderId: number;
  name: string;
  description: string;
  weight: number;
  maxScore: number;
}

export interface Evaluation {
  id: number;
  proposalId: number;
  evaluatorId: number;
  criteriaId: number;
  score: number;
  comments: string;
  evaluatedAt: string;
}

export interface EvaluationReport {
  id: number;
  tenderId: number;
  generatedAt: string;
  generatedBy: number;
  status: ReportStatus;
  fileUrl: string;
}

export type ReportStatus = 'Draft' | 'Final';

// User Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  organization: string;
  createdAt: string;
}

export type UserRole = 'Admin' | 'Procurement Officer' | 'Evaluator' | 'Vendor';

// Vendor Types
export interface Vendor {
  id: number;
  name: string;
  taxId: string;
  address: string;
  email: string;
  phone: string;
  contactPerson: string;
  registeredAt: string;
}

// Notification Types
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: NotificationType;
  relatedId?: number;
}

export type NotificationType = 
  | 'TenderPublished' 
  | 'ProposalReceived' 
  | 'EvaluationNeeded' 
  | 'EvaluationCompleted' 
  | 'TenderAwarded';
