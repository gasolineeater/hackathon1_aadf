import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Mock notifications database
let notificationsDb: any[] = [
  {
    id: '1',
    userId: 'user-1',
    type: 'info',
    title: 'New Tender Published',
    message: 'A new tender "Urban Trails Project" has been published.',
    link: '/tenders/urban-trails',
    linkText: 'View Tender',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: false,
    entityType: 'tender',
    entityId: 'urban-trails'
  },
  {
    id: '2',
    userId: 'user-1',
    type: 'warning',
    title: 'Tender Deadline Approaching',
    message: 'The deadline for "Digital Transformation" tender is tomorrow.',
    link: '/tenders/digital-transformation',
    linkText: 'View Tender',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    read: false,
    entityType: 'tender',
    entityId: 'digital-transformation'
  },
  {
    id: '3',
    userId: 'user-1',
    type: 'success',
    title: 'Proposal Submitted',
    message: 'Your proposal for "Infrastructure Project" has been submitted successfully.',
    link: '/proposals/infrastructure-project',
    linkText: 'View Proposal',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    read: true,
    entityType: 'proposal',
    entityId: 'infrastructure-project'
  },
  {
    id: '4',
    userId: 'user-2',
    type: 'info',
    title: 'New Tender Published',
    message: 'A new tender "Cultural Heritage Project" has been published.',
    link: '/tenders/cultural-heritage',
    linkText: 'View Tender',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: false,
    entityType: 'tender',
    entityId: 'cultural-heritage'
  }
];

// GET /api/notifications
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // In a real implementation, we would fetch notifications from the database
    // For now, we'll filter the mock data
    const userId = session.user.id;
    const userNotifications = notificationsDb.filter(n => n.userId === userId);
    
    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return NextResponse.json(userNotifications);
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST /api/notifications
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    
    // Validate request body
    if (!body.title || !body.message || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, message, type' },
        { status: 400 }
      );
    }
    
    // Create new notification
    const newNotification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: session.user.id,
      type: body.type,
      title: body.title,
      message: body.message,
      link: body.link,
      linkText: body.linkText,
      createdAt: new Date().toISOString(),
      read: false,
      entityType: body.entityType,
      entityId: body.entityId
    };
    
    // In a real implementation, we would save to the database
    // For now, we'll add to the mock data
    notificationsDb.push(newNotification);
    
    return NextResponse.json(newNotification, { status: 201 });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PUT /api/notifications/mark-read
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const userId = session.user.id;
    
    // Mark specific notification as read
    if (body.notificationId) {
      const notification = notificationsDb.find(
        n => n.id === body.notificationId && n.userId === userId
      );
      
      if (!notification) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }
      
      notification.read = true;
      
      return NextResponse.json({ success: true });
    }
    
    // Mark all notifications as read
    if (body.markAll) {
      notificationsDb.forEach(notification => {
        if (notification.userId === userId) {
          notification.read = true;
        }
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to mark notifications as read' },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const notificationId = url.searchParams.get('id');
    const clearAll = url.searchParams.get('clearAll');
    const userId = session.user.id;
    
    // Delete specific notification
    if (notificationId) {
      const index = notificationsDb.findIndex(
        n => n.id === notificationId && n.userId === userId
      );
      
      if (index === -1) {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }
      
      notificationsDb.splice(index, 1);
      
      return NextResponse.json({ success: true });
    }
    
    // Delete all notifications for user
    if (clearAll === 'true') {
      notificationsDb = notificationsDb.filter(n => n.userId !== userId);
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error deleting notifications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete notifications' },
      { status: 500 }
    );
  }
}
