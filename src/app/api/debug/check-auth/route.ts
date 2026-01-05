import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "../../../../lib/auth";
import connectDB from "../../../../lib/db";

export async function GET(request: NextRequest) {
  try {
    //connect to database first
    await connectDB();

    //get user authentication info
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({
        authenticated: false,
        message: "No user Authenticated",
        headers: Object.fromEntries(request.headers.entries()),
      });
    }

    return NextResponse.json({
      authenticate: true,
      user: {
        id: userPayload.id,
        email: userPayload.email,
        name: userPayload.name,
      },
      cookies: {
        tokenExists: !!request.cookies.get("token"),
      },
    });
  } catch (error: any) {
    console.error(`Error checking the authentication:`, error);
    return NextResponse.json(
      {
        authenticated: false,
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
