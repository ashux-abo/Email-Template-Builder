"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import {
  TestTube,
  Star,
  AlertTriangle,
  Mail,
  ExternalLink,
  MousePointerClick,
  AlertCircle,
  FileText,
  Send,
} from "lucide-react";

export function TestNotificationForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationType, setNotificationType] = useState("newFeatures");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const notificationTypes = [
    {
      value: "newFeatures",
      label: "New Features",
      icon: Star,
      color: "text-amber-600",
    },
    {
      value: "security",
      label: "Security Alert",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      value: "emailSent",
      label: "Email Sent",
      icon: Mail,
      color: "text-green-600",
    },
    {
      value: "emailOpened",
      label: "Email Opened",
      icon: ExternalLink,
      color: "text-blue-600",
    },
    {
      value: "emailClicked",
      label: "Email Link Clicked",
      icon: MousePointerClick,
      color: "text-purple-600",
    },
    {
      value: "emailBounced",
      label: "Email Bounced",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      value: "newTemplates",
      label: "New Templates",
      icon: FileText,
      color: "text-indigo-600",
    },
  ];

  const selectedType = notificationTypes.find(
    (t) => t.value === notificationType,
  );

  // Send test notification
  const sendTestNotification = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: notificationType,
          title: title || undefined,
          message: message || "This is a test notification",
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Test notification created successfully",
        });

        // Clear form
        setTitle("");
        setMessage("");
      } else {
        const data = await response.json();
        throw new Error(data.error || "Failed to create test notification");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create test notification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Test Notifications
        </h2>
        <p className="text-muted-foreground mt-1">
          Create and preview test notifications
        </p>
      </div>

      <Card className="border-2">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <TestTube className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Notification Builder</CardTitle>
              <CardDescription className="text-sm">
                Build and send test notifications to your account
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <label
                htmlFor="type"
                className="text-sm font-medium flex items-center gap-2"
              >
                Notification Type
                {selectedType && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <selectedType.icon
                      className={`h-3 w-3 ${selectedType.color}`}
                    />
                  </span>
                )}
              </label>
              <select
                id="type"
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
                className="w-full rounded-lg border-2 border-input bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                disabled={isLoading}
              >
                {notificationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="title" className="text-sm font-medium">
                  Custom Title
                </label>
                <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Leave empty to use default title"
                disabled={isLoading}
                className="border-2 h-11"
              />
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-primary mt-0.5">ⓘ</span>
                If left empty, a default title will be generated based on the
                notification type
              </p>
            </div>

            <div className="space-y-3">
              <label htmlFor="message" className="text-sm font-medium">
                Message Content
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your notification message here..."
                disabled={isLoading}
                rows={4}
                className="border-2 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {message.length} characters
              </p>
            </div>

            <div className="pt-2">
              <Button
                onClick={sendTestNotification}
                disabled={isLoading}
                className="w-full h-11 text-base"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Test Notification
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-dashed bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Testing Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>
                  • Test notifications will appear in your notification panel
                </li>
                <li>• They will be marked as unread by default</li>
                <li>
                  • Use this to preview how different notification types look
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
