# MVP2 Real Conversion Readiness Audit

## Status

The MVP2 mock Convert to Client flow is complete.

This audit defines what must be confirmed before implementing any real conversion action.

No application code is changed in this PR.

## Current Safe Mock Flow

The current system can demonstrate:

- won lead source data;
- convert-to-client helper;
- Client Hub draft;
- eligibility indicator;
- readiness checklist;
- mock action panel;
- activity log preview entry;
- post-approval preview;
- no external action.

## Real Conversion Questions To Resolve

Before real conversion, these questions must be answered:

1. Where will Client Hub clients be persisted?
2. Is Client Hub storage local JSON, in-memory mock, existing lead data, or database-backed?
3. Should real conversion create a new client record or update an existing lead record?
4. What exact lead statuses are valid for conversion?
5. Should converted leads remain visible in Lead Engine?
6. Should conversion change lead status from Won to Converted?
7. Where should the audit log be stored?
8. What rollback is possible if conversion is wrong?
9. What tests must exist before conversion is real?
10. Should production deployment wait until database and rollback are explicit?

## Current Known Safe Files

Helper files:

- src/lib/leads/convert-to-client.ts
- src/lib/leads/__tests__/convert-to-client.test.ts

Client Hub display files:

- src/app/client-hub/page.tsx
- src/app/client-hub/mock-data.ts
- src/app/client-hub/components/convert-to-client-draft.tsx
- src/app/client-hub/components/convert-readiness-checklist.tsx
- src/app/client-hub/components/convert-action-panel.tsx
- src/app/client-hub/components/post-approval-preview.tsx
- src/app/client-hub/components/activity-log.tsx

## Required Persistence Decision

Real conversion must not start until the Client Hub persistence model is chosen.

Possible options:

1. Keep Client Hub mock-only for now.
2. Store converted clients in a local typed data module.
3. Store converted clients in existing Lead Engine data structures.
4. Add a database model later through a separate reviewed migration.

Recommended for next step:

Do not add database yet.

First, document the intended data model and conversion contract.

## Required Conversion Contract

The first real conversion contract should define:

- input lead fields;
- allowed lead statuses;
- generated client fields;
- audit log fields;
- failure behavior;
- duplicate handling;
- rollback behavior;
- tests required before merge.

## Required Audit Log Decision

Real conversion must have an audit trail.

Minimum audit fields:

- event id;
- source lead id;
- generated client id;
- actor;
- timestamp;
- action type;
- previous lead status;
- new lead status if changed;
- rollback note if needed.

## Safety Rules Before Real Conversion

Do not implement real conversion if any of these are unresolved:

- persistence path is unclear;
- lead status transition is unclear;
- audit log storage is unclear;
- rollback path is unclear;
- duplicate client handling is unclear;
- tests are missing;
- production risk is not reviewed.

## Explicitly Not Allowed Yet

The next implementation must not:

- create real clients in production;
- update real lead status;
- write to a production database;
- send Gmail drafts;
- send emails;
- call Make;
- call OpenAI;
- trigger notifications;
- trigger external actions.

## Recommended Next PR

Next safe PR:

Document Convert to Client data contract

That PR should define types and rules before any real mutation exists.

## Verification

This audit should be merged only after:

- git diff --check passes;
- npm test passes;
- npm run build passes;
- Git status is clean after commit.
