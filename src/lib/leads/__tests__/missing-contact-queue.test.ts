import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  hasManualContactPath,
  hasMissingEmail,
  isMissingContactQueueLead,
  sortMissingContactQueueLeads,
} from "../missing-contact-queue";

describe("missing contact queue", () => {
  it("detects leads without email", () => {
    assert.equal(hasMissingEmail({ email: "" }), true);
    assert.equal(hasMissingEmail({ email: null }), true);
    assert.equal(hasMissingEmail({ email: "ready@example.ch" }), false);
  });

  it("requires phone or website as a manual contact path", () => {
    assert.equal(hasManualContactPath({ phone: "", website: "" }), false);
    assert.equal(hasManualContactPath({ phone: "+41 22 000 00 00", website: "" }), true);
    assert.equal(hasManualContactPath({ phone: "", website: "https://example.ch" }), true);
  });

  it("accepts missing-email leads with a manual contact path", () => {
    assert.equal(
      isMissingContactQueueLead({
        email: "",
        phone: "+41 22 000 00 00",
        website: "https://example.ch",
        status: "New",
        outreach_status: "New",
      }),
      true,
    );
  });

  it("rejects leads that already have email", () => {
    assert.equal(
      isMissingContactQueueLead({
        email: "ready@example.ch",
        phone: "+41 22 000 00 00",
        website: "https://example.ch",
        status: "New",
        outreach_status: "New",
      }),
      false,
    );
  });

  it("rejects closed or contacted leads", () => {
    assert.equal(
      isMissingContactQueueLead({
        email: "",
        phone: "+41 22 000 00 00",
        website: "https://example.ch",
        status: "Won",
        outreach_status: "New",
      }),
      false,
    );

    assert.equal(
      isMissingContactQueueLead({
        email: "",
        phone: "+41 22 000 00 00",
        website: "https://example.ch",
        status: "New",
        outreach_status: "Contacted",
      }),
      false,
    );
  });

  it("sorts by score descending", () => {
    const leads = sortMissingContactQueueLeads([
      { id: 1, company: "Low", lead_score: 10 },
      { id: 2, company: "High", lead_score: 90 },
    ]);

    assert.equal(leads[0]?.company, "High");
    assert.equal(leads[1]?.company, "Low");
  });
});
