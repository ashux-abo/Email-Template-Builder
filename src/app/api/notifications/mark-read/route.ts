import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "../../../../lib/db";
import AppNotification from "../../../../models/AppNotification";
import { getUserFromRequest } from "../../../../lib/auth";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get the authenticated user
    const user = await getUserFromRequest(request);

    // If no user is found, return unauthorized
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const data = await request.json();

    // Handle marking all as read
    if (data.markAll) {
      await AppNotification.updateMany(
        { userId: user.id, isRead: false },
        { $set: { isRead: true } },
      );

      return NextResponse.json({
        success: true,
        message: "All notifications marked as read",
      });
    }

    // Handle marking a single notification as read
    if (!data.notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 },
      );
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(data.notificationId)) {
      return NextResponse.json(
        { error: "Invalid notification ID" },
        { status: 400 },
      );
    }

    // Find and update the notification
    const notification = await AppNotification.findOneAndUpdate(
      { _id: data.notificationId, userId: user.id },
      { $set: { isRead: true } },
      { new: true },
    );

    if (!notification) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
