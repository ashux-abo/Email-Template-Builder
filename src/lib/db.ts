import mongoose from "mongoose";

// Define types for our connection cache
interface ConnectionCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Define the global namespace
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: ConnectionCache;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env. " +
    "For Vercel, add it in Project Settings → Environment Variables.",
  );
}

// Initialize the cache
if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connect to MongoDB and cache the connection
 * Optimized for Vercel serverless environment
 */
async function connectDB(): Promise<typeof mongoose> {
  // Check if MONGODB_URI is set (runtime check)
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Please add it to your environment variables. " +
      "For Vercel: Project Settings → Environment Variables → Add MONGODB_URI",
    );
  }

  // If we have an existing connection and it's ready, return it
  if (global.mongooseCache.conn) {
    // Check if connection is still alive
    if (mongoose.connection.readyState === 1) {
      return global.mongooseCache.conn;
    }
    // Connection is dead, reset it
    global.mongooseCache.conn = null;
  }

  // If we don't have a connection promise yet, create it
  if (!global.mongooseCache.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      maxPoolSize: 10, // Limits the number of concurrent connections
      serverSelectionTimeoutMS: 10000, // Increased timeout for Vercel
      socketTimeoutMS: 45000, // Give the database time to finish operations
      // Optimize for serverless
      retryWrites: true,
      retryReads: true,
    };

    global.mongooseCache.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully");
      return mongoose;
    }).catch((error) => {
      // Clear the promise on error so we can retry
      global.mongooseCache.promise = null;
      console.error("❌ MongoDB connection error:", error.message);
      
      // Provide helpful error messages
      if (error.message.includes("authentication failed")) {
        throw new Error(
          "MongoDB authentication failed. Check your MONGODB_URI username and password."
        );
      } else if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo")) {
        throw new Error(
          "Cannot reach MongoDB server. Check your MONGODB_URI connection string."
        );
      } else if (error.message.includes("timeout")) {
        throw new Error(
          "MongoDB connection timeout. Check your network and MongoDB server status."
        );
      } else {
        throw new Error(`MongoDB connection failed: ${error.message}`);
      }
    });
  }

  try {
    global.mongooseCache.conn = await global.mongooseCache.promise;
  } catch (e) {
    global.mongooseCache.promise = null;
    throw e;
  }

  return global.mongooseCache.conn;
}

export default connectDB;
