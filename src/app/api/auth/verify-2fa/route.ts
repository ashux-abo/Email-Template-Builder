import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import SecuritySettings from "../../../../models/SecuritySettings";
import speakeasy from "speakeasy";
import {
  generateToken,
  setAuthCookie,
  createSession,
} from "../../../../lib/auth";
import { z } from "zod";

// Validation schema for 2FA verification
const verify2FASchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
});

export async function POST(request: NextRequest) {
  try {
    // Connect to DB
    await connectDB();

    // Parse request body
    const data = await request.json();

    // Validate input
    const validationResult = verify2FASchema.safeParse(data);
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

    const { email, code } = validationResult.data;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Find security settings
    const securitySettings = await SecuritySettings.findOne({
      userId: user._id,
    });

    // Check if 2FA is enabled for this user
    if (
      !securitySettings ||
      !securitySettings.twoFactorEnabled ||
      !securitySettings.twoFactorSecret
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Two-factor authentication not enabled for this user",
        },
        { status: 400 },
      );
    }

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: securitySettings.twoFactorSecret,
      encoding: "base32",
      token: code,
    });

    if (!verified) {
      return NextResponse.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 },
      );
    }

    // Get IP and user agent
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create session
    const sessionToken = await createSession(
      user._id.toString(),
      userAgent,
      Array.isArray(ip) ? ip[0] : ip,
    );

    // Generate token after successful 2FA verification
    const token = generateToken(user, sessionToken);

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Two-factor authentication verified successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    // Set auth cookie
    setAuthCookie(response, token);

    return response;
  } catch (error: any) {
    console.error("Error verifying 2FA:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to verify two-factor authentication",
      },
      { status: 500 },
    );
  }
}
