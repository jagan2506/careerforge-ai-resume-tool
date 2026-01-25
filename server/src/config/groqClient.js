import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: process.env.GROQ_BASE_URL
});

export const GROQ_MODEL =
  process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
