"use client";

import React, { useState } from "react";

interface TemplateEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

export default function TemplateEditor({
  initialContent,
  onChange,
}: TemplateEditorProps) {
  const [content, setContent] = useState(initialContent);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onChange(newContent);
  };

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="flex items-center border-b p-2 bg-gray-50">
        <span className="text-sm text-gray-700">HTML Editor</span>
      </div>
      <textarea
        className="w-full h-[400px] p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        value={content}
        onChange={handleChange}
      />
    </div>
  );
}
