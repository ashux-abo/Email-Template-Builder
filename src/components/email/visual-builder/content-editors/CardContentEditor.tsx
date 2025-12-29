"use client";

import React from "react";
import { BlockContent, TemplateBlock } from "../types";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";

interface CardContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
}

export function CardContentEditor({
  block,
  onUpdateContent,
}: CardContentEditorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="card-title">Card Title</Label>
        <Input
          id="card-title"
          value={block.content.title || ""}
          onChange={(e) => onUpdateContent(block.id, { title: e.target.value })}
          placeholder="Card Title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-description">Card Description</Label>
        <Textarea
          id="card-description"
          value={block.content.description || ""}
          onChange={(e) =>
            onUpdateContent(block.id, { description: e.target.value })
          }
          placeholder="Card Description"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-bg-color">Background Color</Label>
        <div className="flex gap-2">
          <Input
            id="card-bg-color"
            type="color"
            value={block.content.backgroundColor || "#ffffff"}
            onChange={(e) =>
              onUpdateContent(block.id, { backgroundColor: e.target.value })
            }
            className="w-12"
          />
          <Input
            value={block.content.backgroundColor || "#ffffff"}
            onChange={(e) =>
              onUpdateContent(block.id, { backgroundColor: e.target.value })
            }
            placeholder="#ffffff"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-border-color">Border Color</Label>
        <div className="flex gap-2">
          <Input
            id="card-border-color"
            type="color"
            value={block.content.borderColor || "#e5e7eb"}
            onChange={(e) =>
              onUpdateContent(block.id, { borderColor: e.target.value })
            }
            className="w-12"
          />
          <Input
            value={block.content.borderColor || "#e5e7eb"}
            onChange={(e) =>
              onUpdateContent(block.id, { borderColor: e.target.value })
            }
            placeholder="#e5e7eb"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-padding">Padding</Label>
        <Input
          id="card-padding"
          value={block.content.padding || "16px"}
          onChange={(e) =>
            onUpdateContent(block.id, { padding: e.target.value })
          }
          placeholder="16px"
        />
      </div>
    </div>
  );
}
