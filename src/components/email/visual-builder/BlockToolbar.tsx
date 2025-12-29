"use client";

import React from "react";
import { Button } from "../../../components/ui/button";
import {
  PlusIcon,
  Type,
  AlignLeft,
  Link,
  Image,
  MinusIcon,
  Grid,
  Quote,
  List,
  Share,
  Video,
  Square,
  LayoutGrid,
} from "lucide-react";
import { BlockType } from "./types";

interface BlockToolbarProps {
  onAddBlock: (type: BlockType) => void;
}

export function BlockToolbar({ onAddBlock }: BlockToolbarProps) {
  console.log("BlockToolbar rendered");

  return (
    <div className="mb-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Content Blocks</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Header button clicked");
              onAddBlock("header");
            }}
          >
            <Type className="mr-1 h-4 w-4" />
            Header
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlock("text")}
          >
            <AlignLeft className="mr-1 h-4 w-4" />
            Text
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlock("button")}
          >
            <Link className="mr-1 h-4 w-4" />
            Button
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlock("image")}
          >
            <Image className="mr-1 h-4 w-4" />
            Image
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlock("spacer")}
          >
            <MinusIcon className="mr-1 h-4 w-4" />
            Spacer
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlock("divider")}
          >
            <MinusIcon className="mr-1 h-4 w-4 transform rotate-90" />
            Divider
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlock("quote")}
          >
            <Quote className="mr-1 h-4 w-4" />
            Quote
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlock("list")}
          >
            <List className="mr-1 h-4 w-4" />
            List
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlock("social")}
          >
            <Share className="mr-1 h-4 w-4" />
            Social
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlock("video")}
          >
            <Video className="mr-1 h-4 w-4" />
            Video
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlock("card")}
          >
            <Square className="mr-1 h-4 w-4" />
            Card
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddBlock("section")}
          >
            <LayoutGrid className="mr-1 h-4 w-4" />
            Section
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-700">Grid Layouts</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Adding 1-column grid");
              onAddBlock("grid-1-column");
            }}
          >
            <Grid className="mr-1 h-4 w-4" />1 Column
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Adding 2-column grid");
              onAddBlock("grid-2-column");
            }}
          >
            <Grid className="mr-1 h-4 w-4" />2 Columns
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log("Adding 3-column grid");
              onAddBlock("grid-3-column");
            }}
          >
            <Grid className="mr-1 h-4 w-4" />3 Columns
          </Button>
        </div>
      </div>
    </div>
  );
}
