import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth";
import User from "../../../../models/User";
import UserProfile from "../../../../models/UserProfile";

/**
 * GET /api/user/profile
 * Get user profile information
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the current user from the token
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find user in the database
    const user = await User.findById(userPayload.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get or create user profile
    let userProfile = await UserProfile.findOne({ userId: user._id });

    if (!userProfile) {
      // Create a new profile if it doesn't exist
      userProfile = await UserProfile.create({
        userId: user._id,
        jobTitle: "",
        company: "",
        location: "",
        phone: "",
        bio: "",
        profilePicture: null,
        timezone: "UTC+00:00",
      });
    }

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      jobTitle: userProfile.jobTitle || "",
      company: userProfile.company || "",
      location: userProfile.location || "",
      phone: userProfile.phone || "",
      bio: userProfile.bio || "",
      profilePicture: userProfile.profilePicture || "",
      timezone: userProfile.timezone || "UTC+00:00",
    });
  } catch (error: any) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/user/profile
 * Update user profile information
 */
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    // Get the current user from the token
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find user in the database
    const user = await User.findById(userPayload.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();

    // Update user basic info if provided
    if (body.name) {
      user.name = body.name;
      await user.save();
    }

    // Get or create user profile
    let userProfile = await UserProfile.findOne({ userId: user._id });

    if (!userProfile) {
      userProfile = await UserProfile.create({
        userId: user._id,
        jobTitle: body.jobTitle || "",
        company: body.company || "",
        location: body.location || "",
        phone: body.phone || "",
        bio: body.bio || "",
        profilePicture: body.profilePicture || null,
        timezone: body.timezone || "UTC+00:00",
      });
    } else {
      // Update profile fields
      if (body.jobTitle !== undefined) userProfile.jobTitle = body.jobTitle;
      if (body.company !== undefined) userProfile.company = body.company;
      if (body.location !== undefined) userProfile.location = body.location;
      if (body.phone !== undefined) userProfile.phone = body.phone;
      if (body.bio !== undefined) userProfile.bio = body.bio;
      if (body.profilePicture !== undefined) userProfile.profilePicture = body.profilePicture;
      if (body.timezone !== undefined) userProfile.timezone = body.timezone;

      await userProfile.save();
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      profile: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        jobTitle: userProfile.jobTitle || "",
        company: userProfile.company || "",
        location: userProfile.location || "",
        phone: userProfile.phone || "",
        bio: userProfile.bio || "",
        profilePicture: userProfile.profilePicture || "",
        timezone: userProfile.timezone || "UTC+00:00",
      },
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
