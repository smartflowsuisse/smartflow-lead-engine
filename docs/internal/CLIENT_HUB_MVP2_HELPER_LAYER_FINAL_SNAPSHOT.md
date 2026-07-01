# MVP2 Convert to Client Helper Layer Final Snapshot

## Status

MVP2 Convert to Client helper layer is complete as a safe preview-only layer.

No real conversion exists yet.

No persistence decision has been implemented.

## Completed Helper Layer PRs

- PR #181 — Add convert to client typed contract
- PR #182 — Connect convert helper to typed contract
- PR #183 — Add convert to client duplicate helper
- PR #184 — Add convert to client audit event builder
- PR #185 — Add convert to client rollback context builder
- PR #186 — Add convert to client safety guard
- PR #187 — Add convert to client orchestration preview

## Current Helper Layer Files

- src/lib/leads/convert-to-client-contract.ts
- src/lib/leads/convert-to-client.ts
- src/lib/leads/convert-to-client-duplicate-check.ts
- src/lib/leads/convert-to-client-audit-event.ts
- src/lib/leads/convert-to-client-rollback-context.ts
- src/lib/leads/convlient-safety-guard.ts
- src/lib/leads/convert-to-client-orchestration-preview.ts

## Current Helper Layer Tests

- src/lib/leads/__tests__/convert-to-client-contract.test.ts
- src/lib/leads/__tests__/convert-to-client.test.ts
- src/lib/leads/__tests__/convert-to-client-duplicate-check.test.ts
- src/lib/leads/__tests__/convert-to-client-audit-event.test.ts
- src/lib/leads/__tests__/convert-to-client-rollback-context.test.ts
- src/lib/leads/__tests__/convert-to-client-safety-guard.test.ts
- src/lib/leads/__tests__/convert-to-client-orchestration-preview.test.ts

## What The Helper Layer Can Do

The helper layer can now:

- define the typed conversion contract;
- validate allowed conversion statuses;
- create a client draft from a won lead;
- detect duplicate client candidates;
- prepare audit events;
- prepare rollback context;
- evaluate safety guard conditions;
- build a full orchestration preview.

## Safety State

The helper layer does not:

- create a real client;
- update a real lead;
- write to a database;
- create Gmail drafts;
- send emails;
- call Make;
- call OpenAI;
- trigger notifications;
- trigger external actions;
- deploy production automation.

## Current Preview Flow

The helper layer supports this preview-only flow:

- lead input
- typed contract validation
- eligibility check
- client draft preview
- duplicate check
- audit event preparation
- rollback context preparation
- safety guard evaluation
- orchestration preview result

## Current Blockers Before Real Conversion

Real conversion must not start until:

- Client Hub persistence model is decided;
- lead status transition model is confirmed;
- audit log storage model is confirmed;
- duplicate handling UX is confirmed;
- rollback mechanism is defined;
- production risk is reviewed;
- database migration, if needed, is reviewed separately.

## Recommended Next Step

Next safe step:

MVP2.21 — Persistence Decision Document

That document should compare:

- keep mock-only;
- local typed data module;
- existing lead data structure;
- future database-backed clients.

Recommended default for now:

Do not add database yet.

## Verification

This snapshot should be merged only after:

- git diff --check passes;
- npm test passes;
- npm run build passes;
- Git status is clean after commit.
