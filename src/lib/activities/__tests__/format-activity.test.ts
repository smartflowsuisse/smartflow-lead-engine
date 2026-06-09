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
});
