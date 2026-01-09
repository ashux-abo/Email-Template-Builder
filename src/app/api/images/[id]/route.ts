import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import Image from "../../../../models/Image";
import { ObjectId } from "mongodb";

// Force dynamic rendering to avoid caching issues
export const dynamic = "force-dynamic";

/**
 * GET handler for image retrieval
 * This implementation avoids using params entirely to prevent NextJS warnings
 */
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Extract the image ID from the URL path
    // This avoids using the params object entirely which causes NextJS warnings
    const pathname = request.nextUrl.pathname;
    const imageId = pathname.split("/").pop();

    if (!imageId) {
      return NextResponse.json(
        {
          success: false,
          message: "Image ID is required",
        },
        { status: 400 },
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(imageId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid image ID format",
        },
        { status: 400 },
      );
    }

    // Find the image in the database
    const image = await Image.findById(imageId);

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "Image not found",
        },
        { status: 404 },
      );
    }

    // Create a response with the image data
    const response = new NextResponse(image.data);

    // Set appropriate headers
    response.headers.set("Content-Type", image.contentType);
    response.headers.set("Content-Length", image.size.toString());
    response.headers.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year

    return response;
  } catch (error) {
    console.error("Error retrieving image:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve image",
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE handler for removing an image
 * Uses the same URL parsing approach to avoid params warning
 */
export async function DELETE(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    // Extract the image ID from the URL path
    const pathname = request.nextUrl.pathname;
    const imageId = pathname.split("/").pop();

    if (!imageId) {
      return NextResponse.json(
        {
          success: false,
          message: "Image ID is required",
        },
        { status: 400 },
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(imageId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid image ID format",
        },
        { status: 400 },
      );
    }

    // Find and delete the image
    const result = await Image.findByIdAndDelete(imageId);

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: "Image not found or already deleted",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete image",
        error:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 },
    );
  }
}
