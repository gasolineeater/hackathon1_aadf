'use client';

import { 
  Tender, 
  Proposal, 
  Evaluation, 
  Contract,
  TenderStatus,
  ProposalStatus,
  generateMockTenders,
  generateMockProposals,
  generateMockEvaluation,
  generateMockContract
} from '../types/procurement';

// In a real application, this would be replaced with API calls
// For now, we'll use localStorage to persist data between sessions

const STORAGE_KEYS = {
  TENDERS: 'aadf_tenders',
  PROPOSALS: 'aadf_proposals',
  EVALUATIONS: 'aadf_evaluations',
  CONTRACTS: 'aadf_contracts',
};

// Helper function to safely parse JSON from localStorage
const safelyParseJSON = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper function to safely stringify and save JSON to localStorage
const safelySaveJSON = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Initialize with mock data if empty
const initializeData = () => {
  if (typeof window === 'undefined') return;
  
  // Check if tenders exist
  const existingTenders = localStorage.getItem(STORAGE_KEYS.TENDERS);
  if (!existingTenders) {
    const mockTenders = generateMockTenders(10);
    safelySaveJSON(STORAGE_KEYS.TENDERS, mockTenders);
    
    // Generate related data
    const allProposals: Proposal[] = [];
    const allEvaluations: Evaluation[] = [];
    const allContracts: Contract[] = [];
    
    mockTenders.forEach(tender => {
      if (tender.status === 'published' || tender.status === 'evaluation' || tender.status === 'awarded' || tender.status === 'completed') {
        const proposals = generateMockProposals(tender.id, 3 + Math.floor(Math.random() * 3));
        allProposals.push(...proposals);
        
        if (tender.status === 'evaluation' || tender.status === 'awarded' || tender.status === 'completed') {
          const evaluation = generateMockEvaluation(tender.id, proposals);
          allEvaluations.push(evaluation);
          
          if (tender.status === 'awarded' || tender.status === 'completed') {
            const winningProposalId = evaluation.winningProposalId || proposals[0].id;
            const winningProposal = proposals.find(p => p.id === winningProposalId);
            
            if (winningProposal) {
              const contract = generateMockContract(tender.id, winningProposalId, winningProposal.vendorId);
              allContracts.push(contract);
            }
          }
        }
      }
    });
    
    safelySaveJSON(STORAGE_KEYS.PROPOSALS, allProposals);
    safelySaveJSON(STORAGE_KEYS.EVALUATIONS, allEvaluations);
    safelySaveJSON(STORAGE_KEYS.CONTRACTS, allContracts);
  }
};

