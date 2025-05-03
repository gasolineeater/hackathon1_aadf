'use client';

import { useAuth } from '@/contexts/AuthContext';

type UserRole = 'admin' | 'evaluator' | 'vendor';

interface RoleAccess {
  isAdmin: boolean;
  isEvaluator: boolean;
  isVendor: boolean;
  hasAccess: (allowedRoles: UserRole[]) => boolean;
}

export function useRoleAccess(): RoleAccess {
  const { user } = useAuth();
  
  // Get user role from user metadata
  const userRole = user?.user_metadata?.role as UserRole | undefined;
  
  const isAdmin = userRole === 'admin';
  const isEvaluator = userRole === 'evaluator';
  const isVendor = userRole === 'vendor';
  
  // Check if user has access based on allowed roles
  const hasAccess = (allowedRoles: UserRole[]): boolean => {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
  };
  
  return {
    isAdmin,
    isEvaluator,
    isVendor,
    hasAccess,
  };
}
