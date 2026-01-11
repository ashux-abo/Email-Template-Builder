import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth";
import User from "../../../../models/User";

// Mock data for statistics (to be replaced with real data in the future)
const generateMockStats = (timeRange: string) => {
  const multiplier =
    timeRange === "7days"
      ? 1
      : timeRange === "30days"
        ? 4
        : timeRange === "90days"
          ? 12
          : 20;

  // Generate random data for the time period
  const emailsOverTime = [];
  const now = new Date();
  const days =
    timeRange === "7days"
      ? 7
      : timeRange === "30days"
        ? 30
        : timeRange === "90days"
          ? 90
          : 180;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    emailsOverTime.push({
      date: date.toISOString().split("T")[0],
      count: Math.floor((Math.random() * 30 * multiplier) / days) + 1,
    });
  }

  // Calculate total emails based on the time range
  const totalEmailsSent = emailsOverTime.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  return {
    totalEmailsSent,
    totalRecipients: Math.floor(totalEmailsSent * 1.2),
    averageOpenRate: 0.45 + (Math.random() * 0.2 - 0.1),
    averageClickRate: 0.22 + (Math.random() * 0.1 - 0.05),
    emailsPerTemplate: [
      {
        templateName: "Welcome Email",
        count: Math.floor(totalEmailsSent * 0.3),
      },
      { templateName: "Newsletter", count: Math.floor(totalEmailsSent * 0.25) },
      { templateName: "Promotion", count: Math.floor(totalEmailsSent * 0.2) },
      {
        templateName: "Password Reset",
        count: Math.floor(totalEmailsSent * 0.15),
      },
      { templateName: "Onboarding", count: Math.floor(totalEmailsSent * 0.1) },
    ],
    deliveryStatus: [
      { status: "delivered", count: Math.floor(totalEmailsSent * 0.9) },
      { status: "opened", count: Math.floor(totalEmailsSent * 0.6) },
      { status: "clicked", count: Math.floor(totalEmailsSent * 0.3) },
      { status: "bounced", count: Math.floor(totalEmailsSent * 0.05) },
      { status: "failed", count: Math.floor(totalEmailsSent * 0.05) },
    ],
    emailsOverTime,
  };
};

export async function GET(request: NextRequest) {
  try {
    // Connect to DB
    await connectDB();

    // Get the current user from the token
    const userPayload = getUserFromRequest(request);

    if (!userPayload) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find the user
    const user = await User.findById(userPayload.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the time range from the query params
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30days";

    // For now, generate mock statistics based on the time range
    // This would be replaced with real data from the database in a production app
    const stats = generateMockStats(timeRange);

    return NextResponse.json({ stats });
  } catch (error: any) {
    console.error("Error fetching email statistics:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch email statistics" },
      { status: 500 },
    );
  }
}
