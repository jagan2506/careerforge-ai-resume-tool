// server/index.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";


import authRoutes from "./routes/authRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";          // your puppeteer route
// import other routes as needed, e.g.
// import resumeRoutes from "./src/routes/resumeRoutes.js";

dotenv.config();

const app = express();

// Basic middleware
app.use(cors());                    // allow frontend to call backend [web:411]
app.use(express.json());            // parse JSON bodies

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => {
  res.send("CareerForge AI Resume Tool API is running");
});

app.use("/api/auth", authRoutes);   // example auth routes
app.use("/api/pdf", pdfRoutes);  
app.use("/api/ai",aiRoutes) ;  // GET /api/pdf/resume?url=... for PDF
// app.use("/api/resume", resumeRoutes); // add other routes similarly

// Server listen (Render + local)
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
