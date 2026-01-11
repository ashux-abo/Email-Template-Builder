"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { useToast } from "../ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  BellRing,
  AlertTriangle,
  FileText,
  Star,
  ExternalLink,
  Mail,
  MousePointerClick,
  AlertCircle,
} from "lucide-react";

interface NotificationPreferences {
  app: {
    newFeatures: boolean;
    security: boolean;
    emailSent: boolean;
    emailOpened: boolean;
    emailClicked: boolean;
    emailBounced: boolean;
    newTemplates: boolean;
  };
}

export default function NotificationSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    app: {
      newFeatures: true,
      security: true,
      emailSent: true,
      emailOpened: true,
      emailClicked: true,
      emailBounced: true,
      newTemplates: true,
    },
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Fetch notification settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/user/notification-preferences");

        if (response.ok) {
          const data = await response.json();
          setPreferences(data.preferences);
        }
      } catch (error) {
        console.error("Error fetching notification preferences:", error);
        toast({
          title: "Error",
          description: "Failed to load notification preferences",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [toast]);

  // Handle toggle change
  const handleToggle = (category: "app", type: string, value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value,
      },
    }));
    setHasChanges(true);
  };

  // Save changes
  const saveChanges = async () => {
    try {
      setIsSaving(true);
      const response = await fetch("/api/user/notification-preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences }),
      });

      if (response.ok) {
        setHasChanges(false);
        toast({
          title: "Success",
          description: "Notification preferences updated",
        });
      } else {
        throw new Error("Failed to update preferences");
      }
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const notificationItems = [
    {
      id: "newFeatures",
      icon: Star,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      title: "New Features",
      description: "Receive notifications about new features and updates",
      value: preferences.app.newFeatures,
    },
    {
      id: "security",
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      title: "Security Alerts",
      description: "Important security notifications and alerts",
      value: preferences.app.security,
    },
    {
      id: "emailSent",
      icon: Mail,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      title: "Email Sent",
      description: "Get notified when your emails are sent successfully",
      value: preferences.app.emailSent,
    },
    {
      id: "emailOpened",
      icon: ExternalLink,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "Email Opened",
      description: "Know when recipients open your emails",
      value: preferences.app.emailOpened,
    },
    {
      id: "emailClicked",
      icon: MousePointerClick,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "Email Clicked",
      description: "Track when links in your emails are clicked",
      value: preferences.app.emailClicked,
    },
    {
      id: "emailBounced",
      icon: AlertCircle,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      title: "Email Bounced",
      description: "Alerts when emails fail to deliver",
      value: preferences.app.emailBounced,
    },
    {
      id: "newTemplates",
      icon: FileText,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "New Templates",
      description: "Get notified about new email templates",
      value: preferences.app.newTemplates,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Notification Preferences
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage how and when you receive notifications
        </p>
      </div>

      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BellRing className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">In-App Notifications</CardTitle>
              <CardDescription className="text-sm">
                Choose which notifications you want to receive
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          {notificationItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors ${
                index !== notificationItems.length - 1 ? "border-b" : ""
              }`}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-2 rounded-lg ${item.iconBg} flex-shrink-0`}>
                  <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-0.5">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
              <Switch
                checked={item.value}
                onCheckedChange={(value) => handleToggle("app", item.id, value)}
                disabled={isLoading || isSaving}
                className="ml-4"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-2">
        <p className="text-sm text-muted-foreground">
          {hasChanges && "You have unsaved changes"}
        </p>
        <div className="flex gap-2">
          {hasChanges && (
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              disabled={isSaving}
            >
              Cancel
            </Button>
          )}
          <Button
            onClick={saveChanges}
            disabled={isLoading || isSaving || !hasChanges}
            className="min-w-[120px]"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
