import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth";
import User from "../../../../models/User";
import UserProfile from "../../../../models/UserProfile";

export async function GET(request: NextRequest) {
  try {
    // Connect to DB
    await connectDB();

    // Get the current user from the token
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find user in the database (excluding password)
    const user = await User.findById(userPayload.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user profile to access profile picture
    const userProfile = await UserProfile.findOne({ userId: user._id });

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: userProfile?.profilePicture || null,
      },
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user" },
      { status: 500 },
    );
  }
}
