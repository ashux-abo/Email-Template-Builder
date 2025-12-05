import mongoose from 'mongoose';

export interface IEmailHistory {
  userId: mongoose.Types.ObjectId;
  templateId: string;
  subject: string;
  recipients: string[];
  content: string;
  sentAt: Date;
  status: 'success' | 'failed';
  errorMessage?: string;
}

const emailHistorySchema = new mongoose.Schema<IEmailHistory>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    templateId: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    recipients: [{
      type: String,
      required: true,
    }],
    content: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['success', 'failed'],
      required: true,
    },
    errorMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const EmailHistory = mongoose.models.EmailHistory || mongoose.model<IEmailHistory>('EmailHistory', emailHistorySchema);

export default EmailHistory; 