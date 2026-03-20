// backend/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./database.js";
import authRoutes from "./routes/auth.js";
import summaryRoutes from "./routes/Summariser.js";
// import * as FormData from "form-data";

const app = express();
app.use(express.json());
app.use(cors());
// Connect to MongoDB
connectDB();

// Auth API
app.use("/api/auth", authRoutes);
app.use("/api/summary", summaryRoutes);


const PORT = process.env.PORT || 5000;
console.log("MONGO_URI is:", process.env.MONGO_URI);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
