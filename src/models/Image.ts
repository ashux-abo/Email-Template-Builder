import mongoose from "mongoose";

export interface IImage {
  name: string;
  userId: mongoose.Schema.Types.ObjectId;
  data: Buffer;
  contentType: string;
  folder: string;
  size: number;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new mongoose.Schema<IImage>(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      default: "uploads",
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes for faster queries
imageSchema.index({ userId: 1 });
imageSchema.index({ folder: 1 });

const Image =
  mongoose.models.Image || mongoose.model<IImage>("Image", imageSchema);

export default Image;
