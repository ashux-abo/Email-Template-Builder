import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env",
  );
}

// Check for existing connection
let isConnected = false;

async function dbConnect() {
  if (isConnected) {
    console.log("Using existing database connection");
    return Promise.resolve();
  }

  try {
    await mongoose.connect(MONGODB_URI!);
    isConnected = true;
    console.log("New database connection established");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

export default dbConnect;
