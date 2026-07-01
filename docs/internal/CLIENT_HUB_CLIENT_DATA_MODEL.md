# Client Hub Client Data Model

## Status

This document defines the planned Client Hub client data model before any real persistence or real conversion is implemented.

No application code is changed in this PR.

No database is added in this PR.

## Purpose

The Client Hub needs a clear client model before real Convert to Client can exist.

This document separates client records from lead records and defines the first safe client lifecycle.

## Lead vs Client Boundary

A lead is a sales opportunity.

A client is an accepted operational relationship after human review.

The system must not silently turn every won lead into an active client.

The first safe conversion target should be a client draft, not an active client.

## Client Record Fields

Minimum client fields:

- id;
- sourceLeadId;
- company;
- contactName;
- email;
- phone;
- language;
- status;
- createdAt;
- updatedAt;
- createdBy;
- notes optional;
- tags optional;

Recommended future fields:

- website;
- address;
- canton;
- sector;
- servicePackage;
- onboardingStatus;
- nextAction;
- assignedOwner;
- auditLogIds;

## Client Statuses

Initial statuses:

- Draft;
- Review;
- Active;
- Paused;
- Archived.

First conversion should create only:

- Draft.

Active status must require separate human confirmation.

## Client Lifecycle

Recommended lifecycle:

1. lead marked as won;
2. Convert to Client preview generated;
3. duplicate check completed;
4. rollback context prepared;
5. audit event prepared;
6. human review required;
7. client draft created only after explicit approval;
8. client becomes active only after onboarding confirmation.

## Source Lead Relationship

Every client draft created from a lead must keep:

- sourceLeadId;
- previousLeadStatus;
- conversionAuditEventId if available;
- createdBy;
- createdAt.

The source lead should remain traceable after conversion.

## Required Human Review

Human review must confirm:

- company name is correct;
- contact data is correct;
- duplicate check has no blocking result;
- client draft fields are acceptable;
- rollback context exists;
- audit event can be stored;
- no external action is triggered automatically.

## Persistence Not Decided Yet

This model does not choose a database.

Persistence remains blocked until the storage model is separately reviewed.

Current safe default:

- keep preview-only;
- do not write client records;
- do not update real lead status.

## Blocked Actions

Still blocked:

- database write;
- real client creation;
- lead status update;
- Gmail draft creation;
- email sending;
- Make call;
- OpenAI call;
- external notifications;
- production automation.

## Recommended Next Step

Next safe PR:

MVP2.23 — Lead Status Transition Model

That document should define how a lead moves from Won to any future Converted state, and when that transition is allowed.

## Verification

This document should be merged only after:

- git diff --check passes;
- npm test passes;
- npm run build passes;
- Git status is clean after commit.
