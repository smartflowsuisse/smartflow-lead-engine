import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildIndustrySearchQueries,
  buildIndustrySearchTerm,
  buildIndustryTagFilters,
  buildNominatimSearchQuery,
  buildOverpassFilterClause,
  isConstructionIndustry,
  isRealEstateIndustry,
  matchesConstructionBusinessName,
  matchesRealEstateBusinessName,
} from "../providers/industry-tags";
import {
  dedupeCandidates,
  extractCompanyName,
  extractWebsite,
  mapOsmElementToCandidate,
  sortCandidatesByWebsite,
} from "../providers/map-osm-element";
import {
  buildViewbox,
  parseNominatimResults,
  parseNominatimSearchResults,
  toOverpassAreaId,
} from "../providers/nominatim";
import { mapNominatimSearchResultToCandidate } from "../providers/osm-provider";
import {
  isLikelyBusinessResult,
  isWithinBoundingBox,
  matchesCity,
} from "../providers/search-filters";
import { shouldUseOverpassFallback } from "../providers/overpass-search";

const zurichLocation = {
  placeId: 1,
  osmType: "relation" as const,
  osmId: 12345,
  displayName: "Zürich, Switzerland",
  boundingbox: ["47.3202187", "47.4346662", "8.4480061", "8.6254413"] as [
    string,
    string,
    string,
    string,
  ],
  state: "Zürich",
  lat: 47.3744489,
  lon: 8.5410422,
};

describe("buildIndustrySearchTerm", () => {
  it("maps gastro to restaurant search term", () => {
    assert.equal(buildIndustrySearchTerm("Gastro"), "restaurant");
  });

  it("maps construction terms to Bauunternehmung", () => {
    assert.equal(buildIndustrySearchTerm("Construction"), "Bauunternehmung");
    assert.equal(buildIndustrySearchTerm("Bau"), "Bauunternehmung");
    assert.equal(buildIndustrySearchTerm("Bauunternehmen"), "Bauunternehmung");
  });

  it("falls back to the raw industry for unknown categories", () => {
    assert.equal(buildIndustrySearchTerm("Florist"), "Florist");
  });
});

describe("isConstructionIndustry", () => {
  it("detects construction-related industries", () => {
    assert.equal(isConstructionIndustry("Construction"), true);
    assert.equal(isConstructionIndustry("Bauunternehmen"), true);
    assert.equal(isConstructionIndustry("Generalunternehmer"), true);
    assert.equal(isConstructionIndustry("Entreprise de construction"), true);
    assert.equal(isConstructionIndustry("Gastro"), false);
  });
});

describe("buildIndustrySearchQueries", () => {
  it("returns multiple queries for construction industries", () => {
    const queries = buildIndustrySearchQueries("Construction", "Lausanne");
    assert.ok(queries.length >= 5);
    assert.ok(queries.some((query) => query.includes("Bauunternehmung")));
    assert.ok(queries.some((query) => query.includes("Bau AG")));
  });

  it("returns a single query for non-construction industries", () => {
    assert.deepEqual(buildIndustrySearchQueries("Gastro", "Zürich"), [
      "restaurant Zürich",
    ]);
  });

  it("returns multiple queries for real-estate industries", () => {
    const queries = buildIndustrySearchQueries("Immobilien", "Genève");
    assert.ok(queries.length >= 3);
    assert.ok(queries.some((query) => query.includes("immobilier")));
    assert.ok(queries.some((query) => query.includes("Immobilien")));
  });
});

describe("buildNominatimSearchQuery", () => {
  it("builds a city-scoped Swiss search query", () => {
    assert.equal(
      buildNominatimSearchQuery("Gastro", "Zürich"),
      "restaurant Zürich"
    );
  });
});

describe("buildIndustryTagFilters", () => {
  it("builds construction overpass tag filters", () => {
    const filters = buildIndustryTagFilters("Construction");
    assert.match(filters.join(" "), /construction/);
    assert.match(filters.join(" "), /builder/);
  });

  it("builds a name filter for non-construction industries", () => {
    const filters = buildIndustryTagFilters("IT");
    assert.match(filters[0], /Informatik/i);
  });
});

describe("buildOverpassFilterClause", () => {
  it("combines multiple tag filters", () => {
    const clause = buildOverpassFilterClause([
      '["office"="estate_agent"]',
      '["shop"="estate_agent"]',
    ]);
    assert.match(clause, /office/);
    assert.match(clause, /shop/);
  });
});

describe("matchesConstructionBusinessName", () => {
  it("matches common construction company names", () => {
    assert.equal(matchesConstructionBusinessName("Neubag Bauunternehmung"), true);
    assert.equal(matchesConstructionBusinessName("Bau- & Holzwerker AG"), true);
    assert.equal(matchesConstructionBusinessName("Restaurant Konshi"), false);
  });

  it("rejects common false positives in Geneva", () => {
    assert.equal(matchesConstructionBusinessName("AtelierBois sarl"), false);
    assert.equal(matchesConstructionBusinessName("Okjob agency job"), false);
  });
});

