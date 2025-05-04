'use client';

import { useAuth } from '@/contexts/AuthContext';

export function useRoleAccess() {
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';
  const isEvaluator = user?.role === 'evaluator' || isAdmin; // Admins can do everything evaluators can
  const isVendor = user?.role === 'vendor';
  const isAuthenticated = !!user;

  return {
    isAdmin,
    isEvaluator,
    isVendor,
    isAuthenticated
  };
}
