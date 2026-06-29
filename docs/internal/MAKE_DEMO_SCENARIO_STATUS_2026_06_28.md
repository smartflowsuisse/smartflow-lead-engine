# Make Demo Scenario Status — 2026-06-28

## Purpose

This document clarifies which Make demo scenario is the current primary scenario and which one should be treated as old/reserve.

## Primary Scenario

Current primary scenario:

SmartFlow Demo — Form to CRM AI Summary

Status:

Active internal demo asset.

Use this scenario for controlled demo preparation and first-client simulation.

## Primary Scenario Flow

Google Sheets source → Make → OpenAI summary → Google Sheets CRM Demo

Expected behavior:

1. A fake or demo request is added to the source sheet.
2. Make is run manually with Run once.
3. OpenAI creates an internal summary.
4. The CRM Demo sheet receives the processed row.
5. Human review remains required.
6. No external email is sent.

## Why This Is Primary

This scenario is the cleanest current demo path because it matches the intended client-facing story:

Client request → internal CRM → AI summary → human review → manual follow-up preparation

It also has the latest verified priority fix:

Priorité: Medium
Prochaine action: Revue manuelle uniquement

## Reserve Scenario

Reserve / old scenario:

SmartFlow Demo — Sheet AI Summary

Status:

Reserve only.

Do not use as the main first-client demo path unless there is a specific reason.

## Reserve Scenario Rule

The reserve scenario should not be deleted yet.

It may still be useful for reference, fallback testing, or historical comparison.

Do not modify it before confirming:

1. what it currently does;
2. which Google Sheet it uses;
3. whether its prompt is outdated;
4. whether it overlaps with the primary scenario;
5. whether it can safely remain disabled/manual.

## Safety Boundaries

For both scenarios:

Every 15 minutes: OFF
Gmail module: Not present
External email sending: NO
Mass outreach: NO
Real client data: NO
Production changes: NO
Vercel changes: NO
API changes: NO
Database changes: NO

## Do Not Do Yet

Do not enable scheduling.
Do not add Gmail sending.
Do not connect real client data.
Do not delete the reserve scenario.
Do not rename Make scenarios without checking documentation references first.
Do not present either scenario as autonomous live-client automation.

## Next Step

Prepare a clean demo script based on the primary scenario:

1. Client submits a request.
2. Request enters CRM Demo.
3. AI creates an internal summary.
4. Human reviews the result.
5. Manual follow-up is prepared.
6. Nothing is sent automatically.

## Conclusion

SmartFlow Demo — Form to CRM AI Summary is the current primary Make demo scenario.

SmartFlow Demo — Sheet AI Summary should remain as reserve/old scenario until a separate review confirms whether it should be archived, updated, or kept unchanged.
