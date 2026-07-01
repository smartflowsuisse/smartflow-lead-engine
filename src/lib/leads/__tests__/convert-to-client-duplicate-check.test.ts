import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { checkConvertToClientDuplicate } from "../convert-to-client-duplicate-check";

describe("checkConvertToClientDuplicate", () => {
  it("returns no duplicate when client list is empty", () => {
    const result = checkConvertToClientDuplicate(
      {
        sourceLeadId: "lead-001",
        company: "Demo Construction Genève",
        email: "contact@example.com",
      },
      [],
    );

    assert.equal(result.hasDuplicate, false);
    assert.deepEqual(result.matchedBy, []);
    assert.deepEqual(result.duplicateIds, []);
  });

  it("detects duplicate by sourceLeadId", () => {
    const result = checkConvertToClientDuplicate(
      {
        sourceLeadId: "lead-001",
        company: "Demo Construction Genève",
      },
      [
        {
          id: "client-001",
          sourceLeadId: "lead-001",
          company: "Other Company",
        },
      ],
    );

    assert.equal(result.hasDuplicate, true);
    assert.deepEqual(result.matchedBy, ["sourceLeadId"]);
    assert.deepEqual(result.duplicateIds, ["client-001"]);
  });

  it("detects duplicate by normalized company name", () => {
    const result = checkConvertToClientDuplicate(
      {
        sourceLeadId: "lead-002",
        company: " Demo Construction Genève ",
      },
      [
        {
          id: "client-002",
          sourceLeadId: "lead-old",
          company: "demo construction genève",
        },
      ],
    );

    assert.equal(result.hasDuplicate, true);
    assert.deepEqual(result.matchedBy, ["company"]);
    assert.deepEqual(result.duplicateIds, ["client-002"]);
  });

  it("detects duplicate by normalized email", () => {
    const result = checkConvertToClientDuplicate(
      {
        sourceLeadId: "lead-003",
        company: "Different Company",
        email: " CONTACT@EXAMPLE.COM ",
      },
      [
        {
          id: "client-003",
          company: "Existing Client",
          email: "contact@example.com",
        },
      ],
    );

    assert.equal(result.hasDuplicate, true);
    assert.deepEqual(result.matchedBy, ["email"]);
    assert.deepEqual(result.duplicateIds, ["client-003"]);
  });

  it("deduplicates duplicate ids when several fields match same client", () => {
    const result = checkConvertToClientDuplicate(
      {
        sourceLeadId: "lead-004",
        company: "Demo Client",
        email: "demo@example.com",
      },
      [
        {
          id: "client-004",
          sourceLeadId: "lead-004",
          company: "demo client",
          email: "demo@example.com",
        },
      ],
    );

    assert.equal(result.hasDuplicate, true);
    assert.deepEqual(result.matchedBy, ["sourceLeadId", "company", "email"]);
    assert.deepEqual(result.duplicateIds, ["client-004"]);
  });
});
