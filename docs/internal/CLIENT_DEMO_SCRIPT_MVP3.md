# Client Demo Script MVP3

## Purpose

This document defines the client-facing demo script for the SmartFlow Suisse MVP3 demo package.

The goal is to explain the business value of the workflow, not the technical implementation.

This demo is designed for a controlled first-client conversation and remains preview-only.

---

## Demo Positioning

SmartFlow Suisse helps small and medium businesses reduce manual follow-up work after a new client request.

The demo shows how a request can move through a structured workflow:

Request
→ Lead Engine
→ Client Hub
→ AI-assisted summary
→ Manual follow-up preparation
→ Convert to Client preview
→ Human approval

Nothing is sent, created, or changed automatically without human validation.

---

## What The Client Should Understand

By the end of the demo, the client should understand:

1. How incoming requests can be captured and structured.
2. How the business can see lead information in one place.
3. How AI can help summarize and prioritize the request.
4. How follow-up preparation can be made faster.
5. How conversion to client can be previewed before any real action.
6. Why human approval remains required before external or irreversible actions.

---

## Demo Flow

### Step 1 — New Request

Explain that a potential customer submits a request through a form or another intake channel.

Example:

A company receives a request for a renovation, service, quote, or administrative follow-up.

The important point is that the request does not remain hidden in an inbox or spreadsheet.

---

### Step 2 — Lead Engine

Show that the request becomes a structured lead.

The Lead Engine is used internally to organize:

- company or contact name;
- request details;
- contact information;
- status;
- next action;
- follow-up readiness.

Business value:

The team can avoid losing requests and can see which leads require action.

---

### Step 3 — AI-Assisted Summary

Explain that AI can help summarize the request in a clear format.

The AI layer can support:

- short summary;
- priority suggestion;
- next action suggestion;
- manual review note;
- preparation of internal context.

Important safety point:

AI does not make the final decision. It supports the human operator.

---

### Step 4 — Client Hub

Show the Client Hub as the operational view.

The Client Hub helps connect the lead information with the next business steps.

It can show:

- request context;
- current status;
- follow-up readiness;
- conversion preview;
- safety information.

Business value:

The business has one place to understand what should happen next.

---

### Step 5 — Manual Follow-Up Preparation

Explain that the system can help prepare follow-up, but does not send external messages automatically.

The operator can review the context and decide what to send.

Important safety point:

No email is sent automatically during this demo.

---

### Step 6 — Convert To Client Preview

Show the Convert to Client preview.

Explain that this is not real conversion yet.

The preview shows what would be prepared if the business approves the conversion.

The preview may include:

- whether conversion can proceed;
- blocked reasons;
- client draft;
- audit preview;
- rollback preview;
- safety guard.

Business value:

The business can review the result before any real change happens.

---

### Step 7 — Human Approval

Explain the core operating principle:

Nothing irreversible happens without human approval.

Before production conversion, the operator must review and confirm.

This is important for:

- data quality;
- legal responsibility;
- client trust;
- operational safety;
- avoiding accidental external actions.

---

## Safety Boundaries For Demo

This demo does not perform:

- real client creation;
- lead status mutation;
- database write;
- production API mutation;
- automatic email sending;
- Gmail automation;
- Make production automation;
- OpenAI production call;
- external communication;
- mass outreach.

The current demo is controlled and preview-only.

---

## Suggested Spoken Demo Narrative

"Here is how SmartFlow can help your business manage incoming requests.

A request arrives from a potential customer. Instead of staying only in an inbox or spreadsheet, it is structured as a lead.

The system helps summarize the request and prepare the next action. Then the Client Hub gives your team one clear place to review the request, understand the follow-up, and see what would happen if this lead became a client.

The important part is safety: nothing is sent or changed automatically. The system prepares the work, but a human approves the final action."

---

## Client Questions To Ask During Demo

Use these questions to move from demo to discovery:

1. Where do your client requests arrive today?
2. Who is responsible for follow-up?
3. How do you know which requests are urgent?
4. Are requests ever lost or answered late?
5. Do you use a CRM or mostly email and spreadsheets?
6. Which part of the follow-up process takes the most time?
7. Would a controlled approval-based workflow fit your team?

---

## Recommended Demo Outcome

At the end of the demo, the goal is not to sell a large system immediately.

The goal is to agree on a small first implementation.

Recommended next step:

A controlled pilot workflow for one specific intake process, with manual approval and no automatic external sending until approved.

---

## Internal Notes

This document belongs to MVP3.1.

It depends on the completed Client Hub MVP2 preview/demo layer.

The next related documents are:

- CLIENT_READY_OFFER_PACKAGE.md
- FIRST_CLIENT_ONE_PAGE_PROPOSAL.md
- CLIENT_DEMO_QA_CHECKLIST.md
- MAKE_TO_CLIENT_HUB_DEMO_STORY.md
