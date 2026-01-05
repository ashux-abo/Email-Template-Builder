import mongoose from "mongoose";

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env",
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// In Next.js, this approach prevents multiple connections during development
// due to Fast Refresh
const globalAny: any = global;
const cached: MongooseCache = globalAny.mongoose || {
  conn: null,
  promise: null,
};

if (!globalAny.mongoose) {
  globalAny.mongoose = cached;
}

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
