import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/auth";
import connectDB from "../../../../lib/db";
import Image from "../../../../models/Image";

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectDB();

    // Parse request body
    const body = await request.json();
    const { imageUrl, folder = "email-images" } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image URL provided" },
        { status: 400 },
      );
    }

    // Validate URL format
    let url;
    try {
      url = new URL(imageUrl);
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    try {
      // Fetch the image from the URL
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch image from URL: ${response.statusText}`,
        );
      }

      // Get content type and size
      const contentType = response.headers.get("content-type") || "image/jpeg";

      // Validate content type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.some((type) => contentType.includes(type))) {
        return NextResponse.json(
          {
            error:
              "URL does not point to a supported image format (JPEG, PNG, GIF, WebP)",
          },
          { status: 400 },
        );
      }

      // Convert to buffer
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Get file size
      const size = buffer.length;

      // Check size limit (5MB)
      if (size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image size exceeds 5MB limit" },
          { status: 400 },
        );
      }

      // Extract filename from URL or use a generated one
      const filename =
        url.pathname.split("/").pop() || `external-${Date.now()}.jpg`;

      // Save to MongoDB
      const newImage = new Image({
        name: filename,
        userId: userPayload.id,
        data: buffer,
        contentType: contentType,
        folder: folder,
        size: size,
      });

      await newImage.save();

      // Create URL for accessing the image
      const storedImageUrl = `/api/images/${newImage._id}`;

      return NextResponse.json({
        success: true,
        imageUrl: storedImageUrl,
        imageId: newImage._id.toString(),
      });
    } catch (fetchError: any) {
      console.error("Error fetching external image:", fetchError);
      return NextResponse.json(
        { error: fetchError.message || "Failed to fetch external image" },
        { status: 500 },
      );
    }
  } catch (error: any) {
    console.error("Error processing external image URL:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process external image" },
      { status: 500 },
    );
  }
}
