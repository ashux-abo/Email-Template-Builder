import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/auth";
import NotificationSettings from "../../../../models/NotificationSettings";
import { connectToDatabase } from "../../../../lib/mongoose";

// GET /api/user/notification-preferences
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const user = getUserFromRequest(req);

    // Check if user is authenticated
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find or create notification settings
    let settings = await NotificationSettings.findOne({ userId: user.id });

    if (!settings) {
      // Create default settings if not found
      settings = await NotificationSettings.create({
        userId: user.id,
        app: {
          newFeatures: true,
          security: true,
          emailSent: true,
          emailOpened: true,
          emailClicked: true,
          emailBounced: true,
          newTemplates: true,
        },
      });
    }

    // Transform to match the expected format in the frontend
    const preferences = {
      app: settings.app,
    };

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (error: any) {
    console.error("Error fetching notification preferences:", error);
    return NextResponse.json(
      { error: `Failed to fetch notification preferences: ${error.message}` },
      { status: 500 },
    );
  }
}

// POST /api/user/notification-preferences
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const user = getUserFromRequest(req);

    // Check if user is authenticated
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get preferences from request body
    const { preferences } = await req.json();

    if (!preferences || !preferences.app) {
      return NextResponse.json(
        { error: "Invalid preferences format" },
        { status: 400 },
      );
    }

    // Validate app preferences
    const validAppKeys = [
      "newFeatures",
      "security",
      "emailSent",
      "emailOpened",
      "emailClicked",
      "emailBounced",
      "newTemplates",
    ];

    const appPreferences: Record<string, boolean> = {};

    for (const key of validAppKeys) {
      if (typeof preferences.app[key] === "boolean") {
        appPreferences[key] = preferences.app[key];
      }
    }

    // Update notification settings
    await NotificationSettings.findOneAndUpdate(
      { userId: user.id },
      {
        $set: { app: appPreferences },
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      success: true,
      message: "Notification preferences updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating notification preferences:", error);
    return NextResponse.json(
      { error: `Failed to update notification preferences: ${error.message}` },
      { status: 500 },
    );
  }
}
