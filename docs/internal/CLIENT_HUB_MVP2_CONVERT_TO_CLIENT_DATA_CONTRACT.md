# MVP2 Convert to Client Data Contract

## Status

This document defines the planned Convert to Client data contract.

It does not implement real conversion.

No application code is changed in this PR.

## Purpose

Before any real Convert to Client action exists, the system must define:

- accepted lead input fields;
- allowed lead statuses;
- generated client draft fields;
- audit log event fields;
- duplicate handling;
- failure behavior;
- rollback behavior;
- test requirements.

## Input: Lead

Minimum source lead fields:

- id;
- company;
- status;
- contactName optional;
- email optional;
- phone optional;
- language optional.

Allowed status for first real conversion:

- Won.

Possible future allowed statuses:

- closed-won;
- client-won.

All non-won statuses must be blocked.

## Output: Client Draft

Generated client draft fields:

- id;
- sourceLeadId;
- company;
- contactName;
- email;
- phone;
- language;
- status.

Initial client draft status:

- Draft.

The first real implementation should still create a draft first, not an active client.

## Audit Log Event

Every conversion attempt must create or prepare an audit event.

Minimum audit event fields:

- id;
- sourceLeadId;
- generatedClientId;
- actor;
- timestamp;
- action;
- previousLeadStatus;
- newLeadStatus;
- result;
- rollbackAvailable;
- note.

## Duplicate Handling

Before creating a client draft, the system must check for duplicates by:

- sourceLeadId;
- company name;
- email if present.

If a possible duplicate exists:

- do not create a new real client;
- show duplicate warning;
- require human review.

## Failure Behavior

If conversion cannot proceed:

- do not update lead;
- do not create client;
- do not call external services;
- show clear error reason;
- write or prepare audit note if persistence exists.

## Rollback Behavior

Rollback must be possible before real conversion is allowed.

Minimum rollback requirements:

- know source lead id;
- know generated client id;
- know previous lead status;
- know whether any persisted record was created;
- know who triggered the action;
- know timestamp of action.

## Explicitly Blocked In MVP2

MVP2 must not:

- create production clients automatically;
- update real lead status automatically;
- send Gmail drafts;
- send emails;
- call Make;
- call OpenAI;
- trigger notifications;
- perform external actions.

## First Real Implementation Recommendation

The first real implementation should be split into small PRs:

1. add typed data contract;
2. add duplicate check helper;
3. add audit event builder;
4. add mock-only approval handler;
5. only then evaluate persistence.

## Test Requirements

Before any real conversion merge, tests must cover:

- won lead can produce client draft;
- non-won lead is blocked;
- missing optional fields get safe defaults;
- duplicate source lead is blocked;
- audit event is generated;
- rollback data is present;
- no external action is triggered.

## Verification

This document PR should be merged only after:

- git diff --check passes;
- npm test passes;
- npm run build passes;
- Git status is clean after commit.
