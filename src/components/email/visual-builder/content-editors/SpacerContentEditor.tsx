"use client";

import React from 'react';
import { BlockContent, TemplateBlock } from '../types';

interface SpacerContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
}

export function SpacerContentEditor({ block, onUpdateContent }: SpacerContentEditorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Height
      </label>
      <input
        type="text"
        value={block.content.height || '20px'}
        onChange={(e) => onUpdateContent(block.id, { height: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        placeholder="e.g., 20px"
      />
    </div>
  );
} 