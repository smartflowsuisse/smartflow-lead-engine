# Make Dynamic Mapping Test Log

## Purpose

This internal log records the manual Make demo test where the OpenAI module was corrected to use dynamic Google Sheets mapping instead of static test values.

## Date

2026-06-23

## Scenario

Make scenario tested:

SmartFlow Demo — Sheet AI Summary

Workflow:

1. Google Sheets — Watch New Rows
2. OpenAI — Generate a completion
3. Google Sheets — Update a Row

## Test data

A safe fake/demo row was added to the Google Sheet:

- Company: Dynamic Mapping Test
- Contact: Claire Demo
- Email: dynamic.mapping@example.com
- Phone: +41 79 000 00 88
- Source: Website form
- Request type: Website contact flow
- Message: Test dynamic mapping only. No real client. No email sending.
- Language: FR

## Issue found

The OpenAI prompt originally contained static test values:

- Make Test Company
- Test User
- test@example.com

This caused the generated internal summary to reuse old demo data instead of the current Google Sheets row.

## Fix applied in Make

The OpenAI prompt input block was changed to use dynamic mapped fields from Google Sheets module 1:

- Company name
- Contact name
- Email
- Phone
- Source
- Request type
- Message
- Language

## Test result

Manual Run once was executed successfully.

The scenario processed one safe demo row and updated the same Google Sheets row.

Confirmed result:

- AI internal summary used the correct dynamic row data.
- Company was Dynamic Mapping Test.
- Contact was Claire Demo.
- AI draft reply column remained empty.
- AI next action was filled for manual review.
- AI status was set to Processed.
- Processed timestamp was added.

## Safety confirmation

- No automatic external email sending.
- No Gmail module used.
- No real recipient contacted.
- No mass outreach.
- No database changes.
- No production deployment.
- Scenario remained inactive after the manual test.
- Every 15 minutes automation was not enabled.
- Human review remains required before any real client-facing use.

## Internal conclusion

The Make demo flow now works correctly for internal AI summary generation using dynamic Google Sheets mapping.

Next improvement should be tested only with safe demo data and should not add automatic external sending.
