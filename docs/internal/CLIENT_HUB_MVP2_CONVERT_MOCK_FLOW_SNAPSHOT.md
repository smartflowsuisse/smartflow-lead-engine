# Client Hub MVP2 Convert Mock Flow Snapshot

## Status

MVP2 Convert to Client mock flow is now visible and controlled.

This is still not a real conversion.

## Completed Pull Requests

- PR #168 — Document MVP2 convert to client audit
- PR #169 — Add convert to client helper
- PR #170 — Show Client Hub convert draft mock
- PR #171 — Show Client Hub convert eligibility
- PR #172 — Show Client Hub convert readiness checklist
— Document Client Hub MVP2 progress snapshot
- PR #174 — Show Client Hub convert action panel
- PR #175 — Log Client Hub convert preview mock activity

## Current Mock Flow

The Client Hub now shows this safe flow:

1. won lead exists as mock source data;
2. helper confirms eligibility;
3. Client Hub draft is prepared;
4. eligibility reason is displayed;
5. readiness checklist is displayed;
6. mock action panel explains what would happen;
7. activity log records that a preview was prepared;
8. human review is still required.

## Current Files Involved

Lead helper:

- src/lib/leads/convert-to-client.ts
- src/lib/leads/__tests__/convert-to-client.test.ts

Client Hub mock data:

- src/app/client-hub/mock-data.ts

Client Hub UI:

- src/app/client-hub/page.tsx
- src/app/client-hub/components/convert-to-client-draft.tsx
- src/app/client-hub/components/convert-readiness-checklist.tsx
- src/app/client-hub/components/convert-action-panel.tsx
- src/app/client-hub/components/activity-log.tsx

## Safety State

The current implementation does not:

- create a real client;
- update a real lead;
- write to a database;
- create a Gmail draft;
- send an email;
- call Make;
- call OpenAI;
- trigger external actions;
- deploy to production manually.

## What Is Demonstrable Now

A demo can show:

- a won lead can be recognized as eligible;
- a Client Hub draft can be prepared from lead data;
- conversion remains draft-only;
- human approval is required;
- blocked external actions are visible;
- an audit log entry records the preview.

## Verification

Verified on main during this phase:

- npm test passed;
- npm run build passed;
- git diff --check passed;
- Git working tree was clean.

## Recommended Next Step

MVP2.9 should add a mock post-approval result preview.

Scope:

- show what the result would look like after approval;
- still do not mutate data;
- still do not write to database;
- still do not create a real client;
- still do not update lead status;
- still do not connect Gmail, Make or OpenAI.

## Stop Conditions Before Real Conversion

Do not implement real conversion until:

- Client Hub persistence model is decided;
- lead status update flow is confirmed;
- audit log storage is defined;
- rollback path is clear;
- tests are expanded;
- human approval flow is explicit;
- database migration is reviewed separately.