describe("matchesRealEstateBusinessName", () => {
  it("matches real-estate company names", () => {
    assert.equal(matchesRealEstateBusinessName("Comptoir Immobilier"), true);
    assert.equal(
      matchesRealEstateBusinessName("PLAFIDA IMMOBILIER SA"),
      true
    );
    assert.equal(matchesRealEstateBusinessName("Restaurant Konshi"), false);
  });
});

describe("isLikelyBusinessResult", () => {
  it("excludes construction sites and government offices", () => {
    assert.equal(
      isLikelyBusinessResult(
        {
          placeId: 1,
          name: "Chantier Gare de Lausanne",
          displayName: "Chantier, Lausanne",
          class: "landuse",
          type: "construction",
          lat: 46.5,
          lon: 6.6,
          address: { city: "Lausanne", country_code: "ch" },
          extratags: {},
          boundingbox: ["46.4", "46.6", "6.5", "6.7"],
        },
        "Construction"
      ),
      false
    );

    assert.equal(
      isLikelyBusinessResult(
        {
          placeId: 2,
          name: "Neubag Bauunternehmung",
          displayName: "Neubag, Zürich",
          class: "office",
          type: "company",
          lat: 47.37,
          lon: 8.54,
          address: { city: "Zürich", country_code: "ch" },
          extratags: {},
          boundingbox: ["47.3", "47.4", "8.4", "8.6"],
        },
        "Construction"
      ),
      true
    );

    assert.equal(
      isLikelyBusinessResult(
        {
          placeId: 3,
          name: "China Construction Bank",
          displayName: "China Construction Bank, Zürich",
          class: "office",
          type: "company",
          lat: 47.37,
          lon: 8.54,
          address: { city: "Zürich", country_code: "ch" },
          extratags: {},
          boundingbox: ["47.3", "47.4", "8.4", "8.6"],
        },
        "Bauunternehmen"
      ),
      false
    );

    assert.equal(
      isLikelyBusinessResult(
        {
          placeId: 4,
          name: "Construction spatiale aux troisième et quatrième dimensions",
          displayName: "Construction spatiale, Genève",
          class: "tourism",
          type: "artwork",
          lat: 46.2,
          lon: 6.14,
          address: { city: "Genève", country_code: "ch" },
          extratags: {},
          boundingbox: ["46.1", "46.3", "6.1", "6.2"],
        },
        "Construction"
      ),
      false
    );
  });

  it("accepts real-estate agencies and rejects libraries", () => {
    assert.equal(
      isLikelyBusinessResult(
        {
          placeId: 5,
          name: "Comptoir Immobilier",
          displayName: "Comptoir Immobilier, Genève",
          class: "shop",
          type: "estate_agent",
          lat: 46.2,
          lon: 6.14,
          address: { city: "Genève", country_code: "ch" },
          extratags: {},
          boundingbox: ["46.1", "46.3", "6.1", "6.2"],
        },
        "Immobilien"
      ),
      true
    );

    assert.equal(
      isLikelyBusinessResult(
        {
          placeId: 6,
          name: "Bibliothèque de l'immobilier",
          displayName: "Bibliothèque de l'immobilier, Genève",
          class: "amenity",
          type: "library",
          lat: 46.2,
          lon: 6.14,
          address: { city: "Genève", country_code: "ch" },
          extratags: {},
          boundingbox: ["46.1", "46.3", "6.1", "6.2"],
        },
        "Immobilien"
      ),
      false
    );
  });
});

describe("matchesCity", () => {
  it("accepts results within the city bounding box", () => {
    assert.equal(
      matchesCity(
        {
          placeId: 1,
          name: "Meier-Ehrensperger AG",
          displayName: "Meier-Ehrensperger AG, Zürich",
          class: "craft",
          type: "builder",
          lat: 47.37,
          lon: 8.54,
          address: {},
          extratags: {},
          boundingbox: ["47.3", "47.4", "8.4", "8.6"],
        },
        "Zürich",
        zurichLocation
      ),
      true
    );
  });
});

describe("isWithinBoundingBox", () => {
  it("checks coordinates against nominatim bounding boxes", () => {
    assert.equal(
      isWithinBoundingBox(47.37, 8.54, zurichLocation.boundingbox),
      true
    );
  });
});

describe("shouldUseOverpassFallback", () => {
  it("enables fallback for sparse construction results", () => {
    assert.equal(shouldUseOverpassFallback("Construction", 0, 3), true);
    assert.equal(shouldUseOverpassFallback("Gastro", 0, 3), false);
    assert.equal(shouldUseOverpassFallback("Construction", 5, 3), false);
  });
});

describe("mapOsmElementToCandidate", () => {
  it("maps OSM tags to a discovery candidate", () => {
    const candidate = mapOsmElementToCandidate(
      {
        type: "node",
        id: 1,
        tags: {
          name: "Restaurant Kronenhalle",
          website: "https://kronenhalle.ch",
          "addr:city": "Zürich",
          "addr:country": "CH",
        },
      },
      "Gastro",
      "Zürich"
    );

    assert.ok(candidate);
    assert.equal(candidate.company, "Restaurant Kronenhalle");
    assert.equal(candidate.website, "https://kronenhalle.ch");
    assert.equal(candidate.city, "Zürich");
    assert.equal(candidate.industry, "Gastro");
  });

  it("rejects non-Swiss elements with explicit country", () => {
    const candidate = mapOsmElementToCandidate(
      {
        type: "node",
        id: 2,
        tags: {
          name: "Paris Cafe",
          "addr:country": "FR",
        },
      },
      "Gastro",
      "Paris"
    );

    assert.equal(candidate, null);
  });
});

