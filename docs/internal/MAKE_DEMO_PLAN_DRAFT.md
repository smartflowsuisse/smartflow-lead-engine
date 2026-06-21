# SmartFlow Suisse — Make Demo Plan Draft

## 1. Purpose

This document defines the first simple Make demo for SmartFlow Suisse.

Goal:

- show a practical automation flow;
- avoid complex systems;
- use test data only;
- demonstrate value to a first client;
- keep all client-facing actions manual and safe.

## 2. Demo concept

Simple workflow:

Lead / request → Google Sheets CRM → AI draft → follow-up task → internal notification

The demo should show how a small company can avoid losing incoming requests and follow-ups.

## 3. Tools

Initial tools:

- Make;
- Google Sheets;
- Gmail or email draft concept;
- AI text generation for internal draft only;
- Google Drive / Docs for documentation.

Do not use at this stage:

- public SaaS;
- n8n;
- HubSpot;
- automated mass email;
- direct client email sending;
- sensitive client data.

## 4. Demo data

Use fake/test data only.

Example lead:

- Company: Demo Construction SA
- Contact: Jean Martin
- Email: demo@example.com
- Phone: +41 00 000 00 00
- Source: website form
- Request: renovation quote request
- Status: New
- Follow-up date: tomorrow
- Notes: test data only

## 5. Google Sheets CRM structure

Columns:

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

Statuses:

- New
- Contacted
- Follow-up
- Meeting
- Proposal
- Won
- Lost

## 6. Make scenario v1

Trigger:

- manual test webhook;
- or Google Forms test submission;
- or new row in Google Sheets.

Actions:

1. Receive test request.
2. Add row to Google Sheets CRM.
3. Generate short internal AI draft.
4. Add AI draft into the row.
5. Create follow-up date.
6. Send internal notification to SmartFlow only.

Important:

- no email is sent to the client automatically;
- AI output is draft only;
- human approval remains required.

## 7. AI draft prompt concept

Prompt goal:

Create a short polite reply draft in French based on the request.

Rules:

- do not send;
- do not promise price;
- ask for missing details if needed;
- keep tone professional;
- mention human review.

Example output:

Bonjour,

Merci pour votre demande. Nous avons bien reçu les informations concernant votre projet. Afin de mieux comprendre votre besoin, pourriez-vous nous préciser le délai souhaité et quelques détails supplémentaires sur les travaux?

Cordialement,

## 8. Demo explanation for client

Explain simply:

This is not a complex CRM.

It is a simple workflow that helps you see:

- new requests;
- who has been contacted;
- what needs follow-up;
- draft replies prepared for review;
- open opportunities.

## 9. Safety rules

Demo safety:

- test data only;
- no real customer data without approval;
- no automatic sending;
- no production changes;
- no private inbox connection in first demo;
- no sensitive documents;
- no billing/accounting connection.

## 10. Success criteria

The demo is successful if:

- a test request appears in Google Sheets;
- the row has a clear status;
- the AI draft is generated;
- a follow-up date exists;
- SmartFlow receives internal notification;
- the process is understandable in 2–3 minutes.

## 11. First version scope

Build only:

- one test trigger;
- one Google Sheets table;
- one AI draft;
- one internal notification;
- one follow-up field.

Do not build:

- client portal;
- advanced dashboard;
- automated outreach;
- full CRM;
- paid integration;
- complex permissions.

## 12. Demo video structure

Short screen recording:

1. Show fake request.
2. Run Make scenario.
3. Show Google Sheets row created.
4. Show AI draft.
5. Show follow-up date.
6. Explain human approval.
7. End with next step: audit / quick win.

Length:

- 2–3 minutes maximum.

## 13. Next tasks

1. Create Google Sheets demo table.
2. Create Make account/scenario.
3. Build test trigger.
4. Add AI draft step.
5. Add internal notification.
6. Record short demo video.
7. Prepare client-facing explanation in French.
