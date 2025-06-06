import { genAI } from "../config/googleGemini";
import { formatReadableText } from "./formatReadbleText";

export const polishPrompt = async (rawPrompt: string): Promise<string> => {
  const polishingInstruction = `
You are a prompt engineering expert. Rewrite this raw prompt into a clean, professional instruction for creating modern, award-winning web design.

Focus on:
- Clean, minimal SaaS-style aesthetics (like Awwwards winners)
- Modern UI/UX with premium feel
- Specific, actionable requirements
- No placeholder text like [NAME] or [YOUR FIELD] - write direct instructions
- Medium length - detailed but concise
- Professional tone without unnecessary explanations

Raw prompt: "${rawPrompt}"

Output only the refined prompt with specific requirements. No introductions or meta-commentary.`;

  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: polishingInstruction,
  });

  const formattedText = formatReadableText(response.text!.trim());

  return formattedText;
};
