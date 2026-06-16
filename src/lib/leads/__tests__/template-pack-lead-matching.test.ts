import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterTemplatePackMatchedLeads,
  isLeadMatchedToTemplatePack,
  summarizeTemplatePackLeadMatches,
  type TemplatePackMatchableLead,
} from "../template-pack-lead-matching";

function makeLead(
  overrides: Partial<TemplatePackMatchableLead>,
): TemplatePackMatchableLead {
  return {
    company: "Example Company",
    website: "https://example.com",
    email: "info@example.com",
    industry: "Construction",
    ...overrides,
  };
}

describe("template pack lead matching", () => {
  it("matches construction industries", () => {
    assert.equal(
      isLeadMatchedToTemplatePack(
        makeLead({ industry: "Construction" }),
        "construction",
      ),
      true,
    );

    assert.equal(
      isLeadMatchedToTemplatePack(
        makeLead({ industry: "Bauunternehmen" }),
        "construction",
      ),
      true,
    );
  });

  it("matches retail industries", () => {
    assert.equal(
      isLeadMatchedToTemplatePack(makeLead({ industry: "Retail" }), "retail"),
      true,
    );

    assert.equal(
      isLeadMatchedToTemplatePack(
        makeLead({ industry: "E-commerce" }),
        "retail",
      ),
      true,
    );
  });

  it("matches fiduciary industries", () => {
    assert.equal(
      isLeadMatchedToTemplatePack(
        makeLead({ industry: "Fiduciaire" }),
        "fiduciary",
      ),
      true,
    );

    assert.equal(
      isLeadMatchedToTemplatePack(
        makeLead({ industry: "Accounting" }),
        "fiduciary",
      ),
      true,
    );
  });

  it("does not match unrelated or empty industries", () => {
    assert.equal(
      isLeadMatchedToTemplatePack(
        makeLead({ industry: "Restaurant" }),
        "retail",
      ),
      false,
    );

    assert.equal(
      isLeadMatchedToTemplatePack(makeLead({ industry: "" }), "construction"),
      false,
    );
  });

  it("filters matched leads by template pack", () => {
    const filtered = filterTemplatePackMatchedLeads(
      [
        makeLead({ company: "Builder One", industry: "Construction" }),
        makeLead({ company: "Shop One", industry: "Retail" }),
        makeLead({ company: "Builder Two", industry: "Bauunternehmen" }),
      ],
      "construction",
    );

    assert.deepEqual(
      filtered.map((lead) => lead.company),
      ["Builder One", "Builder Two"],
    );
  });

  it("summarizes matched leads", () => {
    const summary = summarizeTemplatePackLeadMatches(
      [
        makeLead({ company: "Builder One", industry: "Construction" }),
        makeLead({ company: "Shop One", industry: "Retail" }),
        makeLead({ company: "Builder Two", industry: "Bauunternehmen" }),
      ],
      "construction",
    );

    assert.equal(summary.totalLeads, 3);
    assert.equal(summary.matchedLeads, 2);
    assert.deepEqual(summary.topMatchedLeadNames, [
      "Builder One",
      "Builder Two",
    ]);
  });
});
