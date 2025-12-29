"use client";

import React from "react";
import { BlockContent, TemplateBlock } from "../types";

interface QuoteContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
}

export function QuoteContentEditor({
  block,
  onUpdateContent,
}: QuoteContentEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quote Text
        </label>
        <textarea
          value={block.content.text || ""}
          onChange={(e) => onUpdateContent(block.id, { text: e.target.value })}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="Enter quote text here..."
        />
        <p className="mt-1 text-xs text-gray-500">
          You can use variables like {"{recipient_name}"} for dynamic content.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Citation
        </label>
        <input
          type="text"
          value={block.content.citation || ""}
          onChange={(e) =>
            onUpdateContent(block.id, { citation: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="- Author Name"
        />
      </div>
    </div>
  );
}
