"use client";

import React from "react";
import { BlockContent, TemplateBlock } from "../types";
import { TextContentEditor } from "./TextContentEditor";
import { ButtonContentEditor } from "./ButtonContentEditor";
import { ImageContentEditor } from "./ImageContentEditor";
import { SpacerContentEditor } from "./SpacerContentEditor";
import { QuoteContentEditor } from "./QuoteContentEditor";
import { ListContentEditor } from "./ListContentEditor";
import { SocialContentEditor } from "./SocialContentEditor";
import { VideoContentEditor } from "./VideoContentEditor";
import { GridContentEditor } from "./GridContentEditor";
import { CardContentEditor } from "./CardContentEditor";
import { SectionContentEditor } from "./SectionContentEditor";

interface ContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
  onUpdateStyle?: (id: string, styles: Record<string, string>) => void;
}

export function ContentEditor({
  block,
  onUpdateContent,
  onUpdateStyle,
}: ContentEditorProps) {
  console.log("ContentEditor rendering for block type:", block.type);

  // Delegate to the appropriate editor based on block type
  switch (block.type) {
    case "header":
    case "text":
      return (
        <TextContentEditor block={block} onUpdateContent={onUpdateContent} />
      );

    case "button":
      return (
        <ButtonContentEditor block={block} onUpdateContent={onUpdateContent} />
      );

    case "image":
      return (
        <ImageContentEditor block={block} onUpdateContent={onUpdateContent} />
      );

    case "spacer":
    case "divider":
      return (
        <SpacerContentEditor block={block} onUpdateContent={onUpdateContent} />
      );

    case "quote":
      return (
        <QuoteContentEditor block={block} onUpdateContent={onUpdateContent} />
      );

    case "list":
      return (
        <ListContentEditor block={block} onUpdateContent={onUpdateContent} />
      );

    case "social":
      return (
        <SocialContentEditor block={block} onUpdateContent={onUpdateContent} />
      );

    case "video":
      return (
        <VideoContentEditor block={block} onUpdateContent={onUpdateContent} />
      );

    case "grid-1-column":
    case "grid-2-column":
    case "grid-3-column":
      console.log("Rendering GridContentEditor");
      if (!onUpdateStyle) {
        console.warn(
          "Grid component requires onUpdateStyle prop for full functionality",
        );
      }
      return (
        <GridContentEditor
          block={block}
          onUpdateContent={onUpdateContent}
          onUpdateStyle={onUpdateStyle}
        />
      );

    case "card":
      return (
        <CardContentEditor block={block} onUpdateContent={onUpdateContent} />
      );

    case "section":
      return (
        <SectionContentEditor block={block} onUpdateContent={onUpdateContent} />
      );

    default:
      console.warn("Unknown block type:", block.type);
      return (
        <div className="p-4 border rounded-md bg-red-50 text-red-700">
          <p>Unknown block type: {block.type}</p>
        </div>
      );
  }
}
