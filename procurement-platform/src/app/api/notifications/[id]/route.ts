import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/notifications/[id]
 * Retrieves a specific notification by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get notification ID from params
    const notificationId = params.id;
    
    // Fetch notification details
    const { data: notification, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', notificationId)
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Notification not found' },
          { status: 404 }
        );
      }
      
      console.error('Error fetching notification:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notification', details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(notification);
  } catch (error: any) {
    console.error('Error in GET /api/notifications/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/notifications/[id]
 * Marks a specific notification as read
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get notification ID from params
    const notificationId = params.id;
    
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
    
    // Parse request body
    const body = await request.json();
    
    // Prepare update data
    const updateData: any = {};
    
    // Only allow updating the read status
    if (body.read !== undefined) {
      updateData.read = body.read;
    } else {
      // Default to marking as read
      updateData.read = true;
    }
    
    // Update notification
    const { data: updatedNotification, error: updateError } = await supabase
      .from('notifications')
      .update(updateData)
      .eq('id', notificationId)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating notification:', updateError);
      return NextResponse.json(
        { error: 'Failed to update notification', details: updateError.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedNotification);
  } catch (error: any) {
    console.error('Error in PUT /api/notifications/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/notifications/[id]
 * Deletes a specific notification
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get notification ID from params
    const notificationId = params.id;
    
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
  } catch (error: any) {
    console.error('Error in DELETE /api/notifications/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
