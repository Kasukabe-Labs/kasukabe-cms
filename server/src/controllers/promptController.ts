import { Request, Response } from "express";
import { generateRandomPrompt } from "../utils/genPrompt";
import { AuthRequest } from "../middleware/authMiddleware";
import Prompt from "../models/prompt.schema";
import { polishPrompt } from "../utils/polishPrompt";

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

export const polishPromptController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        message: "Request body is missing or invalid",
      });
    }
    const { rawPrompt } = req.body;

    if (!rawPrompt || typeof rawPrompt !== "string") {
      return res.status(400).json({
        message: "Invalid prompt format",
      });
    }
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access, user ID is missing",
      });
    }

    const polishedPrompt = await polishPrompt(rawPrompt);

    const newPolishedPrompt = new Prompt({
      user: userId,
      rawPrompt,
      polishedPrompt: polishedPrompt,
      type: "user",
    });

    await newPolishedPrompt.save();
    return res.status(200).json({
      data: newPolishedPrompt,
      message: "Prompt polished successfully",
    });
  } catch (error) {
    console.log("Error in polishPromptController:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
