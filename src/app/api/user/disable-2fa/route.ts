import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  // Simulate a small delay like a real API
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In a real app, you would disable 2FA for the user in database
  return NextResponse.json({
    success: true,
    message: "Two-factored authentication disabled successfully",
  });
}
