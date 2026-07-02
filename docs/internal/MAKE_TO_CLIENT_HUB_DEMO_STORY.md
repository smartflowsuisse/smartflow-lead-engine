# Make To Client Hub Demo Story

## Purpose

This document defines the controlled demo story that connects the Make demo workflow with the Client Hub MVP2 preview layer.

The goal is not to build a production API connection yet.

The goal is to explain one clear client-ready story:

Google Form or manual lead
→ Google Sheet
→ Make manual run
→ AI-assisted summary
→ CRM Demo Sheet
→ Client Hub
→ Follow-up preparation
→ Convert to Client preview
→ Human approval

This document belongs to MVP3.5.

---

## 1. Demo Principle

The demo must remain controlled and manual.

The purpose is to show the business workflow, not to activate full production automation.

Core principle:

The system prepares the work. The human approves the action.

Nothing external or irreversible happens without review.

---

## 2. Business Story

A potential customer sends a request.

Instead of staying only in an inbox, phone note, or spreadsheet, the request becomes part of a structured SmartFlow workflow.

The workflow helps the business:

- capture the request;
- organize lead information;
- summarize the request;
- prepare the next action;
- review follow-up manually;
- preview what would happen before client creation;
- approve or stop before real action.

This story is useful for small and medium businesses that lose time managing requests manually.

---

## 3. Controlled Demo Flow

The demo flow is:

1. A demo request is created.
2. The request appears in a Google Sheet.
3. Make is run manually.
4. AI-assisted summary is generated for the demo.
5. A CRM Demo Sheet row is created or updated.
6. The Client Hub is shown as the operational view.
7. Follow-up is explained as manual preparation.
8. Convert to Client preview shows what would be prepared.
9. Human approval remains required before real conversion.

This is a demo story, not a production workflow.

---

## 4. Google Form / Manual Lead

The first step can be either:

- a Google Form demo submission;
- a manually added demo row in Google Sheet;
- a prepared fake lead already present in the demo data.

Recommended demo data:

- fake company name;
- fake contact person;
- safe demo email;
- fake phone number;
- realistic request description;
- no private or real client information unless explicitly approved.

The demo should avoid sensitive data.

---

## 5. Google Sheet Source

The Google Sheet acts as the controlled intake source.

It should show:

- company or contact name;
- request type;
- message or description;
- contact information;
- timestamp if available;
- current status if needed.

Before demo, confirm:

- the sheet is accessible;
- the owner/account is correct;
- demo data is safe;
- old confusing test rows are removed or clearly separated;
- no unintended users have edit access.

---

## 6. Make Manual Run

Make should be presented as the ration layer.

During this stage, explain that Make can move structured information from intake into the internal workflow.

Important safety boundary:

Make is not enabled as uncontrolled production automation for this demo.

Recommended state:

- manual Run once only;
- no Gmail sending module;
- no automatic external email;
- no production scheduling unless separately approved;
- no real client creation;
- no irreversible external action.

If the Make scenario is shown, keep it simple and business-oriented.

Do not spend the demo explaining technical module details unless the client asks.

---

## 7. AI-Assisted Summary

The AI step helps summarize and structure the request.

It may support:

- short request summary;
- priority suggestion;
- next action suggestion;
- manual review note.

Important explanation:

AI is assistive. It does not decide alone.

The human operator reviews the result before action.

The AI output should be presented as support for speed, clarity, and consistency.

---

## 8. CRM Demo Sheet

The CRM Demo Sheet is a safe demo destination.

It can show the client how the request becomes more structured after processing.

It may include:

- company or contact name;
- request summary;
- priority;
- next action;
- follow-up readiness;
- manual review note.

Before demo, confirm:

- the CRM Demo Sheet is clean enough to explain;
- rows are demo-safe;
- there is no sensitive private data;
- formatting is readable;
- the business story is easy to follow.

---

## 9. Client Hub View

The Client Hub is the operational demo view.

It should show the business value of having one place to understand what happens next.

The Client Hub may show:

- lead/request context;
- follow-up readiness;
- internal conversion result;
- preview-only state;
- blocked reasons;
- client draft;
- audit preview;
- rollback preview;
- safety guard.

Important explanation:

The Client Hub preview does not create a real client.

It shows what would be prepared if the operator approves.

---

## 10. Follow-Up Preparation

Follow-up must be explained as manual preparation.

The system can help prepare context and next action, but the human decides what to send.

Safety boundary:

- no email is sent automatically;
- no Gmail automation is active;
- no mass outreach is included;
- no draft is sent without review;
- external communication requires approval.

The client should understand that this reduces preparation time without removing control.

---

## 11. Convert To Client Preview

The Convert to Client preview shows what would happen if the lead became a client.

It may show:

- whether conversion can proceed;
- blocked reasons;
- client draft;
- audit preview;
- rollback preview;
- safety guard.

Important explanation:

This is not production conversion.

No real client is created during the demo.

No lead status is changed during the demo.

No database mutation is performed by the preview.

---

## 12. Human Approval

Human approval is the final and most important step.

Before any production action, a person must review and approve.

This protects against:

- incorrect data;
- accidental client creation;
- wrong follow-up;
- unintended external sending;
- operational mistakes;
- trust and compliance issues.

The demo should repeat this principle clearly:

The system prepares. The human approves.

---

## 13. What This Demo Does Not Do

This demo does not include:

- automatic Make scheduling;
- Gmail sending;
- real email sending;
- real client creation;
- production OpenAI workflow;
- API connection between Make and Client Hub;
- database migration;
- lead status mutation;
- mass outreach;
- public SaaS workflow;
- autonomous AI agent action.

These can be considered later only after a separate planning decision.

---

## 14. Recommended Spoken Narrative

Use this narrative during a demo:

A request arrives from a potential customer. Instead of being lost in email or handled manually, it enters a structured workflow.

The request is captured in a sheet, processed through a controlled Make workflow, summarized with AI assistance, and then reviewed in the Client Hub.

From there, the team can see the next action, prepare follow-up, and preview what would happen if this lead became a client.

The important part is safety. Nothing is sent, created, or changed automatically. The system prepares the work, and the human approves the action.

---

## 15. Demo QA Before Showing

Before using this story in a client conversation, confirm:

- CLIENT_DEMO_SCRIPT_MVP3.md exists;
- CLIENT_READY_OFFER_PACKAGE.md exists;
- FIRST_CLIENT_ONE_PAGE_PROPOSAL.md exists;
- CLIENT_DEMO_QA_CHECKLIST.md exists;
- this document exists;
- repository is clean;
- npm test passes;
- npm run build passes;
- Client Hub builds;
- demo data is safe;
- Gmail sending is not active;
- Make production automation is not unexpectedly enabled;
- no real client creation can happen during the demo.

---

## 16. Recommended Next Step After Demo

After showing this story, do not propose a large system immediately.

Recommended next step:

Define one controlled pilot workflow.

The pilot should include:

- one request type;
- one intake source;
- one lead workflow;
- one follow-up process;
- one approval point;
- one review cycle.

This keeps the first implementation safe and practical.

---

## Internal Notes

This document belongs to MVP3.5.

It follows:

- CLIENT_DEMO_SCRIPT_MVP3.md
- CLIENT_READY_OFFER_PACKAGE.md
- FIRST_CLIENT_ONE_PAGE_PROPOSAL.md
- CLIENT_DEMO_QA_CHECKLIST.md

This document is documentation only.

It does not introduce production behavior, automation, integrations, database writes, API mutations, or external sending.
