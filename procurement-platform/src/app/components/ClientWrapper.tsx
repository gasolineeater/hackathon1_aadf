'use client';

import { useState, useEffect } from 'react';
import AnimationProvider from './AnimationProvider';
import CustomCursor from './CustomCursor';
import PremiumLoader from './PremiumLoader';

interface ClientWrapperProps {
  children: React.ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  // Disable the loader in development mode for faster refresh
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      {isLoading && <PremiumLoader onLoadComplete={() => setIsLoading(false)} />}
      
      <AnimationProvider>
        {children}
        <CustomCursor />
      </AnimationProvider>
    </>
  );
}
