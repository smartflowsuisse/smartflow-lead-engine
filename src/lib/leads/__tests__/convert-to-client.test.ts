import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  canConvertLeadToClient,
  createClientDraftFromLead,
} from "../convert-to-client";

describe("convert-to-client", () => {
  it("allows conversion for a won lead", () => {
    assert.equal(
      canConvertLeadToClient({
        id: "lead-001",
        company: "Demo Construction Geneve",
        status: "Won",
      }),
      true,
    );
  });

  it("does not allow conversion for a non-won lead", () => {
    assert.equal(
      canConvertLeadToClient({
        id: "lead-002",
        company: "Demo Services Lausanne",
        status: "Contacted",
      }),
      false,
    );
  });

  it("creates a draft Client Hub client from a won lead", () => {
    const clientDraft = createClientDraftFromLead({
      id: "lead-001",
      company: "Demo Construction Geneve",
      contactName: "Claire Demo",
      email: "claire@example.com",
      phone: "+41000000000",
      language: "FR",
      status: "Won",
    });

    assert.deepEqual(clientDraft, {
      id: "client-lead-001",
      sourceLeadId: "lead-001",
      company: "Demo Construction Geneve",
      contactName: "Claire Demo",
      email: "claire@example.com",
      phone: "+41000000000",
      language: "FR",
      status: "Draft",
    });
  });

  it("throws when creating a client draft from a non-won lead", () => {
    assert.throws(
      () =>
        createClientDraftFromLead({
          id: "lead-002",
          company: "Demo Services Lausanne",
          status: "New",
        }),
      /Lead is not eligible for client conversion/,
    );
  });

  it("fills safe defaults for optional fields", () => {
    const clientDraft = createClientDraftFromLead({
      id: "lead-003",
      company: "Demo Minimal Client",
      status: "closed-won",
    });

    assert.deepEqual(clientDraft, {
      id: "client-lead-003",
      sourceLeadId: "lead-003",
      company: "Demo Minimal Client",
      contactName: "Unknown contact",
      email: "",
      phone: "",
      language: "FR",
      status: "Draft",
    });
  });
});
