import { NextRequest, NextResponse } from "next/server";
import { getTemplateById } from "../../../../lib/email-templates";
import EmailTemplate from "../../../../models/EmailTemplate";
import { getUserFromRequest } from "../../../../lib/auth";
import connectDB from "../../../../lib/db";
import mongoose from "mongoose";

// Helper function to normalize template objects
function normalizeTemplate(template: any) {
  if (!template) return null;

  // If it's a database template with _id, add an id property too
  if (template._id && !template.id) {
    return {
      ...template,
      id: template._id.toString(),
    };
  }

  return template;
}

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await connectDB();

    // Get the authenticated user
    const user = await getUserFromRequest(request);

    // If no user is found, return unauthorized
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // First check if it's a predefined template
    const predefinedTemplate = getTemplateById(id);
    if (predefinedTemplate) {
      return NextResponse.json({
        template: {
          ...predefinedTemplate,
          predefined: true,
        },
      });
    }

    // Then check database for custom templates
    if (mongoose.Types.ObjectId.isValid(id)) {
      const dbTemplate = await EmailTemplate.findById(id);

      if (!dbTemplate) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 },
        );
      }

      // Check if user has access to this template (owner or public)
      const isOwner = dbTemplate.userId.toString() === user.id;
      const isPublic = dbTemplate.isPublic === true;

      if (!isOwner && !isPublic) {
        return NextResponse.json(
          { error: "You do not have access to this template" },
          { status: 403 },
        );
      }

      // Return template with additional fields
      const templateObj = dbTemplate.toObject
        ? dbTemplate.toObject()
        : dbTemplate;
      return NextResponse.json({
        template: {
          ...templateObj,
          id: templateObj._id.toString(),
          predefined: false,
          isOwner,
          html: templateObj.html || "",
          content: templateObj.html || "",
        },
      });
    }

    return NextResponse.json({ error: "Invalid template ID" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const currentUser = await getUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const { name, subject, content, variables, isPublic } =
      await request.json();

    if (!name || !subject || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();

    const template = await EmailTemplate.findById(id);

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    if (template.userId.toString() !== currentUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    template.name = name;
    template.subject = subject;
    template.html = content;
    template.variables = variables || [];
    template.isPublic = !!isPublic;

    await template.save();

    return NextResponse.json({
      message: "Template updated",
      template: {
        ...template.toObject(),
        id: template._id.toString(),
        content: template.html,
      },
    });
  } catch (error: any) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update template" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const currentUser = await getUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    await connectDB();

    const template = await EmailTemplate.findById(id);

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 },
      );
    }

    if (template.userId.toString() !== currentUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await template.deleteOne();

    return NextResponse.json({ message: "Template deleted" });
  } catch (error: any) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete template" },
      { status: 500 },
    );
  }
}
