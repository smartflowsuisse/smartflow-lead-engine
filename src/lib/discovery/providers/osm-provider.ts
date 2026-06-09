import {
  dedupeCandidates,
  extractWebsite,
  sortCandidatesByWebsite,
} from "./map-osm-element";
import { buildNominatimSearchQuery } from "./industry-tags";
import {
  geocodeSwissCity,
  searchSwissBusinesses,
  type NominatimSearchResult,
} from "./nominatim";
import { getDiscoveryConfig } from "../config";
import type {
  DiscoveryCandidate,
  DiscoveryProvider,
  DiscoveryQuery,
  DiscoveryResult,
} from "../types";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function matchesCity(resultCity: string, queryCity: string): boolean {
  const left = normalize(resultCity);
  const right = normalize(queryCity);
  return left.includes(right) || right.includes(left);
}

function extractResultCity(result: NominatimSearchResult, fallbackCity: string): string {
  return (
    result.address.city ||
    result.address.town ||
    result.address.municipality ||
    result.address.village ||
    fallbackCity
  ).trim();
}

export function mapNominatimSearchResultToCandidate(
  result: NominatimSearchResult,
  industry: string,
  queryCity: string
): DiscoveryCandidate | null {
  if (result.address.country_code && result.address.country_code !== "ch") {
    return null;
  }

  const city = extractResultCity(result, queryCity);
  if (!matchesCity(city, queryCity)) {
    return null;
  }

  return {
    company: result.name,
    website: extractWebsite(result.extratags),
    city,
    industry: industry.trim(),
  };
}

export const osmProvider: DiscoveryProvider = {
  name: "osm",

  async discover(query: DiscoveryQuery): Promise<DiscoveryResult> {
    const config = getDiscoveryConfig();
    const limit = Math.min(
      Math.max(1, query.limit || config.defaultLimit),
      config.maxLimit
    );
    const industry = query.industry.trim();
    const city = query.city.trim();

    const location = await geocodeSwissCity(city, {
      nominatimUrl: config.nominatimUrl,
      userAgent: config.userAgent,
    });

    if (!location) {
      return {
        query: { industry, city, limit },
        candidates: [],
        totalFound: 0,
        provider: "osm",
      };
    }

    const searchQuery = buildNominatimSearchQuery(industry, city);
    const results = await searchSwissBusinesses(searchQuery, location, limit, {
      nominatimUrl: config.nominatimUrl,
      userAgent: config.userAgent,
    });

    const mapped = results
      .map((result) =>
        mapNominatimSearchResultToCandidate(result, industry, city)
      )
      .filter((candidate): candidate is DiscoveryCandidate => Boolean(candidate));

    const unique = dedupeCandidates(mapped);
    const sorted = sortCandidatesByWebsite(unique);

    return {
      query: { industry, city, limit },
      candidates: sorted.slice(0, limit),
      totalFound: sorted.length,
      provider: "osm",
    };
  },
};
