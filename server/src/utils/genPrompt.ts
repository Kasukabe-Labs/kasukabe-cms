import { randomWords } from "./words";

export const generateRandomPrompt = (componentType: string): string => {
  const randomIndex = Math.floor(Math.random() * randomWords.length);
  const randomWord = randomWords[randomIndex];
  return `Generate a ${componentType} for a ${randomWord}.`;
};
