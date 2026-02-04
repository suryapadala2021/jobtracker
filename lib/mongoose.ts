// lib/mongoose.ts
import mongoose from "mongoose";

const MONGODB_URI = 'REDACTED_MONGO_URI';

type MongooseCache = {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache;
};

// Use global cache (important for Next.js hot reload)
let cached = globalForMongoose.mongoose;

if (!cached) {
  cached = globalForMongoose.mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<mongoose.Mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
