# SmartFlow Suisse — Client Operating Kit

## Purpose

This document is the main operating map for handling the first real SmartFlow Suisse client.

It does not replace existing readiness documents.  
It connects them into one practical client workflow.

Primary goal:

- avoid improvisation when a client appears;
- use prepared templates and checklists;
- keep client work safe, manual, and controlled;
- move from first contact to paid pilot without building tools from zero.

---

## Current rule

SmartFlow Suisse should not start by selling a large complex system.

The safest first paid offer is:

**Paid diagnostic + first controlled pilot**

The client-facing promise:

> We review your current lead/admin workflow, identify where time is lost, and prepare a simple first AI-assisted workflow that remains under human control.

---

## Operating flow

The working order for the first client is:

1. First contact
2. Discovery call
3. Client intake
4. Audit
5. First offer / paid diagnostic
6. Pilot setup
7. QA check
8. Delivery notes
9. Support / next step

No step should be skipped.

---

## 1. First contact

Use when a lead replies, asks for more information, or shows interest.

Relevant documents:

- `docs/internal/FIRST_CLIENT_REPLY_HANDLING.md`
- `docs/internal/REPLY_HANDLING_PROCESS_DRAFT.md`
- `docs/internal/FRENCH_DISCOVERY_EMAIL_TEMPLATES.md`
- `docs/internal/FIRST_CLIENT_NEXT_ACTIONS.md`

Goal:

- answer safely;
- do not oversell;
- move toward a discovery call;
- do not promise custom automation before understanding the workflow.

Safe rule:

- no mass outreach;
- no automatic sending;
- manual review before every client-facing message.

---

## 2. Discovery call

Use this before making a proposal.

Relevant documents:

- `docs/internal/DISCOVERY_CALL_QUESTIONS_DRAFT.md`
- `docs/internal/FIRST_CLIENT_CALL_SHEET.md`
- `docs/internal/FIRST_CLIENT_DEMO_SHEET_DRAFT.md`

Minimum questions:

1. What happens when a new client request arrives?
2. Where does the request arrive: email, website form, phone, WhatsApp, other?
3. Who handles it?
4. Where is the request stored?
5. What is repeated manually?
6. What is often forgotten or delayed?
7. Which tools are currently used?
8. What should never be automated?
9. What would save the most time in the first month?
10. Who approves changes?

Output after the call:

- short summary;
- current workflow;
- main pain;
- possible first pilot;
- next action.

---

## 3. Client intake

Use after the client agrees to continue.

Required intake data:

- company name;
- contact person;
- email;
- website;
- business type;
- current tools;
- example lead/request;
- current workflow;
- preferred language;
- access needed;
- urgent problem;
- decision maker;
- expected timeline.

Use:

- `docs/internal/CLIENT_INTAKE_TEMPLATE.md`

Purpose:

- collect minimum client information before audit or implementation;
- clarify current workflow, tools, access needs, first problem, and first pilot idea;
- prevent unclear scope, unsafe access handling, and wrong assumptions.

Important rule:

Do not start implementation before intake is completed or manually reviewed.

---

## 4. Audit

Use before quoting any implementation.

Relevant documents:

- `docs/internal/CLIENT_AUDIT_CHECKLIST_DRAFT.md`
- `docs/internal/ONE_PAGE_CLIENT_AUDIT_STRUCTURE.md`
- `docs/internal/LEAD_AUDIT_READINESS_WORKFLOW.md`
- `docs/internal/DATA_SAFETY_RULES_DRAFT.md`

Audit areas:

1. Website and forms
2. Lead capture
3. Email flow
4. CRM or spreadsheet structure
5. Manual follow-up
6. Data safety
7. Repeated admin tasks
8. First automation opportunity

Audit output:

- what works;
- what is broken;
- what is risky;
- what can be improved first;
- what should not be touched yet.

---

## 5. First offer

Preferred first offer:

**Paid diagnostic + first pilot**

Relevant documents:

- `docs/internal/FIRST_PAID_PILOT_OFFER.md`
- `docs/internal/SMARTFLOW_FIRST_OFFER_DRAFT.md`
- `docs/internal/FIRST_CLIENT_MINI_PROPOSAL_STRUCTURE.md`
- `docs/internal/FRENCH_ONE_PAGE_CLIENT_SUMMARY_TEMPLATE.md`

Safe pricing logic:

- small diagnostic if trust is low;
- first paid pilot if pain is clear;
- larger implementation only after workflow is understood.

Do not sell:

- complex CRM;
- full SaaS;
- automatic email sending;
- large unknown automation scope.

---

## 6. Pilot setup

Recommended first pilot options:

1. Form to CRM
2. Email/request to CRM
3. AI-assisted internal lead summary
4. Manual follow-up workflow
5. Internal notification
6. Simple dashboard / tracking sheet

