import { enrichAnalysisWithAi } from "./ai/enrich-analysis";
import { fetchWebsiteForAnalysis } from "./analysis/fetch-website";
import { WebsiteAnalysisUnavailableError } from "./analysis/unavailable";
import {
  calculateLeadScore,
  calculateWebsiteQualityScore,
} from "./scoring";
import type { LeadAnalysisContext, WebsiteAnalysisResult } from "./types";

interface HtmlSignals {
  hasViewport: boolean;
  hasTitle: boolean;
  hasMetaDescription: boolean;
  hasH1: boolean;
  hasHttps: boolean;
  hasContactForm: boolean;
  hasPhoneLink: boolean;
  hasEmailLink: boolean;
  hasSocialLinks: boolean;
  hasPrivacyPolicy: boolean;
  hasImprint: boolean;
  hasTestimonials: boolean;
  scriptCount: number;
  imageCount: number;
  imagesWithoutAlt: number;
  inlineStyleCount: number;
  htmlSize: number;
  loadTimeMs: number;
}

function extractSignals(html: string, url: string, loadTimeMs: number): HtmlSignals {
  const hasViewport =
    /name\s*=\s*["']viewport["']/i.test(html) ||
    /content\s*=\s*["'][^"']*width\s*=\s*device-width/i.test(html);

  const hasTitle = /<title[^>]*>.+<\/title>/is.test(html);
  const hasMetaDescription = /name\s*=\s*["']description["']/i.test(html);
  const hasH1 = /<h1[\s>]/i.test(html);
  const hasHttps = url.startsWith("https://");

  const hasContactForm =
    /<form[^>]*>/i.test(html) &&
    (/(contact|kontakt|anfrage|message|email|submit)/i.test(html) ||
      /type\s*=\s*["']email["']/i.test(html));

  const hasPhoneLink = /href\s*=\s*["']tel:/i.test(html);
  const hasEmailLink = /href\s*=\s*["']mailto:/i.test(html);

  const hasSocialLinks =
    /(facebook|linkedin|instagram|twitter|x\.com|youtube)/i.test(html);

  const hasPrivacyPolicy =
    /(privacy|datenschutz|politique de confidentialité)/i.test(html);
  const hasImprint =
    /(impressum|imprint|mentions légales|legal notice)/i.test(html);

  const hasTestimonials =
    /(testimonial|review|kundenstimme|avis client|referenz)/i.test(html);

  const scriptMatches = html.match(/<script/gi) ?? [];
  const imageMatches = html.match(/<img/gi) ?? [];
  const imagesWithoutAlt = (html.match(/<img(?![^>]*alt\s*=)/gi) ?? []).length;
  const inlineStyleCount = (html.match(/style\s*=/gi) ?? []).length;

  return {
    hasViewport,
    hasTitle,
    hasMetaDescription,
    hasH1,
    hasHttps,
    hasContactForm,
    hasPhoneLink,
    hasEmailLink,
    hasSocialLinks,
    hasPrivacyPolicy,
    hasImprint,
    hasTestimonials,
    scriptCount: scriptMatches.length,
    imageCount: imageMatches.length,
    imagesWithoutAlt,
    inlineStyleCount,
    htmlSize: html.length,
    loadTimeMs,
  };
}

function scoreWebsiteQuality(signals: HtmlSignals): number {
  let score = 20;
  if (signals.hasTitle) score += 10;
  if (signals.hasH1) score += 8;
  if (signals.hasMetaDescription) score += 6;
  if (signals.hasHttps) score += 10;
  if (signals.hasContactForm) score += 6;
  if (signals.hasPhoneLink || signals.hasEmailLink) score += 5;
  if (signals.scriptCount > 20) score -= 10;
  if (signals.inlineStyleCount > 30) score -= 8;
  return Math.max(0, Math.min(80, score));
}

function scoreMobileFriendliness(signals: HtmlSignals): number {
  if (!signals.hasViewport) {
    return Math.max(0, Math.min(35, 15 + (signals.scriptCount < 20 ? 5 : 0)));
  }

  let score = 25;
  score += 30;
  if (signals.inlineStyleCount < 20) score += 10;
  if (signals.scriptCount < 15) score += 10;
  return Math.max(0, Math.min(70, score));
}

function scoreSpeed(): number | null {
  // HTML fetch time is not a reliable page-speed metric.
  return null;
}

function scoreSeo(signals: HtmlSignals): number {
  let score = 10;
  if (signals.hasTitle) score += 15;
  if (signals.hasMetaDescription) score += 15;
  if (signals.hasH1) score += 12;
  if (signals.hasHttps) score += 12;
  if (signals.imagesWithoutAlt === 0 && signals.imageCount > 0) score += 8;
  else if (signals.imagesWithoutAlt < signals.imageCount / 2) score += 4;
  return Math.max(0, Math.min(75, score));
}

function scoreTrust(signals: HtmlSignals): number {
  let score = 10;
  if (signals.hasPrivacyPolicy) score += 18;
  if (signals.hasImprint) score += 18;
  if (signals.hasTestimonials) score += 12;
  if (signals.hasSocialLinks) score += 8;
  if (signals.hasHttps) score += 10;
  return Math.max(0, Math.min(75, score));
}

function identifyQuickWins(signals: HtmlSignals): string[] {
  const wins: string[] = [];
  if (!signals.hasViewport)
    wins.push("Add responsive viewport meta tag for mobile compatibility");
  if (!signals.hasMetaDescription)
    wins.push("Add meta description to improve search click-through rate");
  if (!signals.hasContactForm)
    wins.push("Add a contact form to capture inbound leads");
  if (!signals.hasHttps)
    wins.push("Enable HTTPS/SSL certificate for trust and SEO");
  if (signals.imagesWithoutAlt > 0)
    wins.push(`Add alt text to ${signals.imagesWithoutAlt} images for accessibility and SEO`);
  if (!signals.hasH1)
    wins.push("Add a clear H1 heading for page structure and SEO");
  if (!signals.hasPrivacyPolicy)
    wins.push("Add privacy policy page (required in Switzerland/EU)");
  if (!signals.hasImprint)
    wins.push("Add Impressum/legal notice (required for Swiss businesses)");
  if (signals.loadTimeMs > 2000) {
    wins.push(
      "Page HTML took over 2 seconds to load — full performance audit recommended"
    );
  }
  return wins;
}

function identifyAutomationOpportunities(
  signals: HtmlSignals,
  industry?: string | null
): string[] {
  const opportunities: string[] = [];

  if (!signals.hasContactForm) {
    opportunities.push(
      "Smart contact form with CRM integration and auto-response emails"
    );
  }

  if (!signals.hasTestimonials) {
    opportunities.push(
      "Automated review collection and testimonial display system"
    );
  }

  opportunities.push(
    "AI chatbot for 24/7 lead qualification and appointment booking"
  );

  if (signals.scriptCount > 15) {
    opportunities.push(
      "Website modernization with performance-optimized tech stack"
    );
  }

  if (industry?.match(/retail|e-commerce|shop|handel/i)) {
    opportunities.push(
      "Inventory sync and automated order notification workflows"
    );
  }

  if (industry?.match(/restaurant|hotel|gastro|tourism/i)) {
    opportunities.push(
      "Online booking system with automated confirmation and reminders"
    );
  }

  if (industry?.match(/consult|agency|dienstleistung|service/i)) {
    opportunities.push(
      "Proposal generator and automated follow-up email sequences"
    );
  }

  opportunities.push(
    "Lead scoring dashboard with automated outreach prioritization"
  );

  return [...new Set(opportunities)].slice(0, 6);
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractPageExcerpt(html: string, maxChars = 8000): string {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim();
  const metaDescription = html
    .match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1]
    ?.trim();
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.trim();
  const bodyText = stripHtml(html).slice(0, Math.max(0, maxChars - 500));

  return [title, metaDescription, h1, bodyText].filter(Boolean).join("\n\n").slice(0, maxChars);
}

function buildAnalysisResult(
  signals: HtmlSignals,
  industry: string | null | undefined,
  meta: Record<string, unknown>
): WebsiteAnalysisResult {
  const websiteQuality = scoreWebsiteQuality(signals);
  const mobileFriendliness = scoreMobileFriendliness(signals);
  const speedScore = scoreSpeed();
  const seoScore = scoreSeo(signals);
  const trustScore = scoreTrust(signals);
  const quickWins = identifyQuickWins(signals);
  const automationOpportunities = identifyAutomationOpportunities(
    signals,
    industry
  );

  const result: WebsiteAnalysisResult = {
    websiteQuality,
    mobileFriendliness,
    speedScore,
    seoScore,
    hasContactForm: signals.hasContactForm,
    trustScore,
    quickWins,
    automationOpportunities,
    details: {
      ...meta,
      signals,
      speedUnavailableReason:
        "Real page speed requires browser metrics — not measured in this analysis",
      summary: generateAiSummary(signals, quickWins, automationOpportunities),
    },
  };

  return {
    ...result,
    details: {
      ...result.details,
      websiteQualityScore: calculateWebsiteQualityScore(result),
      opportunityScore: calculateLeadScore(result),
    },
  };
}

function generateAiSummary(
  signals: HtmlSignals,
  quickWins: string[],
  automationOpportunities: string[]
): string {
  const issues: string[] = [];
  if (!signals.hasViewport) issues.push("missing mobile viewport");
  if (!signals.hasMetaDescription) issues.push("no meta description");
  if (!signals.hasContactForm) issues.push("no contact form detected");
  if (signals.loadTimeMs > 2000) {
    issues.push("slow HTML response time");
  }
  if (!signals.hasPrivacyPolicy) issues.push("missing privacy policy");

  const strengths: string[] = [];
  if (signals.hasHttps) strengths.push("HTTPS enabled");
  if (signals.hasContactForm) strengths.push("contact form present");
  if (signals.hasTestimonials) strengths.push("social proof elements found");

  return [
    `AI Website Analysis for SmartFlow Suisse:`,
    strengths.length
      ? `Strengths: ${strengths.join(", ")}.`
      : "Limited trust and conversion elements detected.",
    issues.length
      ? `Issues found: ${issues.join(", ")}.`
      : "Core website fundamentals look solid.",
    `${quickWins.length} quick wins and ${automationOpportunities.length} SmartFlow automation opportunities identified.`,
  ].join(" ");
}

async function finalizeAnalysis(
  result: WebsiteAnalysisResult,
  context: LeadAnalysisContext,
  signals: HtmlSignals,
  pageExcerpt?: string
): Promise<WebsiteAnalysisResult> {
  return enrichAnalysisWithAi(
    result,
    {
      company: context.company,
      city: context.city,
      industry: context.industry ?? null,
      website: context.website,
    },
    signals as unknown as Record<string, unknown>,
    pageExcerpt
  );
}

export async function analyzeWebsite(
  website: string,
  industry?: string | null,
  context: LeadAnalysisContext = {}
): Promise<WebsiteAnalysisResult> {
  if (!website.trim()) {
    throw new Error("Website URL is required for analysis");
  }

  try {
    const fetched = await fetchWebsiteForAnalysis(website);
    const leadContext: LeadAnalysisContext = {
      ...context,
      website: fetched.finalUrl,
      industry: context.industry ?? industry ?? null,
    };

    const signals = extractSignals(
      fetched.html,
      fetched.finalUrl,
      fetched.loadTimeMs
    );
    const heuristic = buildAnalysisResult(signals, industry, {
      mode: "live",
      url: fetched.finalUrl,
      requestedUrl: fetched.requestedUrl,
      statusCode: fetched.statusCode,
      loadTimeMs: fetched.loadTimeMs,
    });

    return finalizeAnalysis(
      heuristic,
      leadContext,
      signals,
      extractPageExcerpt(fetched.html)
    );
  } catch (error) {
    if (error instanceof WebsiteAnalysisUnavailableError) {
      throw error;
    }

    throw new WebsiteAnalysisUnavailableError(
      error instanceof Error ? error.message : "Could not fetch website"
    );
  }
}
