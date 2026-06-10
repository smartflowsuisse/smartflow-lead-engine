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
  "entreprise construction",
  "génie civil",
  "construction",
  "Bauunternehmung",
  "Bau AG",
  "Bau",
  "Generalunternehmer",
  "Contractor",
];

const REAL_ESTATE_KEYWORDS = [
  "immobilien",
  "immobilier",
  "real estate",
  "realty",
  "estate agent",
  "agence immobilière",
  "agence immobiliere",
];

const REAL_ESTATE_NOMINATIM_TERMS = [
  "immobilier",
  "Immobilien",
  "agence immobilière",
  "real estate",
  "estate agent",
];

const CONSTRUCTION_NAME_PATTERN =
  /bau|construction|bâtiment|batiment|génie|genie|generalunternehmer|contractor|baut|charpent|maçon|macon|travaux/i;

const REAL_ESTATE_NAME_PATTERN =
  /immobilier|immobilien|real[\s-]?estate|estate agent|comptoir immobilier|fiduciaire/i;

const CONSTRUCTION_FALSE_POSITIVE_PATTERN =
  /\b(job|agency|emploi|recrutement|okjob)\b|atelier.*bois|centre.*bois|mezzanines bois/i;

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

export function isRealEstateIndustry(industry: string): boolean {
  const normalized = normalizeIndustry(industry);
  return REAL_ESTATE_KEYWORDS.some(
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

  if (isRealEstateIndustry(industry)) {
    return REAL_ESTATE_NOMINATIM_TERMS.map((term) => `${term} ${cityName}`);
  }

  return [buildNominatimSearchQuery(industry, cityName)];
}

export function buildNominatimSearchQuery(industry: string, city: string): string {
  const term = buildIndustrySearchTerm(industry);
  return `${term} ${city.trim()}`;
}

export function matchesConstructionBusinessName(name: string): boolean {
  if (CONSTRUCTION_FALSE_POSITIVE_PATTERN.test(name)) {
    return false;
  }

  return CONSTRUCTION_NAME_PATTERN.test(name);
}

export function matchesRealEstateBusinessName(name: string): boolean {
  return REAL_ESTATE_NAME_PATTERN.test(name);
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
  if (!state.trim()) {
    return [];
  }

  const canton = state.trim();

  if (isConstructionIndustry(industry)) {
    return [
      `entreprise construction ${canton}`,
      `construction ${canton}`,
      `génie civil ${canton}`,
      `Bauunternehmung ${canton}`,
    ];
  }

  if (isRealEstateIndustry(industry)) {
    return [
      `immobilier ${canton}`,
      `Immobilien ${canton}`,
      `agence immobilière ${canton}`,
    ];
  }

  return [];
}

const ROMANDIE_CANTONS = new Set([
  "genève",
  "geneva",
  "vaud",
  "valais",
  "neuchâtel",
  "neuchatel",
  "jura",
  "fribourg",
  "freiburg",
]);

export function prefersCantonBeforeOverpass(state: string | null): boolean {
  if (!state) {
    return false;
  }

  return ROMANDIE_CANTONS.has(state.trim().toLowerCase());
}

export function shouldUseRegionalFallback(
  industry: string,
  resultCount: number,
  minResults: number
): boolean {
  return (
    (isConstructionIndustry(industry) || isRealEstateIndustry(industry)) &&
    resultCount < minResults
  );
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
