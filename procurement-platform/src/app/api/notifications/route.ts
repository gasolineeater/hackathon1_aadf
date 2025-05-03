import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * GET /api/notifications
 * Retrieves notifications for the current user
 */
export async function GET(request: NextRequest) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get('unread_only') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = (page - 1) * limit;

    // Start building the query
    let query = supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id);

    // Apply filters
    if (unreadOnly) {
      query = query.eq('read', false);
    }

    // Apply pagination
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Execute the query
    const { data: notifications, count, error } = await query;

    if (error) {
      console.error('Error fetching notifications:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      );
    }

    // Get unread count
    const { count: unreadCount, error: countError } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (countError) {
      console.error('Error counting unread notifications:', countError);
    }

    return NextResponse.json({
      notifications: notifications || [],
      unread_count: unreadCount || 0,
      pagination: {
        total: count || 0,
        page,
        limit,
        pages: count ? Math.ceil(count / limit) : 0
      }
    });
  } catch (error: any) {
    console.error('Error in GET /api/notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/notifications
 * Creates a new notification
 */
export async function POST(request: NextRequest) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = userProfile?.role === 'admin';

    // Only admins can create notifications for other users
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.message || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: title, message, type' },
        { status: 400 }
      );
    }

    // If recipient_id is provided, check if user has permission
    if (body.recipient_id && body.recipient_id !== user.id && !isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Only admins can create notifications for other users' },
        { status: 403 }
      );
    }

    // Generate a unique ID for the notification
    const notificationId = uuidv4();

    // Prepare notification data
    const notificationData = {
      id: notificationId,
      user_id: body.recipient_id || user.id,
      type: body.type,
      title: body.title,
      message: body.message,
      link: body.link || null,
      link_text: body.link_text || null,
      read: false,
      entity_type: body.entity_type || null,
      entity_id: body.entity_id || null,
      created_by: user.id,
      created_at: new Date().toISOString()
    };

    // Insert notification into database
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return NextResponse.json(
        { error: 'Failed to create notification', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications
 * Marks notifications as read
 */
export async function PUT(request: NextRequest) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Mark specific notification as read
    if (body.notification_id) {
      // Check if notification exists and belongs to user
      const { data: notification, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', body.notification_id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Notification not found' },
            { status: 404 }
          );
        }

        console.error('Error fetching notification:', fetchError);
        return NextResponse.json(
          { error: 'Failed to fetch notification', details: fetchError.message },
          { status: 500 }
        );
      }

      // Update notification
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', body.notification_id);

      if (updateError) {
        console.error('Error marking notification as read:', updateError);
        return NextResponse.json(
          { error: 'Failed to mark notification as read', details: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Mark all notifications as read
    if (body.mark_all) {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (updateError) {
        console.error('Error marking all notifications as read:', updateError);
        return NextResponse.json(
          { error: 'Failed to mark all notifications as read', details: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid request. Either notification_id or mark_all is required' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error in PUT /api/notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications
 * Deletes notifications
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const notificationId = url.searchParams.get('id');
    const clearAll = url.searchParams.get('clear_all');

    // Delete specific notification
    if (notificationId) {
      // Check if notification exists and belongs to user
      const { data: notification, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', notificationId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          return NextResponse.json(
            { error: 'Notification not found' },
            { status: 404 }
          );
        }

        console.error('Error fetching notification:', fetchError);
        return NextResponse.json(
          { error: 'Failed to fetch notification', details: fetchError.message },
          { status: 500 }
        );
      }

      // Delete notification
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (deleteError) {
        console.error('Error deleting notification:', deleteError);
        return NextResponse.json(
          { error: 'Failed to delete notification', details: deleteError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Delete all notifications for user
    if (clearAll === 'true') {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting all notifications:', deleteError);
        return NextResponse.json(
          { error: 'Failed to delete all notifications', details: deleteError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid request. Either id or clear_all=true is required' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error in DELETE /api/notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
