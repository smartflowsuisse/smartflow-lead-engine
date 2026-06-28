# SmartFlow Suisse — Make Demo Fake Client Run

## Purpose

This document defines a safe fake-client Make demo run for SmartFlow Suisse first-client readiness.

The goal is to connect the Client Operating Kit with a practical demo workflow:

Fake request → CRM/tracking → AI-assisted internal summary → manual review → QA → handover.

This is an internal test plan only.

No live automation should be enabled from this document.

---

## Fake client

Company:

**Demo Menuiserie Genève**

Type:

Small carpentry / renovation company in Suisse romande.

Language:

French.

Fake contact:

Jean Demo

Fake request:

> Bonjour, nous souhaitons rénover une cuisine à Genève. Pouvez-vous nous rappeler pour discuter du projet et préparer une estimation ?

Business problem:

The company receives requests by email and website form but does not have a clear CRM or follow-up process.

---

## Demo objective

The demo should show that SmartFlow can create a simple controlled workflow:

1. capture a new request;
2. store it in a CRM/tracking sheet;
3. generate an AI-assisted internal summary;
4. keep external communication manual;
5. prepare next action for human review;
6. verify the workflow with QA;
7. prepare handover notes.

---

## Safe workflow

Recommended demo flow:

1. Fake request submitted or manually entered.
2. Request appears in source sheet or demo intake table.
3. Make scenario is run manually with `Run once`.
4. OpenAI generates an internal summary.
5. Result is written to SmartFlow CRM Demo / tracking sheet.
6. Human reviews result.
7. No external email is sent.
8. QA checklist is completed.
9. Handover notes are prepared.

---

## Tools involved

Possible tools:

- Google Form or manual entry;
- Google Sheets source table;
- Make scenario;
- OpenAI module;
- SmartFlow CRM Demo / tracking sheet;
- internal review;
- QA checklist;
- handover pack.

Do not include:

- Gmail sending module;
- mass outreach;
- automatic external email;
- production website changes;
- real client data;
- real client credentials.

---

## Required demo fields

Minimum request fields:

- Company name
- Contact person
- Email
- Phone
- Service requested
- Location
- Message
- Preferred language
- Source
- Status
- Priority
- Next action

Fake values:

- Company name: Demo Menuiserie Genève
- Contact person: Jean Demo
- Email: jean.demo@example.com
- Phone: +41 22 000 00 00
- Service requested: kitchen renovation
- Location: Genève
- Message: request for kitchen renovation estimate
- Preferred language: French
- Source: Fake demo
- Status: New
- Priority: Medium
- Next action: manual review and call preparation

---

## AI summary expected output

The AI output should be internal only.

Expected structure:

1. Client request summary
2. Service needed
3. Location
4. Urgency / priority
5. Suggested next action
6. Missing information
7. Manual follow-up note

Example expected summary:

- The prospect is asking about a kitchen renovation in Geneva.
- The request should be reviewed manually before replying.
- Missing details include approximate timeline, budget, address, and preferred callback time.
- Recommended next action: call or email manually to qualify the project.

---

## Manual review rule

Human review is mandatory.

Before any client-facing reply:

- verify contact details;
- verify language;
- verify AI summary;
- check missing information;
- decide whether to reply, call, or request more details;
- m external message.

No automatic external email sending is allowed in this demo.

---

## QA checklist

Use:

- `docs/internal/CLIENT_QA_CHECKLIST.md`

QA must verify:

- source data is fake;
- input fields are correct;
- Make mapping uses current row/request;
- AI output is internal only;
- output goes to correct CRM/tracking sheet;
- no Gmail/external sending module is active;
- test result is clear;
- limitations are documented.

---

## Handover notes

Use:

- `docs/internal/CLIENT_HANDOVER_PACK.md`

Fake handover should explain:

- what was tested;
- how the workflow works;
- what the client would use;
- what not to change;
- known limitations;
- support rules;
- next step after pilot.

---

## Scope/payment logic

Use:

- `docs/internal/CLIENT_SCOPE_PAYMENT_RULES.md`

Commercial conclusion:

This demo supports a first paid pilot, not a large implementation.

Recommended first paid pilot:

**Lead Follow-up Starter Workflow**

Includes:

- simple lead tracking;
- AI-assisted internal summary;
- manual follow-up process;
- QA;
- handover notes.

Does not include:

- automatic external email sending;
- full CRM migration;
- complex dashboard;
- mass outreach;
- accounting integration;
- unlimited support.

---

## Pass criteria

The fake Make demo run passes if:

1. fake input is captured;
2. CRM/tracking output is created;
3. AI summary is useful and factual;
4. manual review is preserved;
5. no external email is sent;
6. QA checklist can be completed;
7. handover notes can be prepared;
8. the workflow supports a first paid pilot offer.

---

## Fail conditions

The demo fails if:

- real client data is used;
- wrong row/request is processed;
- AI invents unsupported facts;
- output goes to wrong file;
- Gmail or external sending is active;
- test data mixes with real data;
- Make connection uses wrong account;
- workflow cannot be explained to a client;
- scope/payment decision is unclear.

---

## Current status

Status:

**Planned**

This document prepares the Make fake-client run.

The actual Make run must be executed separately and manually, with screenshots or notes captured after the test.

---

## Next action

Recommended next step:

1. verify current Make demo scenario;
2. verify Google Sheets source and CRM demo ownership;
3. run fake request manually;
4. run Make scenario with `Run once`;
5. record result;
6. complete QA;
7. create a run log document.

Recommended next document after manual test:

- `MAKE_DEMO_FAKE_CLIENT_RUN_LOG.md`


---

## AI priority wording rule

This rule prevents the AI summary from confusing manual review with lead priority.

Problem observed:

- In the manual Make demo test for `Demo Menuiserie Genève 8`, the AI summary returned `Priorité: Manuel`.
- This was not ideal because the CRM priority field was `Medium`.
- Manual review is a safety requirement and next action, not the lead priority value.

Required prompt rule:

When generating the internal summary:

- use the CRM/source priority value when available;
- if no explicit priority is provided, use `Medium` for the demo workflow;
- do not write `Manuel` as the priority;
- keep manual review under `Prochaine action`, not under `Priorité`.

Expected output example:

```text
Résumé interne:
- Entreprise: Demo Menuiserie Genève 8
- Contact: Jean Demo Test 8
- Besoin: Kitchen renovation
- Priorité: Medium
- Prochaine action: Revue manuelle uniquement
```

Safe Make prompt addition:

```text
Priority rule:
Use the CRM/source priority value when available. If no explicit priority is provided, write "Medium". Do not write "Manuel" as the priority. Manual review belongs in "Prochaine action", not in "Priorité".
```

Safety rules:

- this is a documentation-only prompt rule;
- do not enable Make scheduling from this change;
- do not add Gmail sending;
- do not send external email;
- do not use real client data;
- test only with `Run once`.
