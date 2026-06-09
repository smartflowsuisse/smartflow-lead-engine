import type { DiscoveryProviderName } from "./types";

export function getDiscoveryConfig() {
  const provider: DiscoveryProviderName =
    process.env.DISCOVERY_PROVIDER === "mock" ? "mock" : "osm";

  return {
    enabled: process.env.DISCOVERY_ENABLED !== "false",
    defaultLimit: 10,
    maxLimit: 50,
    provider,
    nominatimUrl:
      process.env.NOMINATIM_URL ?? "https://nominatim.openstreetmap.org",
    userAgent:
      process.env.DISCOVERY_USER_AGENT ??
      "SmartFlow-Lead-Engine/1.0 (local discovery)",
  };
}
