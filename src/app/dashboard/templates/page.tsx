"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  LockClosedIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

type Template = {
  _id: string;
  name: string;
  description: string;
  variables: string[];
  isPublic: boolean;
  createdAt: string;
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      const response = await fetch("/api/templates?includeDefault=false");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch templates");
      }

      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error: any) {
      console.error("Error fetching templates:", error);
      setFetchError(error.message || "Failed to load templates");
      toast.error(error.message || "Failed to load templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/templates/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete template");
      }

      toast.success("Template deleted successfully");
      fetchTemplates();
    } catch (error: any) {
      toast.error(error.message || "Error deleting template");
    } finally {
      setIsDeleting(false);
    }
  };

  // Separate templates by visibility
  const privateTemplates = templates.filter((template) => !template.isPublic);
  const publicTemplates = templates.filter((template) => template.isPublic);

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading templates...</div>;
  }

  const renderTemplateTable = (
    templateList: Template[],
    title: string,
    icon: React.ReactNode,
  ) => {
    if (templateList.length === 0) return null;

    return (
      <div className="mb-10">
        <div className="mb-4 flex items-center">
          {icon}
          <h2 className="text-xl font-semibold ml-2">{title}</h2>
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Variables
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Created
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {templateList.map((template) => (
                <tr key={template._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {template.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {template.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {template.variables.slice(0, 3).map((variable) => (
                        <span
                          key={variable}
                          className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs"
                        >
                          {variable}
                        </span>
                      ))}
                      {template.variables.length > 3 && (
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs">
                          +{template.variables.length - 3} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/dashboard/templates/${template._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit with code editor"
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/dashboard/templates/visual/${template._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit with visual editor"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-5 w-5"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M3 9h18"></path>
                          <path d="M8 21V9"></path>
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(template._id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900"
                        title="Delete template"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Email Templates</h1>
        <div className="flex space-x-3">
          <Link
            href="/dashboard/templates/visual/new"
            className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Visual Builder
          </Link>
          <Link
            href="/dashboard/templates/new"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Code Builder
          </Link>
        </div>
      </div>

      {fetchError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <h3 className="text-lg font-medium text-red-800">
            Error loading templates
          </h3>
          <p className="mt-2 text-red-600">{fetchError}</p>
          <button
            onClick={fetchTemplates}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/80"
          >
            Retry
          </button>
        </div>
      ) : templates.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">
            No templates yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new email template.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <Link
              href="/dashboard/templates/visual/new"
              className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Visual Builder
            </Link>
            <Link
              href="/dashboard/templates/new"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Code Builder
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {renderTemplateTable(
            privateTemplates,
            "My Private Templates",
            <LockClosedIcon className="h-5 w-5 text-gray-600" />,
          )}
          {renderTemplateTable(
            publicTemplates,
            "Public Templates",
            <GlobeAltIcon className="h-5 w-5 text-blue-600" />,
          )}
        </div>
      )}
    </div>
  );
}
