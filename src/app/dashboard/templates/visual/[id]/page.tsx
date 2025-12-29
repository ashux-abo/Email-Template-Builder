"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import VisualTemplateBuilder from "../../../../../components/email/VisualTemplateBuilder";
import ErrorBoundary from "../../../../../components/email/ErrorBoundary";

export default function EditVisualTemplate() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">Edit Template (Visual Editor)</h1>
      <ErrorBoundary>
        <VisualTemplateBuilder templateId={id} />
      </ErrorBoundary>
    </div>
  );
}
