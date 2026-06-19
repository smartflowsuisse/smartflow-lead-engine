import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildOutreachInput,
  buildOutreachMailtoLink,
  formatOutreachEmailForCopy,
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
  outreach_status: "New",
  notes: null,
  contact_page_url: null,
  email_confidence: null,
  phone_confidence: null,
  contacted_at: null,
  contacted_language: null,
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

function parseMailtoQuery(link: string): { subject?: string; body?: string } {
  const query = link.split("?")[1] ?? "";
  const result: { subject?: string; body?: string } = {};

  for (const part of query.split("&")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;

    const key = part.slice(0, separator);
    const value = part.slice(separator + 1);

    if (key === "subject") {
      result.subject = decodeURIComponent(value);
    } else if (key === "body") {
      result.body = decodeURIComponent(value);
    }
  }

  return result;
}

function assertMailtoEncoding(link: string): void {
  assert.ok(!link.includes("+"), `mailto link must not use + for spaces: ${link}`);
  assert.ok(link.includes("%20"), `mailto link should encode spaces as %20: ${link}`);
}

describe("buildOutreachMailtoLink", () => {
  it("builds a mailto link with recipient, subject, and body", () => {
    const link = buildOutreachMailtoLink({
      recipient: "info@acme.ch",
      subject: "SmartFlow Suisse — hello",
      body: "Bonjour,\n\nTest message.",
    });

    assert.match(link, /^mailto:info@acme\.ch\?/);
    assertMailtoEncoding(link);

    const { subject, body } = parseMailtoQuery(link);
    assert.equal(subject, "SmartFlow Suisse — hello");
    assert.equal(body, "Bonjour,\n\nTest message.");
  });

  it("omits recipient when lead email is missing", () => {
    const link = buildOutreachMailtoLink({
      recipient: null,
      subject: "Follow up",
      body: "Hello there",
    });

    assert.match(link, /^mailto:\?/);
    assertMailtoEncoding(link);

    const { subject, body } = parseMailtoQuery(link);
    assert.equal(subject, "Follow up");
    assert.equal(body, "Hello there");
  });

  it("encodes special characters for mail clients", () => {
    const link = buildOutreachMailtoLink({
      recipient: "contact@example.com",
      subject: "A & B — test",
      body: "Line 1\nLine 2",
    });

    assertMailtoEncoding(link);
    assert.ok(link.includes("%0A"), "line breaks should be encoded as %0A");

    const { subject, body } = parseMailtoQuery(link);
    assert.equal(subject, "A & B — test");
    assert.equal(body, "Line 1\nLine 2");
    assert.ok(!link.includes("?subject=A &"));
  });

  it("encodes French outreach drafts with accented characters", () => {
    const draft = generateOutreachDraft(
      buildOutreachInput(baseLead, baseAnalysis),
      "fr"
    );
    const link = buildOutreachMailtoLink({
      recipient: "info@techhandel.ch",
      subject: draft.subject,
      body: draft.body,
    });

    assertMailtoEncoding(link);
    assert.match(link, /^mailto:info@techhandel\.ch\?/);

    const { subject, body } = parseMailtoQuery(link);
    assert.equal(subject, draft.subject);
    assert.equal(body, draft.body);
    assert.match(body ?? "", /PME suisses/);
    assert.match(body ?? "", /^Bonjour,/);
  });

  it("encodes German outreach drafts with umlauts and spaces", () => {
    const draft = generateOutreachDraft(
      buildOutreachInput(baseLead, baseAnalysis),
      "de"
    );
    const link = buildOutreachMailtoLink({
      recipient: "info@techhandel.ch",
      subject: draft.subject,
      body: draft.body,
    });

    assertMailtoEncoding(link);

    const { subject, body } = parseMailtoQuery(link);
    assert.equal(subject, draft.subject);
    assert.equal(body, draft.body);
    assert.match(body ?? "", /^Guten Tag,/);
    assert.match(body ?? "", /Schweizer/);
  });

  it("encodes English outreach drafts with spaces and line breaks", () => {
    const draft = generateOutreachDraft(
      buildOutreachInput(baseLead, baseAnalysis),
      "en"
    );
    const link = buildOutreachMailtoLink({
      recipient: "info@techhandel.ch",
      subject: draft.subject,
      body: draft.body,
    });

    assertMailtoEncoding(link);
    assert.ok(link.includes("%0A"), "body should preserve line breaks as %0A");

    const { subject, body } = parseMailtoQuery(link);
    assert.equal(subject, draft.subject);
    assert.equal(body, draft.body);
    assert.match(body ?? "", /^Hello,/);
    assert.match(body ?? "", /15-minute call/);
  });
});

