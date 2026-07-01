# Client Hub MVP2 Progress Snapshot

## Status

MVP2 Convert to Client preparation is in progress.

The current implementation is still safe and mock-controlled.

## Completed Pull Requests

- PR #168 — Document MVP2 convert to client audit
- PR #169 — Add convert to client helper
- PR #170 — Show Client Hub convert draft mock
- PR #171 — Show Client Hub convert eligibility
- PR #172 — Show Client Hub convert readiness checklist

## Completed Scope

MVP2 no:

1. audit of existing Lead Engine status and routes;
2. safe convert-to-client helper;
3. helper tests;
4. mock Client Hub client draft generated from a won lead;
5. visual eligibility indicator;
6. visual conversion readiness checklist.

## Current Code Files

Core helper:

- src/lib/leads/convert-to-client.ts
- src/lib/leads/__tests__/convert-to-client.test.ts

Client Hub display:

- src/app/client-hub/mock-data.ts
- src/app/client-hub/page.tsx
- src/app/client-hub/components/convert-to-client-draft.tsx
- src/app/client-hub/components/convert-readiness-checklist.tsx

## Current Safety State

No real conversion exists yet.

The current state does not:

- create a real client;
- update a lead;
- write to a database;
- send email;
- call Gmail;
- call Make;
- call OpenAI;
- trigger external actions;
- deploy to production manually.

## Current Demonstrable Flow

The current mock flow shows:

- Won lead
- helper says eligible
- Client Hub draft is prepared
- eligibility is shown
- readiness checklist is shown
- human review is still required

## Verification

Verified on main before this snapshot work:

- npm test passed;
- npm run build passed;
- /client-hub appears in build output;
- Git working tree was clean;
- only main remained locally.

## Next Recommended Step

MVP2.6 should add the first safe UI action surface.

Recommended next PR:

Add mock Convert to Client action panel

Scope:

- display a disabled or mock-only action panel;
- show what would happen after human approval;
- do not mutate data;
- do not write to database;
- do not update real lead status;
- do not create real client;
- do not connect external services.

## Stop Conditions Before Real Conversion

Do not implement real conversion yet if:

- lead status model is still not fully confirmed;
- persistence path is unclear;
- Client Hub storage model is not decided;
- there is no audit log plan for conversion;
- tests fail;
- build fails;
- the change requires database migration without separate review.
