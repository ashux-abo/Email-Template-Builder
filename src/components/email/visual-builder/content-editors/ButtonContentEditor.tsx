"use client";

import React from "react";
import { BlockContent, TemplateBlock } from "../types";

interface ButtonContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
}

export function ButtonContentEditor({
  block,
  onUpdateContent,
}: ButtonContentEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Button Text
        </label>
        <input
          type="text"
          value={block.content.text || ""}
          onChange={(e) => onUpdateContent(block.id, { text: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Button URL
        </label>
        <input
          type="text"
          value={block.content.url || ""}
          onChange={(e) => onUpdateContent(block.id, { url: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
        <p className="mt-1 text-xs text-gray-500">
          You can use variables like {"{{"}
          <span>variableName</span>
          {"}}"} in the URL
        </p>
      </div>
    </div>
  );
}
