'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { realTimeService, RealTimeUpdate } from '@/lib/real-time-service';
import { useToast } from '@/app/context/ToastContext';

interface RealTimeContextType {
  isConnected: boolean;
  updates: RealTimeUpdate[];
  lastUpdate: RealTimeUpdate | null;
  sendUpdate: (update: Omit<RealTimeUpdate, 'id' | 'timestamp'>) => RealTimeUpdate | undefined;
  clearUpdates: () => void;
}

const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined);

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (context === undefined) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

interface RealTimeProviderProps {
  children: ReactNode;
}

export const RealTimeProvider: React.FC<RealTimeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [isConnected, setIsConnected] = useState(false);
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([]);
  const [lastUpdate, setLastUpdate] = useState<RealTimeUpdate | null>(null);
  
  // Connect to real-time service when user changes
  useEffect(() => {
    if (user) {
      realTimeService.connect(user.id);
    } else {
      realTimeService.disconnect();
      setIsConnected(false);
      setUpdates([]);
      setLastUpdate(null);
    }
  }, [user]);
  
  // Set up event listeners
  useEffect(() => {
    if (!user) return;
    
    // Connection events
    const connectHandler = () => {
      setIsConnected(true);
    };
    
    const disconnectHandler = () => {
      setIsConnected(false);
    };
    
    // Update events
    const updateHandler = (update: RealTimeUpdate) => {
      setUpdates(prev => [update, ...prev].slice(0, 50)); // Keep only the last 50 updates
      setLastUpdate(update);
      
      // Show toast for important updates
      if (shouldShowToast(update)) {
        showToast({
          type: getToastType(update),
          title: getToastTitle(update),
          message: getToastMessage(update)
        });
      }
    };
    
    // Register event handlers
    realTimeService.on('connect', connectHandler);
    realTimeService.on('disconnect', disconnectHandler);
    realTimeService.on('update', updateHandler);
    realTimeService.on('tender', updateHandler);
    realTimeService.on('proposal', updateHandler);
    realTimeService.on('document', updateHandler);
    realTimeService.on('evaluation', updateHandler);
    realTimeService.on('approval', updateHandler);
    realTimeService.on('system', updateHandler);
    
    // Clean up event handlers
    return () => {
      realTimeService.off('connect', connectHandler);
      realTimeService.off('disconnect', disconnectHandler);
      realTimeService.off('update', updateHandler);
      realTimeService.off('tender', updateHandler);
      realTimeService.off('proposal', updateHandler);
      realTimeService.off('document', updateHandler);
      realTimeService.off('evaluation', updateHandler);
      realTimeService.off('approval', updateHandler);
      realTimeService.off('system', updateHandler);
    };
  }, [user, showToast]);
  
  // Send update to real-time service
  const sendUpdate = (update: Omit<RealTimeUpdate, 'id' | 'timestamp'>) => {
    if (!user) return;
    return realTimeService.sendUpdate(update);
  };
  
  // Clear all updates
  const clearUpdates = () => {
    setUpdates([]);
    setLastUpdate(null);
  };
  
  const value = {
    isConnected,
    updates,
    lastUpdate,
    sendUpdate,
    clearUpdates
  };
  
  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  );
};

// Helper functions for toast notifications

// Determine if a toast should be shown for this update
function shouldShowToast(update: RealTimeUpdate): boolean {
  // Show toasts for system updates and important events
  if (update.type === 'system') return true;
  
  // Show toasts for specific actions
  const importantActions = [
    'created', 'updated', 'closed', 'awarded', 'cancelled', // Tender actions
    'submitted', 'accepted', 'rejected', // Proposal actions
    'validated', 'invalid', // Document actions
    'requested', 'approved', 'rejected' // Approval actions
  ];
  
  return importantActions.includes(update.action);
}

// Get toast type based on update
function getToastType(update: RealTimeUpdate): 'info' | 'success' | 'warning' | 'error' {
  // Success actions
  if (['created', 'submitted', 'validated', 'approved', 'accepted', 'awarded'].includes(update.action)) {
    return 'success';
  }
  
  // Warning actions
  if (['updated', 'invalid', 'requested', 'closed'].includes(update.action)) {
    return 'warning';
  }
  
  // Error actions
  if (['cancelled', 'rejected'].includes(update.action)) {
    return 'error';
  }
  
  // Default to info
  return 'info';
}

// Get toast title based on update
function getToastTitle(update: RealTimeUpdate): string {
  const typeMap: Record<string, string> = {
    'tender': 'Tender',
    'proposal': 'Proposal',
    'document': 'Document',
    'evaluation': 'Evaluation',
    'approval': 'Approval',
    'system': 'System'
  };
  
  const actionMap: Record<string, string> = {
    'created': 'Created',
    'updated': 'Updated',
    'closed': 'Closed',
    'awarded': 'Awarded',
    'cancelled': 'Cancelled',
    'submitted': 'Submitted',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'validated': 'Validated',
    'invalid': 'Invalid',
    'requested': 'Requested',
    'approved': 'Approved',
    'maintenance': 'Maintenance'
  };
  
  const type = typeMap[update.type] || update.type;
  const action = actionMap[update.action] || update.action.replace('_', ' ');
  
  return `${type} ${action}`;
}

// Get toast message based on update
function getToastMessage(update: RealTimeUpdate): string {
  if (update.type === 'system' && update.action === 'maintenance') {
    return update.data.message || 'System maintenance scheduled';
  }
  
  if (update.entityTitle) {
    return `"${update.entityTitle}" has been ${update.action.replace('_', ' ')}`;
  }
  
  return `A ${update.type} has been ${update.action.replace('_', ' ')}`;
}
