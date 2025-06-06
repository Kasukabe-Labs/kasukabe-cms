import mongoose from "mongoose";

export interface IPrompt {
  type: "random" | "user";
  rawPrompt: string;
  polishedPrompt: string;
  createdAt: Date;
  updatedAt: Date;
  user: mongoose.Types.ObjectId;
}