describe("mapNominatimSearchResultToCandidate", () => {
  it("maps nominatim search results to discovery candidates", () => {
    const candidate = mapNominatimSearchResultToCandidate(
      {
        placeId: 1,
        name: "Konshi",
        displayName: "Konshi, Zürich, Switzerland",
        class: "amenity",
        type: "restaurant",
        lat: 47.37,
        lon: 8.54,
        address: {
          city: "Zürich",
          country_code: "ch",
        },
        extratags: {
          website: "https://konshi-zuerich.ch/",
        },
        boundingbox: ["47.3", "47.4", "8.4", "8.6"],
      },
      "Gastro",
      "Zürich",
      zurichLocation
    );

    assert.ok(candidate);
    assert.equal(candidate.company, "Konshi");
    assert.equal(candidate.website, "https://konshi-zuerich.ch/");
    assert.equal(candidate.city, "Zürich");
  });

  it("filters out results outside the requested city", () => {
    const candidate = mapNominatimSearchResultToCandidate(
      {
        placeId: 2,
        name: "Geneva Restaurant",
        displayName: "Geneva Restaurant, Genève, Switzerland",
        class: "amenity",
        type: "restaurant",
        lat: 46.2,
        lon: 6.14,
        address: {
          city: "Genève",
          country_code: "ch",
        },
        extratags: {},
        boundingbox: ["46.2", "46.3", "6.1", "6.2"],
      },
      "Gastro",
      "Zürich",
      zurichLocation
    );

    assert.equal(candidate, null);
  });
});

describe("extractWebsite", () => {
  it("normalizes bare domains", () => {
    assert.equal(
      extractWebsite({ website: "example.ch" }),
      "https://example.ch"
    );
  });
});

describe("extractCompanyName", () => {
  it("prefers name over operator", () => {
    assert.equal(
      extractCompanyName({ name: "CloudTech AG", operator: "Other" }),
      "CloudTech AG"
    );
  });
});

describe("dedupeCandidates", () => {
  it("removes duplicate company records", () => {
    const unique = dedupeCandidates([
      {
        company: "CloudTech AG",
        website: "https://cloudtech.ch",
        city: "Zürich",
        industry: "IT",
      },
      {
        company: "CloudTech AG",
        website: "https://cloudtech.ch",
        city: "Zürich",
        industry: "IT",
      },
    ]);

    assert.equal(unique.length, 1);
  });
});

describe("sortCandidatesByWebsite", () => {
  it("prioritizes candidates with websites", () => {
    const sorted = sortCandidatesByWebsite([
      {
        company: "No Site GmbH",
        website: "",
        city: "Bern",
        industry: "IT",
      },
      {
        company: "With Site AG",
        website: "https://withsite.ch",
        city: "Bern",
        industry: "IT",
      },
    ]);

    assert.equal(sorted[0]?.company, "With Site AG");
  });
});

describe("parseNominatimResults", () => {
  it("parses relation results for area lookup", () => {
    const parsed = parseNominatimResults([
      {
        place_id: 1,
        osm_type: "relation",
        osm_id: 12345,
        display_name: "Zürich, Switzerland",
        boundingbox: ["47.2", "47.5", "8.4", "8.7"],
        lat: "47.37",
        lon: "8.54",
        address: { state: "Zürich" },
      },
    ]);

    assert.equal(parsed[0]?.osmType, "relation");
    assert.equal(parsed[0]?.state, "Zürich");
    assert.equal(toOverpassAreaId("relation", 12345), 3_600_012_345);
  });
});

describe("parseNominatimSearchResults", () => {
  it("parses business search results with extratags", () => {
    const parsed = parseNominatimSearchResults([
      {
        place_id: 1,
        osm_type: "node",
        osm_id: 99,
        display_name: "Konshi, Zürich, Switzerland",
        boundingbox: ["47.3", "47.4", "8.4", "8.6"],
        class: "amenity",
        type: "restaurant",
        lat: "47.37",
        lon: "8.54",
        name: "Konshi",
        address: { city: "Zürich", country_code: "ch" },
        extratags: { website: "https://konshi-zuerich.ch/" },
      },
    ]);

    assert.equal(parsed[0]?.name, "Konshi");
    assert.equal(parsed[0]?.extratags.website, "https://konshi-zuerich.ch/");
    assert.equal(parsed[0]?.class, "amenity");
  });
});

describe("buildViewbox", () => {
  it("formats a nominatim bounding box for viewbox queries", () => {
    assert.equal(
      buildViewbox(["47.3202187", "47.4346662", "8.4480061", "8.6254413"]),
      "8.4480061,47.4346662,8.6254413,47.3202187"
    );
  });
});
