import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildOutreachInput,
  generateOutreachDraft,
} from "../generate-outreach";
import type { Lead, LeadAnalysis } from "../../types";

const baseLead: Lead = {
  id: 1,
  company: "TechHandel AG",
  website: "https://example.net",
  email: "info@techhandel.ch",
  phone: null,
  city: "Lausanne",
  industry: "Retail & E-commerce",
  lead_score: 76,
  status: "Analyzed",
  notes: null,
  created_at: "2026-06-09T08:00:00Z",
  updated_at: "2026-06-09T08:00:00Z",
};

const baseAnalysis: LeadAnalysis = {
  id: 1,
  lead_id: 1,
  website_quality: 60,
  mobile_friendliness: 55,
  speed_score: null,
  seo_score: 50,
  has_contact_form: false,
  trust_score: 45,
  quick_wins: JSON.stringify([
    "Add HTTPS/SSL certificate",
    "Add meta description",
  ]),
  automation_opportunities: JSON.stringify([
    "Smart contact form with CRM integration",
    "AI chatbot for lead qualification",
  ]),
  raw_analysis: JSON.stringify({
    summary: "Issues found: no contact form detected, missing privacy policy.",
  }),
  analyzed_at: "2026-06-09T08:00:00Z",
};

describe("generateOutreachDraft", () => {
  it("includes company, city, industry, and website", () => {
    const draft = generateOutreachDraft(buildOutreachInput(baseLead, baseAnalysis));
    assert.match(draft.body, /TechHandel AG/);
    assert.match(draft.body, /Lausanne/);
    assert.match(draft.body, /Retail & E-commerce/);
    assert.match(draft.body, /https:\/\/example\.net/);
  });

  it("includes lead score and analysis content for high-priority leads", () => {
    const draft = generateOutreachDraft(buildOutreachInput(baseLead, baseAnalysis));
    assert.match(draft.body, /76\/100/);
    assert.match(draft.body, /High Priority/);
    assert.match(draft.body, /no contact form detected/);
    assert.match(draft.body, /Add HTTPS\/SSL certificate/);
    assert.match(draft.body, /Smart contact form with CRM integration/);
    assert.match(draft.subject, /TechHandel AG/);
  });

  it("uses softer messaging for low-priority leads", () => {
    const lowLead: Lead = {
      ...baseLead,
      company: "Restaurant Kronenhalle",
      city: "Zürich",
      industry: "Gastro",
      lead_score: 6,
    };
    const draft = generateOutreachDraft(buildOutreachInput(lowLead, baseAnalysis));
    assert.match(draft.body, /6\/100/);
    assert.match(draft.body, /Not Qualified/);
    assert.match(draft.body, /practical digital improvements/);
  });

  it("works without analysis data", () => {
    const draft = generateOutreachDraft(
      buildOutreachInput({ ...baseLead, lead_score: 0 }, null)
    );
    assert.match(draft.body, /No website analysis available yet/);
    assert.match(draft.body, /not yet calculated/);
  });
});
