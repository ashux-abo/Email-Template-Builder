"use client";

import { useState, useEffect } from "react";
import EmailSender from "./EmailSender";
import EmailTester from "./EmailTester";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

interface DashboardContentProps {
  isDevelopment: boolean;
}

export default function DashboardContent({
  isDevelopment,
}: DashboardContentProps) {
  // Initialize with false, then check localStorage in useEffect
  const [showTester, setShowTester] = useState(false);

  // Access localStorage only on the client side
  useEffect(() => {
    if (isDevelopment) {
      const testerHidden = localStorage.getItem("emailTesterHidden") === "true";
      setShowTester(!testerHidden);
    }
  }, [isDevelopment]);

  // Show the tester component and update localStorage (dev only)
  const handleShowTester = () => {
    if (isDevelopment) {
      localStorage.removeItem("emailTesterHidden");
      setShowTester(true);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <DashboardCard
        title="Create Email"
        description="Create and send beautiful emails using PaletteMail templates"
        icon={<EnvelopeIcon className="h-8 w-8 text-primary" />}
        actions={
          isDevelopment && !showTester ? (
            <button
              onClick={handleShowTester}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              title="Show email configuration tester"
            >
              <span>Show Email Tester</span>
            </button>
          ) : null
        }
      >
        <EmailSender />
        {isDevelopment && showTester && <EmailTester />}
      </DashboardCard>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

function DashboardCard({
  title,
  description,
  icon,
  children,
  actions,
}: DashboardCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon}
            <div className="ml-4">
              <h2 className="text-lg font-medium text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          {actions}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}
