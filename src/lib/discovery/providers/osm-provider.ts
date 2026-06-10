import {
  dedupeCandidates,
  extractWebsite,
  sortCandidatesByWebsite,
} from "./map-osm-element";
import { buildIndustrySearchQueries, buildCantonFallbackQueries, prefersCantonBeforeOverpass, shouldUseRegionalFallback } from "./industry-tags";
import {
  mergeOverpassResults,
  searchConstructionViaOverpass,
  shouldUseOverpassFallback,
} from "./overpass-search";
import {
  geocodeSwissCity,
  searchSwissBusinessesMultiple,
  type NominatimSearchResult,
  type NominatimResult,
} from "./nominatim";
import {
  isLikelyBusinessResult,
  matchesCity,
  matchesRegion,
} from "./search-filters";
import { getDiscoveryConfig } from "../config";
import type {
  DiscoveryCandidate,
  DiscoveryProvider,
  DiscoveryQuery,
  DiscoveryResult,
} from "../types";

export function mapNominatimSearchResultToCandidate(
  result: NominatimSearchResult,
  industry: string,
  queryCity: string,
  location: NominatimResult,
  options: { regionalFallback?: boolean } = {}
): DiscoveryCandidate | null {
  if (result.address.country_code && result.address.country_code !== "ch") {
    return null;
  }

  if (!isLikelyBusinessResult(result, industry)) {
    return null;
  }

  const inArea = options.regionalFallback
    ? matchesRegion(result, queryCity, location)
    : matchesCity(result, queryCity, location);

  if (!inArea) {
    return null;
  }

  const city =
    result.address.city ||
    result.address.town ||
    result.address.municipality ||
    result.address.village ||
    queryCity;

  return {
    company: result.name,
    website: extractWebsite(result.extratags),
    city: city.trim(),
    industry: industry.trim(),
  };
}

async function mergeCantonResults(
  unique: DiscoveryCandidate[],
  sorted: DiscoveryCandidate[],
  industry: string,
  city: string,
  location: NominatimResult,
  limit: number,
  config: ReturnType<typeof getDiscoveryConfig>
): Promise<DiscoveryCandidate[]> {
  if (!location.state) {
    return sorted;
  }

  const cantonQueries = buildCantonFallbackQueries(industry, location.state);
  const cantonResults = await searchSwissBusinessesMultiple(
    cantonQueries,
    location,
    limit,
    {
      nominatimUrl: config.nominatimUrl,
      userAgent: config.userAgent,
      restrictToViewbox: false,
    }
  );

  const cantonMapped = cantonResults
    .map((result) =>
      mapNominatimSearchResultToCandidate(result, industry, city, location, {
        regionalFallback: true,
      })
    )
    .filter((candidate): candidate is DiscoveryCandidate => Boolean(candidate));

  return sortCandidatesByWebsite(dedupeCandidates([...unique, ...cantonMapped]));
}

async function mergeOverpassConstructionResults(
  sorted: DiscoveryCandidate[],
  industry: string,
  city: string,
  location: NominatimResult,
  limit: number,
  config: ReturnType<typeof getDiscoveryConfig>
): Promise<DiscoveryCandidate[]> {
  const overpassResults = await searchConstructionViaOverpass(
    location,
    industry,
    city,
    limit,
    {
      overpassUrl: config.overpassUrl,
      userAgent: config.userAgent,
    }
  );

  return mergeOverpassResults(sorted, overpassResults, limit);
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

    const searchQueries = buildIndustrySearchQueries(industry, city);
    const results = await searchSwissBusinessesMultiple(
      searchQueries,
      location,
      limit,
      {
        nominatimUrl: config.nominatimUrl,
        userAgent: config.userAgent,
      }
    );

    const mapped = results
      .map((result) =>
        mapNominatimSearchResultToCandidate(result, industry, city, location)
      )
      .filter((candidate): candidate is DiscoveryCandidate => Boolean(candidate));

    let unique = dedupeCandidates(mapped);
    let sorted = sortCandidatesByWebsite(unique);
    const minResults = Math.min(3, limit);
    const cantonFirst = prefersCantonBeforeOverpass(location.state);

    const applyCantonFallback = async () => {
      if (!shouldUseRegionalFallback(industry, unique.length, minResults)) {
        return;
      }

      sorted = await mergeCantonResults(
        unique,
        sorted,
        industry,
        city,
        location,
        limit,
        config
      );
      unique = sorted;
    };

    const applyOverpassFallback = async () => {
      if (!shouldUseOverpassFallback(industry, unique.length, minResults)) {
        return;
      }

      try {
        sorted = await mergeOverpassConstructionResults(
          sorted,
          industry,
          city,
          location,
          limit,
          config
        );
        unique = sorted;
      } catch (error) {
        console.error("Overpass construction fallback failed:", error);
      }
    };

    if (cantonFirst) {
      await applyCantonFallback();
      await applyOverpassFallback();
    } else {
      await applyOverpassFallback();
      await applyCantonFallback();
    }

    return {
      query: { industry, city, limit },
      candidates: sorted.slice(0, limit),
      totalFound: unique.length,
      provider: "osm",
    };
  },
};
