import { genAI } from "../config/googleGemini";
import { formatReadableText } from "./formatReadbleText";

export const polishPrompt = async (
  rawPrompt: string,
  componentType: string,
  colors?: string[]
): Promise<string> => {
  const specificInstruction = `Focus on creating a well-designed ${componentType} component with modern UI/UX principles.`;

  const colorInstruction =
    colors && colors.length > 0
      ? `Color Palette: Use these specific colors in your design - ${colors.join(
          ", "
        )}. Incorporate these colors thoughtfully throughout the component.`
      : "";

  const polishingInstruction = `
You are a prompt engineering expert trained to generate highly specific and optimized prompts for modern SaaS-style web UI designs.



Component Type: ${componentType}
Specific Guidelines: ${specificInstruction}
${colorInstruction}

Your goal is to rewrite the raw prompt into a polished and effective instruction for generating modern SaaS-style web UI designs based on the following visual references:

— Think clean, minimal, professional UI/UX like award-winning SaaS tools
— Use modern web design principles: neumorphism, glassmorphism, or clean flat design
— Include design elements appropriate for ${componentType}
— Use subtle shadows, rounded corners, clean typography, and spacious layout
— Color themes can be light or dark depending on tone, but always premium
${
  colors && colors.length > 0
    ? `— IMPORTANT: Use the provided color palette: ${colors.join(", ")}`
    : ""
}
— Output format must be **16:9 landscape**
— No placeholder text like [NAME] or [YOUR LOGO]
— Be concise but rich in visual detail
— Never mention that this is a prompt; just output the final refined prompt
— Focus specifically on ${componentType} requirements and best practices

Always ensure the prompt is written to generate results similar to clean SaaS UI mockups found on sites like Dribbble, Behance, or Awwwards.

Raw prompt: "${rawPrompt}"

Only output the refined prompt with no extra commentary.`;

  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: polishingInstruction,
  });

  const formattedText = formatReadableText(response.text!.trim());

  return formattedText;
};
