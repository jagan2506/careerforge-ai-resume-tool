import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import mongoose from "mongoose";

import aiRoutes from "./routes/aiRoutes.js";

import pdfRoutes from "./routes/pdfRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB error", err));

app.get("/", (req, res) => {
  res.send("CareerForge Pro backend is running");
});


app.use("/api/ai", aiRoutes);

app.use("/api/pdf", pdfRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
