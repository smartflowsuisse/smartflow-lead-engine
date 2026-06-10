import {
  buildConstructionOverpassQuery,
  isConstructionIndustry,
  matchesConstructionBusinessName,
} from "./industry-tags";
import {
  dedupeCandidates,
  mapOsmElementToCandidate,
  sortCandidatesByWebsite,
  type OsmElement,
} from "./map-osm-element";
import { isWithinBoundingBox } from "./search-filters";
import type { NominatimResult } from "./nominatim";
import type { DiscoveryCandidate } from "../types";

const OVERPASS_FALSE_POSITIVE_PATTERN =
  /\b(job|agency|emploi|recrutement|okjob)\b|atelier.*bois|centre.*bois|mezzanines bois/i;

interface OverpassResponse {
  elements: OsmElement[];
}

function isRelevantConstructionElement(element: OsmElement): boolean {
  const tags = element.tags;
  if (!tags?.name) {
    return false;
  }

  if (OVERPASS_FALSE_POSITIVE_PATTERN.test(tags.name)) {
    return false;
  }

  if (tags.office === "construction") {
    return true;
  }

  const relevantCrafts = new Set([
    "builder",
    "general_contractor",
    "metal_construction",
    "carpenter",
    "roofer",
    "scaffolder",
    "stonemason",
    "concrete",
  ]);

  if (relevantCrafts.has(tags.craft ?? "")) {
    return true;
  }

  return matchesConstructionBusinessName(tags.name);
}

function elementCoordinates(element: OsmElement): { lat: number; lon: number } | null {
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (typeof lat !== "number" || typeof lon !== "number") {
    return null;
  }
  return { lat, lon };
}

export async function searchConstructionViaOverpass(
  location: NominatimResult,
  industry: string,
  city: string,
  limit: number,
  options: {
    overpassUrl: string;
    userAgent: string;
  }
): Promise<DiscoveryCandidate[]> {
  const [south, north, west, east] = location.boundingbox.map(Number);
  const query = buildConstructionOverpassQuery(
    south,
    west,
    north,
    east,
    Math.min(limit * 3, 30)
  );

  const response = await fetch(options.overpassUrl, {
    method: "POST",
    headers: {
      "User-Agent": options.userAgent,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: `data=${encodeURIComponent(query)}`,
    signal: AbortSignal.timeout(20_000),
  });

  if (!response.ok) {
    return [];
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) {
    return [];
  }

  const payload = (await response.json()) as OverpassResponse;
  const mapped: DiscoveryCandidate[] = [];

  for (const element of payload.elements ?? []) {
    if (!isRelevantConstructionElement(element)) {
      continue;
    }

    const coordinates = elementCoordinates(element);
    if (
      coordinates &&
      !isWithinBoundingBox(
        coordinates.lat,
        coordinates.lon,
        location.boundingbox
      )
    ) {
      continue;
    }

    const candidate = mapOsmElementToCandidate(element, industry, city);
    if (candidate) {
      mapped.push(candidate);
    }
  }

  return dedupeCandidates(mapped);
}

export function shouldUseOverpassFallback(
  industry: string,
  resultCount: number,
  minResults: number
): boolean {
  return isConstructionIndustry(industry) && resultCount < minResults;
}

export async function mergeOverpassResults(
  existing: DiscoveryCandidate[],
  overpassResults: DiscoveryCandidate[],
  limit: number
): Promise<DiscoveryCandidate[]> {
  const merged = dedupeCandidates([...existing, ...overpassResults]);
  return sortCandidatesByWebsite(merged).slice(0, limit);
}
