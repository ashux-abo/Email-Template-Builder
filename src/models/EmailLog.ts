import mongoose, { Document, Schema } from "mongoose";

export interface IEmailLog extends Document {
  email: string;
  subject: string;
  templateId: mongoose.Types.ObjectId | null;
  templateName: string;
  userId: mongoose.Types.ObjectId;
  sentAt: Date;
  status: "sent" | "delivered" | "failed" | "bounced" | "complained";
}

const EmailLogSchema = new Schema<IEmailLog>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "EmailTemplate",
      default: null,
    },
    templateName: {
      type: String,
      default: "Unknown",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "failed", "bounced", "complained"],
      default: "sent",
    },
  },
  { timestamps: true },
);

// Create indexes for querying
EmailLogSchema.index({ userId: 1, sentAt: -1 });
EmailLogSchema.index({ templateId: 1 });
EmailLogSchema.index({ email: 1 });

// Check if models already exist to prevent OverwriteModelError
export const EmailLog =
  mongoose.models.EmailLog ||
  mongoose.model<IEmailLog>("EmailLog", EmailLogSchema);
