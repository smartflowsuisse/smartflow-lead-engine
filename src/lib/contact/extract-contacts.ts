import { isContactLikeUrl } from "./contact-paths";
import type { ContactFieldMatch } from "./types";

const EMAIL_PATTERN =
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;

const SWISS_PHONE_PATTERN =
  /(?:\+41|0041|0)\s*(?:\(?0?\)?\s*)?(?:[1-9]\d{1,2})[\s./()-]*\d{3}[\s./()-]*\d{2}[\s./()-]*\d{2}/g;

const BLOCKED_EMAIL_DOMAINS = [
  "example.com",
  "domain.com",
  "email.com",
  "sentry.io",
  "wixpress.com",
  "users.noreply.github.com",
  "w3.org",
  "schema.org",
];

const BLOCKED_EMAIL_PREFIXES = [
  "noreply",
  "no-reply",
  "donotreply",
  "mailer-daemon",
  "postmaster",
  "webmaster",
];

const PREFERRED_EMAIL_LOCALS = [
  "info",
  "contact",
  "office",
  "hello",
  "mail",
  "kontakt",
  "service",
];

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&commat;/gi, "@")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(parseInt(code, 16))
    );
}

function deobfuscateEmailText(text: string): string {
  return text
    .replace(/\s*\[at\]\s*/gi, "@")
    .replace(/\s*\(at\)\s*/gi, "@")
    .replace(/\s+at\s+/gi, "@")
    .replace(/\s*\[dot\]\s*/gi, ".")
    .replace(/\s*\(dot\)\s*/gi, ".")
    .replace(/\s+dot\s+/gi, ".");
}

function normalizeEmail(raw: string): string | null {
  const email = decodeHtmlEntities(deobfuscateEmailText(raw)).trim().toLowerCase();
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
  const value = decodeHtmlEntities(raw).trim().replace(/^tel:/i, "");
  const digits = value.replace(/\D/g, "");

  if (digits.length < 9 || digits.length > 15) {
    return null;
  }

  if (/^(\d)\1{7,}$/.test(digits)) {
    return null;
  }

  if (digits.startsWith("41") && digits.length === 11) {
    const local = digits.slice(2);
    return `+41 ${local.slice(0, 2)} ${local.slice(2, 5)} ${local.slice(5, 7)} ${local.slice(7, 9)}`;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
  }

  return value.replace(/\s+/g, " ").trim() || null;
}

function emailRank(match: ContactFieldMatch): number {
  const local = match.value.split("@")[0] ?? "";
  const preferred = PREFERRED_EMAIL_LOCALS.some(
    (prefix) => local === prefix || local.startsWith(`${prefix}.`)
  );

  return match.confidence + (preferred ? 6 : 0);
}

function pickBestMatch(
  matches: ContactFieldMatch[]
): ContactFieldMatch | null {
  if (matches.length === 0) {
    return null;
  }

  return [...matches].sort((left, right) => emailRank(right) - emailRank(left))[0];
}

function pickBestPhoneMatch(matches: ContactFieldMatch[]): ContactFieldMatch | null {
  if (matches.length === 0) {
    return null;
  }

  return [...matches].sort((left, right) => right.confidence - left.confidence)[0];
}

function isContactPage(pageUrl: string): boolean {
  return isContactLikeUrl(pageUrl);
}

function extractMailtoLinks(html: string, pageUrl: string): ContactFieldMatch[] {
  const matches: ContactFieldMatch[] = [];
  const pattern = /href\s*=\s*["']mailto:([^"'?#]+)/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    const email = normalizeEmail(match[1]);
    if (!email) continue;

    const contactPage = isContactPage(pageUrl);
    matches.push({
      value: email,
      confidence: contactPage ? 92 : 95,
      source: contactPage ? "mailto:contact-page" : "mailto:homepage",
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

    const contactPage = isContactPage(pageUrl);
    matches.push({
      value: phone,
      confidence: contactPage ? 90 : 94,
      source: contactPage ? "tel:contact-page" : "tel:homepage",
    });
  }

  return matches;
}

function extractItempropContacts(
  html: string,
  pageUrl: string
): { emails: ContactFieldMatch[]; phones: ContactFieldMatch[] } {
  const emails: ContactFieldMatch[] = [];
  const phones: ContactFieldMatch[] = [];
  const contactPage = isContactPage(pageUrl);

  const emailPattern =
    /itemprop=["']email["'][^>]*>([^<]+)<|itemprop=["']email["'][^>]*content=["']([^"']+)["']/gi;
  let emailMatch: RegExpExecArray | null;
  while ((emailMatch = emailPattern.exec(html)) !== null) {
    const email = normalizeEmail(emailMatch[1] ?? emailMatch[2] ?? "");
    if (!email) continue;
    emails.push({
      value: email,
      confidence: contactPage ? 86 : 80,
      source: "microdata:email",
    });
  }

  const phonePattern =
    /itemprop=["']telephone["'][^>]*>([^<]+)<|itemprop=["']telephone["'][^>]*content=["']([^"']+)["']/gi;
  let phoneMatch: RegExpExecArray | null;
  while ((phoneMatch = phonePattern.exec(html)) !== null) {
    const phone = normalizePhone(phoneMatch[1] ?? phoneMatch[2] ?? "");
    if (!phone) continue;
    phones.push({
      value: phone,
      confidence: contactPage ? 84 : 78,
      source: "microdata:telephone",
    });
  }

  return { emails, phones };
}

function extractJsonLdContacts(
  html: string,
  pageUrl: string
): { emails: ContactFieldMatch[]; phones: ContactFieldMatch[] } {
  const emails: ContactFieldMatch[] = [];
  const phones: ContactFieldMatch[] = [];
  const contactPage = isContactPage(pageUrl);
  const scriptPattern =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  let scriptMatch: RegExpExecArray | null;
  while ((scriptMatch = scriptPattern.exec(html)) !== null) {
    const block = scriptMatch[1];
    const emailMatches = block.match(/"email"\s*:\s*"([^"]+)"/gi) ?? [];
    for (const raw of emailMatches) {
      const value = raw.match(/"email"\s*:\s*"([^"]+)"/i)?.[1];
      const email = value ? normalizeEmail(value) : null;
      if (!email) continue;
      emails.push({
        value: email,
        confidence: contactPage ? 88 : 82,
        source: "jsonld:email",
      });
    }

    const phoneMatches =
      block.match(/"telephone"\s*:\s*"([^"]+)"/gi) ??
      block.match(/"phone"\s*:\s*"([^"]+)"/gi) ??
      [];
    for (const raw of phoneMatches) {
      const value = raw.match(/"(?:telephone|phone)"\s*:\s*"([^"]+)"/i)?.[1];
      const phone = value ? normalizePhone(value) : null;
      if (!phone) continue;
      phones.push({
        value: phone,
        confidence: contactPage ? 86 : 80,
        source: "jsonld:telephone",
      });
    }
  }

  return { emails, phones };
}

