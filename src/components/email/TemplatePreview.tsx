"use client";

import { useEffect, useState } from "react";
import { EmailTemplate } from "../../lib/email-templates";

interface TemplatePreviewProps {
  template: EmailTemplate;
  variables: Record<string, string>;
}

export default function TemplatePreview({
  template,
  variables,
}: TemplatePreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [previewSubject, setPreviewSubject] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Trigger update animation
    setTimeout(() => {
      setIsUpdating(true);
      // Generate preview subject and HTML
      setPreviewSubject(replaceVariables(template.subject || ""));
      setPreviewHtml(replaceVariables(templateHtml));
    });

    // Log template data to help debug
    console.log("Template in preview:", {
      id: template.id,
      name: template.name,
      htmlLength: template.html?.length || 0,
      contentLength: template.content?.length || 0,
      hasHtml: !!template.html,
      hasContent: !!template.content,
    });

    // Get template content (html for predefined templates, content for custom templates)
    const templateHtml = template.html || template.content || "";

    console.log(
      "Template HTML to use:",
      templateHtml.substring(0, 100) + "...",
    );

    // Function to replace variables in the template
    const replaceVariables = (text: string) => {
      if (!text) {
        console.log("No text provided to replace variables");
        return "";
      }

      let result = text;

      // Use baseUrl from variables if it exists, otherwise use window.location.origin
      const baseUrl = variables.baseUrl || window.location.origin;
      const allVariables = {
        ...variables,
        baseUrl,
      };

      // Log variables being used
      console.log("Variables for replacement:", allVariables);

      // Replace each variable placeholder with its value
      Object.entries(allVariables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, "g");
        result = result.replace(regex, value || `[${key}]`);
      });

      // Replace any remaining variables with placeholders
      if (template.variables && Array.isArray(template.variables)) {
        template.variables.forEach((variable) => {
          const regex = new RegExp(`{{${variable}}}`, "g");
          result = result.replace(regex, `[${variable}]`);
        });
      }

      return result;
    };

    const timer = setTimeout(() => setIsUpdating(false), 300);

    return () => clearTimeout(timer);
  }, [template, variables]);

  return (
    <div className="space-y-4">
      <div
        className={`rounded-md border border-gray-200 p-4 transition-all duration-300 ${isUpdating ? "bg-blue-50 border-blue-200" : ""}`}
      >
        <h3 className="font-medium text-gray-700">Subject Preview</h3>
        <p className="mt-1 text-sm">{previewSubject}</p>
      </div>

      <div
        className={`rounded-md border border-gray-200 transition-all duration-300 ${isUpdating ? "border-blue-300 shadow-sm" : ""}`}
      >
        <div className="border-b border-gray-200 bg-gray-50 p-2">
          <h3 className="font-medium text-gray-700">Email Preview</h3>
          {isUpdating && (
            <span className="ml-2 text-xs text-blue-500">Updating...</span>
          )}
        </div>
        <div className="p-4">
          {!previewHtml ? (
            <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 text-gray-500">
              <p>No content to preview</p>
              <p className="text-xs mt-2">Template ID: {template.id}</p>
              <p className="text-xs mt-1">
                Has HTML: {template.html ? "Yes" : "No"}
              </p>
              <p className="text-xs mt-1">
                Has Content: {template.content ? "Yes" : "No"}
              </p>
            </div>
          ) : (
            <iframe
              title="Email Preview"
              srcDoc={previewHtml}
              className="min-h-[400px] w-full border-0"
              sandbox="allow-same-origin allow-scripts"
            />
          )}
        </div>
      </div>
    </div>
  );
}
