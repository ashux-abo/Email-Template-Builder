import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { getUserFromRequest, getTokenFromRequest } from "../../../../lib/auth";
import Session from "../../../../models/Session";

/**
 * GET /api/user/sessions
 * Get all active sessions for the current user
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the current user from the token
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get current session token to identify current session
    const currentToken = getTokenFromRequest(request);

    // Find all active sessions for this user
    const sessions = await Session.find({
      userId: userPayload.id,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    })
      .sort({ lastActive: -1 })
      .lean();

    // Format sessions with current session indicator
    const formattedSessions = sessions.map((session: any) => ({
      _id: session._id.toString(),
      deviceInfo: session.deviceInfo,
      lastActive: session.lastActive || session.createdAt,
      createdAt: session.createdAt,
      isCurrent: session.token === currentToken,
    }));

    return NextResponse.json({
      success: true,
      sessions: formattedSessions,
    });
  } catch (error: any) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch sessions",
      },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
