export type DiscoveryProviderName = "mock" | "osm";

export interface DiscoveryCandidate {
  company: string;
  /** Empty string when OSM has no website tag. */
  website: string;
  city: string;
  industry: string;
}

export interface DiscoveryQuery {
  industry: string;
  city: string;
  limit: number;
}

export interface DiscoveryResult {
  query: DiscoveryQuery;
  candidates: DiscoveryCandidate[];
  totalFound: number;
  provider: DiscoveryProviderName;
}

export interface DiscoveryProvider {
  name: DiscoveryProviderName;
  discover(query: DiscoveryQuery): Promise<DiscoveryResult>;
}
