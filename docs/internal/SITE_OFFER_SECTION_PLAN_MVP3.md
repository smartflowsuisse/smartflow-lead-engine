# Site Offer Section Plan MVP3

## Purpose

This document defines the planning step for updating the SmartFlow Suisse website after completion of the MVP3 client-ready demo package.

The goal is to prepare the site update safely before changing production-facing pages.

This document is planning only.

It does not modify the website, production deployment, forms, integrations, database, Make, Gmail, or OpenAI.

---

## 1. Context

The Client Hub MVP2 preview/demo layer is complete.

The MVP3 client-ready demo package now includes:

- Client demo script;
- Client-ready offer package;
- First client one-page proposal;
- Client demo QA checklist;
- Make to Client Hub demo story.

The next logical step is to prepare the SmartFlow Suisse website so it better explains the new business offer.

The website should help sell what has already been built and validated internally.

---

## 2. Main Website Goal

The website should communicate one clear offer:

SmartFlow Suisse helps small and medium businesses structure incoming requests, prepare follow-up faster, and keep human approval before external or irreversible actions.

The site should not present this as a public SaaS product.

It should present it as a premium Swiss AI and automation service / pilot offer.

---

## 3. Proposed Offer Section

Recommended section title:

Lead & Follow-up System

Alternative titles:

- AI Lead & Follow-up Workflow
- SmartFlow Client Intake System
- AI Workflow for Client Requests

Recommended positioning:

A controlled workflow for small and medium businesses that want to manage incoming requests, follow-up, and client conversion more safely and efficiently.

---

## 4. Core Message

The section should explain:

- client requests arrive from forms, email, phone notes, or spreadsheets;
- manual follow-up creates delays and missed opportunities;
- SmartFlow structures the request into a clear workflow;
- AI can assist with summary and next action;
- Client Hub gives an operational view;
- Convert to Client remains preview-only until approval;
- nothing external happens without human validation.

Core principle:

The system prepares the work. The human approves the action.

---

## 5. Suggested Section Structure

The site section can include:

### Block 1 — Problem

Many businesses lose time because requests are scattered across email, forms, spreadsheets, and manual notes.

### Block 2 — Solution

SmartFlow structures requests into a controlled workflow with AI-assisted summary, follow-up preparation, and human approval.

### Block 3 — Demo Flow

Request
→ Lead Engine
→ Client Hub
→ AI-assisted summary
→ Manual follow-up
→ Convert to Client preview
→ Human approval

### Block 4 — Safety

No automatic external sending.
No real client creation without approval.
No mass outreach.
No production automation without validation.

### Block 5 — Pilot Offer

Start with one controlled pilot workflow.

Recommended range:

CHF 1,500 to CHF 4,500

Estimated timeline:

7 to 21 days

### Block 6 — CTA

Recommended CTA:

Book a discovery call

Alternative CTA:

Request a workflow audit

---

## 6. Possible Website Areas To Update

Potential pages or sections:

- homepage service section;
- AI automation offer section;
- construction workflow templates page or section;
- dedicated Lead & Follow-up System section;
- CTA block;
- French landing page if relevant.

Important:

Do not update all pages at once.

Start with the smallest safe visible change.

---

## 7. Recommended First Website Change

Recommended first refine one small section describing:

Lead & Follow-up System

This should be added in a controlled PR after reviewing existing site structure.

The first code PR should be small and limited.

Recommended first code scope:

- one section component or one existing page section;
- no form changes;
- no API changes;
- no analytics changes;
- no route restructuring;
- no design system rewrite.

---

## 8. Copy Draft

Suggested short copy:

### Title

Lead & Follow-up System

### Subtitle

A controlled AI-assisted workflow to structure incoming requests, prepare follow-up, and preview client conversion before human approval.

### Body

SmartFlow Suisse helps your team move from scattered requests to a structured workflow.

A request can be captured, summarized, reviewed in the Client Hub, and prepared for follow-up without automatic external sending or irreversible actions.

The system prepares the work. Your team approves the action.

### Bullets

- Structure incoming requests from forms, email, or spreadsheets.
- Use AI-assisted summary to understand the next action faster.
- Review follow-up before anything is sent.
- Preview client conversion before real creation.
- Keep human approval at the center of the workflow.

### CTA

Book a discovery call

---

## 9. Safety Boundaries For Site Copy

The website must not claim:

- fully autonomous AI agent;
- automatic client creation;
- guaranteed revenue;
- full CRM replacement;
- public SaaS availability;
- automatic email campaigns;
- legal or compliance automation;
- production integration already active for every client.

The website should say:

- controlled workflow;
- AI-assisted;
- human approval;
- pilot implementation;
- tailored to the client's process;
- safe first step.

---

## 10. Design Constraints

Do not break the approved SmartFlow visual direction.

Preserve:

- premium Swiss minimal style;
- existing color palette;
- existing typography direction;
- clean card-based layout;
- current navigation structure;
- mobile readability;
- existing form architecture.

Avoid:

- large redesign;
- excessive animation;
- too much text;
- aggressive SaaS-style claims;
- adding new dependencies unless required.

---

## 11. Technical Safety Checklist Before Site Code PR

Before changing the site:

- inspect current page/component structure;
- identify the smallest safe target file;
- create a separate branch;
- make one limited change;
- run npm test;
- run npm run build;
- verify preview;
- only then consider production deploy.

Do not push directly to production without QA.

---

## 12. Recommended PR Plan

### PR 1 — Planning document

Add this document.

Risk: none.
Production impact: none.

### PR 2 — Small website copy/section update

Add or refine one offer section.

Risk: low.
Production impact: visible website copy change.
Requires preview check.

### PR 3 — Optional dedicated page later

Only if needed after reviewing the first section.

Risk: medium.
Requires routing, sitemap, metadata, and SEO review.

---

## 13. Go / No-Go Before Site Change

Proceed only if:

- MVP3.1 to MVP3.5 are merged;
- main is clean;
- offer copy is approved;
- target site file is identified;
- the change is small;
- tests and build pass;
- preview is reviewed.

Do not proceed if:

- copy is unclear;
- target file is uncertain;
- change becomes a redesign;
- production deploy is being rushed;
- safety language is missing.

---

## 14. Recommended Next Step

After this planning document is merged, inspect the current website structure and identify the safest file for the first visible offer section update.

The next code step should be small and controlled.

---

## Internal Notes

This document belongs to MVP3.6.

It follows:

- CLIENT_DEMO_SCRIPT_MVP3.md
- CLIENT_READY_OFFER_PACKAGE.md
- FIRST_CLIENT_ONE_PAGE_PROPOSAL.md
- CLIENT_DEMO_QA_CHECKLIST.md
- MAKE_TO_CLIENT_HUB_DEMO_STORY.md

This document is documentation only.

It does not introduce production behavior, automation, integrations, database writes, API mutations, external sending, or production deployment.
