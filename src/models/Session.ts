import mongoose from "mongoose";

export interface ISession {
  userId: mongoose.Schema.Types.ObjectId;
  token: string;
  deviceInfo: {
    browser: string;
    os: string;
    ip: string;
    deviceType: string;
  };
  lastActive: Date;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema<ISession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    deviceInfo: {
      browser: {
        type: String,
        default: "Unknown",
      },
      os: {
        type: String,
        default: "Unknown",
      },
      ip: {
        type: String,
        default: "Unknown",
      },
      deviceType: {
        type: String,
        default: "Unknown",
      },
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Automatically remove expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Create methods for the session model
sessionSchema.methods = {
  // Update the last active timestamp
  updateActivity: function () {
    this.lastActive = new Date();
    return this.save();
  },

  // Revoke the session
  revoke: function () {
    this.isRevoked = true;
    return this.save();
  },
};

// Create static methods for the model
sessionSchema.statics = {
  // Get all active sessions for a user
  findActiveSessionsByUserId: function (
    userId: mongoose.Schema.Types.ObjectId,
  ) {
    return this.find({
      userId,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    }).sort({ lastActive: -1 });
  },

  // Find a session by token
  findByToken: function (token: string) {
    return this.findOne({
      token,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });
  },

  // Revoke all sessions for a user except the current one
  revokeAllExcept: function (
    userId: mongoose.Schema.Types.ObjectId,
    currentToken: string,
  ) {
    return this.updateMany(
      {
        userId,
        token: { $ne: currentToken },
        isRevoked: false,
      },
      {
        $set: { isRevoked: true },
      },
    );
  },
};

const Session =
  mongoose.models.Session ||
  mongoose.model<
    ISession,
    mongoose.Model<ISession> & {
      findActiveSessionsByUserId: (
        userId: mongoose.Schema.Types.ObjectId,
      ) => Promise<ISession[]>;
      findByToken: (token: string) => Promise<ISession | null>;
      revokeAllExcept: (
        userId: mongoose.Schema.Types.ObjectId,
        currentToken: string,
      ) => Promise<any>;
    }
  >("Session", sessionSchema);

export default Session;
