import { Notification } from '@/contexts/NotificationContext';

// This file contains functions to trigger notifications based on different events in the application

// Trigger notification for tender events
export const triggerTenderNotification = async (
  event: 'created' | 'updated' | 'deadline_approaching' | 'closed' | 'awarded' | 'cancelled',
  tenderId: string,
  tenderTitle: string,
  userId: string,
  additionalInfo?: Record<string, any>
) => {
  let notification: Omit<Notification, 'id' | 'createdAt' | 'read'>;
  
  switch (event) {
    case 'created':
      notification = {
        type: 'info',
        title: 'New Tender Published',
        message: `A new tender "${tenderTitle}" has been published.`,
        link: `/tenders/${tenderId}`,
        linkText: 'View Tender',
        entityType: 'tender',
        entityId: tenderId
      };
      break;
      
    case 'updated':
      notification = {
        type: 'info',
        title: 'Tender Updated',
        message: `The tender "${tenderTitle}" has been updated.`,
        link: `/tenders/${tenderId}`,
        linkText: 'View Updates',
        entityType: 'tender',
        entityId: tenderId
      };
      break;
      
    case 'deadline_approaching':
      const daysLeft = additionalInfo?.daysLeft || 'few';
      notification = {
        type: 'warning',
        title: 'Tender Deadline Approaching',
        message: `The deadline for "${tenderTitle}" is in ${daysLeft} days.`,
        link: `/tenders/${tenderId}`,
        linkText: 'View Tender',
        entityType: 'tender',
        entityId: tenderId
      };
      break;
      
    case 'closed':
      notification = {
        type: 'info',
        title: 'Tender Closed',
        message: `The tender "${tenderTitle}" has closed for submissions.`,
        link: `/tenders/${tenderId}`,
        linkText: 'View Tender',
        entityType: 'tender',
        entityId: tenderId
      };
      break;
      
    case 'awarded':
      const winnerName = additionalInfo?.winnerName || 'a vendor';
      notification = {
        type: 'success',
        title: 'Tender Awarded',
        message: `The tender "${tenderTitle}" has been awarded to ${winnerName}.`,
        link: `/tenders/${tenderId}`,
        linkText: 'View Results',
        entityType: 'tender',
        entityId: tenderId
      };
      break;
      
    case 'cancelled':
      notification = {
        type: 'error',
        title: 'Tender Cancelled',
        message: `The tender "${tenderTitle}" has been cancelled.`,
        link: `/tenders/${tenderId}`,
        linkText: 'View Details',
        entityType: 'tender',
        entityId: tenderId
      };
      break;
      
    default:
      throw new Error(`Unknown tender event: ${event}`);
  }
  
  // In a real implementation, this would call the API to create the notification
  // For now, we'll just return the notification object
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...notification,
        userId
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create notification');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Trigger notification for proposal events
export const triggerProposalNotification = async (
  event: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'feedback',
  proposalId: string,
  proposalTitle: string,
  tenderId: string,
  tenderTitle: string,
  userId: string,
  additionalInfo?: Record<string, any>
) => {
  let notification: Omit<Notification, 'id' | 'createdAt' | 'read'>;
  
  switch (event) {
    case 'submitted':
      notification = {
        type: 'success',
        title: 'Proposal Submitted',
        message: `Your proposal for "${tenderTitle}" has been submitted successfully.`,
        link: `/tenders/${tenderId}/proposals/${proposalId}`,
        linkText: 'View Proposal',
        entityType: 'proposal',
        entityId: proposalId
      };
      break;
      
    case 'under_review':
      notification = {
        type: 'info',
        title: 'Proposal Under Review',
        message: `Your proposal for "${tenderTitle}" is now under review.`,
        link: `/tenders/${tenderId}/proposals/${proposalId}`,
        linkText: 'View Status',
        entityType: 'proposal',
        entityId: proposalId
      };
      break;
      
    case 'accepted':
      notification = {
        type: 'success',
        title: 'Proposal Accepted',
        message: `Congratulations! Your proposal for "${tenderTitle}" has been accepted.`,
        link: `/tenders/${tenderId}/proposals/${proposalId}`,
        linkText: 'View Details',
        entityType: 'proposal',
        entityId: proposalId
      };
      break;
      
    case 'rejected':
      notification = {
        type: 'error',
        title: 'Proposal Rejected',
        message: `We regret to inform you that your proposal for "${tenderTitle}" has not been accepted.`,
        link: `/tenders/${tenderId}/proposals/${proposalId}`,
        linkText: 'View Details',
        entityType: 'proposal',
        entityId: proposalId
      };
      break;
      
    case 'feedback':
      notification = {
        type: 'info',
        title: 'New Feedback Received',
        message: `You have received feedback on your proposal for "${tenderTitle}".`,
        link: `/tenders/${tenderId}/proposals/${proposalId}/feedback`,
        linkText: 'View Feedback',
        entityType: 'proposal',
        entityId: proposalId
      };
      break;
      
    default:
      throw new Error(`Unknown proposal event: ${event}`);
  }
  
  // In a real implementation, this would call the API to create the notification
  // For now, we'll just return the notification object
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...notification,
        userId
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create notification');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Trigger notification for document events
export const triggerDocumentNotification = async (
  event: 'uploaded' | 'validated' | 'invalid' | 'updated',
  documentId: string,
  documentName: string,
  entityType: string,
  entityId: string,
  userId: string,
  additionalInfo?: Record<string, any>
) => {
  let notification: Omit<Notification, 'id' | 'createdAt' | 'read'>;
  
  switch (event) {
    case 'uploaded':
      notification = {
        type: 'info',
        title: 'Document Uploaded',
        message: `The document "${documentName}" has been uploaded successfully.`,
        link: `/${entityType}s/${entityId}/documents/${documentId}`,
        linkText: 'View Document',
        entityType: 'document',
        entityId: documentId
      };
      break;
      
    case 'validated':
      notification = {
        type: 'success',
        title: 'Document Validated',
        message: `The document "${documentName}" has been validated successfully.`,
        link: `/${entityType}s/${entityId}/documents/${documentId}`,
        linkText: 'View Validation',
        entityType: 'document',
        entityId: documentId
      };
      break;
      
    case 'invalid':
      const issues = additionalInfo?.issues || 'validation issues';
      notification = {
        type: 'warning',
        title: 'Document Validation Failed',
        message: `The document "${documentName}" has ${issues}.`,
        link: `/${entityType}s/${entityId}/documents/${documentId}`,
        linkText: 'View Issues',
        entityType: 'document',
        entityId: documentId
      };
      break;
      
    case 'updated':
      notification = {
        type: 'info',
        title: 'Document Updated',
        message: `The document "${documentName}" has been updated.`,
        link: `/${entityType}s/${entityId}/documents/${documentId}`,
        linkText: 'View Document',
        entityType: 'document',
        entityId: documentId
      };
      break;
      
    default:
      throw new Error(`Unknown document event: ${event}`);
  }
  
  // In a real implementation, this would call the API to create the notification
  // For now, we'll just return the notification object
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...notification,
        userId
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create notification');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

// Trigger notification for approval events
export const triggerApprovalNotification = async (
  event: 'requested' | 'approved' | 'rejected',
  approvalId: string,
  resourceType: string,
  resourceId: string,
  resourceName: string,
  userId: string,
  additionalInfo?: Record<string, any>
) => {
  let notification: Omit<Notification, 'id' | 'createdAt' | 'read'>;
  
  switch (event) {
    case 'requested':
      const requesterName = additionalInfo?.requesterName || 'Someone';
      notification = {
        type: 'info',
        title: 'Approval Requested',
        message: `${requesterName} has requested your approval for "${resourceName}".`,
        link: `/approvals/${approvalId}`,
        linkText: 'Review Request',
        entityType: resourceType,
        entityId: resourceId
      };
      break;
      
    case 'approved':
      const approverName = additionalInfo?.approverName || 'Someone';
      notification = {
        type: 'success',
        title: 'Request Approved',
        message: `${approverName} has approved your request for "${resourceName}".`,
        link: `/${resourceType}s/${resourceId}`,
        linkText: 'View Details',
        entityType: resourceType,
        entityId: resourceId
      };
      break;
      
    case 'rejected':
      const rejectorName = additionalInfo?.rejectorName || 'Someone';
      const reason = additionalInfo?.reason || 'No reason provided';
      notification = {
        type: 'error',
        title: 'Request Rejected',
        message: `${rejectorName} has rejected your request for "${resourceName}". Reason: ${reason}`,
        link: `/${resourceType}s/${resourceId}`,
        linkText: 'View Details',
        entityType: resourceType,
        entityId: resourceId
      };
      break;
      
    default:
      throw new Error(`Unknown approval event: ${event}`);
  }
  
  // In a real implementation, this would call the API to create the notification
  // For now, we'll just return the notification object
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...notification,
        userId
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create notification');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};
