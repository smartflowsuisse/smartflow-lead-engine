# SmartFlow Make Demo Workflow

## Purpose

This document describes the internal SmartFlow Make demo workflow for first-client readiness.

The demo is designed to show a safe, human-supervised automation flow for Swiss SMEs:

Google Form → Google Sheet → Make → AI summary → manual next step.

This workflow is for internal demo and preparation only. It must not send automatic emails or contact real leads without manual human approval.

## Current ownership and account setup

Target SmartFlow account:

- smartflowsuisse@gmail.com

Current demo assets:

- Google Form: SmartFlow Demo Request Form
- Google Sheet: SmartFlow CRM Demo
- Make scenario: SmartFlow Demo — Sheet AI Summary

The Google Form and Google Sheet should remain owned by or accessible through the SmartFlow account.

Before changing any connection, module, automation, or scenario, verify:

- which Google account owns the Form;
- which Google account owns the Sheet;
- which Google account is connected in Make;
- whether the scenario is active or inactive;
- whether the scenario can send anything externally.

## Intended workflow

### Step 1 — Demo request form

A test/demo request is submitted through the Google Form.

The form should collect only safe demo data, such as:

- company name;
- contact name;
- email;
- phone;
- website;
- service interest;
- message or request details.

No sensitive real client data should be used in the demo unless there is a clear business reason and manual approval.

### Step 2 — Google Sheet CRM

The form data or demo lead data is stored in the SmartFlow CRM Demo Google Sheet.

The sheet acts as a lightweight CRM table for the demo.

Expected fields may include:

- created date;
- company;
- contact name;
- email;
- phone;
- website;
- source;
- language;
- status;
- priority;
- AI summary;
- draft reply;
- next action;
- notes.

### Step 3 — Make scenario

The Make scenario reads a new or selected row from the Google Sheet.

The scenario may generate:

- an AI summary;
- a suggested priority;
- a draft next action;
- a draft reply text for manual review.

The scenario must not automatically send external emails in Phase 1.

### Step 4 — AI summary

The AI summary should help SmartFlow understand the request quickly.

The summary should be short, practical, and safe.

Recommended structure:

- what the company needs;
- possible business problem;
- suggested SmartFlow service;
- recommended next step;
- risk or missing information.

### Step 5 — Manual review

A human must review the AI output before any external action.

Manual review should check:

- company name;
- emailcontext;
- whether the lead is real or demo;
- whether the AI summary is accurate;
- whether the suggested next action is appropriate;
- whether any external communication is allowed.

### Step 6 — Manual next step

Allowed safe outputs:

- update the Google Sheet;
- prepare a draft reply;
- create an internal note;
- create a manual follow-up task;
- copy text manually into an email after review.

Not allowed in Phase 1:

- automatic external email sending;
- mass outreach;
- sending to unverified addresses;
- using real client data without a clear reason;
- changing production/client-facing systems without review.

## Safety rules

### No automatic sending

The Make demo must not send emails automatically.

Any email module, if added later, must stay disabled until explicitly approved and tested.

### No mass outreach

The scenario must not be used for bulk cold outreach.

It is a controlled demo and client-readiness workflow only.

### Human approval required

A human must approve any external message before it is sent.

### Account verification required

Before connecting or changing any Google/Make app, verify that the connection belongs to the correct SmartFlow account.

Preferred account:

- smartflowsuisse@gmail.com

### Demo data preferred

Use fake or low-risk demo data by default.

Real client data should only be used when necessary and with manual care.

## Current expected scenario status

Expected current state:

- Form exists under SmartFlow account.
- Sheet exists under SmartFlow account.
- Make connections are connected to SmartFlow.
- Scenario works manually.
- Automatic scheduling is off.
- No automatic emails are sent.
- Old shortcut was replaced by the new correct shortcut.

## Future improvements

Possible next improvements:

- add a clearer demo checklist;
- add Gmail draft creation without sending;
- add internal notification only;
- add lead priority scoring;
- add a client audit PDF output;
- add a Make scenario test log;
- add a manual approval field in the Sheet.

Do not add automatic external sending until the workflow is stable and explicitly approved.
