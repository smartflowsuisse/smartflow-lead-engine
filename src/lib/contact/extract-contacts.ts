import type { ContactFieldMatch } from "./types";

const EMAIL_PATTERN =
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

const SWISS_PHONE_PATTERN =
  /(?:\+41|0041|0)\s*(?:\(?0?\)?\s*)?(?:[1-9]\d{1,2})[\s./-]?\d{3}[\s./-]?\d{2}[\s./-]?\d{2}/g;

const BLOCKED_EMAIL_DOMAINS = [
  "example.com",
  "domain.com",
  "email.com",
  "sentry.io",
  "wixpress.com",
  "users.noreply.github.com",
];

const BLOCKED_EMAIL_PREFIXES = ["noreply", "no-reply", "donotreply", "mailer-daemon"];

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    );
}

function normalizeEmail(raw: string): string | null {
  const email = decodeHtmlEntities(raw).trim().toLowerCase();
  if (!email.includes("@")) {
    return null;
  }

  const [local, domain] = email.split("@");
  if (!local || !domain || domain.includes("..")) {
    return null;
  }

  if (BLOCKED_EMAIL_PREFIXES.some((prefix) => local.startsWith(prefix))) {
    return null;
  }

  if (BLOCKED_EMAIL_DOMAINS.some((blocked) => domain.endsWith(blocked))) {
    return null;
  }

  if (/\.(png|jpg|jpeg|gif|svg|webp|css|js)$/i.test(domain)) {
    return null;
  }

  return email;
}

function normalizePhone(raw: string): string | null {
  const cleaned = decodeHtmlEntities(raw)
    .replace(/[^\d+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const digits = cleaned.replace(/\D/g, "");
  if (digits.length < 9 || digits.length > 15) {
    return null;
  }

  if (/^(\d)\1{7,}$/.test(digits)) {
    return null;
  }

  return cleaned.replace(/\s/g, " ").trim() || null;
}

function pickBestMatch(
  matches: ContactFieldMatch[]
): ContactFieldMatch | null {
  if (matches.length === 0) {
    return null;
  }

  return [...matches].sort((left, right) => right.confidence - left.confidence)[0];
}

function extractMailtoLinks(html: string, pageUrl: string): ContactFieldMatch[] {
  const matches: ContactFieldMatch[] = [];
  const pattern = /href\s*=\s*["']mailto:([^"'?#]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    const email = normalizeEmail(match[1]);
    if (!email) continue;

    const isContactPage = /contact|kontakt|impressum|imprint|about/i.test(pageUrl);
    matches.push({
      value: email,
      confidence: isContactPage ? 92 : 95,
      source: isContactPage ? "mailto:contact-page" : "mailto:homepage",
    });
  }

  return matches;
}

function extractTelLinks(html: string, pageUrl: string): ContactFieldMatch[] {
  const matches: ContactFieldMatch[] = [];
  const pattern = /href\s*=\s*["']tel:([^"']+)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    const phone = normalizePhone(match[1]);
    if (!phone) continue;

    const isContactPage = /contact|kontakt|impressum|imprint|about/i.test(pageUrl);
    matches.push({
      value: phone,
      confidence: isContactPage ? 90 : 94,
      source: isContactPage ? "tel:contact-page" : "tel:homepage",
    });
  }

  return matches;
}

function extractRegexEmails(html: string, pageUrl: string): ContactFieldMatch[] {
  const text = decodeHtmlEntities(html.replace(/<[^>]+>/g, " "));
  const matches: ContactFieldMatch[] = [];
  const found = text.match(EMAIL_PATTERN) ?? [];

  for (const raw of found) {
    const email = normalizeEmail(raw);
    if (!email) continue;

    const inFooter = /footer|impressum|kontakt|contact/i.test(html.slice(0, 5000) + html.slice(-5000));
    const isContactPage = /contact|kontakt|impressum|imprint|about/i.test(pageUrl);

    matches.push({
      value: email,
      confidence: isContactPage ? 78 : inFooter ? 72 : 58,
      source: isContactPage ? "text:contact-page" : "text:homepage",
    });
  }

  return matches;
}

function extractRegexPhones(html: string, pageUrl: string): ContactFieldMatch[] {
  const text = decodeHtmlEntities(html.replace(/<[^>]+>/g, " "));
  const matches: ContactFieldMatch[] = [];
  const found = text.match(SWISS_PHONE_PATTERN) ?? [];

  for (const raw of found) {
    const phone = normalizePhone(raw);
    if (!phone) continue;

    const isContactPage = /contact|kontakt|impressum|imprint|about/i.test(pageUrl);

    matches.push({
      value: phone,
      confidence: isContactPage ? 76 : 62,
      source: isContactPage ? "text:contact-page" : "text:homepage",
    });
  }

  return matches;
}

export function extractContactsFromHtml(
  html: string,
  pageUrl: string
): {
  email: ContactFieldMatch | null;
  phone: ContactFieldMatch | null;
  contactPageUrl: string | null;
} {
  const emailMatches = [
    ...extractMailtoLinks(html, pageUrl),
    ...extractRegexEmails(html, pageUrl),
  ];
  const phoneMatches = [
    ...extractTelLinks(html, pageUrl),
    ...extractRegexPhones(html, pageUrl),
  ];

  const contactPageUrl = detectContactPageUrl(html, pageUrl);

  return {
    email: pickBestMatch(emailMatches),
    phone: pickBestMatch(phoneMatches),
    contactPageUrl,
  };
}

function detectContactPageUrl(html: string, pageUrl: string): string | null {
  if (/contact|kontakt|impressum|imprint|about/i.test(pageUrl)) {
    return pageUrl;
  }

  const linkPattern =
    /href\s*=\s*["']([^"']*(?:contact|kontakt|impressum|imprint)[^"']*)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], pageUrl).href;
      if (/contact|kontakt|impressum|imprint/i.test(resolved)) {
        return resolved;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export function mergeContactDiscovery(
  current: {
    email: ContactFieldMatch | null;
    phone: ContactFieldMatch | null;
    contactPageUrl: string | null;
  },
  next: {
    email: ContactFieldMatch | null;
    phone: ContactFieldMatch | null;
    contactPageUrl: string | null;
  }
): {
  email: ContactFieldMatch | null;
  phone: ContactFieldMatch | null;
  contactPageUrl: string | null;
} {
  return {
    email: pickHigherConfidence(current.email, next.email),
    phone: pickHigherConfidence(current.phone, next.phone),
    contactPageUrl: current.contactPageUrl ?? next.contactPageUrl,
  };
}

function pickHigherConfidence(
  left: ContactFieldMatch | null,
  right: ContactFieldMatch | null
): ContactFieldMatch | null {
  if (!left) return right;
  if (!right) return left;
  return right.confidence > left.confidence ? right : left;
}
