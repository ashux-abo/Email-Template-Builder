import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import AppNotification from "../../../models/AppNotification";
import { getUserFromRequest } from "../../../lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the authenticated user
    const user = await getUserFromRequest(request);

    // If no user is found, return unauthorized
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL params
    const searchParams = request.nextUrl.searchParams;
    const limit = Number(searchParams.get("limit")) || 10;
    const page = Number(searchParams.get("page")) || 1;
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    // Build query
    const query: any = { userId: user.id };
    if (unreadOnly) {
      query.isRead = false;
    }

    // Fetch notifications
    const notifications = await AppNotification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count for pagination
    const total = await AppNotification.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
