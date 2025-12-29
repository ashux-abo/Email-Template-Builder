"use client";

import React from "react";
import { BlockContent, TemplateBlock } from "../types";
import EmailImageUploader from "../../../../components/ui/EmailImageUploader";
import { Label } from "../../../../components/ui/label";
import { Input } from "../../../../components/ui/input";

interface ImageContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
}

export function ImageContentEditor({
  block,
  onUpdateContent,
}: ImageContentEditorProps) {
  // Filter out placeholder URLs
  const imageUrl =
    block.content.src && block.content.src.includes("placeholder.com")
      ? ""
      : block.content.src || "";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="block text-sm font-medium">Image</Label>
        <EmailImageUploader
          initialImage={imageUrl}
          folder="email-images"
          onImageSelected={(imageUrl) =>
            onUpdateContent(block.id, { src: imageUrl })
          }
          className="mt-1"
        />
      </div>

      <div className="space-y-2">
        <Label className="block text-sm font-medium">Alt Text</Label>
        <Input
          type="text"
          value={block.content.alt || ""}
          onChange={(e) => onUpdateContent(block.id, { alt: e.target.value })}
          className="mt-1 block w-full"
          placeholder="Describe the image for accessibility"
        />
        <p className="text-xs text-gray-500">
          Describe the image to improve accessibility and SEO
        </p>
      </div>
    </div>
  );
}
