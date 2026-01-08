import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import { getUserFromRequest, getTokenFromRequest } from "../../../../../lib/auth";
import Session from "../../../../../models/Session";

/**
 * POST /api/user/sessions/revoke
 * Revoke a specific session or all other sessions
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get the current user from the token
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get current session token
    const currentToken = getTokenFromRequest(request);

    // Parse request body
    const body = await request.json();
    const { sessionId, revokeAll } = body;

    if (revokeAll) {
      // Revoke all sessions except the current one
      const result = await Session.updateMany(
        {
          userId: userPayload.id,
          token: { $ne: currentToken },
          isRevoked: false,
        },
        {
          $set: { isRevoked: true },
        },
      );

      return NextResponse.json({
        success: true,
        message: `Revoked ${result.modifiedCount} session(s)`,
      });
    } else if (sessionId) {
      // Revoke a specific session
      const session = await Session.findOne({
        _id: sessionId,
        userId: userPayload.id,
        isRevoked: false,
      });

      if (!session) {
        return NextResponse.json(
          { error: "Session not found" },
          { status: 404 },
        );
      }

      // Don't allow revoking the current session through this endpoint
      if (session.token === currentToken) {
        return NextResponse.json(
          { error: "Cannot revoke current session" },
          { status: 400 },
        );
      }

      session.isRevoked = true;
      await session.save();

      return NextResponse.json({
        success: true,
        message: "Session revoked successfully",
      });
    } else {
      return NextResponse.json(
        { error: "sessionId or revokeAll is required" },
        { status: 400 },
      );
    }
  } catch (error: any) {
    console.error("Error revoking session:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to revoke session",
      },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
