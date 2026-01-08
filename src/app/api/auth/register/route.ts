import { NextResponse } from "next/server";
import { UAParser } from "ua-parser-js"; // Import the parser
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import Session from "../../../../models/Session"; // Import your Session model
import { generateToken, setAuthCookie } from "../../../../lib/auth";
import { registerSchema } from "../../../../utils/validation";

export async function POST(request: Request) {
  try {
    // Connect to DB with error handling
    try {
      console.log("Connecting to database for registration...");
      await connectDB();
      console.log("Database connection successful");
    } catch (dbError: any) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        {
          error: "Database connection failed",
          message: dbError.message || "Failed to connect to database",
          hint: process.env.NODE_ENV === "production" 
            ? "Please check your MONGODB_URI environment variable in Vercel settings."
            : "Please check your MONGODB_URI in your .env file.",
        },
        { status: 500 },
      );
    }

    const body = await request.json();

    // 1. Validation
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 },
      );
    }

    const { name, email, password } = validationResult.data;

    // 2. Check for Conflict (409)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    // 3. Create User
    const user = await User.create({ name, email, password });

    // 4. Parse Device Info for the Session
    const uaString = request.headers.get("user-agent") || "";
    const parser = new UAParser(uaString);
    const uaResult = parser.getResult();

    // Get IP (Next.js specific way)
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";

    // 5. Generate Token
    const token = generateToken(user);

    // 6. Create the Session in MongoDB
    // We set it to expire in 7 days to match a typical cookie life
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await Session.create({
      userId: user._id,
      token: token,
      deviceInfo: {
        browser: uaResult.browser.name || "Unknown",
        os: uaResult.os.name || "Unknown",
        deviceType: uaResult.device.type || "desktop",
        ip: ip,
      },
      expiresAt: expiresAt,
    });

    // 7. Prepare Response and Set Cookie
    const response = NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: user._id, name: user.name, email: user.email },
      },
      { status: 201 },
    );

    setAuthCookie(response, token);

    return response;
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed", message: error.message },
      { status: 500 },
    );
  }
}
