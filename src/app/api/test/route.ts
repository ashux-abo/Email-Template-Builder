import { NextResponse } from "next/server";
import connectDB from "../../../lib/db";

export async function GET() {
  try {
    // Test database connection
    const connection = await connectDB();

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      mongoose: !!connection,
    });
  } catch (error: any) {
    console.error("Database connection test error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to connect to database",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
