# MVP2 Convert to Client Rollback Plan

## Status

This document defines the planned rollback approach before any real Convert to Client mutation is implemented.

No application code is changed in this PR.

No rollback action is implemented in this PR.

No database is added in this PR.

## Purpose

Before real Convert to Client exists, the system must define how an incorrect conversion can be reversed or neutralized.

Rollback must be planned before any lead status update, client creation, audit persistence or database mutation is allowed.

## Current Safe State

The current system remains preview-only.

The helper layer can prepare rollback context, but it does not execute rollback.

No real lead or client records are mutated.

## Rollback Goals

Rollback must be able to answer:

- which lead was converted;
- what the previous lead status was;
- whether a client record was created;
- which client record was created;
- who approved the conversion;
- when the conversion happened;
- what audit event recorded the action;
- whether external actions were triggered.

## Minimum Rollback Context

Minimum rollback context fields:

- sourceLeadId;
- generatedClientId;
- previousLeadStatus;
- actor;
- timestamp;
- persistedRecordCreated.

Recommended future fields:

- conversionAuditEventId;
- rollbackAuditEventId;
- rollbackReason;
- rollbackActor;
- rollbackTimestamp;
- externalActionsTriggered;
- duplicateDecisionSnapshot.

## Rollback Scenarios

### Scenario 1 — Preview generated incorrectly

Action:

- no persisted rollback needed;
- show blocked or corrected preview;
- keep audit preview optional until persistence exists.

Risk:

- low, because no production mutation occurred.

### Scenario 2 — Client draft created incorrectly

Action:

- mark client draft as Archived or Cancelled;
- restore lead to previous status if status was changed;
- write rollback audit event;
- keep original audit trail.

Risk:

- medium, because persisted records may exist.

### Scenario 3 — Lead status changed incorrectly

Action:

- restore lead to previousLeadStatus;
- record rollback audit event;
- link rollback to original conversion event.

Risk:

- medium to high, depending on downstream workflows.

### Scenario 4 — External action triggered incorrectly

Action:

- stop automatic workflows;
- record incident note;
- do not attempt silent reversal;
- require manual review.

Risk:

- high. External actions must remain blocked in MVP2.

## Rollback Rules

Future rollback must:

- never delete audit history;
- never silently delete client records;
- preserve original conversion event;
- create a separate rollback event;
- restore lead status only when previousLeadStatus is known;
- require human approval;
- block rollback if sourceLeadId or generatedClientId is missing;
- block rollback if previousLeadStatus is unknown.

## Delete vs Archive Decision

Default future behavior:

- do not hard-delete converted client records;
- archive or cancel incorrect client drafts;
- preserve audit trail.

Hard delete should be avoided unless there is a separate legal/privacy reason and explicit approval.

## External Actions Rule

Rollback cannot reliably undo external actions such as:

- sent email;
- Gmail draft creation;
- Make scenario execution;
- OpenAI-generated external communication;
- notifications.

Therefore external actions must remain blocked until real conversion and rollback are fully reviewed.

## Required Before Real Rollback Implementation

Before implementing rollback, define:

- client persistence model;
- lead status persistence model;
- audit log storage model;
- rollback audit event schema;
- allowed rollback actors;
- UI confirmation flow;
- test matrix;
- production risk review.

## Still Blocked In MVP2

MVP2 still must not:

- execute rollback;
- create real clients;
- update real leads;
- write to database;
- persist audit logs;
- create Gmail drafts;
- send emails;
- call Make;
- call OpenAI;
- trigger external notifications;
- run production automation.

## Recommended Next Step

Next safe PR:

MVP2.26 — First Real Conversion PR Scope

That document should define the smallest possible future real-conversion PR, with explicit stop conditions and required approvals.

## Verification

This document should be merged only after:

- git diff --check passes;
- npm test passes;
- npm run build passes;
- Git status is clean after commit.
