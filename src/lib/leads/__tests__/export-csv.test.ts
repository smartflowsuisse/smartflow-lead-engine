import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Lead } from "../../types";
import {
  buildLeadsExportCsv,
  buildLeadsExportFilename,
  escapeCsvField,
  formatLeadExportCreatedDate,
  formatLeadQualification,
  leadToExportRow,
  LEAD_EXPORT_COLUMNS,
  LEAD_EXPORT_DELIMITER,
  LEAD_EXPORT_HEADERS,
  parseLeadExportHeaders,
  REQUIRED_LEAD_EXPORT_HEADERS,
} from "../export-csv";
import { getLeadsForListView } from "../list-view";

function sampleLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: 1,
    company: "Acme SA",
    website: "https://acme.ch",
    email: "info@acme.ch",
    phone: "+41 21 555 66 77",
    city: "Zürich",
    industry: "Construction",
    lead_score: 72,
    status: "Analyzed",
    outreach_status: "New",
    notes: null,
    contacted_at: null,
    contacted_language: null,
    contact_page_url: "https://acme.ch/kontakt",
    email_confidence: null,
    phone_confidence: null,
    created_at: "2026-01-15T10:00:00.000Z",
    updated_at: "2026-01-15T10:00:00.000Z",
    ...overrides,
  };
}

describe("LEAD_EXPORT_COLUMNS", () => {
  it("defines all required operational columns", () => {
    const headers = LEAD_EXPORT_COLUMNS.map((column) => column.header);

    assert.deepEqual(headers, [...LEAD_EXPORT_HEADERS]);

    for (const header of REQUIRED_LEAD_EXPORT_HEADERS) {
      assert.ok(headers.includes(header));
    }
  });
});

describe("escapeCsvField", () => {
  it("quotes fields containing delimiters or quotes", () => {
    assert.equal(escapeCsvField("Acme; SA"), '"Acme; SA"');
    assert.equal(escapeCsvField('Say "hello"'), '"Say ""hello"""');
  });

  it("leaves simple values unquoted", () => {
    assert.equal(escapeCsvField("Acme SA"), "Acme SA");
  });
});

describe("formatLeadQualification", () => {
  it("maps score to qualification label", () => {
    assert.equal(formatLeadQualification(72), "High Priority");
    assert.equal(formatLeadQualification(0), "Not Scored");
  });
});

describe("formatLeadExportCreatedDate", () => {
  it("formats created date as YYYY-MM-DD", () => {
    assert.equal(
      formatLeadExportCreatedDate("2026-01-15T10:00:00.000Z"),
      "2026-01-15"
    );
  });
});

describe("leadToExportRow", () => {
  it("includes all export columns in order", () => {
    const lead = sampleLead({
      company: 'Acme "Premium" SA',
      city: "Zürich",
    });

    const row = leadToExportRow(lead);

    assert.equal(row[0], 'Acme "Premium" SA');
    assert.equal(row[1], "Zürich");
    assert.equal(row[2], "Construction");
    assert.equal(row[3], "info@acme.ch");
    assert.equal(row[4], "+41 21 555 66 77");
    assert.equal(row[5], "https://acme.ch");
    assert.equal(row[6], "https://acme.ch/kontakt");
    assert.equal(row[7], "72");
    assert.equal(row[8], "High Priority");
    assert.equal(row[9], "Analyzed");
    assert.equal(row[10], "2026-01-15");
  });
});

describe("buildLeadsExportCsv", () => {
  it("builds a CSV with headers and escaped rows", () => {
    const csv = buildLeadsExportCsv([
      sampleLead({ company: "Acme; SA" }),
      sampleLead({ id: 2, company: "Beta AG", lead_score: 0, status: "New Lead" }),
    ]);

    const lines = csv.replace(/^\uFEFF/, "").split("\n");

    assert.equal(lines[0], LEAD_EXPORT_HEADERS.join(LEAD_EXPORT_DELIMITER));
    assert.match(lines[1] ?? "", /^"Acme; SA"/);
    assert.match(lines[2] ?? "", /^Beta AG;/);
  });

  it("includes required operational headers", () => {
    const csv = buildLeadsExportCsv([sampleLead()]);
    const headers = parseLeadExportHeaders(csv);

    for (const header of REQUIRED_LEAD_EXPORT_HEADERS) {
      assert.ok(headers.includes(header), `Missing header: ${header}`);
    }
  });
});

describe("buildLeadsExportFilename", () => {
  it("uses leads-export-YYYY-MM-DD.csv format", () => {
    assert.equal(
      buildLeadsExportFilename(new Date(2026, 5, 9)),
      "leads-export-2026-06-09.csv"
    );
  });
});

describe("getLeadsForListView export filtering", () => {
  const leads = [
    sampleLead({ id: 1, company: "Alpha", lead_score: 10, status: "New Lead" }),
    sampleLead({ id: 2, company: "Beta", lead_score: 65, status: "Analyzed" }),
    sampleLead({
      id: 3,
      company: "Gamma",
      email: null,
      lead_score: 65,
      status: "New Lead",
    }),
  ];

  it("respects score and contact filters for export", () => {
    const filtered = getLeadsForListView(leads, {
      contact: "no_email",
      score: "score_61_plus",
      sort: "score_high",
    });

    assert.deepEqual(
      filtered.map((lead) => lead.id),
      [3]
    );
  });

  it("sorts filtered leads for export", () => {
    const filtered = getLeadsForListView(leads, {
      contact: "all",
      score: "all",
      sort: "score_low",
    });

    assert.deepEqual(
      filtered.map((lead) => lead.id),
      [1, 2, 3]
    );
  });
});
