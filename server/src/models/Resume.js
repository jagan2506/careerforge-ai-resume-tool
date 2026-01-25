import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    role: String,
    company: String,
    location: String,
    period: String,
    bullets: [String]
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,
    title: String,
    email: String,
    phone: String,
    summary: String,
    experience: [experienceSchema],
    skills: [String],
    lastATSScore: { type: Number, default: 0 },
    jdUsed: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
