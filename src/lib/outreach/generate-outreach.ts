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


function localizeFrenchOutreachText(value: string): string {
  const cleaned = value.trim();
  const normalized = cleaned.replace(/[.!?]+$/, "");

  const translations: Record<string, string> = {
    "Add a clear H1 heading for page structure and SEO":
      "Ajouter un titre H1 clair pour améliorer la structure de la page et le SEO",
    "Add Impressum/legal notice (required for Swiss businesses)":
      "Ajouter une page Impressum ou mentions légales afin de renforcer la confiance en Suisse",
    "AI chatbot for 24/7 lead qualification and appointment booking":
      "Mettre en place un assistant IA pour qualifier les demandes et faciliter la prise de rendez-vous",
    "Website modernization with performance-optimized tech stack":
      "Moderniser le site avec une base technique plus rapide et plus maintenable",
    "Lead scoring dashboard with automated outreach prioritization":
      "Mettre en place un tableau de bord pour prioriser automatiquement les prospects",
    "Add meta description to improve search click-through rate":
      "Ajouter une méta-description pour améliorer le taux de clic depuis les résultats de recherche",
    "Add a contact form to capture inbound leads":
      "Ajouter un formulaire de contact pour capter les demandes entrantes",
    "Add privacy policy page (required in Switzerland/EU)":
      "Ajouter une page de politique de confidentialité adaptée au contexte suisse et européen",
    "Smart contact form with CRM integration and auto-response emails":
      "Mettre en place un formulaire intelligent connecté au CRM avec réponse automatique par email",
  };

  if (translations[cleaned]) {
    return translations[cleaned];
  }

  if (translations[normalized]) {
    return translations[normalized];
  }

  if (cleaned.includes("AI Website Analysis")) {
    return "le site dispose de bases solides, avec plusieurs opportunités concrètes d'amélioration sur la structure, la confiance et la conversion.";
  }

  if (cleaned.includes("HTTPS enabled")) {
    return "le site dispose de bases techniques correctes, mais certaines améliorations peuvent renforcer la confiance et la conversion.";
  }

  return cleaned;
}

function localizeFrenchScoreLabel(label: string | null): string {
  if (!label) return "non qualifié";

  const translations: Record<string, string> = {
    "High Priority": "haute priorité",
    "Qualified": "qualifié",
    "Nurture": "à développer",
  };

  return translations[label] ?? label;
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
    return `Score d'opportunité : ${input.leadScore}/100 (${localizeFrenchScoreLabel(label)})`;
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
  const observation = localizeFrenchOutreachText(primaryObservation(input));
  const websiteRef = input.website
    ? `En parcourant ${input.website}, nous avons noté : ${observation}.`
    : `D'après les informations disponibles, ${observation}.`;

  const quickWins = formatBullets(
    input.quickWins.map(localizeFrenchOutreachText).slice(0, 3),
    "• Analyse complète du site pour identifier des gains rapides"
  );
  const opportunities = formatBullets(
    input.automationOpportunities.map(localizeFrenchOutreachText).slice(0, 3),
    "• Formulaires intelligents avec intégration CRM\n• Séquences de relance automatisées\n• Qualification de leads assistée par l'IA"
  );

  const summary = input.analysisSummary
    ? `Résumé d'analyse : ${localizeFrenchOutreachText(input.analysisSummary)}`
    : "Résumé d'analyse : pas encore disponible — nous pouvons faire une première revue rapide si cela vous intéresse.";

  return [
    "Bonjour,",
    "",
    `Je m'appelle Andrii Moroz, fondateur de SmartFlow Suisse. En regardant ${target}, j'ai relevé quelques points concrets qui pourraient améliorer votre présence en ligne.`,
    "",
    websiteRef,
    scoreLine(input, "fr"),
    "",
    summary,
    "",
    "Points d'amélioration possibles :",
    quickWins,
    "",
    "Pistes possibles :",
    opportunities,
    "",
    "SmartFlow Suisse accompagne les PME suisses dans l'amélioration de leur site, de leur suivi des demandes et de leurs processus de contact.",
    "",
    "Seriez-vous ouvert à un court échange de 15 minutes cette semaine pour voir si ces pistes peuvent être utiles pour votre entreprise ?",
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
    `Mein Name ist Andrii Moroz, Gründer von SmartFlow Suisse. Ich habe mir ${target} angesehen und möchte eine konkrete Beobachtung zu Ihrer Online-Präsenz teilen.`,
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
    `My name is Andrii Moroz, founder of SmartFlow Suisse. I reviewed ${target} and wanted to share a specific observation about your online presence.`,
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

export function formatOutreachEmailForCopy(draft: OutreachDraft): string {
  return `Subject: ${draft.subject}\n\n${draft.body}`;
}

export interface OutreachMailtoInput {
  recipient?: string | null;
  subject: string;
  body: string;
}

function encodeMailtoQueryValue(value: string): string {
  // encodeURIComponent uses %20 for spaces; URLSearchParams uses "+" which
  // many mail clients render literally in subject/body fields.
  return encodeURIComponent(value);
}

export function buildOutreachMailtoLink(input: OutreachMailtoInput): string {
  const recipient = input.recipient?.trim() ?? "";
  const queryParts: string[] = [];

  if (input.subject) {
    queryParts.push(`subject=${encodeMailtoQueryValue(input.subject)}`);
  }

  if (input.body) {
    queryParts.push(`body=${encodeMailtoQueryValue(input.body)}`);
  }

  const query = queryParts.join("&");
  if (!recipient) {
    return query ? `mailto:?${query}` : "mailto:";
  }

  return query ? `mailto:${recipient}?${query}` : `mailto:${recipient}`;
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
