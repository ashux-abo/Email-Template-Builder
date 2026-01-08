import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import { getUserFromRequest } from "../../../../../lib/auth";
import SecuritySettings from "../../../../../models/SecuritySettings";

/**
 * POST /api/user/two-factor/disable
 * Disable two-factor authentication for the current user
 */
export async function POST(request: NextRequest) {
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
      securitySettings = await SecuritySettings.create({
        userId: userPayload.id,
        twoFactorEnabled: false,
      });
    } else {
      securitySettings.twoFactorEnabled = false;
      securitySettings.twoFactorSecret = undefined;
      await securitySettings.save();
    }

    return NextResponse.json({
      message: "Two-factor authentication disabled successfully",
    });
  } catch (error: any) {
    console.error("Error disabling 2FA:", error);
    return NextResponse.json(
      { error: error.message || "Failed to disable two-factor authentication" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
