# Make Demo Dry Run — 2026-06-27

## Purpose

Document the controlled manual Make dry-run completed after the first-client readiness documentation updates.

## Scenario tested

Scenario:

- SmartFlow Demo — Form to CRM AI Summary

Flow:

- Google Sheets — Watch New Rows
- OpenAI — Generate a completion
- Google Sheets — Add a Row

## Test input

Source:

- SmartFlow Demo Request Form (Ответы)
- Sформу (1)

Test row:

- Company: Demo Menuiserie Genève 7
- Contact: Marc Blanc Test 7
- Email: marc.demo7@example.com
- Phone: +41 79 777 88 90
- Source: Website form
- Request type: Website contact flow
- Message: Make dry-run test after demo sheet readiness update
- Language: FR

Phone formatting note:

- Phone was inserted as text with an apostrophe before the value to prevent Google Sheets formula parsing or #ERROR! issues.

## Result

Make Run once completed successfully.

Modules processed:

- Google Sheets — Watch New Rows: 1
- OpenAI — Generate a completion: 1
- Google Sheets — Add a Row: 1

CRM output:

- SmartFlow CRM Demo
- Sheet: CRM Demo
- New row created for Demo Menuiserie Genève 7

Verified output:

- Phone displayed correctly.
- No #ERROR! phone formatting issue.
- AI summary was generated.
- Notes included: Imported from response by Make demo. No email sent.

## Safety confirmation

- Run mode: manual Run once only.
- Make schedule remained OFF.
- Every 15 minutes schedule was not enabled.
- No Gmail module was present.
- No external email was sent.
- No production system was changed.
- No database change was made.
- No API change was made.

## Status

Dry-run status: Passed  
Client-facing: No  
Manual review required before any client-facing use: Yes
