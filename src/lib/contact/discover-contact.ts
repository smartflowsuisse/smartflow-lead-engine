import {
  buildContactPageCandidates,
  fetchWebsiteHtml,
} from "./fetch-website-html";
import { extractContactsFromHtml, mergeContactDiscovery } from "./extract-contacts";
import type { ContactDiscoveryResult } from "./types";

const MAX_CONTACT_PAGES = 3;

export async function discoverContactFromWebsite(
  website: string
): Promise<ContactDiscoveryResult> {
  const pagesCrawled: string[] = [];
  let merged = {
    email: null as ContactDiscoveryResult["email"],
    phone: null as ContactDiscoveryResult["phone"],
    contactPageUrl: null as string | null,
  };

  const homepage = await fetchWebsiteHtml(website);
  if (!homepage) {
    return {
      email: null,
      phone: null,
      contactPageUrl: null,
      pagesCrawled,
    };
  }

  pagesCrawled.push(homepage.url);
  merged = mergeContactDiscovery(
    merged,
    extractContactsFromHtml(homepage.html, homepage.url)
  );

  const candidateUrls = buildContactPageCandidates(homepage.url);
  let crawledContactPages = 0;

  for (const candidateUrl of candidateUrls) {
    if (crawledContactPages >= MAX_CONTACT_PAGES) {
      break;
    }

    if (pagesCrawled.includes(candidateUrl)) {
      continue;
    }

    if (
      merged.email &&
      merged.phone &&
      merged.contactPageUrl &&
      merged.email.confidence >= 90 &&
      merged.phone.confidence >= 90
    ) {
      break;
    }

    const page = await fetchWebsiteHtml(candidateUrl, 8_000);
    if (!page) {
      continue;
    }

    pagesCrawled.push(page.url);
    crawledContactPages += 1;
    merged = mergeContactDiscovery(
      merged,
      extractContactsFromHtml(page.html, page.url)
    );
  }

  return {
    email: merged.email,
    phone: merged.phone,
    contactPageUrl: merged.contactPageUrl,
    pagesCrawled,
  };
}
