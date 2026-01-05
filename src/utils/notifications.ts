import User from "../models/User";
import NotificationSettings from "../models/NotificationSettings";
import AppNotification from "../models/AppNotification";

export type NotificationType =
  // App notifications only
  | "newFeatures"
  | "security"
  | "emailSent"
  | "emailOpened"
  | "emailClicked"
  | "emailBounced"
  | "newTemplates";

export interface NotificationData {
  userId: string;
  type: NotificationType;
  title?: string;
  message: string;
  data?: Record<string, any>;
}

/**
 * Send an app notification to a user
 */
export async function sendNotification(
  notification: NotificationData,
): Promise<{ success: boolean; message: string }> {
  try {
    const { userId, type, title, message, data = {} } = notification;

    // Find the user
    const user = await User.findById(userId).select("name");
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Get notification settings
    const settings = await NotificationSettings.findOne({ userId });
    if (!settings) {
      return { success: false, message: "Notification settings not found" };
    }

    // Check if this notification type is enabled for app notifications
    const isEnabled = settings.app[type as keyof typeof settings.app];

    if (!isEnabled) {
      return { success: true, message: "Notification type disabled by user" };
    }

    // Create and store app notification in the database
    const notificationTitle = title || getDefaultTitle(type);

    await AppNotification.create({
      userId,
      type,
      title: notificationTitle,
      message,
      isRead: false,
      data,
    });

    return { success: true, message: "App notification created and stored" };
  } catch (error: any) {
    console.error("Error sending notification:", error);
    return {
      success: false,
      message: `Error sending notification: ${error.message}`,
    };
  }
}

/**
 * Get notifications for a user
 */
export async function getUserNotifications(
  userId: string,
  options: { limit?: number; offset?: number; unreadOnly?: boolean } = {},
): Promise<{ notifications: any[]; total: number }> {
  const { limit = 10, offset = 0, unreadOnly = false } = options;

  try {
    const query = { userId };
    if (unreadOnly) {
      Object.assign(query, { isRead: false });
    }

    const [notifications, total] = await Promise.all([
      AppNotification.find(query)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      AppNotification.countDocuments(query),
    ]);

    return { notifications, total };
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return { notifications: [], total: 0 };
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  notificationId: string,
): Promise<boolean> {
  try {
    const result = await AppNotification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true },
    );
    return !!result;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(
  userId: string,
): Promise<boolean> {
  try {
    const result = await AppNotification.updateMany(
      { userId, isRead: false },
      { isRead: true },
    );
    return !!result.modifiedCount;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
}

/**
 * Get default notification title based on type
 */
function getDefaultTitle(type: NotificationType): string {
  switch (type) {
    case "newFeatures":
      return "New Features Available";
    case "security":
      return "Security Alert";
    case "emailSent":
      return "Email Sent Successfully";
    case "emailOpened":
      return "Email Opened";
    case "emailClicked":
      return "Email Link Clicked";
    case "emailBounced":
      return "Email Delivery Failed";
    case "newTemplates":
      return "New Templates Available";
    default:
      return "Notification";
  }
}
