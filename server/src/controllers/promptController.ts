import { Request, Response } from "express";
import { generateRandomPrompt } from "../utils/genPrompt";
import { AuthRequest } from "../middleware/authMiddleware";
import Prompt from "../models/prompt.schema";

export const generateRandomPromptController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access, user ID is missing",
      });
    }

    const randomPrompt = generateRandomPrompt();
    if (!randomPrompt) {
      return res.status(404).json({ message: "No prompts available" });
    }

    const newPrompt = new Prompt({
      user: userId,
      rawPrompt: randomPrompt,
      type: "random",
    });

    await newPrompt.save();

    return res.status(200).json({ data: newPrompt });
  } catch (error) {
    console.error("Error generating random prompt:", error);
    return res.status(500).json({ error: "Failed to generate random prompt" });
  }
};
