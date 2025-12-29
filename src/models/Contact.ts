import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  company?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    company: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Create compound index for userId and email to ensure uniqueness per user
ContactSchema.index({ userId: 1, email: 1 }, { unique: true });

export default mongoose.models.Contact ||
  mongoose.model<IContact>("Contact", ContactSchema);
