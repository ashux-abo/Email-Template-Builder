import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import SecuritySettings from "../../../../models/SecuritySettings";
import { z } from "zod";

// Validation schema for checking 2FA
const check2FASchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    // Connect to DB
    await connectDB();

    // Parse request body
    const data = await request.json();

    // Validate input
    const validationResult = check2FASchema.safeParse(data);
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

    const { email } = validationResult.data;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, don't reveal if user doesn't exist
      return NextResponse.json({ success: true, requiresTwoFactor: false });
    }

    // Find security settings
    const securitySettings = await SecuritySettings.findOne({
      userId: user._id,
    });

    // Check if 2FA is enabled for this user
    const requiresTwoFactor = !!(
      securitySettings && securitySettings.twoFactorEnabled
    );

    return NextResponse.json({
      success: true,
      requiresTwoFactor,
    });
  } catch (error: any) {
    console.error("Error checking 2FA:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "An error occurred while checking two-factor authentication status",
      },
      { status: 500 },
    );
  }
}
