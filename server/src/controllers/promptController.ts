import { Request, Response } from "express";
import { generateRandomPrompt } from "../utils/genPrompt";
import { AuthRequest } from "../middlewares/authMiddleware";
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

    const { componentType } = req.body;

    if (!componentType || typeof componentType !== "string") {
      return res.status(400).json({
        message: "Component type is required",
      });
    }

    const randomPrompt = generateRandomPrompt(componentType);
    if (!randomPrompt) {
      return res.status(404).json({ message: "No prompts available" });
    }

    // Just return the prompt data without saving to DB
    const promptData = {
      rawPrompt: randomPrompt,
      componentType: componentType,
      type: "random" as const,
      createdAt: new Date(),
    };

    return res.status(200).json({ data: promptData });
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
    const { rawPrompt, componentType, colors } = req.body;

    if (!rawPrompt || typeof rawPrompt !== "string") {
      return res.status(400).json({
        message: "Invalid prompt format",
      });
    }

    if (!componentType || typeof componentType !== "string") {
      return res.status(400).json({
        message: "Component type is required",
      });
    }

    // Validate colors if provided
    if (
      colors &&
      (!Array.isArray(colors) ||
        !colors.every((color) => typeof color === "string"))
    ) {
      return res.status(400).json({
        message: "Colors must be an array of strings",
      });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized access, user ID is missing",
      });
    }

    const polishedPromptText = await polishPrompt(
      rawPrompt,
      componentType,
      colors
    );

    // Just return the polished prompt data without saving to DB
    const promptData = {
      rawPrompt,
      polishedPrompt: polishedPromptText,
      componentType: componentType,
      colors: colors || [],
      type: "user" as const,
      createdAt: new Date(),
    };

    return res.status(200).json({
      data: promptData,
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

export const bookmarkPromptController = async (
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

    const { rawPrompt, polishedPrompt, componentType, type } = req.body;

    if (!rawPrompt || typeof rawPrompt !== "string") {
      return res.status(400).json({
        message: "Raw prompt is required",
      });
    }

    if (!componentType || typeof componentType !== "string") {
      return res.status(400).json({
        message: "Component type is required",
      });
    }

    if (!type || (type !== "random" && type !== "user")) {
      return res.status(400).json({
        message: "Valid type is required",
      });
    }

    const newBookmarkedPrompt = new Prompt({
      user: userId,
      rawPrompt,
      polishedPrompt: polishedPrompt || undefined,
      componentType: componentType,
      type: type,
    });

    await newBookmarkedPrompt.save();

    return res.status(200).json({
      data: newBookmarkedPrompt,
      message: "Prompt bookmarked successfully",
    });
  } catch (error) {
    console.error("Error bookmarking prompt:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getBookmarkedPromptsController = async (
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

    const bookmarkedPrompts = await Prompt.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      data: bookmarkedPrompts,
    });
  } catch (error) {
    console.error("Error fetching bookmarked prompts:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deletePromptController = async (
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

    const { promptId } = req.params;

    if (!promptId) {
      return res.status(400).json({
        message: "Prompt ID is required",
      });
    }

    const deletedPrompt = await Prompt.findOneAndDelete({
      _id: promptId,
      user: userId,
    });

    if (!deletedPrompt) {
      return res.status(404).json({
        message: "Prompt not found or you don't have permission to delete it",
      });
    }

    return res.status(200).json({
      message: "Prompt deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
