# SmartFlow Suisse — Client Operating Kit Fake Run

## Purpose

This document tests the SmartFlow Suisse Client Operating Kit with a fake client scenario before using it with a real first client.

The goal is to verify whether the process is practical, safe, and ready for real client work.

This is not a real client project.

---

## Fake client

Company:

**Demo Menuiserie Genève**

Type:

Small carpentry / renovation company in Suisse romande.

Language:

French.

Main problem:

The company receives client requests through email, phone, and a website form, but follow-up is manual and inconsistent.

Current risk:

- requests can be forgotten;
- no simple CRM;
- no clear lead status;
- no structured follow-up;
- no internal summary before replying;
- owner handles too much manually.

---

## Test flow

The fake run follows this order:

1. First contact
2. Discovery call
3. Client intake
4. Audit
5. First offer
6. Pilot setup
7. QA check
8. Handover
9. Support rules
10. Scope/payment decision

---

## 1. First contact

Simulated situation:

The fake client asks:

> Bonjour, nous recevons beaucoup de demandes par email et formulaire, mais nous avons du mal à suivre les clients. Pouvez-vous nous aider avec une solution simple ?

Safe response goal:

- acknowledge the problem;
- do not promise a full automation yet;
- propose a short discovery call;
- explain that SmartFlow first reviews the workflow before implementation.

Relevant document:

- `docs/internal/FIRST_CLIENT_REPLY_HANDLING.md`
- `docs/internal/CLIENT_OPERATING_KIT.md`

Decision:

Continue to discovery call.

---

## 2. Discovery call

Questions to ask:

1. Where do new requests arrive?
2. Who receives them first?
3. Where are they stored?
4. Who replies to the client?
5. What is often forgotten?
6. What tool is currently used?
7. What should not be automated?
8. What would save the most time in the first month?
9. Who approves changes?
10. What is the safest first improvement?

Fake answers:

- requests arrive by email and website form;
- owner receives most requests;
- no CRM, only email inbox and notes;
- follow-up is manual;
- some prospects are forgotten after first reply;
- no automatic external email should be sent;
- first priority is a simple lead tracking system.

Relevant document:

- `docs/internal/CLIENT_INTAKE_TEMPLATE.md`

Decision:

Continue to intake.

---

## 3. Client intake

Minimum intake fields:

- Company name: Demo Menuiserie Genève
- Contact person: Jean Demo
- Email: demo@example.com
- Website: demo-menuiserie.example
- Business type: carpentry / renovation
- Current tools: email, website form, no CRM
- Main problem: no structured follow-up
- First pilot idea: form/email request to simple CRM + AI-assisted internal summary
- Access needed: example request, form fields, Google Sheet or CRM structure
- Preferred language: French

Safety notes:

- no real client data;
- no passwords;
- no production changes;
- no automatic external email sending.

Decision:

Intake is sufficient for fake audit.

---

## 4. Audit

Audit findings:

What works:

- the business receives leads;
- there is client demand;
- email is already used;
- a simple process can improve follow-up.

What is weak:

- no lead status;
- no owner per lead;
- no next action date;
- no central CRM;
- no structured client summary;
- no handover process.

First safe opportunity:

Create a simple CRM workflow:

1. new request enters a tracking table;
2. lead status is assigned;
3. AI generates internal summary;
4. human reviews;
5. manual follow-up remains required.

Relevant documents:

- `docs/internal/CLIENT_AUDIT_CHECKLIST_DRAFT.md`
- `docs/internal/CLIENT_OPERATING_KIT.md`

Decision:

First paid pilot is more appropriate than large implementation.

---

## 5. First offer

Recommended offer:

**Paid diagnostic + first controlled pilot**

Fake offer structure:

- review current request flow;
- create simple CRM/tracking structure;
- prepare AI-assisted internal lead summary;
- define manual follow-up steps;
- run QA check;
- deliver handover notes.

Not included:

- full CRM migration;
- automatic external email sending;
- mass outreach;
- complex dashboard;
- accounting integration;
- unlimited revisions.

Relevant document:

- `docs/internal/CLIENT_SCOPE_PAYMENT_RULES.md`

Decision:

Offer is controlled and safe.

---

## 6. Pilot setup

Fake pilot:

**Lead Follow-up Starter Workflow**

Input:

- website form or manual request entry.

Processing:

- request is stored in CRM/tracking sheet;
- AI prepares internal summary;
- lead status and next action are visible.

Output:

- CRM row;
- internal AI summary;
- manual follow-up task.

Human review:

Required before any external reply.

Relevant documents:

- `docs/internal/MAKE_DEMO_WORKFLOW.md`
- `docs/internal/CLIENT_WORKFLOW_TEMPLATES.md`
- `docs/internal/CLIENT_OPERATING_KIT.md`

Decision:

Pilot is small enough.

---

## 7. QA check

QA checklist result:

- Scope clear: yes
- Access clear: partial, would need real client confirmation
- Input clear: yes
- Processing clear: yes
- Output clear: yes
- No external automatic email: yes
- AI reviewed manually: yes
- Data safety acceptable: yes
- Handover required: yes
- Support rules required: yes

Relevant document:

- `docs/internal/CLIENT_QA_CHECKLIST.md`

Decision:

Safe for demo, not yet real implementation until real access is reviewed.

---

## 8. Handover

Fake handover must explain:

- what was delivered;
- how the workflow works;
- how to test;
- what not to change;
- known limitations;
- what to do if something breaks;
- support rules;
- next step.

Relevant document:

- `docs/internal/CLIENT_HANDOVER_PACK.md`

Decision:

Handover pack is necessary before delivery.

---

## 9. Support

Support classification:

Included only if agreed:

- small checks;
- minor text correction;
- workflow check;
- usage question.

Not included by default:

- new workflow;
- new integration;
- automatic email sending;
- CRM migration;
- redesign;
- unlimited support.

Relevant document:

- `docs/internal/CLIENT_SUPPORT_RULES.md`

Decision:

Support rules protect SmartFlow from uncontrolled unpaid work.

---

## 10. Scope/payment decision

Fake decision:

Do not start with a large fixed-price implementation.

Best first commercial path:

1. free first discussion;
2. paid diagnostic;
3. first paid pilot;
4. support plan or second phase later.

Relevant document:

- `docs/internal/CLIENT_SCOPE_PAYMENT_RULES.md`

Decision:

This path is safer for survival, revenue, and delivery quality.

---

## Fake run result

Status:

**Passed with conditions**

What is ready:

- first-client operating flow;
- intake;
- QA;
- handover;
- support rules;
- scope/payment rules.

What still needs practical strengthening:

1. real client folder structure in Google Drive;
2. French client-facing one-page offer;
3. invoice/devis template;
4. password/access management process;
5. one full Make demo run using the same fake client.

---

## Final conclusion

The Client Operating Kit is usable for first-client preparation.

SmartFlow Suisse should use this flow for the first real client:

1. do not jump directly into implementation;
2. run discovery and intake first;
3. sell diagnostic or first paid pilot;
4. keep automation controlled;
5. preserve manual review;
6. complete QA before delivery;
7. deliver handover notes;
8. classify support and change requests.

