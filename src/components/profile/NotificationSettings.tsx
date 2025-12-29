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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Notification Settings</CardTitle>
        <CardDescription>
          Control which notifications you receive within the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-medium">In-App Notifications</h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-primary/10">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">New Features</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about new features and updates
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.app.newFeatures}
                onCheckedChange={(value) =>
                  handleToggle("app", "newFeatures", value)
                }
                disabled={isLoading || isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Security Alerts</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about security issues and alerts
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.app.security}
                onCheckedChange={(value) =>
                  handleToggle("app", "security", value)
                }
                disabled={isLoading || isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-green-100">
                  <ExternalLink className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Email Sent</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified when your emails are sent successfully
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.app.emailSent}
                onCheckedChange={(value) =>
                  handleToggle("app", "emailSent", value)
                }
                disabled={isLoading || isSaving}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-full bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">New Templates</h4>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new email templates
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.app.newTemplates}
                onCheckedChange={(value) =>
                  handleToggle("app", "newTemplates", value)
                }
                disabled={isLoading || isSaving}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={saveChanges}
            disabled={isLoading || isSaving || !hasChanges}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
