import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/db";
import { getUserFromRequest } from "../../../../lib/auth";
import { sendEmail } from "../../../../utils/email";
import { emailSendSchema } from "../../../../utils/validation";
import { getTemplateByIdWithDb } from "../../../../lib/email-templates";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    // Connect to DB
    await dbConnect();

    // Check authentication
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Get template to validate required variables
    console.log("Looking for template with ID:", body.templateId);
    const template = await getTemplateByIdWithDb(body.templateId);
    console.log("Template found:", template ? "Yes" : "No");
    
    if (!template) {
      console.error(`Template with ID ${body.templateId} not found`);
      return NextResponse.json(
        { 
          error: `Template with ID ${body.templateId} not found`,
          templateId: body.templateId,
        },
        { status: 404 },
      );
    }
    
    console.log("Template details:", {
      id: template.id,
      name: template.name,
      hasHtml: !!template.html,
      hasContent: !!template.content,
      variables: template.variables,
    });

    // Check if all required variables are provided
    const missingVariables = template.variables.filter(
      (variable) => !body.variables || !body.variables[variable],
    );

    if (missingVariables.length > 0) {
      return NextResponse.json(
        {
          error: "Missing required template variables",
          missingVariables,
        },
        { status: 400 },
      );
    }

    // Custom validation schema that doesn't require subject
    const sendEmailSchema = z.object({
      // Using .min(1) to handle "required" and passing the message there
      templateId: z.string().min(1, "Please select a template"),

      recipients: z
        .string()
        .min(1, "At least one recipient is required") // Simplified error message passing
        .refine(
          (emails) => {
            if (!emails) return false;
            const emailList = emails.split(",").map((e) => e.trim());
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailList.every((email) => emailRegex.test(email));
          },
          { message: "Please enter valid email addresses separated by commas" },
        ),
      variables: z
        .record(z.string(), z.string())
        .refine(
          (data) =>
            Object.values(data).every((value) => value && value.trim() !== ""),
          {
            message: "All template variables must be filled out",
          },
        ),
    });

    // Validate input with custom schema
    const validationResult = sendEmailSchema.safeParse({
      ...body,
      recipients: Array.isArray(body.recipients)
        ? body.recipients.join(",")
        : body.recipients,
    });

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.issues);
      return NextResponse.json(
        {
          error: "Validation failed",
          issues: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const {
      templateId,
      recipients: recipientsString,
      variables,
    } = validationResult.data;
    const recipients = recipientsString.split(",").map((email) => email.trim());

    // Send the email (pass the template to avoid refetching)
    const result = await sendEmail({
      userId: user.id,
      templateId,
      variables,
      recipients,
      template, // Pass the already-fetched template
    });

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Email sent successfully",
      result,
    });
  } catch (error: any) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 },
    );
  }
}
