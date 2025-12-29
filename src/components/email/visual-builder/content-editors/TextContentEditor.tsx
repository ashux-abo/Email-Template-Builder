"use client";

import React from 'react';
import { BlockContent, TemplateBlock } from '../types';

interface TextContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
}

export function TextContentEditor({ block, onUpdateContent }: TextContentEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Text Content
        </label>
        <textarea
          value={block.content.text || ''}
          onChange={(e) => onUpdateContent(block.id, { text: e.target.value })}
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
        <p className="mt-1 text-xs text-gray-500">
          Use {'{{'}<span>variableName</span>{'}}'} to insert dynamic content
        </p>
      </div>
    </div>
  );
} 