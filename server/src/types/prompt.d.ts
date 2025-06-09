import mongoose from "mongoose";

export type ComponentType =
  | "landing-page"
  | "dashboard"
  | "features-section"
  | "pricing-page"
  | "contact-form"
  | "navigation"
  | "hero-section"
  | "card-layout"
  | "login-signup"
  | "footer";

export interface IPrompt {
  type: "random" | "user";
  rawPrompt: string;
  polishedPrompt?: string;
  componentType: ComponentType;
  createdAt: Date;
  updatedAt: Date;
  user: mongoose.Types.ObjectId;
}
