import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildMailtoHref,
  buildOutreachSessionEmail,
  buildOutreachSessionSubject,
  isOutreachSessionLead,
  sortOutreachSessionLeads,
  type OutreachSessionLead,
} from "../outreach-session";

describe("outreach session helpers", () => {
  it("keeps only actionable leads", () => {
    const leads: OutreachSessionLead[] = [
      { id: 1, email: "a@example.ch", lead_score: 80, status: "New", outreach_status: "New" },
      { id: 2, email: "b@example.ch", lead_score: 44, status: "New", outreach_status: "New" },
      { id: 3, email: "c@example.ch", lead_score: 80, status: "Won", outreach_status: "New" },
      { id: 4, email: "d@example.ch", lead_score: 80, status: "New", outreach_status: "Contacted" },
      { id: 5, lead_score: 80, status: "New", outreach_status: "New" },
    ];

    assert.deepEqual(sortOutreachSessionLeads(leads).map((lead) => lead.id), [1]);
  });

  it("sorts actionable leads by score desc, then company", () => {
    const leads: OutreachSessionLead[] = [
      { id: 1, company: "Beta", email: "b@example.ch", lead_score: 80, status: "New", outreach_status: "New" },
      { id: 2, company: "Alpha", email: "a@example.ch", lead_score: 80, status: "New", outreach_status: "New" },
      { id: 3, company: "Gamma", email: "g@example.ch", lead_score: 90, status: "New", outreach_status: "New" },
    ];

    assert.deepEqual(sortOutreachSessionLeads(leads).map((lead) => lead.company), [
      "Gamma",
      "Alpha",
      "Beta",
    ]);
  });

  it("builds email subject and body", () => {
    const lead: OutreachSessionLead = {
      id: 1,
      company: "Construction Perret SA",
      email: "cpsa@cpsa.ch",
      city: "Satigny",
      industry: "Construction",
      lead_score: 73,
      status: "New",
      outreach_status: "New",
    };

    assert.equal(
      buildOutreachSessionSubject(lead),
      "Free workflow audit — Construction Automation Starter",
    );
    assert.match(buildOutreachSessionEmail(lead), /Construction Perret SA/);
    assert.match(buildOutreachSessionEmail(lead), /Satigny · Construction/);
    assert.ok(buildMailtoHref(lead)?.startsWith("mailto:cpsa@cpsa.ch?subject="));
  });

  it("rejects CRM statuses already past first outreach", () => {
    for (const status of ["Contacted", "Replied", "Meeting", "Proposal", "Won", "Lost"]) {
      assert.equal(
        isOutreachSessionLead({
          id: status,
          email: "lead@example.ch",
          lead_score: 90,
          status,
          outreach_status: "New",
        }),
        false,
      );
    }
  });

  it("rejects closed and contacted leads", () => {
    assert.equal(
      isOutreachSessionLead({
        id: 1,
        email: "a@example.ch",
        lead_score: 90,
        status: "Lost",
        outreach_status: "New",
      }),
      false,
    );

    assert.equal(
      isOutreachSessionLead({
        id: 2,
        email: "a@example.ch",
        lead_score: 90,
        status: "New",
        outreach_status: "Contacted",
      }),
      false,
    );
  });
});
