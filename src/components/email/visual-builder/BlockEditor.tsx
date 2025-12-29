"use client";

import React, { useState } from 'react';
import { BlockContent, TemplateBlock } from './types';
import { ContentEditor } from './content-editors/ContentEditor';
import { StyleEditor } from './StyleEditor';

interface BlockEditorProps {
  block: TemplateBlock | null;
  onUpdateContent: (id: string, content: Partial<BlockContent>) => void;
  onUpdateStyle: (id: string, styles: Record<string, string>) => void;
}

export function BlockEditor({ block, onUpdateContent, onUpdateStyle }: BlockEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'style'>('content');

  if (!block) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
        <p>Select a block to edit its content and styling</p>
        <p className="mt-2 text-sm">Or add a new block using the buttons above</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-4 border-b border-gray-200">
        <div className="flex space-x-2">
          <button
            type="button"
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'content' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button
            type="button"
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === 'style' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('style')}
          >
            Style
          </button>
        </div>
      </div>
      
      <div>
        {activeTab === 'content' ? (
          <ContentEditor 
            block={block} 
            onUpdateContent={onUpdateContent} 
          />
        ) : (
          <StyleEditor 
            block={block} 
            onUpdateStyle={onUpdateStyle} 
          />
        )}
      </div>
    </div>
  );
} 