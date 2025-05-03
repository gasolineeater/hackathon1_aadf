'use client';

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealTime } from '@/contexts/RealTimeContext';
import { RealTimeUpdate } from '@/lib/real-time-service';

export const useRealTimeUpdate = () => {
  const { user } = useAuth();
  const { sendUpdate } = useRealTime();
  
  // Tender updates
  const updateTender = useCallback(
    (
      action: string,
      tenderId: string,
      tenderTitle: string,
      data: any = {}
    ) => {
      if (!user) return null;
      
      return sendUpdate({
        type: 'tender',
        action,
        entityId: tenderId,
        entityTitle: tenderTitle,
        data
      });
    },
    [user, sendUpdate]
  );
  
  // Proposal updates
  const updateProposal = useCallback(
    (
      action: string,
      proposalId: string,
      proposalTitle: string,
      data: any = {}
    ) => {
      if (!user) return null;
      
      return sendUpdate({
        type: 'proposal',
        action,
        entityId: proposalId,
        entityTitle: proposalTitle,
        data
      });
    },
    [user, sendUpdate]
  );
  
  // Document updates
  const updateDocument = useCallback(
    (
      action: string,
      documentId: string,
      documentTitle: string,
      data: any = {}
    ) => {
      if (!user) return null;
      
      return sendUpdate({
        type: 'document',
        action,
        entityId: documentId,
        entityTitle: documentTitle,
        data
      });
    },
    [user, sendUpdate]
  );
  
  // Evaluation updates
  const updateEvaluation = useCallback(
    (
      action: string,
      evaluationId: string,
      evaluationTitle: string,
      data: any = {}
    ) => {
      if (!user) return null;
      
      return sendUpdate({
        type: 'evaluation',
        action,
        entityId: evaluationId,
        entityTitle: evaluationTitle,
        data
      });
    },
    [user, sendUpdate]
  );
  
  // Approval updates
  const updateApproval = useCallback(
    (
      action: string,
      approvalId: string,
      approvalTitle: string,
      data: any = {}
    ) => {
      if (!user) return null;
      
      return sendUpdate({
        type: 'approval',
        action,
        entityId: approvalId,
        entityTitle: approvalTitle,
        data
      });
    },
    [user, sendUpdate]
  );
  
  // System updates
  const updateSystem = useCallback(
    (
      action: string,
      data: any = {}
    ) => {
      if (!user) return null;
      
      return sendUpdate({
        type: 'system',
        action,
        entityId: `system-${Date.now()}`,
        data
      });
    },
    [user, sendUpdate]
  );
  
  return {
    updateTender,
    updateProposal,
    updateDocument,
    updateEvaluation,
    updateApproval,
    updateSystem
  };
};
