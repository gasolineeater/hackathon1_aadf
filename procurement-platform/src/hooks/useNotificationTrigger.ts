'use client';

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  triggerTenderNotification,
  triggerProposalNotification,
  triggerDocumentNotification,
  triggerApprovalNotification
} from '@/lib/notification-triggers';

export const useNotificationTrigger = () => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  // Trigger tender notification
  const notifyTender = useCallback(
    async (
      event: 'created' | 'updated' | 'deadline_approaching' | 'closed' | 'awarded' | 'cancelled',
      tenderId: string,
      tenderTitle: string,
      additionalInfo?: Record<string, any>
    ) => {
      if (!user) return null;
      
      try {
        // In a real implementation, this would call the API
        // For now, we'll create a local notification
        const notificationData = {
          type: event === 'awarded' ? 'success' : event === 'cancelled' ? 'error' : event === 'deadline_approaching' ? 'warning' : 'info',
          title: `Tender ${event.charAt(0).toUpperCase() + event.slice(1).replace('_', ' ')}`,
          message: getMessageForTenderEvent(event, tenderTitle, additionalInfo),
          link: `/tenders/${tenderId}`,
          linkText: 'View Tender',
          entityType: 'tender',
          entityId: tenderId
        } as const;
        
        // Add notification locally
        addNotification(notificationData);
        
        // Also trigger server-side notification
        await triggerTenderNotification(
          event,
          tenderId,
          tenderTitle,
          user.id,
          additionalInfo
        );
        
        return true;
      } catch (error) {
        console.error('Error triggering tender notification:', error);
        return false;
      }
    },
    [user, addNotification]
  );
  
  // Trigger proposal notification
  const notifyProposal = useCallback(
    async (
      event: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'feedback',
      proposalId: string,
      proposalTitle: string,
      tenderId: string,
      tenderTitle: string,
      additionalInfo?: Record<string, any>
    ) => {
      if (!user) return null;
      
      try {
        // In a real implementation, this would call the API
        // For now, we'll create a local notification
        const notificationData = {
          type: event === 'accepted' ? 'success' : event === 'rejected' ? 'error' : event === 'submitted' ? 'success' : 'info',
          title: `Proposal ${event.charAt(0).toUpperCase() + event.slice(1).replace('_', ' ')}`,
          message: getMessageForProposalEvent(event, proposalTitle, tenderTitle, additionalInfo),
          link: `/tenders/${tenderId}/proposals/${proposalId}`,
          linkText: 'View Proposal',
          entityType: 'proposal',
          entityId: proposalId
        } as const;
        
        // Add notification locally
        addNotification(notificationData);
        
        // Also trigger server-side notification
        await triggerProposalNotification(
          event,
          proposalId,
          proposalTitle,
          tenderId,
          tenderTitle,
          user.id,
          additionalInfo
        );
        
        return true;
      } catch (error) {
        console.error('Error triggering proposal notification:', error);
        return false;
      }
    },
    [user, addNotification]
  );
  
  // Trigger document notification
  const notifyDocument = useCallback(
    async (
      event: 'uploaded' | 'validated' | 'invalid' | 'updated',
      documentId: string,
      documentName: string,
      entityType: string,
      entityId: string,
      additionalInfo?: Record<string, any>
    ) => {
      if (!user) return null;
      
      try {
        // In a real implementation, this would call the API
        // For now, we'll create a local notification
        const notificationData = {
          type: event === 'validated' ? 'success' : event === 'invalid' ? 'warning' : 'info',
          title: `Document ${event.charAt(0).toUpperCase() + event.slice(1)}`,
          message: getMessageForDocumentEvent(event, documentName, additionalInfo),
          link: `/${entityType}s/${entityId}/documents/${documentId}`,
          linkText: 'View Document',
          entityType: 'document',
          entityId: documentId
        } as const;
        
        // Add notification locally
        addNotification(notificationData);
        
        // Also trigger server-side notification
        await triggerDocumentNotification(
          event,
          documentId,
          documentName,
          entityType,
          entityId,
          user.id,
          additionalInfo
        );
        
        return true;
      } catch (error) {
        console.error('Error triggering document notification:', error);
        return false;
      }
    },
    [user, addNotification]
  );
  
  // Trigger approval notification
  const notifyApproval = useCallback(
    async (
      event: 'requested' | 'approved' | 'rejected',
      approvalId: string,
      resourceType: string,
      resourceId: string,
      resourceName: string,
      additionalInfo?: Record<string, any>
    ) => {
      if (!user) return null;
      
      try {
        // In a real implementation, this would call the API
        // For now, we'll create a local notification
        const notificationData = {
          type: event === 'approved' ? 'success' : event === 'rejected' ? 'error' : 'info',
          title: `Approval ${event.charAt(0).toUpperCase() + event.slice(1)}`,
          message: getMessageForApprovalEvent(event, resourceName, additionalInfo),
          link: event === 'requested' ? `/approvals/${approvalId}` : `/${resourceType}s/${resourceId}`,
          linkText: event === 'requested' ? 'Review Request' : 'View Details',
          entityType: resourceType,
          entityId: resourceId
        } as const;
        
        // Add notification locally
        addNotification(notificationData);
        
        // Also trigger server-side notification
        await triggerApprovalNotification(
          event,
          approvalId,
          resourceType,
          resourceId,
          resourceName,
          user.id,
          additionalInfo
        );
        
        return true;
      } catch (error) {
        console.error('Error triggering approval notification:', error);
        return false;
      }
    },
    [user, addNotification]
  );
  
  return {
    notifyTender,
    notifyProposal,
    notifyDocument,
    notifyApproval
  };
};

