import { Schema, model } from "mongoose";
import { IPrompt } from "../types/prompt";

const PromptSchema = new Schema<IPrompt>(
  {
    type: {
      type: String,
      enum: ["random", "user"],
      required: true,
    },
    rawPrompt: {
      type: String,
      required: true,
    },
    polishedPrompt: {
      type: String,
    },
    componentType: {
      type: String,
      required: true,
      enum: [
        "landing-page",
        "dashboard",
        "features-section",
        "pricing-page",
        "contact-form",
        "navigation",
        "hero-section",
        "card-layout",
        "login-signup",
        "footer",
      ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Prompt = model<IPrompt>("Prompt", PromptSchema);

export default Prompt;