Relevant documents:

- `docs/internal/MAKE_DEMO_WORKFLOW.md`
- `docs/internal/CLIENT_WORKFLOW_TEMPLATES.md`
- `docs/internal/GOOGLE_SHEETS_CRM_DEMO_STRUCTURE_DRAFT.md`
- `docs/internal/MAKE_DEMO_PLAN_DRAFT.md`
- `docs/internal/MAKE_DYNAMIC_MAPPING_TEST_LOG.md`

Safe output types:

- CRM row;
- AI summary;
- internal notification;
- draft text;
- manual review task.

Not allowed by default:

- automatic external email sending;
- mass outreach;
- production changes without check;
- access sharing without review.

---

## 7. QA check

Before showing or delivering anything to the client, verify:

1. Input works.
2. Data lands in the right place.
3. Required fields are captured.
4. AI summary uses the correct row/client.
5. No wrong recipient is used.
6. No automatic external email is sent.
7. Access rights are correct.
8. Test data is separated from real data.
9. Error case is understood.
10. Client instruction is ready.

Relevant documents:

- `docs/internal/CLIENT_DEMO_CHECKLIST.md`
- `docs/internal/DEMO_CLIENT_FIRST_PACK.md`
- `docs/internal/FIRST_DEMO_FLOW_RUN_LOG.md`

Use:

- `docs/internal/CLIENT_QA_CHECKLIST.md`

Purpose:

- verify scope, access, input, processing, output, email safety, AI output, data safety, client test, and delivery readiness before showing or delivering client work.

Important rule:

No client workflow should be considered ready without a manual QA check.

---

## 8. Delivery

Before handover, prepare:

- what was built;
- how it works;
- how to test it;
- what the client must not change;
- what to do if something breaks;
- what is included after delivery;
- what is not included.

Relevant documents:

- `docs/internal/FRENCH_MAKE_DEMO_CLIENT_GUIDE.md`
- `docs/internal/FIRST_CLIENT_PACK_DRAFT.md`
- `docs/internal/DEMO_CLIENT_FIRST_PACK.md`

Use:

- `docs/internal/CLIENT_HANDOVER_PACK.md`

Purpose:

- prepare clear client delivery notes;
- explain what was delivered, how it works, how to test it, what not to change, known limitations, support rules, and next steps;
- avoid unclear handover after a pilot or implementation.

Important rule:

Do not deliver client work without clear handover notes.

---

## 9. Support and next step

After pilot delivery, offer a controlled support path.

Support may include:

- small fixes;
- workflow monitoring;
- form/CRM checks;
- small text updates;
- monthly review.

Support should not include by default:

- new large workflows;
- new systems;
- redesign;
- unlimited changes;
- automatic email sending;
- emergency support without agreement.

Use:

- `docs/internal/CLIENT_SUPPORT_RULES.md`

Purpose:

- define what is included after delivery;
- separate included support, minor paid adjustments, new scope, urgent issues, and unsafe requests;
- prevent small pilots from turning into unlimited unpaid work.

Important rule:

Support is not unlimited implementation. Every post-delivery request must be classified before action.

---

## Scope and payment rules

Use:

- `docs/internal/CLIENT_SCOPE_PAYMENT_RULES.md`

Purpose:

- define scope, deliverables, exclusions, payment terms, approval rules, and change request handling before paid work starts;
- protect SmartFlow from unpaid implementation, unclear client expectations, and oversized fixed-price promises;
- separate free discussion, paid diagnostic, first paid pilot, larger implementation, and support.

Important rule:

No paid client work should start without clear scope, payment terms, approval, and risk review.

---

## Current missing practical tools

The following tools are still needed before the first client:

1. simple invoice / devis template
2. password/access management process

---

## First-client readiness decision

SmartFlow Suisse can already show a controlled demo.

SmartFlow Suisse should not yet claim full operational agency readiness until the following are completed:

- intake template;
- QA checklist;
- handover pack;
- support rules;
- scope/payment structure.

---

## Safety rules

1. No mass outreach.
2. No automatic external email sending.
3. No production changes without checks.
4. No client access stored in plain documents.
5. No implementation before audit.
6. No fixed-price large project without defined scope.
7. No promise of integration before tool/access review.
8. Human review remains mandatory for client-facing output.

---

## Recommended immediate next actions

1. Create `CLIENT_INTAKE_TEMPLATE.md`.
2. Create `CLIENT_QA_CHECKLIST.md`.
3. Create `CLIENT_HANDOVER_PACK.md`.
4. Create `CLIENT_SUPPORT_RULES.md`.
5. Add all four to the readiness index.
6. Run one fake client cycle using the operating kit.

