'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null; user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any | null }>;
  updateProfile: (data: any) => Promise<{ error: any | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      setIsLoading(true);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        router.refresh();
      }

      return { error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { error };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            organization: userData.organization,
            role: userData.role || 'vendor', // Default role
          },
        },
      });

      if (!error) {
        // Create user profile in the database
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user?.id,
              email: email,
              full_name: userData.fullName,
              role: userData.role || 'vendor',
              organization: userData.organization,
            },
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { error: profileError, user: null };
        }

        // If the user is a vendor, create a vendor profile
        if (userData.role === 'vendor') {
          const { error: vendorError } = await supabase
            .from('vendors')
            .insert([
              {
                user_id: data.user?.id,
                name: userData.organization || userData.fullName,
                contact_person: userData.fullName,
                contact_email: email,
              },
            ]);

          if (vendorError) {
            console.error('Error creating vendor profile:', vendorError);
            return { error: vendorError, user: null };
          }
        }
      }

      return { error, user: data.user };
    } catch (error) {
      console.error('Error signing up:', error);
      return { error, user: null };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/auth/signin');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      return { error };
    } catch (error) {
      console.error('Error resetting password:', error);
      return { error };
    }
  };

  // Update user profile
  const updateProfile = async (data: any) => {
    try {
      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: data.fullName,
          organization: data.organization,
        },
      });

      if (authError) {
        return { error: authError };
      }

      // Update user profile in the database
      const { error: profileError } = await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          organization: data.organization,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      return { error: profileError };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
