"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, ArrowLeft, Check } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      const data = await response.json();

      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(
          data.data.notifications.filter((n: Notification) => !n.isRead).length,
        );
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(
          notifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, isRead: true }
              : notification,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ markAll: true }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(
          notifications.map((notification) => ({
            ...notification,
            isRead: true,
          })),
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Group notifications by date
  const groupNotificationsByDate = () => {
    const grouped: Record<string, Notification[]> = {};

    notifications.forEach((notification) => {
      const date = new Date(notification.createdAt);
      const dateKey = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      ).toISOString();

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(notification);
    });

    return Object.entries(grouped)
      .map(([date, items]) => ({
        date: new Date(date),
        notifications: items,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const groupedNotifications = groupNotificationsByDate();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Bell className="mr-2 h-6 w-6" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </h1>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline" size="sm">
              <Check className="mr-1.5 h-4 w-4" />
              Mark all as read
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/profile/notifications/settings")}
          >
            Settings
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse text-center">
            <div className="h-8 w-48 bg-gray-200 rounded mb-4 mx-auto"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mb-2 mx-auto"></div>
            <div className="h-4 w-56 bg-gray-200 rounded mx-auto"></div>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No notifications</h2>
          <p className="text-gray-500">You don't have any notifications yet.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {groupedNotifications.map((group) => (
            <div key={group.date.toISOString()} className="space-y-4">
              <h2 className="text-sm font-medium text-gray-500 border-b pb-2">
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(group.date)}
              </h2>

              <div className="divide-y divide-gray-100">
                {group.notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`py-4 px-2 hover:bg-gray-50 rounded-md transition-colors ${
                      !notification.isRead ? "bg-primary/5" : ""
                    }`}
                    onClick={() =>
                      !notification.isRead && markAsRead(notification._id)
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${
                          !notification.isRead ? "bg-primary" : "bg-transparent"
                        }`}
                      />
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{notification.title}</h3>
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-600">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
