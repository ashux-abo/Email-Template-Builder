import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth";
import UserProfile from "../../../../models/UserProfile";
import { uploadToCloudinary } from "../../../../lib/cloudinary";

/**
 * POST /api/user/profile-picture
 * Upload and save user profile picture to Cloudinary and database
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get the current user from the token - MUST AWAIT
    const userPayload = await getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("profilePicture") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size should be less than 5MB" },
        { status: 400 },
      );
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, GIF and WebP images are allowed" },
        { status: 400 },
      );
    }

    // Check Cloudinary configuration BEFORE processing file
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Cloudinary configuration missing:", {
        hasCloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        hasApiKey: !!process.env.CLOUDINARY_API_KEY,
        hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
      });
      return NextResponse.json(
        {
          error:
            "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your environment variables.",
          details: "Missing Cloudinary credentials",
        },
        { status: 500 },
      );
    }

    // Convert file to buffer
    let buffer: Buffer;
    try {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } catch (bufferError: any) {
      console.error("Error converting file to buffer:", bufferError);
      return NextResponse.json(
        { error: "Failed to process image file" },
        { status: 500 },
      );
    }

    // Upload to Cloudinary with detailed error handling
    let uploadResult: any;
    try {
      uploadResult = await uploadToCloudinary(
        buffer,
        `profile-pictures/${userPayload.id}`,
      );
    } catch (cloudinaryError: any) {
      console.error("Cloudinary upload error:", {
        message: cloudinaryError.message,
        error: cloudinaryError,
        stack: cloudinaryError.stack,
      });

      // Check for specific Cloudinary errors
      if (
        cloudinaryError.message?.includes("Invalid Signature") ||
        cloudinaryError.message?.includes("signature")
      ) {
        return NextResponse.json(
          {
            error:
              "Cloudinary authentication failed. Please check your CLOUDINARY_API_SECRET in environment variables.",
            details:
              "Invalid Cloudinary API signature - verify your API secret is correct",
          },
          { status: 500 },
        );
      }

      return NextResponse.json(
        {
          error:
            cloudinaryError.message || "Failed to upload image to Cloudinary",
          details: "Please check your Cloudinary API credentials",
        },
        { status: 500 },
      );
    }

    if (!uploadResult || !uploadResult.secure_url) {
      console.error("Cloudinary upload returned no URL:", uploadResult);
      return NextResponse.json(
        { error: "Failed to upload image to Cloudinary - no URL returned" },
        { status: 500 },
      );
    }

    const imageUrl = uploadResult.secure_url as string;

    // Get or create user profile
    let userProfile;
    try {
      userProfile = await UserProfile.findOne({ userId: userPayload.id });

      if (!userProfile) {
        userProfile = await UserProfile.create({
          userId: userPayload.id,
          profilePicture: imageUrl,
          jobTitle: "",
          company: "",
          location: "",
          phone: "",
          bio: "",
          timezone: "UTC+00:00",
        });
      } else {
        userProfile.profilePicture = imageUrl;
        await userProfile.save();
      }
    } catch (dbError: any) {
      console.error("Error saving profile picture to database:", dbError);
      return NextResponse.json(
        {
          error: "Image uploaded but failed to save to database",
          details: dbError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Profile picture uploaded successfully",
      profilePicture: imageUrl,
    });
  } catch (error: any) {
    console.error("Unexpected error uploading profile picture:", error);
    // Ensure we always return JSON, never HTML
    return NextResponse.json(
      {
        error: error.message || "Failed to upload profile picture",
        details: "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/user/profile-picture
 * Remove user profile picture
 */
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    // Get the current user from the token - MUST AWAIT
    const userPayload = await getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get user profile
    const userProfile = await UserProfile.findOne({ userId: userPayload.id });

    if (userProfile) {
      userProfile.profilePicture = null;
      await userProfile.save();
    }

    return NextResponse.json({
      message: "Profile picture removed successfully",
    });
  } catch (error: any) {
    console.error("Error removing profile picture:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove profile picture" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
