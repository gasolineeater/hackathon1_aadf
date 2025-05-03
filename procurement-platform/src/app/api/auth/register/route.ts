import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, fullName, role, organization } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['admin', 'evaluator', 'vendor', 'user'];
    if (role && !validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: admin, evaluator, vendor, user' },
        { status: 400 }
      );
    }

    const result = await registerUser({
      email,
      password,
      fullName,
      role: role || 'user',
      organization,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Registration failed' },
        { status: 400 }
      );
    }

    // Create audit log
    await createAuditLog({
      action: 'user.register',
      resourceType: 'user',
      resourceId: result.user.id,
      userId: result.user.id,
      details: {
        email: result.user.email,
        role: result.user.role,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        name: result.user.fullName,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
