import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildIndustrySearchTerm,
  buildIndustryTagFilters,
  buildNominatimSearchQuery,
  buildOverpassFilterClause,
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

describe("buildIndustrySearchTerm", () => {
  it("maps gastro to restaurant search term", () => {
    assert.equal(buildIndustrySearchTerm("Gastro"), "restaurant");
  });

  it("falls back to the raw industry for unknown categories", () => {
    assert.equal(buildIndustrySearchTerm("Florist"), "Florist");
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
  it("builds a name filter for fallback tag matching", () => {
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
      "Zürich"
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
        address: {
          city: "Genève",
          country_code: "ch",
        },
        extratags: {},
        boundingbox: ["46.2", "46.3", "6.1", "6.2"],
      },
      "Gastro",
      "Zürich"
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
      },
    ]);

    assert.equal(parsed[0]?.osmType, "relation");
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
        name: "Konshi",
        address: { city: "Zürich", country_code: "ch" },
        extratags: { website: "https://konshi-zuerich.ch/" },
      },
    ]);

    assert.equal(parsed[0]?.name, "Konshi");
    assert.equal(parsed[0]?.extratags.website, "https://konshi-zuerich.ch/");
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
