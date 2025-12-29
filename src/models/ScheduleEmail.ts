import mongoose, { Document, Schema } from "mongoose";

export interface IScheduledEmail extends Document {
  userId: mongoose.Types.ObjectId;
  subject: string;
  recipientGroup: string;
  recipientCount: number;
  scheduledDate: Date;
  template: string;
  templateId: mongoose.Types.ObjectId;
  recurrence: "once" | "daily" | "weekly" | "monthly";
  status: "scheduled" | "sent" | "cancelled" | "failed";
  lastSent?: Date;
  nextSendDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduledEmailSchema = new Schema<IScheduledEmail>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    recipientGroup: {
      type: String,
      required: true,
      trim: true,
    },
    recipientCount: {
      type: Number,
      default: 0,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    template: {
      type: String,
      required: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "EmailTemplate",
      required: true,
    },
    recurrence: {
      type: String,
      enum: ["once", "daily", "weekly", "monthly"],
      default: "once",
    },
    status: {
      type: String,
      enum: ["scheduled", "sent", "cancelled", "failed"],
      default: "scheduled",
    },
    lastSent: {
      type: Date,
    },
    nextSendDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient querying
ScheduledEmailSchema.index({ userId: 1, status: 1 });
ScheduledEmailSchema.index({ status: 1, scheduledDate: 1 });
ScheduledEmailSchema.index({ userId: 1, scheduledDate: 1 });

export default mongoose.models.ScheduledEmail ||
  mongoose.model<IScheduledEmail>("ScheduledEmail", ScheduledEmailSchema);
