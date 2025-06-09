import { genAI } from "../config/googleGemini";
import { formatReadableText } from "./formatReadbleText";

const componentSpecificInstructions = {
  "landing-page":
    "Focus on hero sections, value propositions, social proof, and strong CTAs. Include header navigation, hero banner, features section, testimonials, and footer.",
  dashboard:
    "Emphasize data visualization, charts, metrics cards, navigation sidebar, and clean information hierarchy. Include analytics widgets and user-friendly controls.",
  "features-section":
    "Create feature grids with icons, benefit-focused copy, and visual hierarchy. Use cards or tiles with hover effects and clear value propositions.",
  "pricing-page":
    "Include pricing tiers, feature comparisons, popular badges, and clear CTAs. Make pricing transparent with toggle options for billing periods.",
  "contact-form":
    "Design user-friendly forms with proper validation, clear labels, and submission feedback. Include contact information and location if relevant.",
  navigation:
    "Create intuitive navigation with clear hierarchy, responsive design, and proper mobile experience. Include search and user account elements.",
  "hero-section":
    "Focus on compelling headlines, sub-headlines, CTAs, and background visuals. Make it conversion-focused with clear value proposition.",
  "card-layout":
    "Design clean card components with consistent spacing, hover effects, and clear content hierarchy. Ensure responsive grid layouts.",
  "login-signup":
    "Create secure, user-friendly authentication forms with social login options, password requirements, and clear error handling.",
  footer:
    "Include essential links, contact information, social media, newsletter signup, and legal links. Keep it organized and accessible.",
};

export const polishPrompt = async (
  rawPrompt: string,
  componentType: string
): Promise<string> => {
  const specificInstruction =
    componentSpecificInstructions[
      componentType as keyof typeof componentSpecificInstructions
    ] ||
    `Focus on creating a well-designed ${componentType} component with modern UI/UX principles.`;

  const polishingInstruction = `
You are a prompt engineering expert trained to generate highly specific and optimized prompts for modern SaaS-style web UI designs.

Component Type: ${componentType}
Specific Guidelines: ${specificInstruction}

Your goal is to rewrite the raw prompt into a polished and effective instruction for generating modern SaaS-style web UI designs based on the following visual references:

— Think clean, minimal, professional UI/UX like award-winning SaaS tools
— Use modern web design principles: neumorphism, glassmorphism, or clean flat design
— Include design elements appropriate for ${componentType}
— Use subtle shadows, rounded corners, clean typography, and spacious layout
— Color themes can be light or dark depending on tone, but always premium
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
