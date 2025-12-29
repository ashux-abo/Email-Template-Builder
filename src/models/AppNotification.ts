import mongoose from "mongoose";

export interface IAppNotification {
  userId: mongoose.Schema.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const appNotificationSchema = new mongoose.Schema<IAppNotification>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "newFeatures",
        "security",
        "emailSent",
        "emailOpened",
        "emailClicked",
        "emailBounced",
        "newTemplates",
      ],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Add index for faster queries
appNotificationSchema.index({ userId: 1, createdAt: -1 });
appNotificationSchema.index({ userId: 1, isRead: 1 });

const AppNotification =
  mongoose.models.AppNotification ||
  mongoose.model<IAppNotification>("AppNotification", appNotificationSchema);

export default AppNotification;
