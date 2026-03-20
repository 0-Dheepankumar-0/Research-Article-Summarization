// backend/db.js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
  await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};
