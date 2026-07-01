# MVP2 Convert to Client Scope

## Status

This document defines the smallest safe scope for the first future Convert to Client implementation PR.

No application code is changed in this PR.

No real conversion is implemented in this PR.

No database is added in this PR.

## Current State

The current system has:

- Client Hub MVP1 mock interface;
- MVP2 preview-only Convert to Client flow;
- typed conversion contract;
- duplicate check helper;
- audit event builder;
- rollback context builder;
- safety guard;
- orchestration preview helper;
- persistence decision document;
- client data model;
- lead status transition model;
- audit log storage model;
- rollback plan.

The current system does not:

- create real clients;
- update real leads;
- write to a database;
- persist audit logs;
- create Gmail drafts;
- send emails;
- call Make;
- call OpenAI;
- trigger external actions.

## First Real Conversion PR Goal

The first future real-conversion PR must be minimal.

Recommended first implementation target:

- internal-only conversion action;
- no database;
- no external calls;
- no Gmail;
- no Make;
- no OpenAI;
- no email sending;
- no production automation.

The first real-conversion PR should prove the control flow only.

## Allowed Files For First Real Conversion PR

Allowed to touch:

- src/lib/leads/convert-to-client.ts
- src/lib/leads/convert-to-client-contract.ts
- src/lib/leads/convert-to-client-orchestration-preview.ts
- src/lib/leads/convert-to-client-safety-guard.ts
- src/lib/leads/__tests__/*
- optional new file under src/lib/leads/

Allowed only if necessary:

- src/app/client-hub/page.tsx
- src/app/client-hub/components/*

## Blocked Files / Areas

Do not touch without separate approval:

- database schema files;
- migration files;
- API mutation routes;
- Gmail integration files;
- Make integration files;
- OpenAI integration files;
- production deployment configuration;
- authentication or permission logic;
- real email sending logic.

## Required Safety Gates

Before any future real conversion can proceed, the implementation must check:

- lead is eligible;
- duplicate check has no blocking result;
- rollback context exists;
- audit event can be prepared;
- human approval is explicit;
- no external action is triggered.

## Stop Conditions

Stop immediately if:

- tests fail;
- build fails;
- git diff --check fails;
- unknown files are changed;
- database write appears;
- lead status mutation appears without explicit scope;
- client persistence appears without explicit scope;
- Gmail, Make or OpenAI call appears;
- email sending appears;
- production deploy is required;
- rollback context is missing;
- duplicate handling is unclear.

## Human Approval Requirement

Preview does not equal conversion.

The future real conversion must require a clear human action.

No automatic conversion from status alone is allowed.

## First PR Verification Checklist

The future first real-conversion PR must include:

- npm test passed;
- npm run build passed;
- git diff --check passed;
- changed files reviewed;
- no external integrations added;
- no production deploy;
- no database migration;
- no email sending;
- rollback behavior reviewed;
- duplicate behavior reviewed.

## Recommended Next Step

After this scope is merged, the next safe step is:

MVP2.27 — internal convert action helper

This should be a small code PR that prepares an internal conversion result object using the existing helper layer.

It must not persist data.

It must not update real leads.

It must not create real clients.

It must not call external services.