function extractRegexEmails(html: string, pageUrl: string): ContactFieldMatch[] {
  const text = deobfuscateEmailText(
    decodeHtmlEntities(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<[^>]+>/g, " "))
  );
  const matches: ContactFieldMatch[] = [];
  const found = text.match(EMAIL_PATTERN) ?? [];
  const contactPage = isContactPage(pageUrl);
  const footerHint = /footer|impressum|kontakt|contact|datenschutz/i.test(
    html.slice(0, 5000) + html.slice(-5000)
  );

  for (const raw of found) {
    const email = normalizeEmail(raw);
    if (!email) continue;

    matches.push({
      value: email,
      confidence: contactPage ? 78 : footerHint ? 72 : 58,
      source: contactPage ? "text:contact-page" : "text:homepage",
    });
  }

  return matches;
}

function extractRegexPhones(html: string, pageUrl: string): ContactFieldMatch[] {
  const text = decodeHtmlEntities(html.replace(/<[^>]+>/g, " "));
  const matches: ContactFieldMatch[] = [];
  const found = text.match(SWISS_PHONE_PATTERN) ?? [];
  const contactPage = isContactPage(pageUrl);

  for (const raw of found) {
    const phone = normalizePhone(raw);
    if (!phone) continue;

    matches.push({
      value: phone,
      confidence: contactPage ? 76 : 62,
      source: contactPage ? "text:contact-page" : "text:homepage",
    });
  }

  return matches;
}

export function extractContactPageLinksFromHtml(
  html: string,
  pageUrl: string
): string[] {
  const links = new Set<string>();
  const linkPattern = /href\s*=\s*["']([^"'#]+)["']/gi;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(html)) !== null) {
    try {
      const resolved = new URL(match[1], pageUrl).href;
      if (isContactLikeUrl(resolved)) {
        links.add(resolved);
      }
    } catch {
      continue;
    }
  }

  return [...links];
}

export function extractContactsFromHtml(
  html: string,
  pageUrl: string
): {
  email: ContactFieldMatch | null;
  phone: ContactFieldMatch | null;
  contactPageUrl: string | null;
} {
  const itemprop = extractItempropContacts(html, pageUrl);
  const jsonLd = extractJsonLdContacts(html, pageUrl);

  const emailMatches = [
    ...extractMailtoLinks(html, pageUrl),
    ...itemprop.emails,
    ...jsonLd.emails,
    ...extractRegexEmails(html, pageUrl),
  ];
  const phoneMatches = [
    ...extractTelLinks(html, pageUrl),
    ...itemprop.phones,
    ...jsonLd.phones,
    ...extractRegexPhones(html, pageUrl),
  ];

  const contactPageUrl = detectContactPageUrl(html, pageUrl);

  return {
    email: pickBestMatch(emailMatches),
    phone: pickBestPhoneMatch(phoneMatches),
    contactPageUrl,
  };
}

function detectContactPageUrl(html: string, pageUrl: string): string | null {
  if (isContactLikeUrl(pageUrl)) {
    return pageUrl;
  }

  const linked = extractContactPageLinksFromHtml(html, pageUrl);
  if (linked.length > 0) {
    const preferred =
      linked.find((url) => /contact|kontakt/i.test(url)) ??
      linked.find((url) => /impressum|imprint/i.test(url)) ??
      linked[0];
    return preferred ?? null;
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
    email: pickHigherEmail(current.email, next.email),
    phone: pickHigherPhone(current.phone, next.phone),
    contactPageUrl: current.contactPageUrl ?? next.contactPageUrl,
  };
}

function pickHigherEmail(
  left: ContactFieldMatch | null,
  right: ContactFieldMatch | null
): ContactFieldMatch | null {
  if (!left) return right;
  if (!right) return left;
  return emailRank(right) > emailRank(left) ? right : left;
}

function pickHigherPhone(
  left: ContactFieldMatch | null,
  right: ContactFieldMatch | null
): ContactFieldMatch | null {
  if (!left) return right;
  if (!right) return left;
  return right.confidence > left.confidence ? right : left;
}
