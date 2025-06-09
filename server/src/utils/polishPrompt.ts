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
  componentType: string,
  colors?: string[]
): Promise<string> => {
  const specificInstruction =
    componentSpecificInstructions[
      componentType as keyof typeof componentSpecificInstructions
    ] ||
    `Focus on creating a well-designed ${componentType} component with modern UI/UX principles.`;

  const colorInstruction =
    colors && colors.length > 0
      ? `Color Palette: Use these specific colors in your design - ${colors.join(
          ", "
        )}. Incorporate these colors thoughtfully throughout the component.`
      : "";

  const polishingInstruction = `

You are a prompt engineering assistant trained to convert short, raw one-liner prompts into detailed, vivid, structured design briefs for generating high-quality SaaS-style UI mockups.



Your job is to polish the following raw user prompt into a **comprehensive and specific visual design brief** that could be used by an AI image generator or a UI designer to create a modern, professional mockup.



---



✳️ Component Type: **${componentType}**



🧠 Component-Specific Design Instructions:

${specificInstruction}



🎨 ${colorInstruction ? colorInstruction : ""}



---



✍️ Transform the prompt using this structure:



1. **🧩 Layout & Structure**

- Describe the structure: grid system, sidebar, center content, spacing between elements, header/footer presence, etc.



2. **📦 Key Components**

- List the major UI elements to include, such as charts, sidebars, cards, tables, filters, forms, navbars, etc.



3. **🎨 Color Scheme**

- Suggest colors for background, primary UI accents, typography, and button styles.

${
  colors?.length
    ? `Use this color palette throughout: ${colors.join(", ")}`
    : ""
}



4. **🅰 Typography**

- Specify font style (e.g., Inter, SF Pro, Satoshi), and sizes for headline, subtext, buttons.



5. **⚡️ Interactions & CTA**

- Describe primary CTAs, button placement, hover styles, spacing.



6. **🌌 Visual Style & Effects**

- Mention shadows, rounded corners, glassmorphism, neumorphism, or flat modernism. Keep the tone premium and elegant.



7. **💡 Overall Vibe**

- Describe how it should feel — clean, intelligent, futuristic, focused, minimal. Name similar apps (e.g., Linear, Superhuman, Vercel, Notion).



---



🛑 DO NOT say "this is a prompt" — just output the final polished design brief.

✅ Be creative, highly visual, and detailed.

✅ Format must describe a **16:9 landscape** web layout.

🧠 Write like a senior product designer giving mockup instructions.



---



User's raw prompt:

"${rawPrompt}"



Now generate the full polished prompt.

`;

  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: polishingInstruction,
  });

  const formattedText = formatReadableText(response.text!.trim());

  return formattedText;
};