describe("formatOutreachEmailForCopy", () => {
  it("combines subject and body for clipboard copy", () => {
    const draft = generateOutreachDraft(
      buildOutreachInput(baseLead, baseAnalysis),
      "en"
    );
    const copied = formatOutreachEmailForCopy(draft);

    assert.match(copied, /^Subject: /);
    assert.ok(copied.includes(draft.subject));
    assert.ok(copied.includes(draft.body));
  });
});

describe("generateOutreachDraft", () => {
  it("includes company, city, industry, and website", () => {
    const draft = generateOutreachDraft(
      buildOutreachInput(baseLead, baseAnalysis),
      "en"
    );
    assert.match(draft.body, /TechHandel AG/);
    assert.match(draft.body, /Lausanne/);
    assert.match(draft.body, /Retail & E-commerce/);
    assert.match(draft.body, /https:\/\/example\.net/);
  });

  it("includes lead score and analysis content for high-priority leads", () => {
    const draft = generateOutreachDraft(
      buildOutreachInput(baseLead, baseAnalysis),
      "en"
    );
    assert.match(draft.body, /76\/100/);
    assert.match(draft.body, /High Priority/);
    assert.match(draft.body, /Add HTTPS\/SSL certificate/);
    assert.match(draft.body, /Smart contact form with CRM integration/);
    assert.match(draft.subject, /TechHandel AG/);
    assert.match(draft.body, /Andrii Moroz/);
    assert.match(draft.body, /https:\/\/smartflowsuisse\.ch/);
    assert.match(draft.body, /info@smartflowsuisse.com/);
    assert.match(draft.body, /My name is Andrii Moroz, founder of SmartFlow Suisse/);
  });

  it("uses softer messaging for low-priority leads", () => {
    const lowLead: Lead = {
      ...baseLead,
      company: "Restaurant Kronenhalle",
      city: "Zürich",
      industry: "Gastro",
      lead_score: 6,
    };
    const draft = generateOutreachDraft(
      buildOutreachInput(lowLead, baseAnalysis),
      "en"
    );
    assert.match(draft.body, /6\/100/);
    assert.match(draft.body, /Cold/);
    assert.match(draft.subject, /digital improvements/i);
  });

  it("works without analysis data for not-scored leads", () => {
    const draft = generateOutreachDraft(
      buildOutreachInput({ ...baseLead, lead_score: 0 }, null),
      "en"
    );
    assert.match(draft.body, /not yet available/i);
    assert.match(draft.body, /not yet calculated/i);
    assert.match(draft.body, /Andrii Moroz/);
    assert.match(draft.body, /info@smartflowsuisse.com/);
  });

  it("generates French draft with Bonjour greeting", () => {
    const draft = generateOutreachDraft(
      buildOutreachInput(baseLead, baseAnalysis),
      "fr"
    );
    assert.equal(draft.language, "fr");
    assert.match(draft.body, /^Bonjour,/);
    assert.match(
      draft.body,
      /Je m'appelle Andrii Moroz, fondateur de SmartFlow Suisse/
    );
    assert.match(draft.body, /SmartFlow Suisse accompagne les PME suisses/);
  });

  it("generates German draft with Guten Tag greeting", () => {
    const draft = generateOutreachDraft(
      buildOutreachInput(baseLead, baseAnalysis),
      "de"
    );
    assert.equal(draft.language, "de");
    assert.match(draft.body, /^Guten Tag,/);
    assert.match(
      draft.body,
      /Mein Name ist Andrii Moroz, Gründer von SmartFlow Suisse/
    );
    assert.match(draft.body, /SmartFlow Suisse unterstützt Schweizer Unternehmen/);
  });

  it("generates English draft with Hello greeting", () => {
    const draft = generateOutreachDraft(
      buildOutreachInput(baseLead, baseAnalysis),
      "en"
    );
    assert.equal(draft.language, "en");
    assert.match(draft.body, /^Hello,/);
    assert.match(
      draft.body,
      /My name is Andrii Moroz, founder of SmartFlow Suisse/
    );
    assert.match(draft.body, /15-minute call/i);
  });
});
