import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const genAI = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});
