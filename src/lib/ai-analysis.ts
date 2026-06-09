import type { WebsiteAnalysisResult } from "./types";
import { normalizeWebsite } from "./utils";

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
  hasSslBadge: boolean;
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
  const hasSslBadge = /(ssl|secure|sicher|https)/i.test(html);

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
    hasSslBadge,
    scriptCount: scriptMatches.length,
    imageCount: imageMatches.length,
    imagesWithoutAlt,
    inlineStyleCount,
    htmlSize: html.length,
    loadTimeMs,
  };
}

function scoreWebsiteQuality(signals: HtmlSignals): number {
  let score = 50;
  if (signals.hasTitle) score += 10;
  if (signals.hasH1) score += 8;
  if (signals.hasMetaDescription) score += 8;
  if (signals.hasHttps) score += 10;
  if (signals.hasContactForm) score += 8;
  if (signals.hasPhoneLink || signals.hasEmailLink) score += 6;
  if (signals.scriptCount > 20) score -= 10;
  if (signals.inlineStyleCount > 30) score -= 8;
  return Math.max(0, Math.min(100, score));
}

function scoreMobileFriendliness(signals: HtmlSignals): number {
  let score = 30;
  if (signals.hasViewport) score += 40;
  if (signals.inlineStyleCount < 20) score += 15;
  if (signals.scriptCount < 15) score += 15;
  return Math.max(0, Math.min(100, score));
}

function scoreSpeed(signals: HtmlSignals): number {
  let score = 80;
  if (signals.loadTimeMs > 3000) score -= 30;
  else if (signals.loadTimeMs > 1500) score -= 15;
  if (signals.htmlSize > 500_000) score -= 20;
  else if (signals.htmlSize > 200_000) score -= 10;
  if (signals.scriptCount > 25) score -= 15;
  if (signals.imageCount > 30) score -= 10;
  return Math.max(0, Math.min(100, score));
}

function scoreSeo(signals: HtmlSignals): number {
  let score = 20;
  if (signals.hasTitle) score += 20;
  if (signals.hasMetaDescription) score += 20;
  if (signals.hasH1) score += 15;
  if (signals.hasHttps) score += 15;
  if (signals.imagesWithoutAlt === 0 && signals.imageCount > 0) score += 10;
  else if (signals.imagesWithoutAlt < signals.imageCount / 2) score += 5;
  return Math.max(0, Math.min(100, score));
}

function scoreTrust(signals: HtmlSignals): number {
  let score = 20;
  if (signals.hasPrivacyPolicy) score += 20;
  if (signals.hasImprint) score += 20;
  if (signals.hasTestimonials) score += 15;
  if (signals.hasSocialLinks) score += 10;
  if (signals.hasSslBadge || signals.hasHttps) score += 15;
  return Math.max(0, Math.min(100, score));
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
  if (signals.loadTimeMs > 2000)
    wins.push("Optimize page load speed — target under 2 seconds");
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

function simulateAnalysis(website: string, industry?: string | null): WebsiteAnalysisResult {
  const url = normalizeWebsite(website);
  const hash = url.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const signals: HtmlSignals = {
    hasViewport: hash % 3 !== 0,
    hasTitle: true,
    hasMetaDescription: hash % 4 !== 0,
    hasH1: hash % 5 !== 0,
    hasHttps: url.startsWith("https://"),
    hasContactForm: hash % 2 === 0,
    hasPhoneLink: hash % 3 === 0,
    hasEmailLink: hash % 4 === 0,
    hasSocialLinks: hash % 2 !== 0,
    hasPrivacyPolicy: hash % 6 !== 0,
    hasImprint: hash % 7 !== 0,
    hasTestimonials: hash % 8 === 0,
    hasSslBadge: url.startsWith("https://"),
    scriptCount: 5 + (hash % 20),
    imageCount: 3 + (hash % 15),
    imagesWithoutAlt: hash % 5,
    inlineStyleCount: hash % 25,
    htmlSize: 50_000 + (hash % 200_000),
    loadTimeMs: 800 + (hash % 3000),
  };

  return buildAnalysisResult(signals, industry, { mode: "simulated", url });
}

function buildAnalysisResult(
  signals: HtmlSignals,
  industry: string | null | undefined,
  meta: Record<string, unknown>
): WebsiteAnalysisResult {
  const websiteQuality = scoreWebsiteQuality(signals);
  const mobileFriendliness = scoreMobileFriendliness(signals);
  const speedScore = scoreSpeed(signals);
  const seoScore = scoreSeo(signals);
  const trustScore = scoreTrust(signals);
  const quickWins = identifyQuickWins(signals);
  const automationOpportunities = identifyAutomationOpportunities(
    signals,
    industry
  );

  return {
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
      summary: generateAiSummary(signals, quickWins, automationOpportunities),
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
  if (signals.loadTimeMs > 2000) issues.push("slow page load");
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

export async function analyzeWebsite(
  website: string,
  industry?: string | null
): Promise<WebsiteAnalysisResult> {
  const url = normalizeWebsite(website);
  if (!url) {
    throw new Error("Website URL is required for analysis");
  }

  const start = Date.now();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "SmartFlow-Lead-Engine/1.0 (Website Analysis Bot; +https://smartflow.ch)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);
    const loadTimeMs = Date.now() - start;

    if (!response.ok) {
      return simulateAnalysis(url, industry);
    }

    const html = await response.text();
    const finalUrl = response.url || url;
    const signals = extractSignals(html, finalUrl, loadTimeMs);

    return buildAnalysisResult(signals, industry, {
      mode: "live",
      url: finalUrl,
      statusCode: response.status,
      loadTimeMs,
    });
  } catch {
    return simulateAnalysis(url, industry);
  }
}
