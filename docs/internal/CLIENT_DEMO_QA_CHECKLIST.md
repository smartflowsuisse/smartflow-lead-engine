# Client Demo QA Checklist

## Purpose

This checklist must be used before every SmartFlow Suisse client demo.

The goal is to confirm that the demo is safe, controlled, understandable, and aligned with the current MVP3 client-ready package.

This checklist is for demo readiness only.

It does not authorize production automation, real client conversion, external sending, or database mutation.

---

## 1. Repository Status

Before the demo, confirm the repository is clean.

Required checks:

- current branch is main;
- main is up to date with origin/main;
- no uncommitted changes;
- no leftover local demo branch;
- latest MVP3 documents exist in main.

Commands to run before demo:

- git checkout main
- git pull origin main
- git status
- git branch

Expected result:

- On branch main
- Your branch is up to date with origin/main
- nothing to commit, working tree clean

---

## 2. Build And Test Status

Run the standard validation before the demo.

Commands:

- npm test
- npm run build

Required result:

- tests pass;
- build passes;
- /client-hub appears in the build output;
- no type errors;
- no failed route generation.

Do not run a client demo if tests or build fail.

---

## 3. Client Hub Availability

Open the local Client Hub route before the demo.

Check:

- /client-hub opens;
- the page loads without crash;
- Client Hub UI is visible;
- no obvious runtime error appears;
- layout is readable on the demo screen.

If using local development:

- npm run dev
- open http://localhost:3000/client-hub

---

## 4. Internal Convert Result Preview

Confirm the Client Hub shows the internal convert result preview.

Required visible elements:

- preview-only state;
- canProceed;
- blocked reasons;
- client draft;
- audit preview;
- rollback preview;
- safety guard.

The demo must clearly explain that this is not real client creation.

---

## 5. Safety Language

The demo must include clear safety language.

Confirm that the demo narrative explains:

- no real client is created;
- no lead status is changed;
- no database write happens during preview;
- no production API mutation happens;
- no email is sent automatically;
- no external action happens without human approval.

The client should understand:

The system prepares the work. The human approves the action.

---

## 6. Make Demo Readiness

If the Make demo story is shown verbally or manually, confirm:

- Make automation is not enabled for production;
- scheduled automatic execution is not required for the demo;
- Gmail sending is not part of the demo;
- external email sending is disabled;
- only controlled manual demo examples are used;
- no real client data is processed unless explicitly approved.

Important:

Do not enable Make scheduling during a client demo unless this has been separately approved and validated.

---

## 7. Google Sheet Demo Readiness

If using a Google Sheet demo, confirm:

- demo sheet is accessible;
- demo data is safe and non-sensitive;
- CRM demo sheet is understandable;
- test rows do not contain real private client data;
- old confusing test rows are removed or clearly separated;
- the sheet is not shared with unintended users.

The demo should use fake or approved sample data.

---

## 8. Email / Gmail Safety

Before the demo, confirm:

- no Gmail module is active for production sending;
- no email is sent automatically;
- no draft is sent without review;
- no mass outreach exists;
- no live client email is used in the demo unless explicitly approved.

If follow-up is discussed, present it as manual preparation only.

---

## 9. OpenAI / AI Safety

Before the demo, confirm:

- AI is presented as assistive;
- AI does not make final decisions;
- AI output is reviewed by a human;
- AI summary is not treated as legal, financial, or operational authority;
- no production OpenAI flow is enabled without explicit approval.

The demo should explain AI as support for speed and structure, not autonomous action.

---

## 10. Production Safety

Before the demo, confirm that the following are not part of the current demo:

- production database write;
- real client creation;
- real lead status update;
- mutation API execution;
- production Gmail integration;
- Make production automation;
- automatic OpenAI production action;
- external sending;
- mass outreach;
- public SaaS workflow.

If the client asks for these features, record them as future planning items.

Do not implement them during the demo.

---

## 11. Demo Materials Ready

Before the demo, confirm the following documents exist and are available:

- CLIENT_DEMO_SCRIPT_MVP3.md
- CLIENT_READY_OFFER_PACKAGE.md
- FIRST_CLIENT_ONE_PAGE_PROPOSAL.md
- CLIENT_DEMO_QA_CHECKLIST.md

Optional next document:

- MAKE_TO_CLIENT_HUB_DEMO_STORY.md

---

## 12. Demo Narrative

The demo should follow this simple flow:

Request
→ Lead Engine
→ Client Hub
→ AI-assisted summary
→ Manual follow-up preparation
→ Convert to Client preview
→ Human approval

Avoid deep technical explanation unless the client asks.

Focus on:

- saving time;
- reducing missed follow-ups;
- structuring requests;
- improving visibility;
- keeping human approval;
- starting with a small safe pilot.

---

## 13. Client Discovery Questions

During or after the demo, ask:

1. Where do your client requests arrive today?
2. Who handles follow-up?
3. How do you know which requests are urgent?
4. Are requests ever lost or answered late?
5. Do you use a CRM, email, spreadsheets, or another tool?
6. What should never happen automatically?
7. Which single process would be best for a first pilot?

---

## 14. Go / No-Go Decision

Proceed with demo only if:

- repository is clean;
- tests pass;
- build passes;
- /client-hub opens;
- demo data is safe;
- no automatic external sending is active;
- safety language is clear;
- demo documents are ready.

Do not proceed if:

- build fails;
- tests fail;
- working tree is dirty;
- demo data is sensitive or unclear;
- Gmail sending is active;
- Make production automation is enabled unexpectedly;
- real client creation could happen;
- you cannot explain the safety boundary clearly.

---

## 15. Post-Demo Checklist

After the demo, record:

- client name;
- date;
- what was shown;
- questions asked by the client;
- requested features;
- objections;
- agreed next step;
- whether a proposal should be sent.

Do not promise production features without separate planning.

---

## Internal Notes

This document belongs to MVP3.4.

It follows:

- CLIENT_DEMO_SCRIPT_MVP3.md
- CLIENT_READY_OFFER_PACKAGE.md
- FIRST_CLIENT_ONE_PAGE_PROPOSAL.md

Related next document:

- MAKE_TO_CLIENT_HUB_DEMO_STORY.md

This document is documentation only.

It does not introduce production behavior, automation, integrations, database writes, API mutations, or exte.
