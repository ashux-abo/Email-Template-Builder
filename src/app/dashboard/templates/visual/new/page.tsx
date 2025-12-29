"use client";

import React from "react";
import { useRouter } from "next/navigation";
import VisualTemplateBuilder from "../../../../../components/email/VisualTemplateBuilder";
import ErrorBoundary from "../../../../../components/email/ErrorBoundary";

export default function NewVisualTemplate() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">
        Create New Template (Visual Editor)
      </h1>
      <ErrorBoundary>
        <VisualTemplateBuilder />
      </ErrorBoundary>
    </div>
  );
}
