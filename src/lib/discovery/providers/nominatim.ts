export interface NominatimResult {
  placeId: number;
  osmType: "node" | "way" | "relation";
  osmId: number;
  displayName: string;
  boundingbox: [string, string, string, string];
}

export interface NominatimSearchResult {
  placeId: number;
  name: string;
  displayName: string;
  address: {
    city?: string;
    town?: string;
    municipality?: string;
    village?: string;
    state?: string;
    country_code?: string;
  };
  extratags: Record<string, string>;
  boundingbox: [string, string, string, string];
}

interface NominatimResponseItem {
  place_id: number;
  osm_type: string;
  osm_id: number;
  display_name: string;
  boundingbox: [string, string, string, string];
  class?: string;
  type?: string;
}

interface NominatimSearchResponseItem extends NominatimResponseItem {
  name?: string;
  address?: NominatimSearchResult["address"];
  extratags?: Record<string, string>;
}

function parseOsmType(value: string): NominatimResult["osmType"] | null {
  if (value === "node" || value === "way" || value === "relation") {
    return value;
  }
  return null;
}

export function toOverpassAreaId(
  osmType: NominatimResult["osmType"],
  osmId: number
): number | null {
  if (osmType === "relation") return 3_600_000_000 + osmId;
  if (osmType === "way") return 2_400_000_000 + osmId;
  return null;
}

export function parseNominatimResults(
  payload: NominatimResponseItem[]
): NominatimResult[] {
  const results: NominatimResult[] = [];

  for (const item of payload) {
    const osmType = parseOsmType(item.osm_type);
    if (!osmType) continue;

    results.push({
      placeId: item.place_id,
      osmType,
      osmId: item.osm_id,
      displayName: item.display_name,
      boundingbox: item.boundingbox,
    });
  }

  return results;
}

export function parseNominatimSearchResults(
  payload: NominatimSearchResponseItem[]
): NominatimSearchResult[] {
  const results: NominatimSearchResult[] = [];

  for (const item of payload) {
    if (!item.name?.trim()) continue;

    results.push({
      placeId: item.place_id,
      name: item.name.trim(),
      displayName: item.display_name,
      address: item.address ?? {},
      extratags: item.extratags ?? {},
      boundingbox: item.boundingbox,
    });
  }

  return results;
}

export function buildViewbox(boundingbox: [string, string, string, string]): string {
  const [south, north, west, east] = boundingbox;
  return `${west},${north},${east},${south}`;
}

export async function geocodeSwissCity(
  city: string,
  options: {
    nominatimUrl: string;
    userAgent: string;
  }
): Promise<NominatimResult | null> {
  const url = new URL("/search", options.nominatimUrl);
  url.searchParams.set("city", city.trim());
  url.searchParams.set("country", "Switzerland");
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: {
      "User-Agent": options.userAgent,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Nominatim request failed (${response.status})`);
  }

  const payload = (await response.json()) as NominatimResponseItem[];
  const parsed = parseNominatimResults(payload);
  return parsed[0] ?? null;
}

export async function searchSwissBusinesses(
  query: string,
  location: NominatimResult,
  limit: number,
  options: {
    nominatimUrl: string;
    userAgent: string;
  }
): Promise<NominatimSearchResult[]> {
  const url = new URL("/search", options.nominatimUrl);
  url.searchParams.set("q", query);
  url.searchParams.set("countrycodes", "ch");
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("extratags", "1");
  url.searchParams.set("limit", String(Math.min(limit * 3, 50)));
  url.searchParams.set("viewbox", buildViewbox(location.boundingbox));

  const response = await fetch(url, {
    headers: {
      "User-Agent": options.userAgent,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Nominatim search failed (${response.status})`);
  }

  const payload = (await response.json()) as NominatimSearchResponseItem[];
  return parseNominatimSearchResults(payload);
}
