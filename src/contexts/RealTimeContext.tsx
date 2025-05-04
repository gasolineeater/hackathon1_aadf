'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the real-time context type
interface RealTimeContextType {
  connected: boolean;
}

// Create the real-time context
const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined);

// Real-time provider component
export function RealTimeProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);

  // Simulate connection to real-time service
  useEffect(() => {
    // Simulate connection delay
    const timer = setTimeout(() => {
      setConnected(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <RealTimeContext.Provider value={{ connected }}>
      {children}
    </RealTimeContext.Provider>
  );
}

// Custom hook to use the real-time context
export function useRealTime() {
  const context = useContext(RealTimeContext);
  if (context === undefined) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
}
