import { useState, useEffect } from "react";
import { Bell, X, Check, ExternalLink } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { Badge } from "./badge";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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

  // Initial fetch and setup polling
  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 px-1 min-w-5 h-5 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <Card className="absolute right-0 mt-2 w-80 max-h-[32rem] overflow-hidden flex flex-col z-50 shadow-lg animate-in fade-in-50 slide-in-from-top-5">
          <div className="p-4 border-b flex items-center justify-between bg-primary/5">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8 px-2 text-xs"
                >
                  <Check size={14} className="mr-1" />
                  Mark all as read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          <div className="overflow-y-auto flex-grow">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 hover:bg-muted/50 cursor-pointer flex gap-3 ${
                      !notification.isRead ? "bg-primary/5" : ""
                    }`}
                    onClick={() =>
                      !notification.isRead && markAsRead(notification._id)
                    }
                  >
                    <div
                      className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                        !notification.isRead ? "bg-primary" : "bg-transparent"
                      }`}
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">
                          {notification.title}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs mt-1 text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t bg-muted/50 text-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground w-full"
              asChild
            >
              <a href="/profile/notifications">
                View all notifications
                <ExternalLink size={12} className="ml-1" />
              </a>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
