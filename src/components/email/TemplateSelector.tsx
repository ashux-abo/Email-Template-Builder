"use client";
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EmailTemplate } from "../../lib/email-templates";
import { Badge } from "../../components/ui/badge";
import { CalendarCheck, Globe, Lock, Star } from "lucide-react";

interface TemplateSelectorProps {
  onSelect: (template: EmailTemplate) => void;
  selectedTemplateId?: string;
  includePredefined?: boolean;
}

export default function TemplateSelector({
  onSelect,
  selectedTemplateId,
  includePredefined = true,
}: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        setIsLoading(true);
        setError(null);

        const url = `/api/templates${includePredefined ? "" : "?includeDefault=false"}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch templates");
        }

        const data = await response.json();
        setTemplates(data.templates);
      } catch (err: any) {
        setError(err.message || "Failed to load templates");
        toast.error("Failed to load email templates");
      } finally {
        setIsLoading(false);
      }
    }

    fetchTemplates();
  }, [includePredefined]);

  const handleSelectTemplate = async (template: EmailTemplate) => {
    console.log("Template selected from list:", {
      id: template.id,
      name: template.name,
      hasHtml: !!template.html,
      hasContent: !!template.content,
    });

    // For non-predefined templates, ensure we fetch the complete data
    if (!template.predefined && template.id) {
      try {
        console.log("Fetching full template data for:", template.id);
        const response = await fetch(`/api/templates/${template.id}`);

        if (response.ok) {
          const data = await response.json();
          console.log("Full template data:", {
            id: data.template.id,
            name: data.template.name,
            hasHtml: !!data.template.html,
            hasContent: !!data.template.content,
            htmlLength: data.template.html?.length || 0,
            contentLength: data.template.content?.length || 0,
          });
          onSelect(data.template);
        } else {
          // If fetch fails, use the original template
          console.error(
            "Failed to fetch full template data, using original template",
          );
          onSelect(template);
        }
      } catch (error) {
        console.error("Error fetching full template:", error);
        onSelect(template);
      }
    } else {
      // For predefined templates, use as-is
      onSelect(template);
    }
  };

  // Helper function to get template ID - handles both predefined templates (id) and custom templates (_id)
  const getTemplateId = (template: any) => template.id || template._id;

  // Helper function to check if a template is selected
  const isTemplateSelected = (template: any) => {
    const id = getTemplateId(template);
    return selectedTemplateId === id;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading templates...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        <button
          className="mt-2 text-blue-500 underline"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <div
          key={getTemplateId(template)}
          className={`cursor-pointer rounded-lg border p-4 transition-colors hover:border-primary ${
            isTemplateSelected(template)
              ? "border-2 border-primary bg-primary/5"
              : "border-gray-200"
          }`}
          onClick={() => handleSelectTemplate(template)}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium">{template.name}</h3>
            <div className="flex space-x-1">
              {template.predefined && (
                <Badge className="bg-blue-500">
                  <Star className="h-3 w-3 mr-1" />
                  Built-in
                </Badge>
              )}
              {template.isPublic && !template.predefined && (
                <Badge className="bg-green-500">
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              )}
              {!template.isPublic && !template.predefined && (
                <Badge variant="outline">
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </Badge>
              )}
              {template.isOwner === false && !template.predefined && (
                <Badge variant="secondary">Shared</Badge>
              )}
            </div>
          </div>

          <p className="mt-1 text-sm text-gray-500">{template.description}</p>

          {template.createdAt && (
            <div className="mt-2 text-xs text-gray-400 flex items-center">
              <CalendarCheck className="h-3 w-3 mr-1" />
              Created: {formatDate(template.createdAt)}
            </div>
          )}

          <div className="mt-4">
            <span className="text-xs text-gray-500">Variables: </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {template.variables && template.variables.length > 0 ? (
                template.variables.map((variable) => (
                  <span
                    key={`${getTemplateId(template)}-${variable}`}
                    className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs"
                  >
                    {variable}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400">No variables</span>
              )}
            </div>
          </div>
        </div>
      ))}

      {templates.length === 0 && (
        <div className="col-span-full text-center py-8">
          <p className="text-gray-500">
            No templates found. Create your first template to get started.
          </p>
        </div>
      )}
    </div>
  );
}
