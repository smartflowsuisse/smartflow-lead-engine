export interface DiscoveryCandidate {
  company: string;
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
  provider: "mock";
}

export interface DiscoveryProvider {
  name: string;
  discover(query: DiscoveryQuery): Promise<DiscoveryResult>;
}
