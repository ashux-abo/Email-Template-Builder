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

  // Fetch existing template if editing
  const fetchTemplate = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/templates/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }

      const data = await response.json();

      // If template already has blocks data, use it directly
      if (
        data.template.blocks &&
        Array.isArray(data.template.blocks) &&
        data.template.blocks.length > 0
      ) {
        setTemplate(data.template);
      }
      // If template has HTML but no blocks (likely edited in code editor)
      else if (data.template.html) {
        // Basic conversion of HTML to blocks
        // Start with default blocks structure
        const convertedTemplate = {
          ...data.template,
          // We keep default blocks but with the template HTML in the first text block
          blocks: [
            // Header block
            {
              id: `header-${Date.now()}`,
              type: "header",
              content: {
                text: "Template Header",
              },
              styles: getDefaultStylesForType("header"),
            },
            // Text block with HTML content
            {
              id: `text-${Date.now()}`,
              type: "text",
              content: {
                text: "This template was imported from HTML code. You can now edit it using the visual editor.",
              },
              styles: getDefaultStylesForType("text"),
            },
            // Add a note that this is converted from HTML editor
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

        // Notify user about the conversion
        toast.info(
          "Template was originally created in HTML editor. Basic conversion applied.",
          {
            autoClose: 5000,
          },
        );
      } else {
        // Fallback to empty template
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

  // Handler for template settings changes
  const handleTemplateChange = (changes: Partial<VisualTemplate>) => {
    setTemplate((prev) => ({ ...prev, ...changes }));
  };

  // Add a new block
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

  // Remove a block
  const removeBlock = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((block) => block.id !== id),
    }));

    if (activeBlock === id) {
      setActiveBlock(null);
    }
  };

  // Move a block up or down
  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = template.blocks.findIndex((block) => block.id === id);
    if (index === -1) return;

    const newBlocks = [...template.blocks];

    if (direction === "up" && index > 0) {
      // Swap with previous block
      [newBlocks[index - 1], newBlocks[index]] = [
        newBlocks[index],
        newBlocks[index - 1],
      ];
    } else if (direction === "down" && index < newBlocks.length - 1) {
      // Swap with next block
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

  // Update block content
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

  // Update block style
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

  // Get the active block
  const getActiveBlock = () => {
    if (!activeBlock) return null;
    return template.blocks.find((block) => block.id === activeBlock) || null;
  };

  // Save the template
  const handleSave = async () => {
    // Validate required fields
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

      // Generate HTML from blocks
      const html = generateHtml(template.blocks);

      // Create the template data with HTML
      const templateData = {
        ...template,
        html,
        blocks: template.blocks,
      };

      // Ensure senderName is always included
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

  // Check if form is valid
  const isFormValid = () => {
    return (
      template.name.trim() !== "" &&
      template.subject.trim() !== "" &&
      template.blocks.length > 0
    );
  };

  // Return loading UI
  if (isLoading) {
    return <div className="flex justify-center p-6">Loading template...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Template Settings */}
      <TemplateSettings template={template} onChange={handleTemplateChange} />

      {/* Template Builder */}
      <div className="rounded-lg border border-gray-200 p-4">
        {/* Block Toolbar */}
        <BlockToolbar onAddBlock={addBlock} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Email preview */}
          <div className="col-span-3">
            <EmailPreview
              blocks={template.blocks}
              activeBlock={activeBlock}
              onSelectBlock={setActiveBlock}
              onMoveBlock={moveBlock}
              onRemoveBlock={removeBlock}
            />

            {template.blocks.length === 0 && (
              <div className="mt-4 rounded-md bg-yellow-50 p-3 border border-yellow-200 text-sm text-yellow-800">
                <p className="font-medium">No content blocks added</p>
                <p className="mt-1 text-xs">
                  Use the content block options above to add elements to your
                  template.
                </p>
              </div>
            )}
          </div>

          {/* Block editor panel */}
          <div className="col-span-2">
            <BlockEditor
              block={getActiveBlock()}
              onUpdateContent={updateBlockContent}
              onUpdateStyle={updateBlockStyle}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="flex items-center">
          {!isFormValid() && (
            <div className="text-sm text-red-500 mr-3">
              <span className="font-medium">Please fix the following:</span>
              <ul className="list-disc list-inside text-xs mt-1">
                {template.name.trim() === "" && (
                  <li>Template name is required</li>
                )}
                {template.subject.trim() === "" && (
                  <li>Email subject is required</li>
                )}
                {template.blocks.length === 0 && (
                  <li>Add at least one content block</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
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
            disabled={isSaving || !isFormValid()}
            className={`inline-flex justify-center rounded-md border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isFormValid()
                ? "border-transparent bg-primary text-white hover:bg-primary-dark focus:ring-primary"
                : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isSaving
              ? "Saving..."
              : templateId
                ? "Update Template"
                : "Create Template"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VisualTemplateBuilder;
