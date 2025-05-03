'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';

type UserRole = 'admin' | 'evaluator' | 'vendor';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['admin', 'evaluator', 'vendor'] 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { hasAccess } = useRoleAccess();
  const router = useRouter();
  
  useEffect(() => {
    // If not loading and no user, redirect to sign in
    if (!isLoading && !user) {
      router.push('/auth/signin');
      return;
    }
    
    // If user exists but doesn't have the required role, redirect to home
    if (!isLoading && user && allowedRoles.length > 0 && !hasAccess(allowedRoles)) {
      router.push('/');
    }
  }, [user, isLoading, router, allowedRoles, hasAccess]);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056a4]"></div>
      </div>
    );
  }
  
  // If no user or doesn't have access, don't render children
  if (!user || (allowedRoles.length > 0 && !hasAccess(allowedRoles))) {
    return null;
  }
  
  // User is authenticated and has the required role
  return <>{children}</>;
}
