'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function NotificationPermission() {
  const { user } = useAuth();
  const [permissionState, setPermissionState] = useState<NotificationPermission | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  
  useEffect(() => {
    // Only show for logged-in users and if browser supports notifications
    if (user && 'Notification' in window) {
      setPermissionState(Notification.permission);
      
      // Show prompt if permission is not granted or denied
      if (Notification.permission === 'default') {
        // Wait a bit before showing the prompt to not overwhelm the user
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user]);
  
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);
      setShowPrompt(false);
      
      // If granted, show a test notification
      if (permission === 'granted') {
        new Notification('Notifications Enabled', {
          body: 'You will now receive notifications from the AADF Procurement Platform.',
          icon: '/logo.png'
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };
  
  const dismissPrompt = () => {
    setShowPrompt(false);
    
    // Remember the user's choice for 7 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    localStorage.setItem('notification_prompt_dismissed', expiryDate.toISOString());
  };
  
  if (!showPrompt || !user) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-50 border border-gray-200">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-[#0056a4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900">Enable Notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get notified about tender updates, proposal status changes, and more.
          </p>
          <div className="mt-4 flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-[#0056a4] hover:bg-[#004483] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4]"
              onClick={requestPermission}
            >
              Enable
            </button>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0056a4]"
              onClick={dismissPrompt}
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
