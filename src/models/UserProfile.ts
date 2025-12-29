import mongoose from "mongoose";

export interface IUserProfile {
  userId: mongoose.Schema.Types.ObjectId;
  jobTitle?: string;
  company?: string;
  location?: string;
  phone?: string;
  bio?: string;
  profilePicture?: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

const userProfileSchema = new mongoose.Schema<IUserProfile>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    jobTitle: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: null,
    },
    timezone: {
      type: String,
      default: "UTC+00:00",
    },
  },
  {
    timestamps: true,
  },
);

const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>("UserProfile", userProfileSchema);

export default UserProfile;
