import nodemailer from "nodemailer";
import { EmailTemplate } from "../lib/email-templates";
import User from "../models/User";
import EmailHistory from "../models/EmailHistory";
import { compileTemplate } from "../lib/email-templates";
import mongoose from "mongoose";

// Get email configuration from environment variables
const EMAIL_USER = process.env.SMTP_USER;
const EMAIL_PASSWORD = process.env.SMTP_PASSWORD;
const EMAIL_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const EMAIL_PORT = parseInt(process.env.SMTP_PORT || "587", 10);

// Create reusable transporter
const createTransporter = () => {
  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    throw new Error(
      "Email configuration missing. Please set SMTP_USER and SMTP_PASSWORD in your .env file",
    );
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for port 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
};

interface SendEmailParams {
  userId: string;
  templateId: string;
  variables: Record<string, string>;
  recipients: string[];
  template?: any;
}

/**
 * Send an email using a template and save to email history
 */
export async function sendEmail({
  userId,
  templateId,
  variables,
  recipients,
  template,
}: SendEmailParams): Promise<{ success: boolean; message: string }> {
  try {
    // 3. Pass the template to getCompiledTemplate
    const { subject, html } = await getCompiledTemplate(
      templateId,
      variables,
      template,
    );

    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"Email Sender" <${EMAIL_USER}>`,
      to: recipients.join(", "),
      subject,
      html,
    });

    // Save to email history
    await saveEmailHistory({
      userId: new mongoose.Types.ObjectId(userId),
      templateId,
      subject,
      recipients,
      content: html,
      status: "success",
    });

    return {
      success: true,
      message: `Email sent: ${info.messageId}`,
    };
  } catch (error: any) {
    // Save failed email to history
    if (userId) {
      try {
        await saveEmailHistory({
          userId: new mongoose.Types.ObjectId(userId),
          templateId,
          subject: "Failed Email",
          recipients,
          content: JSON.stringify(variables),
          status: "failed",
          errorMessage: error.message,
        });
      } catch (historyError) {
        // Silently handle history saving errors
      }
    }

    return {
      success: false,
      message: `Failed to send email: ${error.message}`,
    };
  }
}

/**
 * Get a compiled template with variables replaced
 */
async function getCompiledTemplate(
  templateId: string,
  variables: Record<string, string>,
  passedTemplate?: any,
): Promise<{ subject: string; html: string }> {
  let template = passedTemplate;
  // Import dynamically to avoid circular dependencies
  if (!template) {
    // Use getTemplateByIdWithDb to support both predefined and database templates
    const { getTemplateByIdWithDb } = await import("../lib/email-templates");
    template = await getTemplateByIdWithDb(templateId);
  }

  if (!template) {
    throw new Error(`Template with ID ${templateId} not found`);
  }

  // Ensure we have html content (use content field if html is missing)
  const htmlContent = template.html || template.content || "";
  const subjectContent = template.subject || "";

  if (!htmlContent) {
    throw new Error(`Template with ID ${templateId} has no HTML content`);
  }

  const compiledSubject = compileTemplate(subjectContent, variables);
  const compiledHtml = compileTemplate(htmlContent, variables);

  return {
    subject: compiledSubject,
    html: compiledHtml,
  };
}

/**
 * Save email to history
 */
async function saveEmailHistory(emailData: {
  userId: mongoose.Types.ObjectId;
  templateId: string;
  subject: string;
  recipients: string[];
  content: string;
  status: "success" | "failed";
  errorMessage?: string;
}) {
  try {
    await EmailHistory.create(emailData);
  } catch (error) {
    // Silently fail if history can't be saved
  }
}
