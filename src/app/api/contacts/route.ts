import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Contact from "../../../models/Contact";
import { getUserFromRequest } from "../../../lib/auth";

// GET - Fetch all contacts for the current user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the authenticated user
    const user = await getUserFromRequest(request);

    // If no user is found, return unauthorized
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all contacts for the user
    const contacts = await Contact.find({ userId: user.id }).sort({ name: 1 });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}

// POST - Create a new contact
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
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    // Check if contact with this email already exists for this user
    const existingContact = await Contact.findOne({
      userId: user.id,
      email: data.email.toLowerCase(),
    });

    if (existingContact) {
      return NextResponse.json(
        { error: "A contact with this email already exists" },
        { status: 400 },
      );
    }

    // Create new contact
    const contact = await Contact.create({
      userId: user.id,
      name: data.name,
      email: data.email,
      company: data.company || "",
      tags: Array.isArray(data.tags)
        ? data.tags
        : typeof data.tags === "string"
          ? data.tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter(Boolean)
          : [],
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating contact:", error);

    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "A contact with this email already exists" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 },
    );
  }
}

// Import this if you want to use it in other files
export const dynamic = "force-dynamic";
