import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "../../../../lib/db";
import ScheduledEmail from "../../../../models/ScheduledEmail";
import AppNotification from "../../../../models/AppNotification";
import { getUserFromRequest } from "../../../../lib/auth";

// GET - Fetch a specific scheduled email
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    // Get the authenticated user
    const user = await getUserFromRequest(request);

    // If no user is found, return unauthorized
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Find the scheduled email
    const scheduledEmail = await ScheduledEmail.findOne({
      _id: params.id,
      userId: user.id,
    });

    if (!scheduledEmail) {
      return NextResponse.json(
        { error: "Scheduled email not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ scheduledEmail });
  } catch (error) {
    console.error("Error fetching scheduled email:", error);
    return NextResponse.json(
      { error: "Failed to fetch scheduled email" },
      { status: 500 },
    );
  }
}

// PUT - Update a scheduled email
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    // Get the authenticated user
    const user = await getUserFromRequest(request);

    // If no user is found, return unauthorized
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Parse the request body
    const data = await request.json();

    // Find the scheduled email
    const scheduledEmail = await ScheduledEmail.findOne({
      _id: params.id,
      userId: user.id,
    });

    if (!scheduledEmail) {
      return NextResponse.json(
        { error: "Scheduled email not found" },
        { status: 404 },
      );
    }

    // Cannot update an email that has already been sent or cancelled
    if (scheduledEmail.status !== "scheduled") {
      return NextResponse.json(
        { error: `Cannot update a ${scheduledEmail.status} email` },
        { status: 400 },
      );
    }

    // Update fields
    const updateData: any = {};

    if (data.subject) updateData.subject = data.subject;
    if (data.scheduledDate) {
      updateData.scheduledDate = new Date(data.scheduledDate);
      updateData.nextSendDate = new Date(data.scheduledDate);
    }
    if (data.recurrence) updateData.recurrence = data.recurrence;

    // Update the scheduled email
    const updatedEmail = await ScheduledEmail.findByIdAndUpdate(
      params.id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    // Create notification for the update
    await AppNotification.create({
      userId: user.id,
      type: "emailSent",
      title: "Email Schedule Updated",
      message: `Your scheduled email "${updatedEmail?.subject}" has been updated.`,
      isRead: false,
      data: {
        scheduledEmailId: updatedEmail?._id,
      },
    });

    return NextResponse.json({ scheduledEmail: updatedEmail });
  } catch (error) {
    console.error("Error updating scheduled email:", error);
    return NextResponse.json(
      { error: "Failed to update scheduled email" },
      { status: 500 },
    );
  }
}

// DELETE - Cancel a scheduled email
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    // Get the authenticated user
    const user = await getUserFromRequest(request);

    // If no user is found, return unauthorized
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Find the scheduled email
    const scheduledEmail = await ScheduledEmail.findOne({
      _id: params.id,
      userId: user.id,
    });

    if (!scheduledEmail) {
      return NextResponse.json(
        { error: "Scheduled email not found" },
        { status: 404 },
      );
    }

    // Cannot cancel an email that has already been sent or cancelled
    if (scheduledEmail.status !== "scheduled") {
      return NextResponse.json(
        { error: `Cannot cancel a ${scheduledEmail.status} email` },
        { status: 400 },
      );
    }

    // Update the status to cancelled
    const cancelledEmail = await ScheduledEmail.findByIdAndUpdate(
      params.id,
      { $set: { status: "cancelled" } },
      { new: true },
    );

    // Create notification for the cancellation
    await AppNotification.create({
      userId: user.id,
      type: "emailSent",
      title: "Email Schedule Cancelled",
      message: `Your scheduled email "${scheduledEmail.subject}" has been cancelled.`,
      isRead: false,
      data: {
        scheduledEmailId: scheduledEmail._id,
      },
    });

    return NextResponse.json({
      message: "Email schedule cancelled successfully",
      scheduledEmail: cancelledEmail,
    });
  } catch (error) {
    console.error("Error cancelling scheduled email:", error);
    return NextResponse.json(
      { error: "Failed to cancel scheduled email" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
