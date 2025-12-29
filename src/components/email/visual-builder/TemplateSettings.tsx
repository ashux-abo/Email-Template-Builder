"use client";

import React, { useState, useEffect } from "react";
import { VisualTemplate } from "./types";

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
    // Update error states when template changes
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="flex items-center text-sm font-medium text-gray-700"
          >
            Template Name <span className="ml-1 text-red-500">*</span>
            {errors.name && (
              <span className="ml-2 text-xs text-red-500">Required</span>
            )}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={template.name}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary ${
              errors.name
                ? "border-red-300 focus:border-red-500"
                : "border-gray-300 focus:border-primary"
            }`}
            placeholder="e.g., Welcome Email"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={template.description}
            onChange={handleInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="Brief description of this template"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="flex items-center text-sm font-medium text-gray-700"
          >
            Email Subject <span className="ml-1 text-red-500">*</span>
            {errors.subject && (
              <span className="ml-2 text-xs text-red-500">Required</span>
            )}
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={template.subject}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary ${
              errors.subject
                ? "border-red-300 focus:border-red-500"
                : "border-gray-300 focus:border-primary"
            }`}
            placeholder="e.g., Welcome to Our Service!"
            required
          />
        </div>

        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="isPublic"
              name="isPublic"
              type="checkbox"
              checked={template.isPublic}
              onChange={handleCheckboxChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="isPublic" className="font-medium text-gray-700">
              Make this template public
            </label>
            <p className="text-gray-500">
              Public templates are available to all users of the system
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Detected Variables
          </label>
          <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 p-3">
            {template.variables.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {template.variables.map((variable) => (
                  <span
                    key={variable}
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      variable === "senderName"
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {variable}
                    {variable === "senderName" && (
                      <span
                        className="ml-1"
                        title="Used for From field in emails"
                      >
                        *
                      </span>
                    )}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No variables detected. Add variables using {"{{"}
                <span>variableName</span>
                {"}}"} syntax in your content.
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Note: <span className="font-medium">senderName</span> is
              automatically included and will be used as the "From" name in
              emails.
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-md bg-blue-50 p-3 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800">
            Template Requirements
          </h3>
          <ul className="mt-2 text-xs text-blue-700 space-y-1 list-disc list-inside">
            <li>
              Fields marked with <span className="text-red-500">*</span> are
              required
            </li>
            <li>
              At least one content block must be added to create a template
            </li>
            <li>
              The template will be available in your Templates dashboard after
              creation
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
