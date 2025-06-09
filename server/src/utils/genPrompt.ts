import { randomWords } from "./words";

const componentTemplates = {
  "landing-page": [
    "Create a modern landing page for a {word} startup with hero section, features, and CTA",
    "Design a conversion-focused landing page for a {word} service with testimonials",
    "Build a sleek landing page for a {word} product with pricing tiers",
  ],
  dashboard: [
    "Generate a comprehensive dashboard UI for {word} management with analytics",
    "Create a user dashboard for a {word} platform with charts and metrics",
    "Design an admin dashboard for {word} with data visualization and controls",
  ],
  "features-section": [
    "Create a features section showcasing {word} capabilities with icons and descriptions",
    "Design a feature grid for a {word} app with hover effects and details",
    "Build a comparison table for {word} features with pricing options",
  ],
  "pricing-page": [
    "Design a pricing page for a {word} SaaS with multiple tiers and features",
    "Create a subscription pricing layout for {word} service with popular badges",
    "Build a flexible pricing component for {word} with toggle options",
  ],
  "contact-form": [
    "Create a contact form for a {word} business with validation and modern design",
    "Design a multi-step contact form for {word} services with progress indicator",
    "Build a contact page for {word} with form, map, and contact details",
  ],
  navigation: [
    "Design a responsive navigation bar for a {word} website with dropdown menus",
    "Create a sidebar navigation for a {word} dashboard with icons and categories",
    "Build a mobile-first navigation for {word} app with hamburger menu",
  ],
  "hero-section": [
    "Create a compelling hero section for a {word} platform with call-to-action",
    "Design an animated hero banner for {word} service with background video",
    "Build a conversion-focused hero area for {word} with lead capture form",
  ],
  "card-layout": [
    "Design a card-based layout for {word} content with hover animations",
    "Create a product card grid for {word} marketplace with filters",
    "Build a blog card layout for {word} articles with tags and categories",
  ],
  "login-signup": [
    "Create a modern login/signup form for {word} platform with social auth",
    "Design a multi-step registration process for {word} service",
    "Build a secure authentication UI for {word} with password strength indicator",
  ],
  footer: [
    "Design a comprehensive footer for {word} website with links and social media",
    "Create a minimalist footer for {word} landing page with essential links",
    "Build a newsletter signup footer for {word} with subscription form",
  ],
};

export const generateRandomPrompt = (componentType: string): string => {
  const templates =
    componentTemplates[componentType as keyof typeof componentTemplates];

  if (!templates) {
    // Fallback to generic template if component type not found
    const randomIndex = Math.floor(Math.random() * randomWords.length);
    const randomWord = randomWords[randomIndex];
    return `Generate a ${componentType} UI for a ${randomWord}.`;
  }

  const randomTemplateIndex = Math.floor(Math.random() * templates.length);
  const randomWordIndex = Math.floor(Math.random() * randomWords.length);

  const template = templates[randomTemplateIndex];
  const randomWord = randomWords[randomWordIndex];

  return template.replace("{word}", randomWord);
};
