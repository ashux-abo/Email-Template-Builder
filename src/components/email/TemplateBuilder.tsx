"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import TemplateEditor from "./TemplateEditor";
import { EmailTemplate } from "../../lib/email-templates";
import { FileText, Eye, Code, Sparkles, CheckCircle2 } from "lucide-react";

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
    blocks: null as any,
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
    setIsPreviewUpdating(true);
    setTimeout(() => setIsPreviewUpdating(false), 300);

    setTemplate((prev) => ({ ...prev, html }));

    const variableRegex = /{{([^}]+)}}/g;
    const matches = html.match(variableRegex) || [];
    const extractedVariables = [
      ...new Set(matches.map((match) => match.replace(/{{|}}/g, ""))),
    ];

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

      const updatedTemplate = { ...template };
      if (!updatedTemplate.variables.includes("senderName")) {
        updatedTemplate.variables = [
          ...updatedTemplate.variables,
          "senderName",
        ];
      }

      const templateToSave = {
        ...updatedTemplate,
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading template...</p>
        </div>
      </div>
    );
  }

  const getPreviewHtml = () => {
    let html = template.html;

    template.variables.forEach((variable) => {
      const regex = new RegExp(`{{${variable}}}`, "g");
      html = html.replace(regex, `[${variable}]`);
    });

    return html;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {templateId ? "Edit Email Template" : "Create New Template"}
            </h2>
            <p className="text-gray-600">
              Design and customize your email template with dynamic variables
              and live preview
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Template Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">
                Template Details
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Template Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={template.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Welcome Email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={template.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
                  placeholder="Brief description of this template"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={template.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-900 placeholder-gray-400"
                  placeholder="e.g., Welcome to Our Service!"
                  required
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-3">
                  <input
                    id="isPublic"
                    name="isPublic"
                    type="checkbox"
                    checked={template.isPublic}
                    onChange={handleCheckboxChange}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="isPublic"
                      className="font-semibold text-gray-900 cursor-pointer block"
                    >
                      Make this template public
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Public templates are available to all users of the system
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Variables Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-gray-900">
                Detected Variables
              </h3>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 border border-gray-200">
              {template.variables.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {template.variables.map((variable) => (
                    <span
                      key={variable}
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        variable === "senderName"
                          ? "bg-green-100 text-green-800 border-2 border-green-300 shadow-sm"
                          : "bg-white text-primary border-2 border-primary/20 shadow-sm"
                      }`}
                    >
                      <span className="font-mono">{variable}</span>
                      {variable === "senderName" && (
                        <span title="Used for From field in emails">
                          <CheckCircle2 className="w-4 h-4" />
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-3">
                  No variables detected. Add variables using{" "}
                  <code className="bg-white px-2 py-1 rounded text-primary font-mono text-xs border border-gray-200">
                    {"{{variableName}}"}
                  </code>{" "}
                  syntax in your template.
                </p>
              )}
              <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>
                    <span className="font-semibold">senderName</span> is
                    automatically included and will be used as the "From" name
                    in emails.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Live Preview
                </h3>
              </div>
              {isPreviewUpdating && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  Updating...
                </span>
              )}
            </div>

            <div
              className={`rounded-lg border-2 bg-gray-50 p-1 transition-all duration-300 ${
                isPreviewUpdating
                  ? "border-blue-300 shadow-lg shadow-blue-100"
                  : "border-gray-200"
              }`}
            >
              <div className="bg-white rounded-md overflow-hidden shadow-sm">
                <iframe
                  title="Email Preview"
                  srcDoc={getPreviewHtml()}
                  className="w-full h-[500px] border-0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Template HTML Editor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Template HTML</h3>
        </div>

        <TemplateEditor
          initialContent={template.html}
          onChange={handleHtmlChange}
        />

        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-sm text-amber-900 flex items-start gap-2">
            <span className="text-lg">💡</span>
            <span>
              Use{" "}
              <code className="bg-white px-2 py-0.5 rounded text-primary font-mono text-xs border border-amber-200">
                {"{{variableName}}"}
              </code>{" "}
              syntax to define dynamic content.
              <code className="bg-white px-2 py-0.5 rounded text-green-700 font-mono text-xs border border-amber-200 ml-1">
                {"{{senderName}}"}
              </code>{" "}
              is a special variable used for the "From" name in emails.
            </span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-3 pb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              {templateId ? "Update Template" : "Create Template"}
            </>
          )}
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
