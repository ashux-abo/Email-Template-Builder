"use client";

import { useParams, useRouter } from "next/navigation";
import TemplateBuilder from "../../../../components/email/TemplateBuilder";

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit Email Template</h1>
        <p className="mt-2 text-gray-600">
          Make changes to your template and preview in real-time.
        </p>
      </div>

      <TemplateBuilder
        templateId={templateId}
        onSave={(template) => {
          router.push("/dashboard/templates");
        }}
      />
    </div>
  );
}
