import type { DiscoveryCandidate } from "../types";

export interface OsmElement {
  type: "node" | "way" | "relation";
  id: number;
  tags?: Record<string, string>;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
}

function normalizeWebsite(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return `https://${value}`;
}

export function extractWebsite(tags: Record<string, string>): string {
  const raw =
    tags.website || tags["contact:website"] || tags.url || tags["contact:url"] || "";
  return normalizeWebsite(raw);
}

export function extractCompanyName(tags: Record<string, string>): string {
  return (tags.name || tags.operator || tags.brand || tags["name:de"] || "").trim();
}

export function extractCity(
  tags: Record<string, string>,
  fallbackCity: string
): string {
  return (
    tags["addr:city"] ||
    tags["addr:town"] ||
    tags["addr:place"] ||
    tags["addr:municipality"] ||
    fallbackCity
  ).trim();
}

export function isSwissElement(tags: Record<string, string>): boolean {
  const country = (tags["addr:country"] || tags["is_in:country_code"] || "")
    .trim()
    .toUpperCase();

  if (country === "CH" || country === "CHE") {
    return true;
  }

  return !country;
}

export function mapOsmElementToCandidate(
  element: OsmElement,
  industry: string,
  fallbackCity: string
): DiscoveryCandidate | null {
  const tags = element.tags;
  if (!tags) return null;
  if (!isSwissElement(tags)) return null;

  const company = extractCompanyName(tags);
  if (!company) return null;

  const website = extractWebsite(tags);
  const city = extractCity(tags, fallbackCity);

  return {
    company,
    website,
    city,
    industry: industry.trim(),
  };
}

export function dedupeCandidates(
  candidates: DiscoveryCandidate[]
): DiscoveryCandidate[] {
  const seen = new Set<string>();
  const unique: DiscoveryCandidate[] = [];

  for (const candidate of candidates) {
    const key = `${candidate.company.trim().toLowerCase()}|${candidate.website.trim().toLowerCase()}|${candidate.city.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(candidate);
  }

  return unique;
}

export function sortCandidatesByWebsite(
  candidates: DiscoveryCandidate[]
): DiscoveryCandidate[] {
  return [...candidates].sort((left, right) => {
    const leftScore = left.website ? 1 : 0;
    const rightScore = right.website ? 1 : 0;
    return rightScore - leftScore;
  });
}
