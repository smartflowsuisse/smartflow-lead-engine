# MVP2 Lead Status Transition Model

## Status

This document defines the planned lead status transition model before any real Convert to Client mutation is implemented.

No application code is changed in this PR.

No lead status is changed in this PR.

No database is added in this PR.

## Purpose

Convert to Client requires a clear lead status model before any real mutation exists.

The system must prevent accidental conversion of leads that are not approved for client creation.

## Current Safe State

The current implementation remains preview-only.

It can show a conversion preview, but it must not update real lead status.

## Allowed Source Status For First Real Conversion

The first real conversion may only start from:

- Won.

Possible future compatible source statuses:

- closed-won;
- client-won.

These future statuses must be explicitly reviewed before use in real mutation.

## Blocked Source Statuses

The following statuses must not be converted automatically:

- New;
- Contacted;
- Needs review;
- Missing contact;
- Skipped;
- Not fit;
- Lost;
- Archived;
- Converted;
- Draft;
- Active.

Any unknown status must be blocked by default.

## Future Target Status

Recommended future target status after approved conversion:

- Converted.

However, this must not be implemented until persistence, audit storage and rollback are decided.

## Required Transition

Future approved transition:

Won -> Converted

This transition should happen only after:

- duplicate check passes;
- client draft is reviewed;
- audit event can be stored;
- rollback context exists;
- human approval is explicit;
- persistence model is confirmed.

## Human Approval Requirement

Lead status must not change automatically from preview alone.

Human approval must be a separate action from preview generation.

Preview does not equal conversion.

## Audit Requirements For Status Change

Every future status transition must record:

- source lead id;
- previous status;
- new status;
- actor;
- timestamp;
- generated client id if any;
- reason;
- rollback availability.

## Rollback Requirements

Before status mutation exists, rollback must define:

- how to restore previous lead status;
- how to identify generated client draft;
- how to mark failed conversion;
- how to preserve audit history;
- who can execute rollback.

## Explicitly Blocked In MVP2

MVP2 must still not:

- update real lead status;
- create real clients;
- write to a database;
- create Gmail drafts;
- send emails;
- call Make;
- call OpenAI;
- trigger external notifications;
- run production automation.

## Recommended Next Step

Next safe PR:

MVP2.24 — Audit Log Storage Model

That document should define where future conversion audit events will be stored before any real mutation is implemented.

## Verification

This document should be merged only after:

- git diff --check passes;
- npm test passes;
- npm run build passes;
- Git status is clean after commit.
