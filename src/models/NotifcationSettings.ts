import mongoose from "mongoose";

export interface INotificationSettings {
  userId: mongoose.Schema.Types.ObjectId;
  app: {
    newFeatures: boolean;
    security: boolean;
    emailSent: boolean;
    emailOpened: boolean;
    emailClicked: boolean;
    emailBounced: boolean;
    newTemplates: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const notificationSettingsSchema = new mongoose.Schema<INotificationSettings>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    app: {
      newFeatures: {
        type: Boolean,
        default: true,
      },
      security: {
        type: Boolean,
        default: true,
      },
      emailSent: {
        type: Boolean,
        default: true,
      },
      emailOpened: {
        type: Boolean,
        default: true,
      },
      emailClicked: {
        type: Boolean,
        default: true,
      },
      emailBounced: {
        type: Boolean,
        default: true,
      },
      newTemplates: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

const NotificationSettings =
  mongoose.models.NotificationSettings ||
  mongoose.model<INotificationSettings>(
    "NotificationSettings",
    notificationSettingsSchema,
  );

export default NotificationSettings;
