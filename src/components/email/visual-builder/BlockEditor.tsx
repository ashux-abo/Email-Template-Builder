"use client";

import React, { useState } from "react";
import { BlockContent, TemplateBlock } from "./types";
import { ContentEditor } from "./content-editors/ContentEditor";
import { StyleEditor } from "./StyleEditor";
import { Edit3, Palette, MousePointerClick } from "lucide-react";

interface BlockEditorProps {
  block: TemplateBlock | null;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
  onUpdateStyle: (id: string, styles: Record<string, string>) => void;
}

export function BlockEditor({
  block,
  onUpdateContent,
  onUpdateStyle,
}: BlockEditorProps) {
  const [activeTab, setActiveTab] = useState<"content" | "style">("content");

  if (!block) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-dashed border-gray-300 p-8">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
          <MousePointerClick className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-base font-semibold text-gray-700">
          No block selected
        </p>
        <p className="mt-2 text-sm text-gray-600 max-w-xs">
          Select a block from the preview to edit its content and styling
        </p>
        <div className="mt-4 px-4 py-2 bg-blue-100 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            💡 Or add a new block using the buttons above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border-2 border-gray-200 overflow-hidden shadow-sm">
      {/* Header with tabs */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 border-b-2 border-gray-200">
        <div className="flex">
          <button
            type="button"
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
              activeTab === "content"
                ? "text-primary bg-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
            onClick={() => setActiveTab("content")}
          >
            <div className="flex items-center justify-center gap-2">
              <Edit3 className="w-4 h-4" />
              <span>Content</span>
            </div>
            {activeTab === "content" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t"></div>
            )}
          </button>
          <button
            type="button"
            className={`flex-1 px-6 py-4 text-sm font-semibold transition-all relative ${
              activeTab === "style"
                ? "text-primary bg-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
            onClick={() => setActiveTab("style")}
          >
            <div className="flex items-center justify-center gap-2">
              <Palette className="w-4 h-4" />
              <span>Style</span>
            </div>
            {activeTab === "style" && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t"></div>
            )}
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="p-6 max-h-[600px] overflow-y-auto">
        {activeTab === "content" ? (
          <ContentEditor block={block} onUpdateContent={onUpdateContent} />
        ) : (
          <StyleEditor block={block} onUpdateStyle={onUpdateStyle} />
        )}
      </div>
    </div>
  );
}
