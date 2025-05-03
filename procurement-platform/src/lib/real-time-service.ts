// This is a real-time update service for the procurement platform
// In a real implementation, this would connect to a real WebSocket server

export interface RealTimeUpdate {
  id: string;
  type: 'tender' | 'proposal' | 'document' | 'evaluation' | 'approval' | 'system';
  action: string;
  entityId: string;
  entityTitle?: string;
  data: any;
  timestamp: string;
}

export class RealTimeService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private userId: string | null = null;
  private connected = false;
  private updateQueue: RealTimeUpdate[] = [];
  
  constructor() {
    // This is a mock implementation
    // In a real app, we would connect to a real WebSocket server
  }
  
  // Connect to WebSocket server
  connect(userId: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return;
    }
    
    this.userId = userId;
    
    // In a real implementation, this would connect to a real WebSocket server
    // For now, we'll simulate WebSocket behavior
    console.log(`[RealTime] Connecting for user ${userId}...`);
    
    // Simulate connection events
    setTimeout(() => {
      this.connected = true;
      this.emit('connect', { userId });
      console.log('[RealTime] Connected');
      
      // Process any queued updates
      this.processQueue();
      
      // Simulate receiving updates
      this.startSimulatingUpdates();
    }, 500);
  }
  
  // Disconnect from WebSocket server
  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    
    this.connected = false;
    this.userId = null;
    this.reconnectAttempts = 0;
    console.log('[RealTime] Disconnected');
    
    this.emit('disconnect', {});
  }
  
  // Add event listener
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)?.push(callback);
    return () => this.off(event, callback);
  }
  
  // Remove event listener
  off(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      return;
    }
    
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  // Send update to server
  sendUpdate(update: Omit<RealTimeUpdate, 'id' | 'timestamp'>) {
    if (!this.userId) {
      console.warn('[RealTime] Cannot send update: not connected');
      return;
    }
    
    const fullUpdate: RealTimeUpdate = {
      ...update,
      id: `update-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    
    // In a real implementation, this would send the update to the server
    console.log('[RealTime] Sending update:', fullUpdate);
    
    // For now, we'll just emit the update locally after a short delay
    setTimeout(() => {
      this.emit(update.type, fullUpdate);
      this.emit('update', fullUpdate);
    }, 100);
    
    return fullUpdate;
  }
  
  // Queue update to be sent when connected
  queueUpdate(update: Omit<RealTimeUpdate, 'id' | 'timestamp'>) {
    const fullUpdate: RealTimeUpdate = {
      ...update,
      id: `update-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    
    this.updateQueue.push(fullUpdate);
    
    if (this.connected) {
      this.processQueue();
    }
    
    return fullUpdate;
  }
  
  // Process queued updates
  private processQueue() {
    if (!this.connected || this.updateQueue.length === 0) {
      return;
    }
    
    console.log(`[RealTime] Processing ${this.updateQueue.length} queued updates`);
    
    // Process all queued updates
    this.updateQueue.forEach(update => {
      this.emit(update.type, update);
      this.emit('update', update);
    });
    
    // Clear the queue
    this.updateQueue = [];
  }
  
  // Emit event to listeners
  private emit(event: string, data: any) {
    if (!this.listeners.has(event)) {
      return;
    }
    
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
  
  // Simulate receiving updates
  private startSimulatingUpdates() {
    if (!this.userId) return;
    
    // Simulate receiving updates every 20-40 seconds
    const interval = setInterval(() => {
      // Only send simulated updates occasionally
      if (Math.random() > 0.7) {
        const simulatedUpdates = [
          {
            type: 'tender' as const,
            action: 'updated',
            entityId: 'tender-123',
            entityTitle: 'Urban Development Project',
            data: {
              status: 'updated',
              updatedFields: ['deadline', 'budget'],
              updatedBy: 'Admin User'
            }
          },
          {
            type: 'proposal' as const,
            action: 'new_evaluation',
            entityId: 'proposal-456',
            entityTitle: 'Infrastructure Proposal',
            data: {
              evaluatorName: 'John Smith',
              score: 85,
              comments: 'Good proposal with strong technical approach'
            }
          },
          {
            type: 'document' as const,
            action: 'uploaded',
            entityId: 'document-789',
            entityTitle: 'Technical Specifications',
            data: {
              uploadedBy: 'Jane Doe',
              fileType: 'PDF',
              fileSize: '2.4 MB'
            }
          },
          {
            type: 'system' as const,
            action: 'maintenance',
            entityId: 'system-1',
            data: {
              message: 'The system will undergo maintenance in 2 hours',
              duration: '30 minutes',
              affectedServices: ['document upload', 'proposal submission']
            }
          }
        ];
        
        const randomUpdate = simulatedUpdates[Math.floor(Math.random() * simulatedUpdates.length)];
        const fullUpdate: RealTimeUpdate = {
          ...randomUpdate,
          id: `update-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        };
        
        this.emit(randomUpdate.type, fullUpdate);
        this.emit('update', fullUpdate);
        console.log(`[RealTime] Received ${randomUpdate.type} update:`, fullUpdate);
      }
    }, Math.random() * 20000 + 20000); // Random interval between 20-40 seconds
    
    // Clean up interval when disconnecting
    this.on('disconnect', () => {
      clearInterval(interval);
    });
  }
}

// Create singleton instance
export const realTimeService = new RealTimeService();
