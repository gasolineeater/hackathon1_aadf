import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockData';

// Mock authentication handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Handle sign-in
    if (req.url.includes('/api/auth/signin') || req.url.includes('/api/auth/callback/credentials')) {
      const { email, password } = body;
      
      // Find user
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
      
      // Create a session
      const session = {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          user_metadata: {
            full_name: user.full_name,
            organization: user.organization
          }
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      return NextResponse.json({ session });
    }
    
    // Handle sign-out
    if (req.url.includes('/api/auth/signout')) {
      return NextResponse.json({ success: true });
    }
    
    // Handle session
    if (req.url.includes('/api/auth/session')) {
      // For demo purposes, always return a valid session
      const session = {
        user: {
          id: '1',
          email: 'admin@aadf.org',
          role: 'admin',
          user_metadata: {
            full_name: 'AADF Admin',
            organization: 'AADF'
          }
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      return NextResponse.json({ session });
    }
    
    return NextResponse.json(
      { error: 'Not implemented' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle GET requests (for session, providers, etc.)
export async function GET(req: NextRequest) {
  try {
    // Handle session
    if (req.url.includes('/api/auth/session')) {
      // For demo purposes, always return a valid session
      const session = {
        user: {
          id: '1',
          email: 'admin@aadf.org',
          role: 'admin',
          user_metadata: {
            full_name: 'AADF Admin',
            organization: 'AADF'
          }
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      return NextResponse.json({ session });
    }
    
    // Handle providers
    if (req.url.includes('/api/auth/providers')) {
      return NextResponse.json({ 
        credentials: {
          id: 'credentials',
          name: 'Credentials',
          type: 'credentials',
          signinUrl: '/api/auth/signin/credentials',
          callbackUrl: '/api/auth/callback/credentials'
        }
      });
    }
    
    // Handle CSRF token
    if (req.url.includes('/api/auth/csrf')) {
      return NextResponse.json({ 
        csrfToken: 'mock-csrf-token'
      });
    }
    
    return NextResponse.json(
      { error: 'Not implemented' },
      { status: 501 }
    );
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
