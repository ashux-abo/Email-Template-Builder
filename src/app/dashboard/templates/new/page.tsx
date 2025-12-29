"use client";

import { useRouter } from "next/navigation";
import TemplateBuilder from "../../../../components/email/TemplateBuilder";

export default function NewTemplatePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Email Template</h1>
        <p className="mt-2 text-gray-600">
          Design your email template with HTML and preview it in real-time.
        </p>
      </div>

      <TemplateBuilder
        onSave={(template) => {
          router.push("/dashboard/templates");
        }}
      />
    </div>
  );
}
