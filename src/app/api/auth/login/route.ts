import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import SecuritySettings from "../../../../models/SecuritySettings";
import {
  generateToken,
  setAuthCookie,
  createSession,
} from "../../../../lib/auth";
import { loginSchema } from "../../../../utils/validation";

export async function POST(request: Request) {
  console.log("Login API route called");

  try {
    // Connect to DB
    try {
      console.log("Connecting to database...");
      await connectDB();
      console.log("Database connection successful");
    } catch (dbError: any) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError.message,
        },
        { status: 500 },
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log("Request body parsed:", { email: body.email });
    } catch (parseError) {
      console.error("Request parsing error:", parseError);
      return NextResponse.json(
        { error: "Invalid request body - could not parse JSON" },
        { status: 400 },
      );
    }

    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error.issues);
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { email, password } = validationResult.data;

    // Find user by email
    console.log("Finding user with email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check password
    console.log("Checking password...");
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log("Invalid password");
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if user has 2FA enabled
    console.log("Checking if 2FA is enabled...");
    const securitySettings = await SecuritySettings.findOne({
      userId: user._id,
    });

    if (securitySettings && securitySettings.twoFactorEnabled) {
      console.log("2FA is enabled for this user, requiring verification");
      return NextResponse.json({
        requiresTwoFactor: true,
        message: "Please enter your 2FA verification code",
        email: user.email,
      });
    }

    // Get IP and user agent
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create session
    console.log("Creating session...");
    const sessionToken = await createSession(
      user._id.toString(),
      userAgent,
      Array.isArray(ip) ? ip[0] : ip,
    );

    // Generate token with session ID
    console.log("Generating token...");
    console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);
    console.log("User data for token:", {
      id: user._id,
      name: user.name,
      email: user.email,
    });

    const token = generateToken(user, sessionToken);
    console.log("Token generated successfully, length:", token.length);

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    // Set auth cookie
    console.log("Setting auth cookie...");
    setAuthCookie(response, token);
    console.log("Auth cookie set");

    // Log all cookies for debugging
    console.log(
      "Response cookies:",
      Object.fromEntries(
        response.cookies.getAll().map((c) => [c.name, "hidden-value"]),
      ),
    );

    console.log("Login successful, returning response");
    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: "Login failed",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
