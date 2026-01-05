"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import TemplateEditor from "./TemplateEditor";
import { EmailTemplate } from "@/lib/email-templates";
import { FileText } from "lucide-react";

interface TemplateBuilderProps {
  templateId?: string;
  onSave?: (template: any) => void;
}

const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  templateId,
  onSave,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewUpdating, setIsPreviewUpdating] = useState(false);
  const [template, setTemplate] = useState({
    name: "",
    description: "",
    subject: "",
    html: defaultTemplate,
    css: defaultCss,
    variables: [] as string[],
    isPublic: false,
  });

  useEffect(() => {
    if (templateId) {
      fetchTemplate(templateId);
    }
  }, [templateId]);

  const fetchTemplate = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/templates/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }

      const data = await response.json();
      setTemplate(data.template);
    } catch (error: any) {
      toast.error(error.message || "Error loading template");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleHtmlChange = (html: string) => {
    // Trigger preview update animation
    setIsPreviewUpdating(true);
    setTimeout(() => setIsPreviewUpdating(false), 300);

    setTemplate((prev) => ({ ...prev, html }));

    // Extract variables from the HTML using regex for {{variable}} pattern
    const variableRegex = /{{([^}]+)}}/g;
    const matches = html.match(variableRegex) || [];
    const extractedVariables = [
      ...new Set(matches.map((match) => match.replace(/{{|}}/g, ""))),
    ];

    // Always include senderName in the variables list
    const variables = extractedVariables.includes("senderName")
      ? extractedVariables
      : [...extractedVariables, "senderName"];

    setTemplate((prev) => ({ ...prev, variables }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Ensure senderName is always included in variables before saving
      const updatedTemplate = { ...template };
      if (!updatedTemplate.variables.includes("senderName")) {
        updatedTemplate.variables = [
          ...updatedTemplate.variables,
          "senderName",
        ];
      }

      // Preserve the blocks data if it exists
      // This ensures we don't lose visual editor structure when saving in code editor
      const templateToSave = {
        ...updatedTemplate,
        // Keep blocks if they exist, but update HTML
        blocks: updatedTemplate.blocks || null,
      };

      const url = templateId
        ? `/api/templates/${templateId}`
        : "/api/templates";

      const method = templateId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save template");
      }

      const data = await response.json();

      toast.success(
        templateId
          ? "Template updated successfully"
          : "Template created successfully",
      );

      if (onSave) {
        onSave(data.template);
      } else {
        router.push("/dashboard/templates");
      }
    } catch (error: any) {
      toast.error(error.message || "Error saving template");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading template...</div>;
  }

  // Create a preview of the template with sample values for variables
  const getPreviewHtml = () => {
    let html = template.html;

    // Replace variables with sample values
    template.variables.forEach((variable) => {
      const regex = new RegExp(`{{${variable}}}`, "g");
      html = html.replace(regex, `[${variable}]`);
    });

    return html;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Template Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={template.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="e.g., Welcome Email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={template.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Brief description of this template"
              required
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Email Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={template.subject}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="e.g., Welcome to Our Service!"
              required
            />
          </div>

          <div className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="isPublic"
                name="isPublic"
                type="checkbox"
                checked={template.isPublic}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="isPublic" className="font-medium text-gray-700">
                Make this template public
              </label>
              <p className="text-gray-500">
                Public templates are available to all users of the system
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Detected Variables
            </label>
            <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 p-3">
              {template.variables.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {template.variables.map((variable) => (
                    <span
                      key={variable}
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        variable === "senderName"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {variable}
                      {variable === "senderName" && (
                        <span
                          className="ml-1"
                          title="Used for From field in emails"
                        >
                          *
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No variables detected. Add variables using{" "}
                  {"{{variableName}}"} syntax in your template.
                </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Note: <span className="font-medium">senderName</span> is
                automatically included and will be used as the "From" name in
                emails.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Preview
              {isPreviewUpdating && (
                <span className="ml-2 text-xs text-blue-500">Updating...</span>
              )}
            </label>
            <div
              className={`mt-1 rounded-md border border-gray-300 bg-white p-3 transition-all duration-300 ${isPreviewUpdating ? "border-blue-300 shadow-sm" : ""}`}
            >
              <iframe
                title="Email Preview"
                srcDoc={getPreviewHtml()}
                className="h-[300px] w-full rounded border"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">
          Template HTML
        </label>
        <TemplateEditor
          initialContent={template.html}
          onChange={handleHtmlChange}
        />
        <p className="mt-1 text-xs text-gray-500">
          Use {"{{variableName}}"} syntax to define dynamic content.
          <span className="font-medium text-primary">
            {" "}
            {"{{senderName}}"}
          </span>{" "}
          is a special variable used for the "From" name in emails.
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {isSaving
            ? "Saving..."
            : templateId
              ? "Update Template"
              : "Create Template"}
        </button>
      </div>
    </div>
  );
};

// Default template HTML
const defaultTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Email Template</title>
</head>
<body>
  <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
    <div style="background-color: #4a6cf7; color: white; padding: 20px; text-align: center;">
      <h1>Hello, {{name}}!</h1>
    </div>
    <div style="padding: 20px; border: 1px solid #eee;">
      <p>This is a sample email template. You can edit it to suit your needs.</p>
      <p>Feel free to add your content here.</p>
      <a href="{{actionLink}}" style="display: inline-block; background-color: #4a6cf7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 20px;">Click Here</a>
      <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
        Best regards,<br>
        {{senderName}}
      </p>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #888;">
      <p>&copy; 2023 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Default CSS
const defaultCss = `
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0;
}
`;

export default TemplateBuilder;
