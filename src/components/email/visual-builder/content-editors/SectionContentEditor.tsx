"use client";

import React from "react";
import { BlockContent, TemplateBlock } from "../types";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";

interface SectionContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
}

export function SectionContentEditor({
  block,
  onUpdateContent,
}: SectionContentEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="section-title">Section Title</Label>
        <Input
          id="section-title"
          value={block.content.title || ""}
          onChange={(e) => onUpdateContent(block.id, { title: e.target.value })}
          placeholder="Section Title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="section-bg-color">Background Color</Label>
        <div className="flex gap-2">
          <Input
            id="section-bg-color"
            type="color"
            value={block.content.backgroundColor || "#f9fafb"}
            onChange={(e) =>
              onUpdateContent(block.id, { backgroundColor: e.target.value })
            }
            className="w-12"
          />
          <Input
            value={block.content.backgroundColor || "#f9fafb"}
            onChange={(e) =>
              onUpdateContent(block.id, { backgroundColor: e.target.value })
            }
            placeholder="#f9fafb"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="section-padding">Padding</Label>
        <Input
          id="section-padding"
          value={block.content.padding || "24px"}
          onChange={(e) =>
            onUpdateContent(block.id, { padding: e.target.value })
          }
          placeholder="24px"
        />
      </div>
    </div>
  );
}
