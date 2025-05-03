import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await signIn(email, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create audit log
    await createAuditLog({
      action: 'user.signin',
      resourceType: 'user',
      resourceId: result.user.id,
      userId: result.user.id,
      details: {
        email: result.user.email,
      },
    });

    return NextResponse.json({
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        name: result.user.name,
      },
      token: result.token,
    });
  } catch (error: any) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during sign in' },
      { status: 500 }
    );
  }
}
