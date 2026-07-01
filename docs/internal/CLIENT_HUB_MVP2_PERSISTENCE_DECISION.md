# MVP2 Convert to Client Persistence Decision

## Status

The MVP2 Convert to Client helper layer is complete as a safe preview-only layer.

This document decides the persistence direction before any real conversion is implemented.

No application code is changed in this PR.

## Main Decision

Do not add a database yet.

Do not implement real client creation yet.

Do not update real lead status yet.

Keep Convert to Client preview-only until the Client Hub data model is explicitly defined and reviewed.

## Reason

The current system is still in first-client readiness mode.

Adding persistence too early would increase production risk before the exact client model, lead status transition, audit log storage and rollback path are fully defined.

## Options Reviewed

### Option 1 — Keep mock-only

Pros:
- safest option;
- no database risk;
- no migration risk;
- no production data mutation;
- enough for demo and internal validation.

Cons:
- no real client record is created;
- cannot yet support operational client management.

Decision:
Use this as the current default.

### Option 2 — Local typed data module

Pros:
- simple;
- no database migration;
- useful for controlled internal demo data.

Cons:
- not real persistence;
- can become confusing if treated as production data;
- not suitable for long-term client operations.

Decision:
Possible later for demo only, not for real conversion.

### Option 3 — Existing Lead Engine data structures

Pros:
- reuses current Lead Engine model;
- avoids adding a new database layer immediately.

Cons:
- risks mixing leads and clients;
- lead status lifecycle may become unclear;
- rollback rules become harder if client and lead are the same record.

Decision:
Do not use until lead/client boundary is documented.

### Option 4 — Database-backed clients

Pros:
- correct long-term model;
- supports real client operations;
- supports audit history and future workflow automation.

Cons:
- requires schema design;
- requires migration review;
- requires rollback plan;
- increases production risk.

Decision:
Do not add database in MVP2. Defer until after explicit schema and migration review.

## Selected Path

Selected current path:

1. keep MVP2 preview-only;
2. document Client Hub client model separately;
3. document lead status transition model separately;
4. document audit log storage separately;
5. only then decide whether a database migration is needed.

## What Remains Blocked

Blocked until further review:

- real client creation;
- real lead status update;
- database write;
- database migration;
- Gmail draft creation;
- email sending;
- Make call;
- OpenAI call;
- external notifications;
- production automation.

## Required Next Documents Before Real Conversion

Before real conversion, create and review:

1. Client Hub Client Data Model;
2. Lead Status Transition Model;
3. Audit Log Storage Model;
4. Rollback Plan;
5. First Real Conversion PR Scope.

## Recommended Next Step

Next safe PR:

MVP2.22 — Client Hub Client Data Model

This should document the fields and lifecycle of a client record before any database or mutation work.

## Safety Confirmation

This decision keeps the current system safe:

- no real conversion;
- no production mutation;
- no external action;
- no database change;
- no automation trigger.

## Verification

This document should be merged only after:

- git diff --check passes;
- npm test passes;
- npm run build passes;
- Git status is clean after commit.
