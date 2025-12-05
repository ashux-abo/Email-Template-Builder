import mongoose from 'mongoose';

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
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Initialize the cache
if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connect to MongoDB and cache the connection
 */
async function connectDB(): Promise<typeof mongoose> {
  // If we have an existing connection, return it
  if (global.mongooseCache.conn) {
    return global.mongooseCache.conn;
  }

  // If we don't have a connection promise yet, create it
  if (!global.mongooseCache.promise) {
    const opts = {
      bufferCommands: false,
    };

    global.mongooseCache.promise = mongoose.connect(MONGODB_URI!, opts);
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