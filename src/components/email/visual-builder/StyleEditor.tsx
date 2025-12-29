"use client";

import React from 'react';
import { TemplateBlock } from './types';

interface StyleEditorProps {
  block: TemplateBlock;
  onUpdateStyle: (id: string, styles: Record<string, string>) => void;
}

export function StyleEditor({ block, onUpdateStyle }: StyleEditorProps) {
  return (
    <div className="space-y-4">
      {(block.type === 'header' || block.type === 'text' || block.type === 'button') && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Text Color
            </label>
            <div className="mt-1 flex">
              <input
                type="color"
                value={block.styles.color || '#000000'}
                onChange={(e) => onUpdateStyle(block.id, { color: e.target.value })}
                className="h-8 w-8 cursor-pointer rounded border"
              />
              <input
                type="text"
                value={block.styles.color || ''}
                onChange={(e) => onUpdateStyle(block.id, { color: e.target.value })}
                className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                placeholder="#000000 or rgb value"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Font Size
            </label>
            <input
              type="text"
              value={block.styles.fontSize || ''}
              onChange={(e) => onUpdateStyle(block.id, { fontSize: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="e.g., 16px"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Font Family
            </label>
            <select
              value={block.styles.fontFamily || 'Arial, sans-serif'}
              onChange={(e) => onUpdateStyle(block.id, { fontFamily: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica</option>
              <option value="'Times New Roman', Times, serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', Courier, monospace">Courier New</option>
              <option value="Verdana, Geneva, sans-serif">Verdana</option>
              <option value="Tahoma, Geneva, sans-serif">Tahoma</option>
              <option value="'Trebuchet MS', Helvetica, sans-serif">Trebuchet MS</option>
              <option value="Impact, Charcoal, sans-serif">Impact</option>
              <option value="'Open Sans', sans-serif">Open Sans</option>
              <option value="'Roboto', sans-serif">Roboto</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Font Weight
            </label>
            <select
              value={block.styles.fontWeight || 'normal'}
              onChange={(e) => onUpdateStyle(block.id, { fontWeight: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
              <option value="lighter">Lighter</option>
              <option value="bolder">Bolder</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
              <option value="400">400</option>
              <option value="500">500</option>
              <option value="600">600</option>
              <option value="700">700</option>
              <option value="800">800</option>
              <option value="900">900</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Text Decoration
            </label>
            <select
              value={block.styles.textDecoration || 'none'}
              onChange={(e) => onUpdateStyle(block.id, { textDecoration: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="none">None</option>
              <option value="underline">Underline</option>
              <option value="overline">Overline</option>
              <option value="line-through">Line Through</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Text Align
            </label>
            <select
              value={block.styles.textAlign || 'left'}
              onChange={(e) => onUpdateStyle(block.id, { textAlign: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </>
      )}
      
      {(block.type === 'header' || block.type === 'button') && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Background Color
          </label>
          <div className="mt-1 flex">
            <input
              type="color"
              value={block.styles.backgroundColor || '#ffffff'}
              onChange={(e) => onUpdateStyle(block.id, { backgroundColor: e.target.value })}
              className="h-8 w-8 cursor-pointer rounded border"
            />
            <input
              type="text"
              value={block.styles.backgroundColor || ''}
              onChange={(e) => onUpdateStyle(block.id, { backgroundColor: e.target.value })}
              className="ml-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="#ffffff or rgb value"
            />
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Padding
        </label>
        <input
          type="text"
          value={block.styles.padding || ''}
          onChange={(e) => onUpdateStyle(block.id, { padding: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          placeholder="e.g., 10px or 10px 20px"
        />
      </div>
      
      {block.type === 'button' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Border Radius
          </label>
          <input
            type="text"
            value={block.styles.borderRadius || ''}
            onChange={(e) => onUpdateStyle(block.id, { borderRadius: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="e.g., 4px"
          />
        </div>
      )}
    </div>
  );
} 