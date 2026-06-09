export const OUTREACH_LANGUAGES = [
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "en", label: "English" },
] as const;

export type OutreachLanguage = (typeof OUTREACH_LANGUAGES)[number]["code"];

export function parseOutreachLanguage(value: unknown): OutreachLanguage {
  if (value === "fr" || value === "de" || value === "en") {
    return value;
  }
  return "fr";
}

export const OUTREACH_SIGNATURE = [
  "Andrii Moroz",
  "Founder, SmartFlow Suisse",
  "info@smartflowsuisse.com",
].join("\n");