// Tender Services
export const TenderService = {
  // Get all tenders
  getAllTenders: (): Tender[] => {
    initializeData();
    return safelyParseJSON(STORAGE_KEYS.TENDERS, []);
  },
  
  // Get tender by ID
  getTenderById: (id: string): Tender | null => {
    const tenders = TenderService.getAllTenders();
    return tenders.find(tender => tender.id === id) || null;
  },
  
  // Create new tender
  createTender: (tender: Omit<Tender, 'id' | 'createdAt' | 'updatedAt'>): Tender => {
    const tenders = TenderService.getAllTenders();
    
    const newTender: Tender = {
      ...tender,
      id: `TEN-${1000 + tenders.length}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    tenders.push(newTender);
    safelySaveJSON(STORAGE_KEYS.TENDERS, tenders);
    
    return newTender;
  },
  
  // Update tender
  updateTender: (id: string, updates: Partial<Tender>): Tender | null => {
    const tenders = TenderService.getAllTenders();
    const index = tenders.findIndex(tender => tender.id === id);
    
    if (index === -1) return null;
    
    const updatedTender = {
      ...tenders[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    tenders[index] = updatedTender;
    safelySaveJSON(STORAGE_KEYS.TENDERS, tenders);
    
    return updatedTender;
  },
  
  // Update tender status
  updateTenderStatus: (id: string, status: TenderStatus): Tender | null => {
    return TenderService.updateTender(id, { status });
  },
  
  // Delete tender
  deleteTender: (id: string): boolean => {
    const tenders = TenderService.getAllTenders();
    const filteredTenders = tenders.filter(tender => tender.id !== id);
    
    if (filteredTenders.length === tenders.length) return false;
    
    safelySaveJSON(STORAGE_KEYS.TENDERS, filteredTenders);
    return true;
  },
  
  // Get tenders by status
  getTendersByStatus: (status: TenderStatus): Tender[] => {
    const tenders = TenderService.getAllTenders();
    return tenders.filter(tender => tender.status === status);
  },
  
  // Search tenders
  searchTenders: (query: string): Tender[] => {
    const tenders = TenderService.getAllTenders();
    const lowerQuery = query.toLowerCase();
    
    return tenders.filter(tender => 
      tender.title.toLowerCase().includes(lowerQuery) ||
      tender.reference.toLowerCase().includes(lowerQuery) ||
      tender.description.toLowerCase().includes(lowerQuery) ||
      tender.category.some(cat => cat.toLowerCase().includes(lowerQuery))
    );
  },
};

// Proposal Services
export const ProposalService = {
  // Get all proposals
  getAllProposals: (): Proposal[] => {
    initializeData();
    return safelyParseJSON(STORAGE_KEYS.PROPOSALS, []);
  },
  
  // Get proposal by ID
  getProposalById: (id: string): Proposal | null => {
    const proposals = ProposalService.getAllProposals();
    return proposals.find(proposal => proposal.id === id) || null;
  },
  
  // Get proposals by tender ID
  getProposalsByTenderId: (tenderId: string): Proposal[] => {
    const proposals = ProposalService.getAllProposals();
    return proposals.filter(proposal => proposal.tenderId === tenderId);
  },
  
  // Get proposals by vendor ID
  getProposalsByVendorId: (vendorId: string): Proposal[] => {
    const proposals = ProposalService.getAllProposals();
    return proposals.filter(proposal => proposal.vendorId === vendorId);
  },
  
  // Create new proposal
  createProposal: (proposal: Omit<Proposal, 'id' | 'createdAt' | 'updatedAt'>): Proposal => {
    const proposals = ProposalService.getAllProposals();
    const tenderId = proposal.tenderId;
    const proposalCount = proposals.filter(p => p.tenderId === tenderId).length;
    
    const newProposal: Proposal = {
      ...proposal,
      id: `PROP-${tenderId}-${proposalCount + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    proposals.push(newProposal);
    safelySaveJSON(STORAGE_KEYS.PROPOSALS, proposals);
    
    return newProposal;
  },
  
  // Update proposal
  updateProposal: (id: string, updates: Partial<Proposal>): Proposal | null => {
    const proposals = ProposalService.getAllProposals();
    const index = proposals.findIndex(proposal => proposal.id === id);
    
    if (index === -1) return null;
    
    const updatedProposal = {
      ...proposals[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    proposals[index] = updatedProposal;
    safelySaveJSON(STORAGE_KEYS.PROPOSALS, proposals);
    
    return updatedProposal;
  },
  
  // Update proposal status
  updateProposalStatus: (id: string, status: ProposalStatus): Proposal | null => {
    return ProposalService.updateProposal(id, { status });
  },
  
  // Delete proposal
  deleteProposal: (id: string): boolean => {
    const proposals = ProposalService.getAllProposals();
    const filteredProposals = proposals.filter(proposal => proposal.id !== id);
    
    if (filteredProposals.length === proposals.length) return false;
    
    safelySaveJSON(STORAGE_KEYS.PROPOSALS, filteredProposals);
    return true;
  },
};

// Evaluation Services
export const EvaluationService = {
  // Get all evaluations
  getAllEvaluations: (): Evaluation[] => {
    initializeData();
    return safelyParseJSON(STORAGE_KEYS.EVALUATIONS, []);
  },
  
  // Get evaluation by ID
  getEvaluationById: (id: string): Evaluation | null => {
    const evaluations = EvaluationService.getAllEvaluations();
    return evaluations.find(evaluation => evaluation.id === id) || null;
  },
  
  // Get evaluation by tender ID
  getEvaluationByTenderId: (tenderId: string): Evaluation | null => {
    const evaluations = EvaluationService.getAllEvaluations();
    return evaluations.find(evaluation => evaluation.tenderId === tenderId) || null;
  },
  
  // Create new evaluation
  createEvaluation: (evaluation: Omit<Evaluation, 'id' | 'createdAt' | 'updatedAt'>): Evaluation => {
    const evaluations = EvaluationService.getAllEvaluations();
    
    const newEvaluation: Evaluation = {
      ...evaluation,
      id: `EVAL-${evaluation.tenderId}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    evaluations.push(newEvaluation);
    safelySaveJSON(STORAGE_KEYS.EVALUATIONS, evaluations);
    
    return newEvaluation;
  },
  
  // Update evaluation
  updateEvaluation: (id: string, updates: Partial<Evaluation>): Evaluation | null => {
    const evaluations = EvaluationService.getAllEvaluations();
    const index = evaluations.findIndex(evaluation => evaluation.id === id);
    
    if (index === -1) return null;
    
    const updatedEvaluation = {
      ...evaluations[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    evaluations[index] = updatedEvaluation;
    safelySaveJSON(STORAGE_KEYS.EVALUATIONS, evaluations);
    
    return updatedEvaluation;
  },
  
  // Add score to evaluation
  addScore: (
    evaluationId: string, 
    proposalId: string, 
    criterionId: string, 
    evaluatorId: string, 
    score: number, 
    comments?: string
  ): Evaluation | null => {
    const evaluation = EvaluationService.getEvaluationById(evaluationId);
    if (!evaluation) return null;
    
    const evaluationMatrix = [...evaluation.evaluationMatrix];
    const proposalIndex = evaluationMatrix.findIndex(em => em.proposalId === proposalId);
    
    if (proposalIndex === -1) {
      // Add new proposal to matrix
      evaluationMatrix.push({
        proposalId,
        scores: [{
          criterionId,
          evaluatorId,
          score,
          comments,
        }],
      });
    } else {
      // Update existing proposal
      const scores = [...evaluationMatrix[proposalIndex].scores];
      const scoreIndex = scores.findIndex(s => s.criterionId === criterionId && s.evaluatorId === evaluatorId);
      
      if (scoreIndex === -1) {
        // Add new score
        scores.push({
          criterionId,
          evaluatorId,
          score,
          comments,
        });
      } else {
        // Update existing score
        scores[scoreIndex] = {
          ...scores[scoreIndex],
          score,
          comments,
        };
      }
      
      evaluationMatrix[proposalIndex].scores = scores;
    }
    
    return EvaluationService.updateEvaluation(evaluationId, { evaluationMatrix });
  },
  
  // Finalize evaluation and calculate ranking
  finalizeEvaluation: (evaluationId: string): Evaluation | null => {
    const evaluation = EvaluationService.getEvaluationById(evaluationId);
    if (!evaluation) return null;
    
    const tender = TenderService.getTenderById(evaluation.tenderId);
    if (!tender) return null;
    
    const proposals = ProposalService.getProposalsByTenderId(evaluation.tenderId);
    
    // Calculate average scores and total scores
    const finalRanking = evaluation.evaluationMatrix.map(em => {
      const proposal = proposals.find(p => p.id === em.proposalId);
      if (!proposal) return null;
      
      // Calculate weighted scores for each criterion
      const criterionScores = tender.evaluationCriteria.map(criterion => {
        const scores = em.scores.filter(s => s.criterionId === criterion.id);
        if (scores.length === 0) return 0;
        
        const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
        return (averageScore / criterion.maxScore) * criterion.weight;
      });
      
      const totalScore = criterionScores.reduce((sum, score) => sum + score, 0);
      
      return {
        proposalId: em.proposalId,
        vendorName: proposal.vendorName,
        totalScore,
        rank: 0, // Will be set after sorting
      };
    }).filter(Boolean) as { proposalId: string; vendorName: string; totalScore: number; rank: number; }[];
    
    // Sort by total score and assign ranks
    finalRanking.sort((a, b) => b.totalScore - a.totalScore);
    finalRanking.forEach((ranking, index) => {
      ranking.rank = index + 1;
    });
    
    const winningProposalId = finalRanking.length > 0 ? finalRanking[0].proposalId : undefined;
    
    // Update evaluation
    const updatedEvaluation = EvaluationService.updateEvaluation(evaluationId, {
      status: 'completed',
      endDate: new Date(),
      finalRanking,
      winningProposalId,
    });
    
    // Update tender status
    if (updatedEvaluation && winningProposalId) {
      TenderService.updateTenderStatus(evaluation.tenderId, 'awarded');
      
      // Update winning proposal status
      ProposalService.updateProposalStatus(winningProposalId, 'selected');
      
      // Update other proposals to rejected
      proposals
        .filter(p => p.id !== winningProposalId)
        .forEach(p => ProposalService.updateProposalStatus(p.id, 'rejected'));
    }
    
    return updatedEvaluation;
  },
  
  // Delete evaluation
  deleteEvaluation: (id: string): boolean => {
    const evaluations = EvaluationService.getAllEvaluations();
    const filteredEvaluations = evaluations.filter(evaluation => evaluation.id !== id);
    
    if (filteredEvaluations.length === evaluations.length) return false;
    
    safelySaveJSON(STORAGE_KEYS.EVALUATIONS, filteredEvaluations);
    return true;
  },
};

// Contract Services
export const ContractService = {
  // Get all contracts
  getAllContracts: (): Contract[] => {
    initializeData();
    return safelyParseJSON(STORAGE_KEYS.CONTRACTS, []);
  },
  
  // Get contract by ID
  getContractById: (id: string): Contract | null => {
    const contracts = ContractService.getAllContracts();
    return contracts.find(contract => contract.id === id) || null;
  },
  
  // Get contract by tender ID
  getContractByTenderId: (tenderId: string): Contract | null => {
    const contracts = ContractService.getAllContracts();
    return contracts.find(contract => contract.tenderId === tenderId) || null;
  },
  
  // Create new contract
  createContract: (contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Contract => {
    const contracts = ContractService.getAllContracts();
    
    const newContract: Contract = {
      ...contract,
      id: `CONT-${contract.tenderId}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    contracts.push(newContract);
    safelySaveJSON(STORAGE_KEYS.CONTRACTS, contracts);
    
    return newContract;
  },
  
  // Update contract
  updateContract: (id: string, updates: Partial<Contract>): Contract | null => {
    const contracts = ContractService.getAllContracts();
    const index = contracts.findIndex(contract => contract.id === id);
    
    if (index === -1) return null;
    
    const updatedContract = {
      ...contracts[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    contracts[index] = updatedContract;
    safelySaveJSON(STORAGE_KEYS.CONTRACTS, contracts);
    
    return updatedContract;
  },
  
  // Delete contract
  deleteContract: (id: string): boolean => {
    const contracts = ContractService.getAllContracts();
    const filteredContracts = contracts.filter(contract => contract.id !== id);
    
    if (filteredContracts.length === contracts.length) return false;
    
    safelySaveJSON(STORAGE_KEYS.CONTRACTS, filteredContracts);
    return true;
  },
  
  // Update milestone status
  updateMilestoneStatus: (
    contractId: string, 
    milestoneId: string, 
    status: 'pending' | 'completed' | 'delayed',
    completionDate?: Date
  ): Contract | null => {
    const contract = ContractService.getContractById(contractId);
    if (!contract || !contract.milestones) return null;
    
    const milestones = [...contract.milestones];
    const milestoneIndex = milestones.findIndex(m => m.id === milestoneId);
    
    if (milestoneIndex === -1) return null;
    
    milestones[milestoneIndex] = {
      ...milestones[milestoneIndex],
      status,
      completionDate: status === 'completed' ? completionDate || new Date() : undefined,
    };
    
    return ContractService.updateContract(contractId, { milestones });
  },
};
