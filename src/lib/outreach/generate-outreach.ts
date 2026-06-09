import type { Lead, LeadAnalysis } from "../types";
import { getScoreLabel } from "../scoring";
import {
  OUTREACH_SIGNATURE,
  type OutreachLanguage,
} from "./languages";

export interface OutreachDraftInput {
  company: string;
  city: string | null;
  industry: string | null;
  website: string | null;
  leadScore: number;
  analysisSummary: string | null;
  quickWins: string[];
  automationOpportunities: string[];
}

export interface OutreachDraft {
  subject: string;
  body: string;
  language: OutreachLanguage;
  generatedAt: string;
}

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function extractSummary(rawAnalysis: string): string | null {
  try {
    const parsed = JSON.parse(rawAnalysis) as Record<string, unknown>;
    return typeof parsed.summary === "string" ? parsed.summary : null;
  } catch {
    return null;
  }
}

export function buildOutreachInput(
  lead: Lead,
  analysis?: LeadAnalysis | null
): OutreachDraftInput {
  return {
    company: lead.company,
    city: lead.city,
    industry: lead.industry,
    website: lead.website,
    leadScore: lead.lead_score,
    analysisSummary: analysis ? extractSummary(analysis.raw_analysis) : null,
    quickWins: analysis ? parseJsonArray(analysis.quick_wins) : [],
    automationOpportunities: analysis
      ? parseJsonArray(analysis.automation_opportunities)
      : [],
  };
}

function formatBullets(items: string[], fallback: string): string {
  if (items.length === 0) return fallback;
  return items.map((item) => `• ${item}`).join("\n");
}

function primaryObservation(input: OutreachDraftInput): string {
  if (input.quickWins.length > 0) {
    return input.quickWins[0];
  }

  if (input.analysisSummary) {
    const issuesMatch = input.analysisSummary.match(/Issues found: ([^.]+)/i);
    if (issuesMatch?.[1]) {
      return issuesMatch[1].trim();
    }
    return input.analysisSummary;
  }

  if (input.website) {
    return `your website at ${input.website} has room to capture more qualified inbound leads`;
  }

  return "your online presence could be strengthened to generate more qualified leads";
}

function locationPhrase(input: OutreachDraftInput, language: OutreachLanguage): string {
  const city = input.city ?? "";
  const industry = input.industry ?? "";

  if (language === "fr") {
    if (city && industry) return `${input.company} à ${city} (${industry})`;
    if (city) return `${input.company} à ${city}`;
    if (industry) return `${input.company} (${industry})`;
    return input.company;
  }

  if (language === "de") {
    if (city && industry) return `${input.company} in ${city} (${industry})`;
    if (city) return `${input.company} in ${city}`;
    if (industry) return `${input.company} (${industry})`;
    return input.company;
  }

  if (city && industry) return `${input.company} in ${city} (${industry})`;
  if (city) return `${input.company} in ${city}`;
  if (industry) return `${input.company} (${industry})`;
  return input.company;
}

function scoreLine(input: OutreachDraftInput, language: OutreachLanguage): string {
  const label = input.leadScore > 0 ? getScoreLabel(input.leadScore) : null;

  if (input.leadScore <= 0) {
    if (language === "fr") return "Score d'opportunité : non calculé";
    if (language === "de") return "Opportunity Score: noch nicht berechnet";
    return "Lead opportunity score: not yet calculated";
  }

  if (language === "fr") {
    return `Score d'opportunité : ${input.leadScore}/100 (${label})`;
  }
  if (language === "de") {
    return `Opportunity Score: ${input.leadScore}/100 (${label})`;
  }
  return `Lead opportunity score: ${input.leadScore}/100 (${label})`;
}

function subjectLine(input: OutreachDraftInput, language: OutreachLanguage): string {
  if (language === "fr") {
    if (input.leadScore >= 60) {
      return `SmartFlow Suisse — opportunités concrètes pour le site de ${input.company}`;
    }
    if (input.leadScore > 0) {
      return `SmartFlow Suisse — améliorations digitales pour ${input.company}`;
    }
    return `SmartFlow Suisse — échange rapide avec ${input.company}`;
  }

  if (language === "de") {
    if (input.leadScore >= 60) {
      return `SmartFlow Suisse — konkrete Chancen für die Website von ${input.company}`;
    }
    if (input.leadScore > 0) {
      return `SmartFlow Suisse — digitale Verbesserungen für ${input.company}`;
    }
    return `SmartFlow Suisse — kurzer Austausch mit ${input.company}`;
  }

  if (input.leadScore >= 60) {
    return `SmartFlow Suisse — concrete website opportunities for ${input.company}`;
  }
  if (input.leadScore > 0) {
    return `SmartFlow Suisse — digital improvements for ${input.company}`;
  }
  return `SmartFlow Suisse — quick intro for ${input.company}`;
}

