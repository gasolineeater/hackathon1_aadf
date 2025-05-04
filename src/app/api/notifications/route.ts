import { NextRequest, NextResponse } from 'next/server';
import { mockNotifications } from '@/lib/mockData';

export async function GET(req: NextRequest) {
  try {
    // Return mock notifications data
    return NextResponse.json(mockNotifications);
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Handle marking notifications as read
    if (body.action === 'markAsRead') {
      // In a real app, we would update the database
      // For this mock, we'll just return success
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Notifications API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
