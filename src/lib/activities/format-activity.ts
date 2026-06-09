import type { LeadActivityType } from "../types";

export function formatActivityTitle(type: LeadActivityType): string {
  switch (type) {
    case "analysis_completed":
      return "Analysis completed";
    case "outreach_generated":
      return "Outreach generated";
    case "contacted":
      return "Contacted";
  }
}

export function formatActivityDescription(
  type: LeadActivityType,
  details: Record<string, unknown>
): string {
  switch (type) {
    case "analysis_completed": {
      const score = details.leadScore;
      return typeof score === "number" && score > 0
        ? `Lead score updated to ${score}/100`
        : "Website analysis saved";
    }
    case "outreach_generated": {
      const language = details.language;
      const subject = details.subject;
      const languageLabel =
        language === "fr"
          ? "French"
          : language === "de"
            ? "German"
            : language === "en"
              ? "English"
              : "Unknown language";
      return typeof subject === "string" && subject
        ? `${languageLabel} draft · ${subject}`
        : `${languageLabel} outreach draft created`;
    }
    case "contacted": {
      const language = details.language;
      const languageLabel =
        language === "fr"
          ? "French"
          : language === "de"
            ? "German"
            : language === "en"
              ? "English"
              : null;
      return languageLabel
        ? `Marked as contacted · ${languageLabel} outreach`
        : "Lead moved to Contacted";
    }
  }
}
