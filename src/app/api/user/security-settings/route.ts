import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth";
import SecuritySettings from "../../../../models/SecuritySettings";

/**
 * GET /api/user/security-settings
 * Get security settings for the current user
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the current user from the token
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find or create security settings
    let securitySettings = await SecuritySettings.findOne({ userId: userPayload.id });

    if (!securitySettings) {
      // Create default security settings
      securitySettings = await SecuritySettings.create({
        userId: userPayload.id,
        twoFactorEnabled: false,
      });
    }

    return NextResponse.json({
      twoFactorEnabled: securitySettings.twoFactorEnabled || false,
    });
  } catch (error: any) {
    console.error("Error fetching security settings:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch security settings" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
