"use client";

import React, { useState, useEffect } from "react";
import { BlockContent, BlockType, TemplateBlock } from "../types";
import { Label } from "../../../../components/ui/label";
import {
  PlusIcon,
  Type,
  AlignLeft,
  Link,
  Image,
  Layout,
  Square,
  MinusIcon,
  Pencil,
  Palette,
} from "lucide-react";
import { nanoid } from "nanoid";
import { getDefaultContentForType, getDefaultStylesForType } from "../utils";
import { ContentEditor } from "./ContentEditor";
import { StyleEditor } from "../StyleEditor";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

interface GridContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
  onUpdateStyle?: (id: string, styles: Record<string, string>) => void;
}

export function GridContentEditor({
  block,
  onUpdateContent,
  onUpdateStyle,
}: GridContentEditorProps) {
  const [activeColumn, setActiveColumn] = useState<number | null>(0);
  const [selectedColumnBlock, setSelectedColumnBlock] =
    useState<TemplateBlock | null>(null);
  const [activeTab, setActiveTab] = useState<"content" | "style">("content");

  // Extract the column count from the block type
  const getColumnCount = (): number => {
    switch (block.type) {
      case "grid-1-column":
        return 1;
      case "grid-2-column":
        return 2;
      case "grid-3-column":
        return 3;
      default:
        return 2;
    }
  };

  const columnCount = getColumnCount();

  // Initialize columns if they don't exist
  useEffect(() => {
    if (
      !block.content.columns ||
      block.content.columns.length !== columnCount
    ) {
      console.log("Initializing columns", columnCount);
      const initialColumns: TemplateBlock[][] = Array(columnCount)
        .fill(0)
        .map(() => []);
      onUpdateContent(block.id, { columns: initialColumns });
    }
  }, [block.id, columnCount, block.content.columns, onUpdateContent]);

  // Ensure we have columns data to work with - use a defensive approach
  const columns =
    Array.isArray(block.content.columns) && block.content.columns.length > 0
      ? block.content.columns
      : Array(columnCount)
          .fill(0)
          .map(() => []);

  // Add a new block to a column
  const addBlockToColumn = (columnIndex: number, blockType: BlockType) => {
    console.log("Adding block to column", columnIndex, blockType);
    if (columnIndex < 0 || columnIndex >= columns.length) return;

    const newBlock: TemplateBlock = {
      id: nanoid(),
      type: blockType,
      content: getDefaultContentForType(blockType),
      styles: getDefaultStylesForType(blockType),
    };

    const newColumns = [...columns];
    newColumns[columnIndex] = [...(newColumns[columnIndex] || []), newBlock];

    onUpdateContent(block.id, { columns: newColumns });
    setSelectedColumnBlock(newBlock);
    setActiveTab("content");
  };

  // Remove a block from a column
  const removeBlockFromColumn = (columnIndex: number, blockIndex: number) => {
    if (columnIndex < 0 || columnIndex >= columns.length) return;
    if (blockIndex < 0 || blockIndex >= columns[columnIndex].length) return;

    const newColumns = [...columns];
    newColumns[columnIndex] = newColumns[columnIndex].filter(
      (_, i) => i !== blockIndex,
    );

    onUpdateContent(block.id, { columns: newColumns });

    if (
      selectedColumnBlock &&
      columns[columnIndex][blockIndex] &&
      columns[columnIndex][blockIndex].id === selectedColumnBlock.id
    ) {
      setSelectedColumnBlock(null);
    }
  };

  // Update content of a column block
  const updateColumnBlockContent = (
    columnBlock: TemplateBlock,
    content: Partial<BlockContent>,
  ) => {
    if (!selectedColumnBlock) return;

    const newColumns = columns.map((column) => {
      return column.map((block) => {
        if (block.id === selectedColumnBlock.id) {
          return {
            ...block,
            content: {
              ...block.content,
              ...content,
            },
          };
        }
        return block;
      });
    });

    onUpdateContent(block.id, { columns: newColumns });
  };

  // Update style of a column block
  const updateColumnBlockStyle = (
    columnBlock: TemplateBlock,
    styles: Record<string, string>,
  ) => {
    if (!selectedColumnBlock) return;

    const newColumns = columns.map((column) => {
      return column.map((block) => {
        if (block.id === selectedColumnBlock.id) {
          return {
            ...block,
            styles: {
              ...block.styles,
              ...styles,
            },
          };
        }
        return block;
      });
    });

    onUpdateContent(block.id, { columns: newColumns });
  };

  // Component types that can be added to a column
  const componentTypes: {
    type: BlockType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { type: "text", label: "Text", icon: <AlignLeft className="h-4 w-4" /> },
    { type: "button", label: "Button", icon: <Link className="h-4 w-4" /> },
    { type: "image", label: "Image", icon: <Image className="h-4 w-4" /> },
    {
      type: "spacer",
      label: "Spacer",
      icon: <MinusIcon className="h-4 w-4" />,
    },
    { type: "card", label: "Card", icon: <Square className="h-4 w-4" /> },
    { type: "header", label: "Header", icon: <Type className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Grid Settings</Label>
        <p className="text-sm text-gray-500">
          This is a {columnCount}-column grid block. Click on a column to add
          content.
        </p>
        {activeColumn !== null && (
          <p className="text-sm font-medium text-blue-600">
            Column {activeColumn + 1} selected. Use the tabs below to add or
            edit components.
          </p>
        )}
      </div>

      {/* Grid Column Preview */}
      <div className="border rounded-md overflow-hidden">
        <div
          className="grid"
          style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
        >
          {Array(columnCount)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className={`p-3 min-h-[100px] border cursor-pointer transition-colors ${
                  activeColumn === i
                    ? "bg-blue-50 border-blue-300"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  console.log("Column clicked", i);
                  setActiveColumn(i);
                  setSelectedColumnBlock(null); // Clear component selection
                }}
              >
                <div className="text-center mb-2 text-sm font-medium">
                  Column {i + 1}{" "}
                  {columns[i]?.length > 0
                    ? `(${columns[i].length} items)`
                    : "(Empty)"}
                </div>

                {/* Show blocks in column */}
                <div className="space-y-2">
                  {columns[i]?.map((columnBlock, blockIndex) => (
                    <div
                      key={columnBlock.id}
                      className={`bg-white border rounded-md p-2 flex justify-between items-center ${
                        selectedColumnBlock?.id === columnBlock.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColumnBlock(columnBlock);
                        setActiveTab("content"); // Reset to content tab when selecting
                      }}
                    >
                      <span className="text-sm truncate flex items-center">
                        <span className="mr-1 text-blue-500">
                          {columnBlock.type === "text" && (
                            <AlignLeft className="h-3 w-3" />
                          )}
                          {columnBlock.type === "button" && (
                            <Link className="h-3 w-3" />
                          )}
                          {columnBlock.type === "image" && (
                            <Image className="h-3 w-3" />
                          )}
                          {columnBlock.type === "header" && (
                            <Type className="h-3 w-3" />
                          )}
                          {columnBlock.type === "spacer" && (
                            <MinusIcon className="h-3 w-3" />
                          )}
                          {columnBlock.type === "card" && (
                            <Square className="h-3 w-3" />
                          )}
                        </span>
                        {columnBlock.type}
                      </span>
                      <div className="flex items-center">
                        <button
                          className="mr-1 text-blue-500 hover:text-blue-700 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColumnBlock(columnBlock);
                            setActiveTab("content");
                          }}
                          title="Edit Content"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          className="mr-1 text-purple-500 hover:text-purple-700 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedColumnBlock(columnBlock);
                            setActiveTab("style");
                          }}
                          title="Edit Style"
                        >
                          <Palette className="h-3 w-3" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 p-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBlockFromColumn(i, blockIndex);
                          }}
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Block adder or editor */}
      <div className="w-full border rounded-md">
        <div className="flex border-b">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              !selectedColumnBlock
                ? "bg-blue-50 text-blue-700"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setSelectedColumnBlock(null)}
          >
            Add Components
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium ${
              selectedColumnBlock
                ? "bg-blue-50 text-blue-700"
                : "bg-white text-gray-700"
            }`}
            disabled={!selectedColumnBlock}
            onClick={() => {}}
          >
            Edit Component
          </button>
        </div>

        {/* Add Components Panel */}
        {!selectedColumnBlock && (
          <div className="p-4 bg-gray-50">
            <Label>
              Add to Column {activeColumn !== null ? activeColumn + 1 : 1}
            </Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {componentTypes.map((componentType) => (
                <button
                  key={componentType.type}
                  type="button"
                  onClick={() => {
                    console.log("Button clicked for", componentType.type);
                    if (activeColumn !== null) {
                      addBlockToColumn(activeColumn, componentType.type);
                    } else {
                      // Default to first column if none selected
                      addBlockToColumn(0, componentType.type);
                    }
                  }}
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                >
                  {componentType.icon}
                  <span className="ml-1">{componentType.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Edit Component Panel */}
        {selectedColumnBlock && (
          <div className="p-4">
            <div className="mb-4 border-b border-gray-200">
              <div className="flex space-x-2">
                <button
                  type="button"
                  className={`border-b-2 px-4 py-2 text-sm font-medium ${
                    activeTab === "content"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("content")}
                >
                  Content
                </button>
                <button
                  type="button"
                  className={`border-b-2 px-4 py-2 text-sm font-medium ${
                    activeTab === "style"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                  onClick={() => setActiveTab("style")}
                >
                  Style
                </button>
              </div>
            </div>

            <div className="mt-2">
              {activeTab === "content" ? (
                <ContentEditor
                  block={selectedColumnBlock}
                  onUpdateContent={(id, content) =>
                    updateColumnBlockContent(selectedColumnBlock, content)
                  }
                />
              ) : (
                <StyleEditor
                  block={selectedColumnBlock}
                  onUpdateStyle={(id, styles) =>
                    updateColumnBlockStyle(selectedColumnBlock, styles)
                  }
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
