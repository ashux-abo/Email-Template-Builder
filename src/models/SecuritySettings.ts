import mongoose from "mongoose";

export interface ISecuritySettings {
  userId: mongoose.Schema.Types.ObjectId;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  activeSessions?: string[];
  lastPasswordChange?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const securitySettingsSchema = new mongoose.Schema<ISecuritySettings>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      default: null,
    },
    activeSessions: {
      type: [String],
      default: [],
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const SecuritySettings =
  mongoose.models.SecuritySettings ||
  mongoose.model<ISecuritySettings>("SecuritySettings", securitySettingsSchema);

export default SecuritySettings;