// Helper functions to get notification messages
function getMessageForTenderEvent(
  event: string,
  tenderTitle: string,
  additionalInfo?: Record<string, any>
): string {
  switch (event) {
    case 'created':
      return `A new tender "${tenderTitle}" has been published.`;
    case 'updated':
      return `The tender "${tenderTitle}" has been updated.`;
    case 'deadline_approaching':
      const daysLeft = additionalInfo?.daysLeft || 'few';
      return `The deadline for "${tenderTitle}" is in ${daysLeft} days.`;
    case 'closed':
      return `The tender "${tenderTitle}" has closed for submissions.`;
    case 'awarded':
      const winnerName = additionalInfo?.winnerName || 'a vendor';
      return `The tender "${tenderTitle}" has been awarded to ${winnerName}.`;
    case 'cancelled':
      return `The tender "${tenderTitle}" has been cancelled.`;
    default:
      return `Event related to tender "${tenderTitle}".`;
  }
}

function getMessageForProposalEvent(
  event: string,
  proposalTitle: string,
  tenderTitle: string,
  additionalInfo?: Record<string, any>
): string {
  switch (event) {
    case 'submitted':
      return `Your proposal for "${tenderTitle}" has been submitted successfully.`;
    case 'under_review':
      return `Your proposal for "${tenderTitle}" is now under review.`;
    case 'accepted':
      return `Congratulations! Your proposal for "${tenderTitle}" has been accepted.`;
    case 'rejected':
      return `We regret to inform you that your proposal for "${tenderTitle}" has not been accepted.`;
    case 'feedback':
      return `You have received feedback on your proposal for "${tenderTitle}".`;
    default:
      return `Event related to your proposal for "${tenderTitle}".`;
  }
}

function getMessageForDocumentEvent(
  event: string,
  documentName: string,
  additionalInfo?: Record<string, any>
): string {
  switch (event) {
    case 'uploaded':
      return `The document "${documentName}" has been uploaded successfully.`;
    case 'validated':
      return `The document "${documentName}" has been validated successfully.`;
    case 'invalid':
      const issues = additionalInfo?.issues || 'validation issues';
      return `The document "${documentName}" has ${issues}.`;
    case 'updated':
      return `The document "${documentName}" has been updated.`;
    default:
      return `Event related to document "${documentName}".`;
  }
}

function getMessageForApprovalEvent(
  event: string,
  resourceName: string,
  additionalInfo?: Record<string, any>
): string {
  switch (event) {
    case 'requested':
      const requesterName = additionalInfo?.requesterName || 'Someone';
      return `${requesterName} has requested your approval for "${resourceName}".`;
    case 'approved':
      const approverName = additionalInfo?.approverName || 'Someone';
      return `${approverName} has approved your request for "${resourceName}".`;
    case 'rejected':
      const rejectorName = additionalInfo?.rejectorName || 'Someone';
      const reason = additionalInfo?.reason || 'No reason provided';
      return `${rejectorName} has rejected your request for "${resourceName}". Reason: ${reason}`;
    default:
      return `Event related to approval for "${resourceName}".`;
  }
}
