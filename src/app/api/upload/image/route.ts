import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import connectDB from "@/lib/db";
import Image from "@/models/Image";

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectDB();

    // Process the form data
    const formData = await request.formData();
    const file = formData.get("image") as File;
    const folder = (formData.get("folder") as string) || "email-images";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.",
        },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size should be less than 5MB" },
        { status: 400 },
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to MongoDB instead of Cloudinary
    const newImage = new Image({
      name: file.name,
      userId: userPayload.id,
      data: buffer,
      contentType: file.type,
      folder: folder,
      size: file.size,
    });

    await newImage.save();

    // Create URL for accessing the image
    const imageUrl = `/api/images/${newImage._id}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      imageId: newImage._id.toString(),
    });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 },
    );
  }
}
