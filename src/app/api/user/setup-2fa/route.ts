import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth";
import User from "../../../../models/User";
import SecuritySettings from "../../../../models/SecuritySettings";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

export async function POST(request: NextRequest) {
  try {
    // Connect to DB
    await connectDB();

    // Get the current user from the token
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    // Find the user
    const user = await User.findById(userPayload.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Generate a new secret
    const secret = speakeasy.generateSecret({
      name: `Palette Mail (${user.email})`,
      length: 20,
    });

    // Find or create security settings
    let securitySettings = await SecuritySettings.findOne({ userId: user._id });

    if (!securitySettings) {
      securitySettings = new SecuritySettings({ userId: user._id });
    }

    // Store the secret temporarily (not yet verified)
    securitySettings.twoFactorSecret = secret.base32;
    await securitySettings.save();

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url as string);

    return NextResponse.json({
      success: true,
      qrCode: qrCodeUrl,
      secret: secret.base32,
      message: "Two-factor authentication setup initiated",
    });
  } catch (error: any) {
    console.error("Error setting up 2FA:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to setup two-factor authentication",
      },
      { status: 500 },
    );
  }
}
