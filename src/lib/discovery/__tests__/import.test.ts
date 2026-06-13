import assert from "node:assert/strict";
import { after, describe, it } from "node:test";
import {
  buildDiscoveryLeadInput,
  importDiscoveryCandidate,
  parseDiscoveryImportCandidate,
} from "../import";
import { deleteLead, getLeadById } from "../../leads";
import { shouldAutoAnalyzeAfterDiscoveryImport } from "../../analysis/queue-lead-analysis";
import { shouldDiscoverContact } from "../../contact/enrich-lead-contact";
import type { DiscoveryCandidate } from "../types";

describe("parseDiscoveryImportCandidate", () => {
  it("accepts candidates with a website", () => {
    const parsed = parseDiscoveryImportCandidate({
      company: "Alpine Bau AG",
      website: "https://alpine-bau.ch",
      city: "Bern",
      industry: "Construction",
    });

    assert.deepEqual(parsed, {
      company: "Alpine Bau AG",
      website: "https://alpine-bau.ch",
      city: "Bern",
      industry: "Construction",
    });
  });

  it("accepts candidates without a website", () => {
    const parsed = parseDiscoveryImportCandidate({
      company: "Muster Gipser",
      website: "",
      city: "Luzern",
      industry: "Construction",
    });

    assert.ok(parsed);
    assert.equal(parsed?.website, "");
  });

  it("accepts omitted website as empty", () => {
    const parsed = parseDiscoveryImportCandidate({
      company: "Muster Gipser",
      city: "Luzern",
      industry: "Construction",
    });

    assert.ok(parsed);
    assert.equal(parsed?.website, "");
  });

  it("rejects invalid payloads", () => {
    assert.equal(parseDiscoveryImportCandidate(null), null);
    assert.equal(parseDiscoveryImportCandidate({ company: "Only Name" }), null);
  });
});

describe("buildDiscoveryLeadInput", () => {
  it("maps discovery fields and sets New status", () => {
    const candidate: DiscoveryCandidate = {
      company: "Albis Metallbau GmbH",
      website: "http://www.albismetallbau.ch",
      city: "Zürich",
      industry: "Metallbau",
    };

    assert.deepEqual(buildDiscoveryLeadInput(candidate), {
      company: "Albis Metallbau GmbH",
      website: "http://www.albismetallbau.ch",
      city: "Zürich",
      industry: "Metallbau",
      status: "New",
      notes: "Imported from Discovery",
    });
  });

  it("omits website when missing", () => {
    const candidate: DiscoveryCandidate = {
      company: "Bau Partner",
      website: "",
      city: "Basel",
      industry: "Construction",
    };

    const input = buildDiscoveryLeadInput(candidate);
    assert.equal(input.company, "Bau Partner");
    assert.equal(input.website, undefined);
    assert.equal(input.city, "Basel");
    assert.equal(input.status, "New");
  });
});

describe("importDiscoveryCandidate", () => {
  const createdLeadIds: number[] = [];

  after(() => {
    for (const id of createdLeadIds) {
      deleteLead(id);
    }
  });

  it("imports a lead with website stored in CRM", async () => {
    const company = `Import With Web ${Date.now()}`;
    const result = await importDiscoveryCandidate({
      company,
      website: "https://example-import-test.ch",
      city: "Bern",
      industry: "Construction",
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;

    createdLeadIds.push(result.lead.id);
    assert.equal(result.lead.website, "https://example-import-test.ch");
    assert.equal(shouldDiscoverContact(result.lead), true);
    assert.equal(shouldAutoAnalyzeAfterDiscoveryImport(result.lead), true);
  });

  it("imports a lead without website as null and skips analysis queue", async () => {
    const company = `Import No Web ${Date.now()}`;
    const result = await importDiscoveryCandidate({
      company,
      website: "",
      city: "Luzern",
      industry: "Construction",
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;

    createdLeadIds.push(result.lead.id);
    const stored = getLeadById(result.lead.id);
    assert.ok(stored);
    assert.equal(stored?.website, null);
    assert.equal(shouldDiscoverContact(stored!), false);
    assert.equal(shouldAutoAnalyzeAfterDiscoveryImport(stored!), false);
    assert.equal(stored?.analysis, null);
  });

  it("preserves email and phone from CSV-style data when website is missing", async () => {
    const company = `Import Phone Only ${Date.now()}`;
    const { createLead, deleteLead: removeLead } = await import("../../leads");
    const lead = createLead({
      company,
      phone: "+41 41 555 12 34",
      email: "info@phone-only-test.ch",
      city: "Zug",
      industry: "Handwerk",
      status: "New",
      notes: "Imported from CSV",
    });

    try {
      assert.equal(lead.website, null);
      assert.equal(lead.phone, "+41 41 555 12 34");
      assert.equal(lead.email, "info@phone-only-test.ch");
      assert.equal(shouldDiscoverContact(lead), false);
    } finally {
      removeLead(lead.id);
    }
  });
});
