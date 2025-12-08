"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "react-toastify";
import TemplateSelector from "../../components/email/TemplateSelector";
import ContentEditor from "@/components/email/ContentEditor";
import TemplatePreview from "../../components/email/TemplatePreview";
import { EmailTemplate } from "../../lib/email-templates";

export default function EmailSender() {
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTemplateSelect = (template: EmailTemplate) => {
    console.log("Selected template:", {
      id: template.id,
      name: template.name,
      hasHtml: !!template.html,
      hasContent: !!template.content,
      htmlLength: template.html?.length || 0,
      contentLength: template.content?.length || 0,
    });

    // If the template is missing html/content, try to fetch it fully from the API
    if (!template.html && !template.content && template.id) {
      console.log("Fetching complete template data...");
      fetch(`/api/templates/${template.id}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.template) {
            console.log("Fetched complete template:", {
              id: data.template.id,
              name: data.template.name,
              hasHtml: !!data.template.html,
              hasContent: !!data.template.content,
              htmlLength: data.template.html?.length || 0,
              contentLength: data.template.content?.length || 0,
            });
            setSelectedTemplate(data.template);

            // Reset variables
            const defaultVariables: Record<string, string> = {};
            data.template.variables.forEach(
              (v: string) =>
                (defaultVariables[v] = data.template.defaultValues?.[v] || ""),
            );
            setVariables(defaultVariables);
          } else {
            console.error("Failed to fetch complete template data");
            setSelectedTemplate(template);

            // Reset variables
            const defaultVariables: Record<string, string> = {};
            template.variables.forEach(
              (v) => (defaultVariables[v] = template.defaultValues?.[v] || ""),
            );
            setVariables(defaultVariables);
          }
        })
        .catch((error) => {
          console.error("Error fetching complete template:", error);
          setSelectedTemplate(template);

          // Reset variables
          const defaultVariables: Record<string, string> = {};
          template.variables.forEach(
            (v) => (defaultVariables[v] = template.defaultValues?.[v] || ""),
          );
          setVariables(defaultVariables);
        });
    } else {
      setSelectedTemplate(template);
      setError(null);
      setSuccess(null);

      // Reset variables when template changes
      const defaultVariables: Record<string, string> = {};
      template.variables.forEach(
        (v) => (defaultVariables[v] = template.defaultValues?.[v] || ""),
      );
      setVariables(defaultVariables);
    }
  };

  const handleVariablesChange = (newVariables: Record<string, string>) => {
    // Update variables state as user types in the form
    setVariables((prev) => ({
      ...prev,
      ...newVariables,
    }));
  };

  const handleSendEmail = async (
    templateId: string,
    contentVariables: Record<string, string>,
    recipients: string[],
  ) => {
    setError(null);
    setSuccess(null);
    try {
      setIsLoading(true);

      console.log("Sending email with:", {
        templateId,
        variables: contentVariables,
        recipients,
      });

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId,
          variables: contentVariables,
          recipients,
        }),
      });

      // Parse the response JSON
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        throw new Error("Failed to parse server response");
      }

      // Check if the request was successful
      if (!response.ok) {
        console.error("Email sending failed:", result);

        // Show detailed validation errors if available
        if (result.issues && Array.isArray(result.issues)) {
          const errorMessages = result.issues
            .map((issue: any) => issue.message)
            .join(", ");
          throw new Error(`Validation errors: ${errorMessages}`);
        }

        // Show missing variables if available
        if (result.missingVariables && Array.isArray(result.missingVariables)) {
          throw new Error(
            `Missing variables: ${result.missingVariables.join(", ")}`,
          );
        }

        throw new Error(
          result.error ||
            `Failed to send email: ${response.status} ${response.statusText}`,
        );
      }

      const successMessage = `Email sent successfully to ${recipients.join(", ")}!`;
      setSuccess(successMessage);
      toast.success(successMessage);
      setVariables(contentVariables);
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send email";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Send email error:", error);

      // Try to get more diagnostic information
      try {
        const diagnosticResponse = await fetch("/api/debug/env");
        if (diagnosticResponse.ok) {
          const diagnosticData = await diagnosticResponse.json();
          console.log("Email environment diagnostic:", diagnosticData);
        }
      } catch (diagError) {
        // Silently handle diagnostic errors
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Email Composer</h1>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-300 text-red-700">
          <h3 className="font-semibold mb-1">Error sending email:</h3>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-md bg-green-50 border border-green-300 text-green-700">
          <h3 className="font-semibold mb-1">Success!</h3>
          <p>{success}</p>
        </div>
      )}

      {!selectedTemplate ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Select a Template</h2>
          <p className="text-gray-600">
            Choose a template to get started with your email
          </p>
          <TemplateSelector
            onSelect={handleTemplateSelect}
            includePredefined={true}
          />
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-semibold">Customize Email</h2>
            <ContentEditor
              template={selectedTemplate}
              onSend={handleSendEmail}
              onVariablesChange={handleVariablesChange}
            />
            <button
              className="mt-4 text-sm text-blue-500 hover:underline"
              onClick={() => setSelectedTemplate(null)}
              disabled={isLoading}
            >
              ← Back to template selection
            </button>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Preview</h2>
            <TemplatePreview
              template={selectedTemplate}
              variables={variables}
            />
          </div>
        </div>
      )}
    </div>
  );
}
