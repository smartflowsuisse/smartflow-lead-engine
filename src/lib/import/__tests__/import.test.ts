import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseCsv, normalizeHeader } from "../parse-csv";
import { mapParsedCsvToRows } from "../validate-row";
import { buildImportPreview } from "../preview-import";

describe("parseCsv", () => {
  it("parses comma-separated values with quoted fields", () => {
    const parsed = parseCsv(
      'company,city,notes\n"Acme SA","Zürich","Line 1, still one field"'
    );
    assert.deepEqual(parsed.headers, ["company", "city", "notes"]);
    assert.equal(parsed.rows.length, 1);
    assert.equal(parsed.rows[0][2], "Line 1, still one field");
  });

  it("detects semicolon delimiters", () => {
    const parsed = parseCsv("company;city\nAcme SA;Bern");
    assert.deepEqual(parsed.headers, ["company", "city"]);
    assert.deepEqual(parsed.rows[0], ["Acme SA", "Bern"]);
  });

  it("maps common header aliases", () => {
    assert.equal(normalizeHeader("Company Name"), "company");
    assert.equal(normalizeHeader("E-mail"), "email");
  });
});

describe("mapParsedCsvToRows", () => {
  it("marks rows invalid when company is missing", () => {
    const parsed = parseCsv("company,city\n,Bern");
    const rows = mapParsedCsvToRows(parsed);
    assert.equal(rows[0].errors[0], "Company name is required");
  });

  it("maps all supported columns", () => {
    const parsed = parseCsv(
      "company,website,email,phone,city,industry,notes\nAcme SA,acme.ch,info@acme.ch,+41 21 111 22 33,Bern,Consulting,Priority lead"
    );
    const rows = mapParsedCsvToRows(parsed);
    assert.deepEqual(rows[0].data, {
      company: "Acme SA",
      website: "acme.ch",
      email: "info@acme.ch",
      phone: "+41 21 111 22 33",
      city: "Bern",
      industry: "Consulting",
      notes: "Priority lead",
    });
  });
});

describe("buildImportPreview", () => {
  it("flags duplicate rows within the same file", () => {
    const preview = buildImportPreview(
      "company,website\nAcme SA,acme.ch\nAcme SA,acme.ch"
    );
    assert.equal(preview.summary.total, 2);
    assert.equal(preview.summary.valid, 1);
    assert.equal(preview.summary.duplicate, 1);
    assert.equal(preview.rows[1].status, "duplicate_in_file");
  });
});
