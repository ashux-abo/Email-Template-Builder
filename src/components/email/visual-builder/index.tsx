"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { TemplateSettings } from "./TemplateSettings";
import { BlockToolbar } from "./BlockToolbar";
import { EmailPreview } from "./EmailPreview";
import { BlockEditor } from "./BlockEditor";
import {
  defaultBlocks,
  getDefaultContentForType,
  getDefaultStylesForType,
  extractVariables,
  generateHtml,
} from "./utils";
import {
  BlockContent,
  BlockType,
  TemplateBlock,
  VisualTemplate,
  VisualTemplateBuilderProps,
} from "./types";
import {
  Layers,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Save,
  X,
} from "lucide-react";

export function VisualTemplateBuilder({
  templateId,
  onSave,
}: VisualTemplateBuilderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  const [template, setTemplate] = useState<VisualTemplate>({
    name: "",
    description: "",
    subject: "",
    blocks: defaultBlocks,
    variables: ["name", "actionLink", "senderName"],
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

      if (
        data.template.blocks &&
        Array.isArray(data.template.blocks) &&
        data.template.blocks.length > 0
      ) {
        setTemplate(data.template);
      } else if (data.template.html) {
        const convertedTemplate = {
          ...data.template,
          blocks: [
            {
              id: `header-${Date.now()}`,
              type: "header",
              content: {
                text: "Template Header",
              },
              styles: getDefaultStylesForType("header"),
            },
            {
              id: `text-${Date.now()}`,
              type: "text",
              content: {
                text: "This template was imported from HTML code. You can now edit it using the visual editor.",
              },
              styles: getDefaultStylesForType("text"),
            },
            {
              id: `text-html-${Date.now()}`,
              type: "text",
              content: {
                text: "Note: To preserve all your HTML formatting, you can also continue to edit this template in the HTML editor.",
              },
              styles: getDefaultStylesForType("text"),
            },
          ],
        };
        setTemplate(convertedTemplate);

        toast.info(
          "Template was originally created in HTML editor. Basic conversion applied.",
          {
            autoClose: 5000,
          },
        );
      } else {
        setTemplate({
          ...data.template,
          blocks: defaultBlocks,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Error loading template");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateChange = (changes: Partial<VisualTemplate>) => {
    setTemplate((prev) => ({ ...prev, ...changes }));
  };

  const addBlock = (type: BlockType) => {
    const newBlock: TemplateBlock = {
      id: `${type}-${Date.now()}`,
      type,
      content: getDefaultContentForType(type),
      styles: getDefaultStylesForType(type),
    };

    setTemplate((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));

    setActiveBlock(newBlock.id);
  };

  const removeBlock = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== id),
    }));

    if (activeBlock === id) {
      setActiveBlock(null);
    }
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = template.blocks.findIndex((block) => block.id === id);
    if (index === -1) return;

    const newBlocks = [...template.blocks];

    if (direction === "up" && index > 0) {
      [newBlocks[index - 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index - 1],
      ];
    } else if (direction === "down" && index < newBlocks.length - 1) {
      [newBlocks[index], newBlocks[index + 1]] = [
        newBlocks[index + 1],
        newBlocks[index],
      ];
    }

    setTemplate((prev) => ({
      ...prev,
      blocks: newBlocks,
    }));
  };

  const updateBlockContent = (id: string, content: Partial<BlockContent>) => {
    const updatedBlocks = template.blocks.map((block) =>
      block.id === id
        ? { ...block, content: { ...block.content, ...content } }
        : block,
    );

    setTemplate((prev) => ({
      ...prev,
      blocks: updatedBlocks,
      variables: extractVariables(updatedBlocks),
    }));
  };

  const updateBlockStyle = (id: string, styles: Record<string, string>) => {
    setTemplate((prev) => ({
      ...prev,
      blocks: prev.blocks.map((block) =>
        block.id === id
          ? { ...block, styles: { ...block.styles, ...styles } }
          : block,
      ),
    }));
  };

  const getActiveBlock = () => {
    if (!activeBlock) return null;
    return template.blocks.find((block) => block.id === activeBlock) || null;
  };

  const handleSave = async () => {
    const errors: string[] = [];

    if (!template.name.trim()) {
      errors.push("Template Name is required");
    }

    if (!template.subject.trim()) {
      errors.push("Email Subject is required");
    }

    if (template.blocks.length === 0) {
      errors.push("At least one content block is required");
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    try {
      setIsSaving(true);

      const html = generateHtml(template.blocks);

      const templateData = {
        ...template,
        html,
        blocks: template.blocks,
      };

      if (!templateData.variables.includes("senderName")) {
        templateData.variables.push("senderName");
      }

      const url = templateId
        ? `/api/templates/${templateId}`
        : "/api/templates";

      const method = templateId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateData),
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

  const isFormValid = () => {
    return (
      template.name.trim() !== "" &&
      template.subject.trim() !== "" &&
      template.blocks.length > 0
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading template...</p>
        </div>
      </div>
    );
  }

  const validationErrors = [
    template.name.trim() === "" && "Template name is required",
    template.subject.trim() === "" && "Email subject is required",
    template.blocks.length === 0 && "Add at least one content block",
  ].filter(Boolean);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Layers className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {templateId ? "Edit Visual Template" : "Create Visual Template"}
            </h2>
            <p className="text-gray-600">
              Build your email template with real-time preview
            </p>
          </div>
        </div>
      </div>

      {/* Template Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">
              Template Settings
            </h3>
          </div>
        </div>
        <div className="p-6">
          <TemplateSettings
            template={template}
            onChange={handleTemplateChange}
          />
        </div>
      </div>

      {/* Template Builder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-gray-900">
              Design Your Email
            </h3>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Block Toolbar */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <BlockToolbar onAddBlock={addBlock} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Email preview */}
            <div className="col-span-3 space-y-4">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-1 border-2 border-gray-200">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <EmailPreview
                    blocks={template.blocks}
                    activeBlock={activeBlock}
                    onSelectBlock={setActiveBlock}
                    onMoveBlock={moveBlock}
                    onRemoveBlock={removeBlock}
                  />
                </div>
              </div>

              {template.blocks.length === 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border-2 border-amber-200 shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-amber-900">
                        No content blocks added
                      </p>
                      <p className="mt-1 text-sm text-amber-800">
                        Use the content block options above to add elements to
                        your template.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Block editor panel */}
            <div className="col-span-2">
              <div className="sticky top-6 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-1 border-2 border-gray-200 shadow-sm">
                <div className="bg-white rounded-lg overflow-hidden">
                  <BlockEditor
                    block={getActiveBlock()}
                    onUpdateContent={updateBlockContent}
                    onUpdateStyle={updateBlockStyle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Validation Messages */}
          <div className="flex-1">
            {!isFormValid() && validationErrors.length > 0 && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900 text-sm">
                      Please fix the following issues:
                    </p>
                    <ul className="mt-2 space-y-1">
                      {validationErrors.map((error, index) => (
                        <li
                          key={index}
                          className="text-sm text-red-800 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            {isFormValid() && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="font-semibold text-green-900 text-sm">
                    Template is ready to save!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !isFormValid()}
              className={`px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-4 transition-all shadow-sm hover:shadow-md flex items-center gap-2 ${
                isFormValid()
                  ? "bg-primary text-white hover:bg-primary-dark focus:ring-primary/20"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {templateId ? "Update Template" : "Create Template"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisualTemplateBuilder;
