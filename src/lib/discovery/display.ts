import type { DiscoveryProviderName } from "./types";

export function getDiscoveryProviderLabel(
  provider: DiscoveryProviderName
): string {
  switch (provider) {
    case "osm":
      return "OpenStreetMap";
    case "mock":
      return "Mock provider";
  }
}
