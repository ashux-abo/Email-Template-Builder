import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/src/lib/auth";
import { getBaseUrl } from "@/src/lib/utils";

/**
 * API endpoint to check email-related environment variables
 * Used by the EmailTester component for diagnostics
 * Only available in development environment
 */

export async function GET(request: NextRequest) {
  // Check if we're in production and return 404 if so
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 404 },
    );
  }

  try {
    // Check authentication
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check for SMTP configuration
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASSWORD;

    // Check for other app configuration
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const vercelUrl = process.env.VERCEL_URL;
    const nodeEnv = process.env.NODE_ENV;
    const baseUrl = getBaseUrl();

    return NextResponse.json({
      smtpConfig: {
        SMTP_HOST: smtpHost || "(not set)",
        SMTP_PORT: smtpPort || "(not set)",
        SMTP_USER: smtpUser ? "(set)" : "(not set)",
        SMTP_PASSWORD: smtpPass ? "(set)" : "(not set)",
      },
      appConfig: {
        NEXT_PUBLIC_APP_URL: appUrl || "(not set)",
        VERCEL_URL: vercelUrl || "(not set)",
        NODE_ENV: nodeEnv || "development",
        baseUrl,
      },
      isSmtpConfigured: !!(smtpHost && smtpPort && smtpUser && smtpPass),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Error checking environment variables" },
      { status: 500 },
    );
  }
}
