import { NextRequest, NextResponse } from 'next/server';
import { signOut } from '@/lib/auth';
import { createAuditLog } from '@/lib/audit';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session?.user) {
      // Create audit log before signing out
      await createAuditLog({
        action: 'user.signout',
        resourceType: 'user',
        resourceId: session.user.id,
        userId: session.user.id,
        details: {
          email: session.user.email,
        },
      });
    }

    await signOut();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during sign out' },
      { status: 500 }
    );
  }
}
