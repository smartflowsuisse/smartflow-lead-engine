# SmartFlow Suisse — Google Sheets CRM Demo Structure Draft

## 1. Purpose

This document defines the first simple Google Sheets CRM demo structure for SmartFlow Suisse.

Goal:

- create a simple CRM view for demo and client explanation;
- support the Make demo workflow;
- avoid complex CRM tools at the beginning;
- keep all data visible and understandable;
- use test data only before client approval.

## 2. Main concept

The first demo CRM is a Google Sheets table.

It should show:

- incoming requests;
- contact details;
- request summary;
- status;
- priority;
- follow-up date;
- AI draft;
- notes.

This is not a full CRM replacement.

It is a simple operational view for small businesses.

## 3. Recommended columns

Use these columns:

1. Created at
2. Company
3. Contact name
4. Email
5. Phone
6. Source
7. Request summary
8. Status
9. Priority
10. Follow-up date
11. AI draft
12. Notes
13. Owner
14. Last updated
15. Next action

## 4. Status values

Recommended statuses:

- New
- Contacted
- Follow-up
- Meeting
- Proposal
- Won
- Lost

Rules:

- New: request received but not handled yet.
- Contacted: human sent a reply or made contact.
- Follow-up: waiting for next action.
- Meeting: call scheduled or completed.
- Proposal: offer sent.
- Won: client accepted.
- Lost: not a fit or declined.

## 5. Priority values

Recommended values:

- Low
- Medium
- High

High priority if:

- urgent request;
- good fit;
- clear contact details;
- clear business pain;
- decision-maker involved.

## 6. Source values

Recommended values:

- Website form
- Email
- Phone
- Referral
- Manual entry
- Demo test
- Other

## 7. Test data

Use fake test data only.

Example rows:

### Row 1

- Company: Demo Construction SA
- Contact name: Jean Martin
- Email: demo@example.com
- Phone: +41 00 000 00 00
- Source: Website form
- Request summary: Renovation quote request
- Status: New
- Priority: High
- Follow-up date: tomorrow
- Notes: Test data only

### Row 2

- Company: Exemple Rénovation Sàrl
- Contact name: Marie Dubois
- Email: test@example.com
- Phone: +41 00 000 00 01
- Source: Email
- Request summary: Client asks for appointment
- Status: Follow-up
- Priority: Medium
- Follow-up date: next week
- Notes: Test data only

## 8. Make demo connection

Make scenario should:

1. Receive a test request.
2. Add a new row to Google Sheets.
3. Fill basic fields.
4. Generate AI draft.
5. Add follow-up date.
6. Send internal notification to SmartFlow.

Important:

- do not send emails to client automatically;
- AI draft is internal only;
- human review is required.

## 9. AI draft column

The AI draft column should contain a short French reply draft.

Example:

Bonjour,

Merci pour votre demande. Nous avons bien reçu les informations concernant votre projet. Afin de mieux comprendre votre besoin, pourriez-vous nous préciser le délai souhaité et quelques détails supplémentaires?

Cordialement,

Rule:

The draft must not be sent automatically.

## 10. Notes column

Use notes for:

- manual review;
- source of information;
- client context;
- safety notes;
- follow-up decisions;
- data quality issues.

Example note:

Test data only. AI draft generated for internal review. No email sent.

## 11. Safety rules

Before using real client data:

- get client approval;
- confirm what data can be stored;
- avoid sensitive data;
- do not import full customer lists;
- do not connect private inbox without approval;
- do not automate sending;
- keep manual review.

## 12. Demo explanation

Explain to client:

This table helps you see:

- new requests;
- who needs a reply;
- what needs follow-up;
- which requests are open;
- which replies are only drafts;
- what the next action is.

## 13. First demo success criteria

Success if:

- test request creates a row;
- status is visible;
- follow-up date exists;
- AI draft is visible;
- SmartFlow receives internal notification;
- client understands the workflow in 2–3 minutes.

## 14. Next tasks

1. Create Google Sheets file manually.
2. Add columns.
3. Add 2 fake demo rows.
4. Connect Make test scenario.
5. Generate AI draft into the sheet.
6. Record 2–3 minute demo.
7. Prepare French explanation.
