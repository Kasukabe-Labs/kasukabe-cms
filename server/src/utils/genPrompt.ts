import { randomWords } from "./words";

export const generateRandomPrompt = (): string => {
  const randomIndex = Math.floor(Math.random() * randomWords.length);
  const randomWord = randomWords[randomIndex];
  return `Generate a website for a ${randomWord}.`;
};
