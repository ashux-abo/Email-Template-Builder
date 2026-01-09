"use client";

import Link from "next/link";
import { Mail, Calendar, Users, Inbox, Settings } from "lucide-react";
import DashboardContent from "../../components/dashboard/DashboardContent";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to PaletteMail. Manage your emails, contacts, and account
          settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/templates" className="group">
          <div className="border rounded-lg p-6 h-full hover:border-primary hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold group-hover:text-primary">
                Email Templates
              </h2>
              <Mail className="h-6 w-6 text-primary/70 group-hover:text-primary" />
            </div>
            <p className="text-gray-600 mb-4 flex-1">
              Create and manage your email templates with our intuitive editor.
            </p>
            <span className="text-primary font-medium">Manage Templates →</span>
          </div>
        </Link>

        <Link href="/dashboard/contacts" className="group">
          <div className="border rounded-lg p-6 h-full hover:border-primary hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold group-hover:text-primary">
                Contact Lists
              </h2>
              <Users className="h-6 w-6 text-primary/70 group-hover:text-primary" />
            </div>
            <p className="text-gray-600 mb-4 flex-1">
              Organize your contacts and recipient lists in one place.
            </p>
            <span className="text-primary font-medium">Manage Contacts →</span>
          </div>
        </Link>

        <Link href="/dashboard/history" className="group">
          <div className="border rounded-lg p-6 h-full hover:border-primary hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold group-hover:text-primary">
                Email History
              </h2>
              <Inbox className="h-6 w-6 text-primary/70 group-hover:text-primary" />
            </div>
            <p className="text-gray-600 mb-4 flex-1">
              View your sent emails and track delivery status and engagement.
            </p>
            <span className="text-primary font-medium">View History →</span>
          </div>
        </Link>

        <Link href="/dashboard/schedule" className="group">
          <div className="border rounded-lg p-6 h-full hover:border-primary hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold group-hover:text-primary">
                Email Scheduling
              </h2>
              <Calendar className="h-6 w-6 text-primary/70 group-hover:text-primary" />
            </div>
            <p className="text-gray-600 mb-4 flex-1">
              Schedule your emails to be sent at the perfect time for your
              audience.
            </p>
            <span className="text-primary font-medium">Manage Schedule →</span>
          </div>
        </Link>

        <Link href="/dashboard/profile" className="group">
          <div className="border rounded-lg p-6 h-full hover:border-primary hover:shadow-md transition-all flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold group-hover:text-primary">
                Account Settings
              </h2>
              <Settings className="h-6 w-6 text-primary/70 group-hover:text-primary" />
            </div>
            <p className="text-gray-600 mb-4 flex-1">
              Manage your profile, security settings, and account preferences.
            </p>
            <span className="text-primary font-medium">View Settings →</span>
          </div>
        </Link>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border">
        <div className="mb-4 flex items-center">
          <Mail className="h-6 w-6 text-primary mr-2" />
          <DashboardContent
            isDevelopment={process.env.NODE_ENV === "development"}
          />
        </div>
      </div>
    </div>
  );
}
