"use client";

import React from 'react';
import { BlockContent, TemplateBlock } from '../types';

interface VideoContentEditorProps {
  block: TemplateBlock;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
}

export function VideoContentEditor({ block, onUpdateContent }: VideoContentEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Video URL
        </label>
        <input
          type="text"
          value={block.content.videoUrl || ''}
          onChange={(e) => onUpdateContent(block.id, { videoUrl: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="https://www.youtube.com/embed/videoId"
        />
        <p className="mt-1 text-xs text-gray-500">
          Use YouTube embed URL (https://www.youtube.com/embed/videoId)
        </p>
      </div>
    </div>
  );
} 