function buildFrenchDraft(input: OutreachDraftInput): string {
  const target = locationPhrase(input, "fr");
  const observation = primaryObservation(input);
  const websiteRef = input.website
    ? `En parcourant ${input.website}, nous avons noté : ${observation}.`
    : `D'après les informations disponibles, ${observation}.`;

  const quickWins = formatBullets(
    input.quickWins.slice(0, 3),
    "• Analyse complète du site pour identifier des gains rapides"
  );
  const opportunities = formatBullets(
    input.automationOpportunities.slice(0, 3),
    "• Formulaires intelligents avec intégration CRM\n• Séquences de relance automatisées\n• Qualification de leads assistée par l'IA"
  );

  const summary = input.analysisSummary
    ? `Résumé d'analyse : ${input.analysisSummary}`
    : "Résumé d'analyse : pas encore disponible — nous pouvons réaliser une revue complète lors d'un premier échange.";

  return [
    "Bonjour,",
    "",
    `Je suis Andrii, fondateur de SmartFlow Suisse. J'ai regardé ${target} et souhaitais partager une observation concrète sur votre présence en ligne.`,
    "",
    websiteRef,
    scoreLine(input, "fr"),
    "",
    summary,
    "",
    "Quick wins identifiés :",
    quickWins,
    "",
    "Opportunités SmartFlow :",
    opportunities,
    "",
    "SmartFlow Suisse aide les entreprises suisses à transformer leur site en un canal de leads plus efficace — avec des formulaires intelligents, des relances automatisées et une meilleure qualification des prospects.",
    "",
    "Seriez-vous disponible pour un appel de 15 minutes cette semaine afin d'explorer ce qui serait le plus pertinent pour votre équipe ?",
    "",
    OUTREACH_SIGNATURE,
  ].join("\n");
}

function buildGermanDraft(input: OutreachDraftInput): string {
  const target = locationPhrase(input, "de");
  const observation = primaryObservation(input);
  const websiteRef = input.website
    ? `Beim Durchsehen von ${input.website} ist uns aufgefallen: ${observation}.`
    : `Nach den verfügbaren Informationen: ${observation}.`;

  const quickWins = formatBullets(
    input.quickWins.slice(0, 3),
    "• Vollständige Website-Analyse zur Identifikation schneller Verbesserungen"
  );
  const opportunities = formatBullets(
    input.automationOpportunities.slice(0, 3),
    "• Intelligente Formulare mit CRM-Integration\n• Automatisierte Follow-up-Sequenzen\n• KI-gestützte Lead-Qualifizierung"
  );

  const summary = input.analysisSummary
    ? `Analyse-Zusammenfassung: ${input.analysisSummary}`
    : "Analyse-Zusammenfassung: noch nicht verfügbar — gerne führen wir beim Erstgespräch eine vollständige Review durch.";

  return [
    "Guten Tag,",
    "",
    `Ich bin Andrii, Gründer von SmartFlow Suisse. Ich habe mir ${target} angesehen und möchte eine konkrete Beobachtung zu Ihrer Online-Präsenz teilen.`,
    "",
    websiteRef,
    scoreLine(input, "de"),
    "",
    summary,
    "",
    "Quick Wins:",
    quickWins,
    "",
    "SmartFlow-Möglichkeiten:",
    opportunities,
    "",
    "SmartFlow Suisse unterstützt Schweizer Unternehmen dabei, ihre Website in einen effektiveren Lead-Kanal zu verwandeln — mit intelligenten Formularen, automatisierten Follow-ups und besserer Lead-Qualifizierung.",
    "",
    "Hätten Sie diese Woche Zeit für ein kurzes 15-minütiges Gespräch, um zu prüfen, welche Verbesserungen für Ihr Team am sinnvollsten wären?",
    "",
    OUTREACH_SIGNATURE,
  ].join("\n");
}

function buildEnglishDraft(input: OutreachDraftInput): string {
  const target = locationPhrase(input, "en");
  const observation = primaryObservation(input);
  const websiteRef = input.website
    ? `While reviewing ${input.website}, we noted: ${observation}.`
    : `Based on the information available, ${observation}.`;

  const quickWins = formatBullets(
    input.quickWins.slice(0, 3),
    "• Run a full website review to identify quick wins"
  );
  const opportunities = formatBullets(
    input.automationOpportunities.slice(0, 3),
    "• Smart contact forms with CRM integration\n• Automated follow-up sequences\n• AI-assisted lead qualification"
  );

  const summary = input.analysisSummary
    ? `Analysis summary: ${input.analysisSummary}`
    : "Analysis summary: not yet available — we can run a full review during a first call.";

  return [
    "Hello,",
    "",
    `I'm Andrii, founder of SmartFlow Suisse. I reviewed ${target} and wanted to share a specific observation about your online presence.`,
    "",
    websiteRef,
    scoreLine(input, "en"),
    "",
    summary,
    "",
    "Quick wins identified:",
    quickWins,
    "",
    "SmartFlow opportunities:",
    opportunities,
    "",
    "SmartFlow Suisse helps Swiss businesses turn their website into a stronger lead channel — with smart forms, automated follow-ups, and better lead qualification.",
    "",
    "Would you be open to a brief 15-minute call this week to explore what would make the most sense for your team?",
    "",
    OUTREACH_SIGNATURE,
  ].join("\n");
}

export function generateOutreachDraft(
  input: OutreachDraftInput,
  language: OutreachLanguage = "fr"
): OutreachDraft {
  const body =
    language === "de"
      ? buildGermanDraft(input)
      : language === "en"
        ? buildEnglishDraft(input)
        : buildFrenchDraft(input);

  return {
    subject: subjectLine(input, language),
    body,
    language,
    generatedAt: new Date().toISOString(),
  };
}
