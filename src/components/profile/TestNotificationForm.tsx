"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select } from "../ui/select";
import { useToast } from "../ui/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";

export function TestNotificationForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [notificationType, setNotificationType] = useState("newFeatures");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Send test notification
  const sendTestNotification = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await fetch("/api/notifications/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: notificationType,
          title: title || undefined, // Only send if not empty
          message: message || "This is a test notification",
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Test notification created",
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
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Test Notifications</CardTitle>
        <CardDescription>
          Create test notifications to see how they appear in the app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={sendTestNotification} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Notification Type
            </label>
            <select
              id="type"
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="newFeatures">New Features</option>
              <option value="security">Security Alert</option>
              <option value="emailSent">Email Sent</option>
              <option value="emailOpened">Email Opened</option>
              <option value="emailClicked">Email Link Clicked</option>
              <option value="emailBounced">Email Bounced</option>
              <option value="newTemplates">New Templates</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title (Optional)
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Leave empty to use default title"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              If left empty, a default title will be used based on the
              notification type
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter notification message"
              disabled={isLoading}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : "Send Test Notification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
