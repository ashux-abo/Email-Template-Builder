"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { useRouter } from "next/navigation";
import NotificationSettings from "../../../../../components/profile/NotificationSettings";
import { TestNotificationForm } from "../../../../../components/profile/TestNotificationForm";

export default function NotificationSettingsPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Notification Settings</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <NotificationSettings />
        </div>
        <div>
          <TestNotificationForm />
        </div>
      </div>
    </div>
  );
}
