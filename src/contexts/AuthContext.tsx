'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the user type
interface User {
  id: string;
  email: string;
  role: string;
  user_metadata: {
    full_name: string;
    organization: string;
  };
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.session?.user) {
          setUser(data.session.user);
        }
      } catch (err) {
        console.error('Failed to check session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/signin/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      if (data.session?.user) {
        setUser(data.session.user);
      } else {
        throw new Error('No user returned from sign in');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    setLoading(true);

    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  // For demo purposes, set a default admin user
  useEffect(() => {
    if (!loading && !user) {
      setUser({
        id: '1',
        email: 'admin@aadf.org',
        role: 'admin',
        user_metadata: {
          full_name: 'AADF Admin',
          organization: 'AADF'
        }
      });
    }
  }, [loading, user]);

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
