import { normalizeWebsite } from "../website";

export interface FetchedPage {
  url: string;
  html: string;
}

const USER_AGENT =
  "SmartFlow-Lead-Engine/1.0 (Contact Discovery Bot; +https://smartflow.ch)";

export async function fetchWebsiteHtml(
  website: string,
  timeoutMs = 10_000
): Promise<FetchedPage | null> {
  const url = normalizeWebsite(website);
  if (!url) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    if (!html.trim()) {
      return null;
    }

    return {
      url: response.url || url,
      html,
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function buildContactPageCandidates(baseUrl: string): string[] {
  const normalized = normalizeWebsite(baseUrl);
  if (!normalized) {
    return [];
  }

  let origin: string;
  try {
    origin = new URL(normalized).origin;
  } catch {
    return [];
  }

  const paths = [
    "/contact",
    "/kontakt",
    "/contact-us",
    "/impressum",
    "/imprint",
    "/about",
    "/about-us",
    "/ueber-uns",
  ];

  return paths.map((path) => `${origin}${path}`);
}
