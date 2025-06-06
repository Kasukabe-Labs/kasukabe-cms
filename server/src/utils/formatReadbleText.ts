export function formatReadableText(input: string): string {
  return input
    .replace(/\\n\\n/g, "\n\n")
    .replace(/\\n/g, "\n")
    .replace(/^\s*\*\s+/gm, "- ")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\\+/g, "")
    .trim();
}
