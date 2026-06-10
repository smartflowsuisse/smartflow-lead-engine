import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  formatActivityDescription,
  formatActivityTitle,
} from "../format-activity";

describe("formatActivityTitle", () => {
  it("returns human-readable titles", () => {
    assert.equal(formatActivityTitle("analysis_completed"), "Analysis completed");
    assert.equal(formatActivityTitle("outreach_generated"), "Outreach generated");
    assert.equal(formatActivityTitle("contacted"), "Contacted");
    assert.equal(formatActivityTitle("contact_discovered"), "Contact discovered");
  });
});

describe("formatActivityDescription", () => {
  it("describes analysis completion with score", () => {
    assert.match(
      formatActivityDescription("analysis_completed", { leadScore: 76 }),
      /76\/100/
    );
  });

  it("describes outreach generation with language", () => {
    assert.match(
      formatActivityDescription("outreach_generated", {
        language: "fr",
        subject: "SmartFlow Suisse",
      }),
      /French/
    );
  });

  it("describes contacted action with language", () => {
    assert.match(
      formatActivityDescription("contacted", { language: "de" }),
      /German/
    );
  });

  it("describes auto-discovered contact details", () => {
    assert.match(
      formatActivityDescription("contact_discovered", {
        email: "info@acme.ch",
        phone: "+41 21 555 66 77",
      }),
      /info@acme.ch/
    );
  });
});
