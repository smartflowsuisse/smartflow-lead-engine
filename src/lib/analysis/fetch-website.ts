import { WebsiteAnalysisUnavailableError } from "./unavailable";

export const WEBSITE_ANALYSIS_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export const WEBSITE_ANALYSIS_FETCH_TIMEOUT_MS = 15_000;

export interface FetchedWebsite {
  html: string;
  finalUrl: string;
  loadTimeMs: number;
  statusCode: number;
  requestedUrl: string;
}

const KNOWN_HOSTNAME_CORRECTIONS: Record<string, string[]> = {
  "abismetallbau.ch": ["albismetallbau.ch"],
  "www.abismetallbau.ch": ["www.albismetallbau.ch", "albismetallbau.ch"],
};

function parseWebsiteInput(website: string): {
  hostname: string;
  protocol: "http" | "https" | null;
  pathname: string;
} | null {
  const trimmed = website.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`
    );

    return {
      hostname: url.hostname.toLowerCase(),
      protocol: url.protocol === "http:" ? "http" : "https",
      pathname: url.pathname && url.pathname !== "/" ? url.pathname : "/",
    };
  } catch {
    const host = trimmed
      .replace(/^https?:\/\//i, "")
      .split("/")[0]
      ?.toLowerCase();

    if (!host) {
      return null;
    }

    return {
      hostname: host,
      protocol: null,
      pathname: "/",
    };
  }
}

function collectHostnameVariants(hostname: string): string[] {
  const variants = new Set<string>([hostname]);

  if (hostname.startsWith("www.")) {
    variants.add(hostname.slice(4));
  } else {
    variants.add(`www.${hostname}`);
  }

  const corrections = KNOWN_HOSTNAME_CORRECTIONS[hostname] ?? [];
  for (const corrected of corrections) {
    variants.add(corrected);
    if (corrected.startsWith("www.")) {
      variants.add(corrected.slice(4));
    } else {
      variants.add(`www.${corrected}`);
    }
  }

  if (hostname.includes("abismetallbau")) {
    const corrected = hostname.replace("abismetallbau", "albismetallbau");
    variants.add(corrected);
    if (corrected.startsWith("www.")) {
      variants.add(corrected.slice(4));
    } else {
      variants.add(`www.${corrected}`);
    }
  }

  return [...variants];
}

export function buildWebsiteFetchCandidates(website: string): string[] {
  const parsed = parseWebsiteInput(website);
  if (!parsed) {
    return [];
  }

  const candidates: string[] = [];
  const seen = new Set<string>();
  const hostnames = collectHostnameVariants(parsed.hostname);
  const protocols: Array<"http" | "https"> =
    parsed.protocol === "http"
      ? ["http", "https"]
      : parsed.protocol === "https"
        ? ["https", "http"]
        : ["https", "http"];

  const addCandidate = (url: string) => {
    if (!seen.has(url)) {
      seen.add(url);
      candidates.push(url);
    }
  };

  if (
    website.trim().startsWith("http://") ||
    website.trim().startsWith("https://")
  ) {
    addCandidate(website.trim());
  }

  for (const hostname of hostnames) {
    for (const protocol of protocols) {
      addCandidate(`${protocol}://${hostname}${parsed.pathname}`);
    }
  }

  return candidates;
}

function getFetchErrorCode(error: unknown): string | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }

  const cause = (error as Error & { cause?: unknown }).cause;
  if (cause && typeof cause === "object" && cause !== null && "code" in cause) {
    return String((cause as { code: unknown }).code);
  }

  return undefined;
}

export function isRetryableWebsiteFetchError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return true;
  }

  const code = getFetchErrorCode(error);
  const message = error.message.toLowerCase();

  if (
    code === "ENOTFOUND" ||
    code === "ERR_TLS_CERT_ALTNAME_INVALID" ||
    code === "UNABLE_TO_VERIFY_LEAF_SIGNATURE" ||
    code === "CERT_HAS_EXPIRED" ||
    code === "DEPTH_ZERO_SELF_SIGNED_CERT" ||
    code === "ERR_SSL_WRONG_VERSION_NUMBER" ||
    code === "ECONNREFUSED" ||
    code === "ETIMEDOUT"
  ) {
    return true;
  }

  return (
    message.includes("fetch failed") ||
    message.includes("timed out") ||
    message.includes("http 403") ||
    message.includes("http 405") ||
    message.includes("http 503") ||
    message.includes("empty content")
  );
}

async function fetchWebsiteUrl(
  url: string,
  timeoutMs: number
): Promise<FetchedWebsite> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": WEBSITE_ANALYSIS_USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "de-CH,de;q=0.9,en;q=0.8",
      },
      redirect: "follow",
    });

    const loadTimeMs = Date.now() - start;

    if (!response.ok) {
      throw new Error(`Website returned HTTP ${response.status}`);
    }

    const html = await response.text();
    if (!html.trim()) {
      throw new Error("Website returned empty content");
    }

    return {
      html,
      finalUrl: response.url || url,
      loadTimeMs,
      statusCode: response.status,
      requestedUrl: url,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Website request timed out after ${Math.round(timeoutMs / 1000)} seconds`
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchWebsiteForAnalysis(
  website: string,
  timeoutMs = WEBSITE_ANALYSIS_FETCH_TIMEOUT_MS
): Promise<FetchedWebsite> {
  const candidates = buildWebsiteFetchCandidates(website);

  if (candidates.length === 0) {
    throw new WebsiteAnalysisUnavailableError(
      "Website URL is required for analysis"
    );
  }

  let lastError = "Could not fetch website";

  for (const candidate of candidates) {
    try {
      return await fetchWebsiteUrl(candidate, timeoutMs);
    } catch (error) {
      lastError =
        error instanceof Error ? error.message : "Could not fetch website";

      if (!isRetryableWebsiteFetchError(error)) {
        break;
      }
    }
  }

  throw new WebsiteAnalysisUnavailableError(lastError);
}
