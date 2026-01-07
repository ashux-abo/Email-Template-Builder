import { NextRequest, NextResponse } from "next/server";
import { getTemplates, getTemplateById } from "../../../lib/email-templates";
import EmailTemplate from "../../../models/EmailTemplate";
import { getUserFromRequest } from "../../../lib/auth";
import dbConnect from "../../../lib/db";
import { EmailTemplate as PredefinedTemplate } from "../../../lib/email-templates";
import connectDB from "../../../lib/db";

// ... (keep normalizeTemplate as is)
// function normalizeTemplate(template: any) {
  if (!template) return null;

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

    const user = await getUserFromRequest(request);

    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const includePredefined = searchParams.get("includeDefault") !== "false";

    // FIX: Explicitly type the array to prevent the "implicitly has type any" error
    let allTemplates: any[] = [];

    if (includePredefined) {
      const predefinedTemplates = getTemplates().map((template) => ({
        ...template,
        predefined: true,
      }));
      allTemplates = [...predefinedTemplates];
    }

    const query = {
      $or: [{ userId: user.id }, { isPublic: true, userId: { $ne: user.id } }],
    };

    const databaseTemplates = await EmailTemplate.find(query)
      .select(
        "_id name description subject isPublic userId createdAt variables",
      )
      .sort({ createdAt: -1 });

    const transformedDbTemplates = databaseTemplates.map((template) => {
      const templateObj = template.toObject ? template.toObject() : template;
      return {
        ...templateObj,
        id: templateObj._id.toString(),
        predefined: false,
        isOwner: templateObj.userId.toString() === user.id,
      };
    });

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
    // FIX: Ensure consistency with await
    const currentUser = await getUserFromRequest(request);

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();

    if (data.content && !data.html) {
      data.html = data.content;
      delete data.content;
    }

    const template = new EmailTemplate({
      ...data,
      userId: currentUser.id,
    });

    const savedTemplate = await template.save();

    const savedTemplateObj = savedTemplate.toObject
      ? savedTemplate.toObject()
      : savedTemplate;
    const normalizedTemplate = normalizeTemplate(savedTemplateObj);

    return NextResponse.json(
      {
        message: "Template created successfully",
        template: {
          ...normalizedTemplate,
          content: savedTemplateObj.html,
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
