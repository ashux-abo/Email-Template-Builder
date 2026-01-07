import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth";
import {
  sendNotification,
  NotificationType,
} from "../../../../utils/notifications";
import { z } from "zod";

// Validation schema for sending notifications
const sendNotificationSchema = z.object({
  type: z.string(),
  subject: z.string().optional(),
  message: z.string(),
  userId: z.string().optional(),
  data: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Connect to DB
    await connectDB();

    // Get the current user from the token (admin or the same user)
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Parse request data
    const data = await request.json();

    // Validate input
    const validationResult = sendNotificationSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          issues: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const {
      type,
      subject,
      message,
      userId = userPayload.id,
      data: notificationData = {},
    } = validationResult.data;

    // Send notification
    const result = await sendNotification({
      userId,
      type: type as NotificationType,
      title: subject,
      message,
      data: notificationData,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notification sent successfully",
    });
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to send notification",
      },
      { status: 500 },
    );
  }
}
