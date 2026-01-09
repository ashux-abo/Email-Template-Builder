import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import ScheduledEmail from "@/models/ScheduledEmail";
import EmailTemplate from "@/models/EmailTemplate";
import Contact from "@/models/Contact";
import AppNotification from "@/models/AppNotification";
import { getUserFromRequest } from "@/lib/auth";

// GET - Fetch all scheduled emails for the current user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the authenticated user
    const user = await getUserFromRequest(request);

    // If no user is found, return unauthorized
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get scheduled emails for user
    const scheduledEmails = await ScheduledEmail.find({
      userId: user.id,
    }).sort({ scheduledDate: 1 });

    return NextResponse.json({ scheduledEmails });
  } catch (error) {
    console.error("Error fetching scheduled emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled emails" },
      { status: 500 },
    );
  }
}

// POST - Create a new scheduled email
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get the authenticated user
    const user = await getUserFromRequest(request);

    // If no user is found, return unauthorized
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body
    const data = await request.json();

    // Validate required fields
    if (
      !data.subject ||
      !data.recipientGroup ||
      !data.scheduledDate ||
      !data.templateId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate template exists
    const template = await EmailTemplate.findById(data.templateId);
    if (!template) {
      return NextResponse.json(
        { error: "Email template not found" },
        { status: 404 },
      );
    }

    // Get recipient count based on the group
    let recipientCount = 0;
    let query = { userId: user.id };

    if (data.recipientGroup !== "all") {
      query = {
        ...query,
        tags: { $in: [data.recipientGroup] },
      };
    }

    recipientCount = await Contact.countDocuments(query);

    // Ensure there are recipients
    if (recipientCount === 0) {
      return NextResponse.json(
        { error: "No recipients found in the selected group" },
        { status: 400 },
      );
    }

    // Create scheduled email
    const scheduledEmail = await ScheduledEmail.create({
      userId: user.id,
      subject: data.subject,
      recipientGroup: data.recipientGroup,
      recipientCount: recipientCount,
      scheduledDate: new Date(data.scheduledDate),
      template: template.name,
      templateId: template._id,
      recurrence: data.recurrence || "once",
      status: "scheduled",
      nextSendDate: new Date(data.scheduledDate),
    });

    // Create notification for the user
    await AppNotification.create({
      userId: user.id,
      type: "emailSent",
      title: "Email Scheduled",
      message: `Your email "${data.subject}" has been scheduled for ${new Date(data.scheduledDate).toLocaleString()}`,
      isRead: false,
      data: {
        scheduledEmailId: scheduledEmail._id,
      },
    });

    return NextResponse.json({ scheduledEmail }, { status: 201 });
  } catch (error) {
    console.error("Error creating scheduled email:", error);
    return NextResponse.json(
      { error: "Failed to create scheduled email" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
