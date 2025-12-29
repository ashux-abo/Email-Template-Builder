"use client";

import React from "react";
import { BlockContent, TemplateBlock } from "../types";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { Button } from "../../../../components/ui/button";
import { Plus, Trash } from "lucide-react";

interface ListContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
}

export function ListContentEditor({
  block,
  onUpdateContent,
}: ListContentEditorProps) {
  const listItems = block.content.items || [];

  const handleAddItem = () => {
    const newItems = [...listItems, ""];
    onUpdateContent(block.id, { items: newItems });
  };

  const handleUpdateItem = (index: number, value: string) => {
    const newItems = [...listItems];
    newItems[index] = value;
    onUpdateContent(block.id, { items: newItems });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = listItems.filter((_, i) => i !== index);
    onUpdateContent(block.id, { items: newItems });
  };

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue={block.content.listType || "unordered"}
        onValueChange={(value) =>
          onUpdateContent(block.id, { listType: value })
        }
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unordered">Bullet List</TabsTrigger>
          <TabsTrigger value="ordered">Numbered List</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          List Items
        </label>

        {listItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleUpdateItem(index, e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder={`Item ${index + 1}`}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveItem(index)}
              className="h-8 w-8 p-0"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={handleAddItem}
          className="mt-2 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>
    </div>
  );
}
