'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  link?: string;
  linkText?: string;
  createdAt: string;
  read: boolean;
  entityType?: string;
  entityId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Fetch notifications when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
      setupWebSocket();
    } else {
      setNotifications([]);
      setUnreadCount(0);
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }

    return () => {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    };
  }, [user]);

  // Setup WebSocket connection
  const setupWebSocket = () => {
    // In a real implementation, this would connect to a real WebSocket server
    // For now, we'll simulate WebSocket behavior
    
    // Simulate receiving notifications every 30 seconds
    const interval = setInterval(() => {
      // Only add simulated notifications occasionally
      if (Math.random() > 0.7) {
        const simulatedTypes = ['info', 'success', 'warning'] as const;
        const randomType = simulatedTypes[Math.floor(Math.random() * simulatedTypes.length)];
        
        const simulatedNotifications = [
          {
            type: randomType,
            title: 'New Tender Published',
            message: 'A new tender has been published that matches your interests.',
            link: '/tenders',
            linkText: 'View Tender',
            entityType: 'tender',
            entityId: `tender-${Date.now()}`
          },
          {
            type: randomType,
            title: 'Tender Deadline Approaching',
            message: 'The deadline for "Urban Development Project" is in 2 days.',
            link: '/tenders/urban-development',
            linkText: 'View Tender',
            entityType: 'tender',
            entityId: 'urban-development'
          },
          {
            type: randomType,
            title: 'Proposal Evaluation Complete',
            message: 'Your proposal for "Digital Transformation" has been evaluated.',
            link: '/proposals/digital-transformation',
            linkText: 'View Evaluation',
            entityType: 'proposal',
            entityId: 'digital-transformation'
          }
        ];
        
        const randomNotification = simulatedNotifications[Math.floor(Math.random() * simulatedNotifications.length)];
        addNotification(randomNotification);
      }
    }, 30000);

    return () => clearInterval(interval);
  };

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'info',
          title: 'New Tender Published',
          message: 'A new tender "Urban Trails Project" has been published.',
          link: '/tenders/urban-trails',
          linkText: 'View Tender',
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          read: false,
          entityType: 'tender',
          entityId: 'urban-trails'
        },
        {
          id: '2',
          type: 'warning',
          title: 'Tender Deadline Approaching',
          message: 'The deadline for "Digital Transformation" tender is tomorrow.',
          link: '/tenders/digital-transformation',
          linkText: 'View Tender',
          createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          read: false,
          entityType: 'tender',
          entityId: 'digital-transformation'
        },
        {
          id: '3',
          type: 'success',
          title: 'Proposal Submitted',
          message: 'Your proposal for "Infrastructure Project" has been submitted successfully.',
          link: '/proposals/infrastructure-project',
          linkText: 'View Proposal',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          read: true,
          entityType: 'proposal',
          entityId: 'infrastructure-project'
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll update the state directly
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll update the state directly
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Clear a notification
  const clearNotification = async (id: string) => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll update the state directly
      
      const notificationToRemove = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      if (notificationToRemove && !notificationToRemove.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error clearing notification:', error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll update the state directly
      
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Play notification sound
    const audio = new Audio('/sounds/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
    
    // Show browser notification if supported and permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: '/logo.png'
      });
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
