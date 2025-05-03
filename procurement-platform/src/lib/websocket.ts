// This is a mock WebSocket service for the procurement platform
// In a real implementation, this would connect to a real WebSocket server

export class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private userId: string | null = null;
  
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
    console.log(`[WebSocket] Connecting for user ${userId}...`);
    
    // Simulate connection events
    setTimeout(() => {
      this.emit('connect', { userId });
      console.log('[WebSocket] Connected');
      
      // Simulate receiving notifications
      this.startSimulatingNotifications();
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
    
    this.userId = null;
    this.reconnectAttempts = 0;
    console.log('[WebSocket] Disconnected');
  }
  
  // Add event listener
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    
    this.listeners.get(event)?.push(callback);
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
  
  // Simulate receiving notifications
  private startSimulatingNotifications() {
    if (!this.userId) return;
    
    // Simulate receiving notifications every 30-60 seconds
    const interval = setInterval(() => {
      // Only send simulated notifications occasionally
      if (Math.random() > 0.7) {
        const simulatedEvents = [
          {
            type: 'notification',
            data: {
              type: 'info',
              title: 'New Tender Published',
              message: 'A new tender has been published that matches your interests.',
              link: '/tenders',
              linkText: 'View Tender',
              entityType: 'tender',
              entityId: `tender-${Date.now()}`
            }
          },
          {
            type: 'notification',
            data: {
              type: 'warning',
              title: 'Tender Deadline Approaching',
              message: 'The deadline for "Urban Development Project" is in 2 days.',
              link: '/tenders/urban-development',
              linkText: 'View Tender',
              entityType: 'tender',
              entityId: 'urban-development'
            }
          },
          {
            type: 'tender_update',
            data: {
              tenderId: 'tender-123',
              title: 'Urban Development Project',
              status: 'updated',
              message: 'The tender details have been updated.'
            }
          },
          {
            type: 'proposal_status',
            data: {
              proposalId: 'proposal-456',
              title: 'Infrastructure Proposal',
              status: 'under_review',
              message: 'Your proposal is now under review.'
            }
          }
        ];
        
        const randomEvent = simulatedEvents[Math.floor(Math.random() * simulatedEvents.length)];
        this.emit(randomEvent.type, randomEvent.data);
        console.log(`[WebSocket] Received ${randomEvent.type} event`);
      }
    }, Math.random() * 30000 + 30000); // Random interval between 30-60 seconds
    
    // Clean up interval when disconnecting
    this.on('disconnect', () => {
      clearInterval(interval);
    });
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();
