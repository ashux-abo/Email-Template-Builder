"use client";

import React, { useState, useEffect } from "react";
import { VisualTemplate } from "./types";
import { Code, Info, CheckCircle2, AlertCircle } from "lucide-react";

interface TemplateSettingsProps {
  template: VisualTemplate;
  onChange: (template: Partial<VisualTemplate>) => void;
}

export function TemplateSettings({
  template,
  onChange,
}: TemplateSettingsProps) {
  const [errors, setErrors] = useState<Record<string, boolean>>({
    name: false,
    subject: false,
  });

  useEffect(() => {
    setErrors({
      name: template.name.trim() === "",
      subject: template.subject.trim() === "",
    });
  }, [template.name, template.subject]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({ [name]: checked });
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left Column - Basic Info */}
      <div className="space-y-6">
        {/* Template Name */}
        <div>
          <label
            htmlFor="name"
            className="flex items-center text-sm font-semibold text-gray-900 mb-2"
          >
            Template Name
            <span className="ml-1 text-red-500 text-base">*</span>
            {errors.name && (
              <span className="ml-2 text-xs font-normal text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                Required
              </span>
            )}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={template.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-all outline-none text-gray-900 placeholder-gray-400 ${
              errors.name
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
            }`}
            placeholder="e.g., Welcome Email"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-900 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={template.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-gray-900 placeholder-gray-400 resize-none"
            placeholder="Brief description of this template"
          />
        </div>

        {/* Email Subject */}
        <div>
          <label
            htmlFor="subject"
            className="flex items-center text-sm font-semibold text-gray-900 mb-2"
          >
            Email Subject
            <span className="ml-1 text-red-500 text-base">*</span>
            {errors.subject && (
              <span className="ml-2 text-xs font-normal text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                Required
              </span>
            )}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={template.subject}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 rounded-lg border-2 transition-all outline-none text-gray-900 placeholder-gray-400 ${
              errors.subject
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
            }`}
            placeholder="e.g., Welcome to Our Service!"
            required
          />
        </div>

        {/* Public Template Checkbox */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-100">
          <div className="flex items-start gap-3">
            <input
              id="isPublic"
              name="isPublic"
              type="checkbox"
              checked={template.isPublic}
              onChange={handleCheckboxChange}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
            />
            <div className="flex-1">
              <label
                htmlFor="isPublic"
                className="font-semibold text-gray-900 cursor-pointer block"
              >
                Make this template public
              </label>
              <p className="text-sm text-gray-700 mt-1">
                Public templates are available to all users of the system
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Variables and Requirements */}
      <div className="space-y-6">
        {/* Detected Variables */}
        <div className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code className="w-4 h-4 text-primary" />
            </div>
            <h4 className="text-base font-bold text-gray-900">
              Detected Variables
            </h4>
          </div>

          <div className="space-y-4">
            {/* Variable Tags */}
            {template.variables.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {template.variables.map((variable) => (
                  <span
                    key={variable}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      variable === "senderName"
                        ? "bg-green-100 text-green-800 border-2 border-green-300 shadow-sm"
                        : "bg-primary/10 text-primary border-2 border-primary/20"
                    }`}
                  >
                    <span className="font-mono">{variable}</span>
                    {variable === "senderName" && (
                      <CheckCircle2
                        className="w-4 h-4"
                        title="Used for From field in emails"
                      />
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600">
                  No variables detected. Add variables using{" "}
                  <code className="bg-white px-2 py-1 rounded text-primary font-mono text-xs border border-gray-200">
                    {"{{variableName}}"}
                  </code>{" "}
                  syntax in your content.
                </p>
              </div>
            )}

            {/* Info Note */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-900">
                  <span className="font-semibold">Note:</span> senderName is
                  automatically included and will be used as the "From" name in
                  emails.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Template Requirements */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <AlertCircle className="w-4 h-4 text-purple-600" />
            </div>
            <h4 className="text-base font-bold text-gray-900">
              Template Requirements
            </h4>
          </div>

          <ul className="space-y-2.5">
            <li className="flex items-start gap-2 text-sm text-gray-800">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>
                Fields marked with{" "}
                <span className="text-red-500 font-semibold">*</span> are
                required
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-800">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>
                At least one content block must be added to create a template
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm text-gray-800">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
              <span>
                The template will be available in your Templates dashboard after
                creation
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
