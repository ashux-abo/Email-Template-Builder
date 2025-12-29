import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import {
  getUserFromRequest,
  clearAuthCookie,
  getTokenFromRequest,
} from "../../../../lib/auth";
import Session from "../../../../models/Session";

export async function POST(request: NextRequest) {
  try {
    // Connect to DB
    await connectDB();

    // Get the current user from the token
    const userPayload = getUserFromRequest(request);

    // Get the current session token
    const token = getTokenFromRequest(request);

    // Create response object
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear auth cookie
    clearAuthCookie(response);

    // If we have a token, revoke the session in the database
    if (token && userPayload) {
      try {
        const session = await Session.findOne({ token });
        if (session) {
          session.isRevoked = true;
          await session.save();
        }
      } catch (sessionError) {
        // Just log the error but don't fail the request
        console.error("Error revoking session:", sessionError);
      }
    }

    return response;
  } catch (error: any) {
    console.error("Logout error:", error);
    const response = NextResponse.json(
      { success: false, message: error.message || "Logout failed" },
      { status: 500 },
    );

    // Still clear the cookie even on error
    clearAuthCookie(response);

    return response;
  }
}
