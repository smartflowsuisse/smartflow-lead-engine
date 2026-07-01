# MVP2 Audit Log Storage Model

## Status

This document defines the planned audit log storage model before any real Convert to Client mutation is implemented.

No application code is changed in this PR.

No audit log is persisted in this PR.

No database is added in this PR.

## Purpose

Real Convert to Client must have an audit trail before any production mutation is allowed.

The audit log must make every future conversion traceable, reviewable and reversible.

## Current Safe State

The current implementation can prepare audit events in helper code.

The current implementation does not store audit events.

The current implementation does not update leads or create clients.

## Required Audit Event Fields

Minimum audit event fields:

- id;
- sourceLeadId;
- generatedClientId;
- actor;
- timestamp;
- action;
- previousLeadStatus;
- newLeadStatus optional;
- result;
- rollbackAvailable;
- note.

## Audit Actions

Current planned actions:

- convert_to_client_preview;
- convert_to_client_approved;
- convert_to_client_blocked.

Future actions may include:

- convert_to_client_rolled_back;
- convert_to_client_failed;
- convert_to_client_duplicate_blocked.

## Storage Options Reviewed

### Option 1 — No persistence / preview only

Pros:
- safest current option;
- no production write risk;
- no migration risk;
- enough for MVP2 preview.

Cons:
- audit trail is not durable;
- real conversion cannot be allowed.

Decision:
Use as the current default.

### Option 2 — Local typed data module

Pros:
- simple for demo;
- easy to review;
- no database migration.

Cons:
- not durable production storage;
- can be confused with real audit history.

Decision:
Allowed only for demo documentation or mock data, not real audit storage.

### Option 3 — Existing Lead Engine storage

Pros:
- avoids a new database model immediately;
- keeps audit near lead records.

Cons:
- may mix lead lifecycle and audit history;
- rollback trace may become unclear;
- can make future Client Hub separation harder.

Decision:
Do not use until lead/client boundary is final.

### Option 4 — Database-backed audit log

Pros:
- correct long-term model;
- supports durable history;
- supports rollback and compliance review;
- supports future client operations.

Cons:
- requires schema design;
- requires migration review;
- requires production risk review.

Decision:
Likely future direction, but not in MVP2.

## Selected Current Path

Current selected path:

1. keep audit events preview-only;
2. do not persist audit logs yet;
3. document audit model first;
4. define rollback plan next;
5. decide database schema only after rollback plan is reviewed.

## Rules Before Real Audit Storage

Before audit logs are persisted, the system must define:

- audit event schema;
- storage location;
- retention expectation;
- rollback relationship;
- actor model;
- timestamp source;
- duplicate handling relationship;
- failure handling;
- migration plan if database-backed.

## Blocked Actions

Still blocked:

- persisting audit logs;
- creating real clients;
- updating real leads;
- writing to database;
- creating Gmail drafts;
- sending emails;
- calling Make;
- calling OpenAI;
- triggering external notifications;
- production automation.

## Recommended Next Step

Next safe PR:

MVP2.25 — Convert to Client Rollback Plan

That document should define how to reverse or neutralize a future conversion if it was approved incorrectly.

## Verification

This document should be merged only after:

- git diff --check passes;
- npm test passes;
- npm run build passes;
- Git status is clean after commit.
