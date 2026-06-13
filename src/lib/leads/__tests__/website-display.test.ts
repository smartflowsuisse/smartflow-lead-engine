import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ANALYSIS_REQUIRES_WEBSITE_MESSAGE,
  formatLeadAnalysisStatus,
  formatLeadWebsiteLabel,
  normalizeOptionalWebsite,
  WEBSITE_MISSING_LABEL,
} from "../website-display";

describe("formatLeadWebsiteLabel", () => {
  it("returns Missing when website is null, empty, or whitespace", () => {
    assert.equal(formatLeadWebsiteLabel(null), WEBSITE_MISSING_LABEL);
    assert.equal(formatLeadWebsiteLabel(""), WEBSITE_MISSING_LABEL);
    assert.equal(formatLeadWebsiteLabel("   "), WEBSITE_MISSING_LABEL);
  });

  it("returns trimmed website when present", () => {
    assert.equal(formatLeadWebsiteLabel("https://acme.ch"), "https://acme.ch");
    assert.equal(formatLeadWebsiteLabel("  acme.ch  "), "acme.ch");
  });
});

describe("formatLeadAnalysisStatus", () => {
  it("returns Available when analysis exists", () => {
    assert.equal(formatLeadAnalysisStatus("https://acme.ch", true), "Available");
  });

  it("returns requires-website message when website is missing", () => {
    assert.equal(
      formatLeadAnalysisStatus(null, false),
      ANALYSIS_REQUIRES_WEBSITE_MESSAGE
    );
  });

  it("returns Not run yet when website exists but no analysis", () => {
    assert.equal(formatLeadAnalysisStatus("https://acme.ch", false), "Not run yet");
  });
});

describe("normalizeOptionalWebsite", () => {
  it("returns undefined for empty values and trimmed URL otherwise", () => {
    assert.equal(normalizeOptionalWebsite(null), undefined);
    assert.equal(normalizeOptionalWebsite(""), undefined);
    assert.equal(normalizeOptionalWebsite("  "), undefined);
    assert.equal(normalizeOptionalWebsite("acme.ch"), "acme.ch");
  });
});

describe("lead card display safety", () => {
  it("does not throw for leads without website or analysis metadata", () => {
    assert.doesNotThrow(() => {
      formatLeadWebsiteLabel(null);
      formatLeadAnalysisStatus(null, false);
    });
  });
});
