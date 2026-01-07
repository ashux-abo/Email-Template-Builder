import { NextRequest, NextResponse } from "next/server";
import { getTemplates } from "../../../lib/email-templates";
import EmailTemplate from "../../../models/EmailTemplate";
import { getUserFromRequest } from "../../../lib/auth";
import connectDB from "../../../lib/db";

// Helper function to normalize template objects
// Moved to top level and fixed syntax
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

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get the authenticated user
    const user = await getUserFromRequest(request);

    // If no user is found, return unauthorized
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if we should include predefined templates
    const { searchParams } = new URL(request.url);
    const includePredefined = searchParams.get("includeDefault") !== "false";

    // EXPLICIT TYPE: Prevents "implicitly has type any[]" error
    let allTemplates: any[] = [];

    if (includePredefined) {
      const predefinedTemplates = getTemplates().map((template) => ({
        ...template,
        predefined: true,
      }));
      allTemplates = [...predefinedTemplates];
    }

    // Query options to get user's own templates and public templates from others
    const query = {
      $or: [
        { userId: user.id }, // User's own templates
        { isPublic: true, userId: { $ne: user.id } }, // Public templates from others
      ],
    };

    // Get templates from database
    const databaseTemplates = await EmailTemplate.find(query)
      .select(
        "_id name description subject isPublic userId createdAt variables",
      )
      .sort({ createdAt: -1 });

    // Transform database templates to match the format
    const transformedDbTemplates = databaseTemplates.map((template) => {
      const templateObj = template.toObject ? template.toObject() : template;
      return {
        ...templateObj,
        id: templateObj._id.toString(),
        predefined: false,
        isOwner: templateObj.userId.toString() === user.id,
      };
    });

    // Merge results
    allTemplates = [...allTemplates, ...transformedDbTemplates];

    return NextResponse.json({ templates: allTemplates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Await ensures consistency for Next.js 16 build checks
    const currentUser = await getUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const data = await request.json();

    // Handle content field - map it to html field
    if (data.content && !data.html) {
      data.html = data.content;
      delete data.content;
    }

    const template = new EmailTemplate({
      ...data,
      userId: currentUser.id,
    });

    const savedTemplate = await template.save();

    // Make sure to include content in the response
    const savedTemplateObj = savedTemplate.toObject
      ? savedTemplate.toObject()
      : savedTemplate;

    // This call will now work because normalizeTemplate is correctly defined above
    const normalizedTemplate = normalizeTemplate(savedTemplateObj);

    return NextResponse.json(
      {
        message: "Template created successfully",
        template: {
          ...normalizedTemplate,
          content: savedTemplateObj.html, // Add content field to the response
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create template" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
