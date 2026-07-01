# SmartFlow Client Hub — Architecture

## 1. Purpose

The SmartFlow Client Hub is the operational layer of SmartFlow AI Operations Studio.

Its role is to manage client requests after a lead becomes a client.

The Client Hub connects:

- clients;
- incoming requests;
- AI summaries;
- tasks;
- approval queue;
- suggested replies;
- follow-up;
- history;
- audit log.

The Client Hub must stay safe by default. No external action is executed automatically.

---

## 2. Strategic Role

SmartFlow Suisse is positioned as:

**SmartFlow AI Operations Studio**

The core product direction is:

**Website + AI Client Operations System**

The Client Hub is the internal and client-facing operational system that turns website requests, emails and documents into structured work.

It is not a public SaaS at this stage.

---

## 3. Relation to Lead Engine

The Lead Engine remains responsible for:

- leads;
- outreach preparation;
- mini-audits;
- proposals;
- lead status;
- first contact readiness;
- manual outreach workflow.

The Client Hub starts after a lead is won.

Target flow:

    Lead Engine
    -> Lead status: Won
    -> Convert to Client
    -> Client appears in Client Hub
    -> Client requests are managed there

---

## 4. Main Modules

The first Client Hub version should contain these modules:

1. Clients
2. Client Inbox
3. Requests
4. Tasks
5. Approval Queue
6. Suggested Replies
7. Follow-up
8. Documents
9. Metrics
10. Audit Log

---

## 5. MVP1 Screen Scope

The first visible screen is:

    /client-hub

MVP1 should show static or mock demo data only.

Required blocks:

- clients list;
- client inbox;
- requests list;
- request status;
- mock AI summary;
- mock suggested reply;
- mock Approval Queue.

MVP1 must not connect to Gmail, Make, OpenAI, PDFs or production automation.

---

## 6. Initial Data Model Direction

The future data model should include these entities.

### Client

Represents a real client or demo client.

Potential fields:

- id
- name
- company
- contact_name
- email
- phone
- language
- status
- source_lead_id
- created_at
- updated_at

### ClientRequest

Represents one incoming request from a client.

Potential fields:

- id
- client_id
- source
- title
- raw_content
- ai_summary
- urgency
- status
- received_at
- created_at
- updated_at

### ClientTask

Represents an operational task generated from a request.

Potential fields:

- id
- client_id
- request_id
- title
- description
- status
- priority
- due_date
- created_at
- updated_at

### ApprovalItem

Represents an action that requires human approval.

Potential fields:

- id
- client_id
- request_id
- type
- suggested_action
- suggested_reply
- status
- reviewed_by
- reviewed_at
- rejection_reason
- created_at
- updated_at

### ClientDocument

Represents a file or PDF connected to a client.

Potential fields:

- id
- client_id
- request_id
- file_name
- file_type
- storage_url
- ai_summary
- extraction_status
- created_at
- updated_at

### AuditLog

Represents important internal actions.

Potential fields:

- id
- actor
- action
- entity_type
- entity_id
- metadata
- created_at

---

## 7. Request Statuses

Recommended request statuses:

- New
- Reviewed
- In progress
- Waiting approval
- Reply drafted
- Follow-up scheduled
- Done
- Archived

No status should trigger automatic external sending.

---

## 8. Approval Queue Rules

The Approval Queue is mandatory for external actions.

Allowed MVP behavior:

- show suggested reply;
- allow human review;
- mark as approved;
- mark as rejected;
- log the decision.

Not allowed in early MVP:

- automatic email sending;
- batch approval;
- approval without audit log;
- external action without human decision.

---

## 9. AI Processing Plan

AI can support the Client Hub by generating:

- request summary;
- urgency level;
- suggested next action;
- suggested task;
- suggested reply;
- follow-up suggestion.

AI output must be treated as a draft.

AI must not:

- send emails;
- change production data without review;
- contact clients automatically;
- approve its own actions.

---

## 10. Automation Plan

MVP3 automation direction:

    Make test webhook
    -> Client Hub request
    -> AI summary
    -> urgency
    -> suggested reply
    -> Approval Queue

Later automation direction:

    Gmail from known client
    -> Make
    -> AI processing
    -> Client Hub request
    -> Approval Queue

PDF direction:

    PDF
    -> Google Drive client folder
    -> AI summary / extraction
    -> ClientDocument record

---

## 11. API Plan

Initial API routes should be minimal and safe.

Possible future routes:

- GET /api/client-hub/clients
- GET /api/client-hub/requests
- POST /api/client-hub/requests
- POST /api/client-hub/approval-items
- PATCH /api/client-hub/approval-items/:id
- POST /api/client-hub/audit-log

The first implementation may use mock data before persistence.

---

## 12. UI Plan

Initial UI sections for /client-hub:

1. Overview cards
2. Clients panel
3. Inbox / Requests panel
4. Selected request detail
5. AI summary block
6. Suggested reply block
7. Approval Queue block
8. Recent activity / audit preview

The UI must clearly separate:

- factual client request;
- AI-generated draft;
- human-approved action;
- logged history.

---

## 13. Safety Rules

Mandatory safety rules:

- no production deploy without QA;
- no auto-send;
- no real Gmail intake before MVP3 is stable;
- no real PDF intake before structure is ready;
- no external action without Approval;
- no large PRs;
- no database change without separate review;
- no hidden automation;
- all important actions must be logged.

---

## 14. MVP Roadmap

### MVP0 — Architecture

Goal:

- fix architecture;
- document decisions;
- confirm stack;
- prepare safe execution path.

### MVP1 — First Client Hub Screen

Goal:

- build /client-hub;
- show clients;
- show requests;
- show mock AI summarhow mock Approval Queue.

No real automation.

### MVP2 — Convert to Client

Goal:

- connect Lead Engine to Client Hub;
- convert Won lead into Client Hub client.

### MVP3 — Make + AI Intake Demo

Goal:

- connect a safe Make test webhook;
- create request;
- generate AI summary;
- show suggested reply;
- keep reply in Approval Queue.

### MVP4 — Gmail / PDF Intake

Goal:

- connect known-client Gmail intake;
- connect PDF intake;
- still require approval.

### MVP5 — Approval Actions

Goal:

- approve creates Gmail draft;
- edit saves revised draft;
- reject logs reason.

No auto-send.

---

## 15. Development Workflow

Each implementation step must follow this workflow:

1. Check Git status.
2. Work from clean main.
3. Create feature branch.
4. Make small scoped change.
5. Run checks.
6. Commit.
7. Push branch.
8. Open PR.
9. Review files changed.
10. Merge only after checks.
11. Sync local main.
12. Delete merged branch.

---

## 16. What Not To Automate Now

Do not automate now:

- mass outreach;
- client emails;
- Gmail auto-replies;
- PDF extraction from real client documents;
- payment collection;
- multi-tenant separation;
- batch approval;
- production workflows;
- destructive actions;
- external notifications.

---

## 17. Monetization Direction

The Client Hub supports the commercial offer:

**Website + AI Operations Starter**

Target niche:

- construction companies;
- local service companies;
- Suisse romande SMEs.

Possible pricing direction:

- Starter / Lite: 3'500–5'000 CHF
- Pro: 6'000–9'000 CHF
- Monthly support: 200–600 CHF / month

Prices are not final before a working demo.

---

## 18. Success Criteria

The Client Hub architecture is successful when SmartFlow can demonstrate:

1. a lead becomes a client;
2. a client has requests;
3. AI summarizes a request;
4. a task is suggested;
5. a reply is drafted;
6. the reply waits for Approval;
7. important actions are logged;
8. no external action happens automatically.
