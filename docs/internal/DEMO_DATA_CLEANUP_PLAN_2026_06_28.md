# Demo Data Cleanup Plan — 2026-06-28

## Purpose

This document defines a safe cleanup plan for Make / Google Sheets demo data before any real client presentation.

The goal is to avoid showing messy test history during a client demo.

## Current Situation

The Make demo has accumulated several fake test rows during internal testing.

Known examples include:

- Demo Menuiserie Genève 4
- Demo Menuiserie Genève 5
- Demo Menuiserie Genève 6
- Demo Menuiserie Genève 7
- Demo Menuiserie Genève 8
- Demo Menuiserie Genève 9

These rows were useful for testing Make, OpenAI summaries, CRM Demo output, and the priority fix.

They should not all be shown during a clean first-client demo.

## Primary Demo Scenario

Current primary Make scenario:

SmartFlow Demo — Form to CRM AI Summary

Demo chain:

Google Sheets source → Make → OpenAI summary → Google Sheets CRM Demo

## Cleanup Principle

Do not delete or edit live demo data immediately.

First decide which option is safer:

1. keep 2–3 best existing fake rows;
2. create a separate clean demo sheet;
3. duplicate the current demo sheet and clean the copy;
4. archive old test rows in a separate tab.

## Recommended Option

Recommended option before a client-facing walkthrough:

Create a clean demo copy or clean demo sheet.

Reason:

- preserves internal test history;
- avoids accidental loss of debugging data;
- makes the demo easier to explain;
- reduces visual noise;
- avoids showing repeated fake tests;
- keeps the client story simple.

## Suggested Clean Demo Rows

A clean demo should include only 2–3 realistic fake rows.

Recommended structure:

1. Construction / renovation request
2. Maintenance / service request
3. Urgent follow-up or quote request

Each row should clearly show:

- company or client name;
- contact name;
- request type;
- short message;
- AI internal summary;
- priority;
- next action;
- manual review status.

## Data Safety Rules

Use fake data only.

Do not use:

- real client data;
- real private messages;
- real CRM exports;
- real email content;
- real analytics data;
- real Drive files;
- real Make client scenarios;
- Swissroc or DMC real outreach content as demo data.

## Make Safety Rules

Before any demo:

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

Do not clean the live Google Sheet until the target sheet is confirmed.

Do not delete historical test rows without backup.

Do not modify the primary Make scenario before checking the connected sheet.

Do not enable scheduling.

Do not connect Gmail sending.

Do not use real client data.

Do not present test rows as real client results.

## Pre-Cleanup Checklist

Before changing any Google Sheet:

1. Confirm Google account owner.
2. Confirm source sheet name.
3. Confirm CRM Demo sheet name.
4. Confirm which Make scenario is connected.
5. Confirm whether the scenario is OFF/manual.
6. Confirm whether old test rows need to be preserved.
7. Decide whether to create a clean copy or clean a separate tab.
8. Take a screenshot or export backup if needed.

## Preferred Demo State

For a first-client demo, the preferred state is:

- clean source sheet;
- clean CRM Demo sheet;
- 2–3 fake realistic rows;
- no repeated test rows;
- AI summary visible;
- priority visible;
- next action visible;
- manual review visible;
- no email sending;
- no schedule.

## Next Step

Review the actual Google Sheets before editing anything.

Then choose one of two actions:

Option A:

Create a new clean demo sheet and connect nothing yet.

Option B:

Duplicate current demo sheet, clean the duplicate, and use it only for presentation.

## Conclusion

Demo data cleanup should be handled as a controlled preparation step.

The safest path is to preserve historical test data and prepare a separate clean demo view for client-facing walkthroughs.
