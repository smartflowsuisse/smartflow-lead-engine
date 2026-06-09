import { getDiscoveryConfig } from "../config";
import type {
  DiscoveryProvider,
  DiscoveryQuery,
  DiscoveryResult,
} from "../types";
import { MOCK_SWISS_COMPANIES } from "./mock-data";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function matchesField(value: string, query: string): boolean {
  if (!query) return true;
  return normalize(value).includes(normalize(query));
}

export const mockProvider: DiscoveryProvider = {
  name: "mock",

  async discover(query: DiscoveryQuery): Promise<DiscoveryResult> {
    const config = getDiscoveryConfig();
    const limit = Math.min(
      Math.max(1, query.limit || config.defaultLimit),
      config.maxLimit
    );

    const filtered = MOCK_SWISS_COMPANIES.filter(
      (company) =>
        matchesField(company.city, query.city) &&
        matchesField(company.industry, query.industry)
    );

    return {
      query: {
        industry: query.industry.trim(),
        city: query.city.trim(),
        limit,
      },
      candidates: filtered.slice(0, limit),
      totalFound: filtered.length,
      provider: "mock",
    };
  },
};
