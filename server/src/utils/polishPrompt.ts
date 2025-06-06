import { genAI } from "../config/googleGemini";

export const polishPrompt = async (rawPrompt: string): Promise<string> => {
  const polishingInstruction = `
You are a prompt engineering expert. Your task is to take the raw prompt below and rewrite it into a clear, detailed, and well-structured instruction that an AI can easily understand and execute.

Requirements:
- Make the prompt more specific and actionable
- Add necessary context and details
- Structure it logically
- Keep it concise but comprehensive
- Remove any unnecessary explanations or meta-commentary
- Focus only on the core request

Raw prompt: "${rawPrompt}"

Respond with ONLY the polished prompt. Do not include any explanations, introductions, or additional commentary.`;

  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: polishingInstruction,
  });

  return response.text!.trim();
};
