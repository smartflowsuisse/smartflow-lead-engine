const INDUSTRY_SEARCH_TERMS: Record<string, string> = {
  gastro: "restaurant",
  restaurant: "restaurant",
  it: "Informatik",
  immobilien: "Immobilien",
  immobilier: "immobilier",
  construction: "Bauunternehmen",
  electricien: "Elektriker",
  plombier: "Sanitär",
  chauffage: "Heizung",
  wellness: "Wellness",
  "cabinet médical": "cabinet médical",
  "cabinet medical": "cabinet medical",
  retail: "Geschäft",
  hotel: "Hotel",
};

function escapeOverpass(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function buildIndustrySearchTerm(industry: string): string {
  const normalized = industry.trim().toLowerCase();

  if (INDUSTRY_SEARCH_TERMS[normalized]) {
    return INDUSTRY_SEARCH_TERMS[normalized];
  }

  for (const [key, term] of Object.entries(INDUSTRY_SEARCH_TERMS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return term;
    }
  }

  return industry.trim();
}

export function buildNominatimSearchQuery(industry: string, city: string): string {
  const term = buildIndustrySearchTerm(industry);
  return `${term} ${city.trim()}`;
}

export function buildIndustryTagFilters(industry: string): string[] {
  const term = buildIndustrySearchTerm(industry);
  return [`["name"~"${escapeOverpass(term)}",i]`];
}

export function buildOverpassFilterClause(tagFilters: string[]): string {
  if (tagFilters.length === 1) {
    return tagFilters[0];
  }

  const joined = tagFilters
    .map((filter) => filter.slice(1, -1))
    .join("][");

  return `[${joined}]`;
}
