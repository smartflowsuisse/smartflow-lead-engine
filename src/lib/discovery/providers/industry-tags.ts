const INDUSTRY_SEARCH_TERMS: Record<string, string> = {
  gastro: "restaurant",
  restaurant: "restaurant",
  it: "Informatik",
  immobilien: "Immobilien",
  immobilier: "immobilier",
  electricien: "Elektriker",
  plombier: "Sanitär",
  chauffage: "Heizung",
  wellness: "Wellness",
  "cabinet médical": "cabinet médical",
  "cabinet medical": "cabinet medical",
  retail: "Geschäft",
  hotel: "Hotel",
};

const CONSTRUCTION_KEYWORDS = [
  "construction",
  "bau",
  "bauunternehmen",
  "bauunternehmung",
  "generalunternehmer",
  "contractor",
  "entreprise de construction",
  "génie civil",
  "genie civil",
  "bâtiment",
  "batiment",
];

const CONSTRUCTION_NOMINATIM_TERMS = [
  "Bauunternehmung",
  "Bau AG",
  "Bau",
  "Generalunternehmer",
  "construction",
  "entreprise construction",
  "génie civil",
  "Contractor",
];

const CONSTRUCTION_NAME_PATTERN =
  /bau|construction|bâtiment|batiment|génie|genie|generalunternehmer|contractor|baut|charpent|maçon|macon|travaux/i;

function escapeOverpass(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function normalizeIndustry(value: string): string {
  return value.trim().toLowerCase();
}

export function isConstructionIndustry(industry: string): boolean {
  const normalized = normalizeIndustry(industry);
  return CONSTRUCTION_KEYWORDS.some(
    (keyword) =>
      normalized.includes(keyword) || keyword.includes(normalized)
  );
}

export function buildIndustrySearchTerm(industry: string): string {
  const normalized = normalizeIndustry(industry);

  if (isConstructionIndustry(industry)) {
    return "Bauunternehmung";
  }

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

export function buildIndustrySearchQueries(
  industry: string,
  city: string
): string[] {
  const cityName = city.trim();

  if (isConstructionIndustry(industry)) {
    return CONSTRUCTION_NOMINATIM_TERMS.map((term) => `${term} ${cityName}`);
  }

  return [buildNominatimSearchQuery(industry, cityName)];
}

export function buildNominatimSearchQuery(industry: string, city: string): string {
  const term = buildIndustrySearchTerm(industry);
  return `${term} ${city.trim()}`;
}

export function matchesConstructionBusinessName(name: string): boolean {
  return CONSTRUCTION_NAME_PATTERN.test(name);
}

export function buildIndustryTagFilters(industry: string): string[] {
  if (isConstructionIndustry(industry)) {
    return [
      '["office"="construction"]',
      '["craft"="builder"]',
      '["craft"="carpenter"]',
      '["craft"="roofer"]',
      '["craft"="scaffolder"]',
    ];
  }

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

export function buildCantonFallbackQueries(
  industry: string,
  state: string
): string[] {
  if (!isConstructionIndustry(industry) || !state.trim()) {
    return [];
  }

  const canton = state.trim();
  return [
    `Bauunternehmung ${canton}`,
    `construction ${canton}`,
    `entreprise construction ${canton}`,
    `génie civil ${canton}`,
  ];
}

export function buildConstructionOverpassQuery(
  south: number,
  west: number,
  north: number,
  east: number,
  fetchLimit: number
): string {
  return `
    [out:json][timeout:20];
    (
      node["name"]["office"="construction"](${south},${west},${north},${east});
      way["name"]["office"="construction"](${south},${west},${north},${east});
      node["name"]["craft"~"builder|carpenter|roofer|scaffolder|plumber|electrician|hvac|painter|stonemason|concrete|insulation|floorer|heating_engineer|metal_construction|general_contractor"](${south},${west},${north},${east});
      way["name"]["craft"~"builder|carpenter|roofer|scaffolder|plumber|electrician|hvac|painter|stonemason|concrete|insulation|floorer|heating_engineer|metal_construction|general_contractor"](${south},${west},${north},${east});
    );
    out center tags qt ${fetchLimit};
  `.trim();
}
