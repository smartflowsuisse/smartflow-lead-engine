import { getDiscoveryConfig } from "./config";
import { mockProvider } from "./providers/mock-provider";
import type { DiscoveryQuery, DiscoveryResult } from "./types";

export function validateDiscoveryQuery(
  input: Partial<DiscoveryQuery>
): { ok: true; query: DiscoveryQuery } | { ok: false; error: string } {
  const industry = input.industry?.trim() ?? "";
  const city = input.city?.trim() ?? "";
  const config = getDiscoveryConfig();

  if (!industry) {
    return { ok: false, error: "Industry is required" };
  }
  if (!city) {
    return { ok: false, error: "City is required" };
  }

  const rawLimit = Number(input.limit);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(1, Math.floor(rawLimit)), config.maxLimit)
    : config.defaultLimit;

  return {
    ok: true,
    query: { industry, city, limit },
  };
}

export async function runDiscovery(
  input: Partial<DiscoveryQuery>
): Promise<DiscoveryResult> {
  const validated = validateDiscoveryQuery(input);
  if (!validated.ok) {
    throw new Error(validated.error);
  }

  const config = getDiscoveryConfig();
  if (!config.enabled) {
    throw new Error("Discovery is disabled");
  }

  return mockProvider.discover(validated.query);
}
