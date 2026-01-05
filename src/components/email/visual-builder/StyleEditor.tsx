"use client";

import React from "react";
import { TemplateBlock } from "./types";
import { Palette, Type, AlignLeft, Layers } from "lucide-react";

interface StyleEditorProps {
  block: TemplateBlock;
  onUpdateStyle: (id: string, styles: Record<string, string>) => void;
}

export function StyleEditor({ block, onUpdateStyle }: StyleEditorProps) {
  return (
    <div className="space-y-5">
      {(block.type === "header" ||
        block.type === "text" ||
        block.type === "button") && (
        <>
          {/* Typography Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <Type className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Typography</h4>
            </div>

            <div className="space-y-4">
              {/* Text Color */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <div className="relative">
                    <input
                      type="color"
                      value={block.styles.color || "#000000"}
                      onChange={(e) =>
                        onUpdateStyle(block.id, { color: e.target.value })
                      }
                      className="h-10 w-10 cursor-pointer rounded-lg border-2 border-gray-200 shadow-sm"
                      title="Pick a color"
                    />
                  </div>
                  <input
                    type="text"
                    value={block.styles.color || ""}
                    onChange={(e) =>
                      onUpdateStyle(block.id, { color: e.target.value })
                    }
                    className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Font Size
                </label>
                <input
                  type="text"
                  value={block.styles.fontSize || ""}
                  onChange={(e) =>
                    onUpdateStyle(block.id, { fontSize: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                  placeholder="e.g., 16px"
                />
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={block.styles.fontFamily || "Arial, sans-serif"}
                  onChange={(e) =>
                    onUpdateStyle(block.id, { fontFamily: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm bg-white"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Helvetica Neue', Helvetica, Arial, sans-serif">
                    Helvetica
                  </option>
                  <option value="'Times New Roman', Times, serif">
                    Times New Roman
                  </option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Courier New', Courier, monospace">
                    Courier New
                  </option>
                  <option value="Verdana, Geneva, sans-serif">Verdana</option>
                  <option value="Tahoma, Geneva, sans-serif">Tahoma</option>
                  <option value="'Trebuchet MS', Helvetica, sans-serif">
                    Trebuchet MS
                  </option>
                  <option value="Impact, Charcoal, sans-serif">Impact</option>
                  <option value="'Open Sans', sans-serif">Open Sans</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                </select>
              </div>

              {/* Font Weight */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Font Weight
                </label>
                <select
                  value={block.styles.fontWeight || "normal"}
                  onChange={(e) =>
                    onUpdateStyle(block.id, { fontWeight: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm bg-white"
                >
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                  <option value="lighter">Lighter</option>
                  <option value="bolder">Bolder</option>
                  <option value="100">100 - Thin</option>
                  <option value="200">200 - Extra Light</option>
                  <option value="300">300 - Light</option>
                  <option value="400">400 - Normal</option>
                  <option value="500">500 - Medium</option>
                  <option value="600">600 - Semi Bold</option>
                  <option value="700">700 - Bold</option>
                  <option value="800">800 - Extra Bold</option>
                  <option value="900">900 - Black</option>
                </select>
              </div>

              {/* Text Decoration */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Text Decoration
                </label>
                <select
                  value={block.styles.textDecoration || "none"}
                  onChange={(e) =>
                    onUpdateStyle(block.id, { textDecoration: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm bg-white"
                >
                  <option value="none">None</option>
                  <option value="underline">Underline</option>
                  <option value="overline">Overline</option>
                  <option value="line-through">Line Through</option>
                </select>
              </div>
            </div>
          </div>

          {/* Alignment Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-white rounded-lg shadow-sm">
                <AlignLeft className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">Alignment</h4>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Text Align
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["left", "center", "right"].map((align) => (
                  <button
                    key={align}
                    type="button"
                    onClick={() =>
                      onUpdateStyle(block.id, { textAlign: align })
                    }
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border-2 ${
                      block.styles.textAlign === align ||
                      (!block.styles.textAlign && align === "left")
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-primary/30"
                    }`}
                  >
                    {align.charAt(0).toUpperCase() + align.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Background & Colors Section */}
      {(block.type === "header" || block.type === "button") && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-white rounded-lg shadow-sm">
              <Palette className="w-4 h-4 text-green-600" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Background</h4>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="color"
                  value={block.styles.backgroundColor || "#ffffff"}
                  onChange={(e) =>
                    onUpdateStyle(block.id, { backgroundColor: e.target.value })
                  }
                  className="h-10 w-10 cursor-pointer rounded-lg border-2 border-gray-200 shadow-sm"
                  title="Pick a color"
                />
              </div>
              <input
                type="text"
                value={block.styles.backgroundColor || ""}
                onChange={(e) =>
                  onUpdateStyle(block.id, { backgroundColor: e.target.value })
                }
                className="flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                placeholder="#ffffff"
              />
            </div>
          </div>
        </div>
      )}

      {/* Spacing Section */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-white rounded-lg shadow-sm">
            <Layers className="w-4 h-4 text-orange-600" />
          </div>
          <h4 className="text-sm font-bold text-gray-900">Spacing</h4>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Padding
            </label>
            <input
              type="text"
              value={block.styles.padding || ""}
              onChange={(e) =>
                onUpdateStyle(block.id, { padding: e.target.value })
              }
              className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
              placeholder="e.g., 10px or 10px 20px"
            />
            <p className="text-xs text-gray-600 mt-1">
              Use format: top right bottom left
            </p>
          </div>

          {block.type === "button" && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Border Radius
              </label>
              <input
                type="text"
                value={block.styles.borderRadius || ""}
                onChange={(e) =>
                  onUpdateStyle(block.id, { borderRadius: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm"
                placeholder="e.g., 4px or 8px"
              />
              <p className="text-xs text-gray-600 mt-1">
                Controls button roundness
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
