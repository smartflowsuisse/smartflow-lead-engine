# First Client Execution Roadmap

## Purpose

This document defines the strict execution order for SmartFlow Suisse before the first paid client.

The goal is to prevent context loss, unnecessary development, repeated Make/Sheets checks, unfocused UI work, and non-commercial improvements.

SmartFlow Suisse is now in controlled first-client execution mode.

---

## Current Project State

SmartFlow Suisse already has a working internal foundation:

- Lead Engine works as an internal CRM and outreach control tool.
- Make demo works manually.
- Google Sheets → Make → OpenAI → CRM Demo has been verified.
- Every 15 minutes schedule is OFF.
- No Gmail module exists in Make.
- No automatic external email sending exists.
- No mass outreach is allowed.
- Swissroc has received the first confirmed manual outreach email.
- Swissroc is marked Contacted in CRM.
- A Swissroc follow-up task exists.
- DMC remains delivery unconfirmed and must not be marked Contacted.
- Git main must remain clean before and after each work block.
- Production, Vercel, API, database, Make schedule, and Gmail automation must not be touched unless explicitly required by a roadmap step.

---

## Main Objective

The objective is to get the first paid pilot client.

The working path is:

mini-audit → one-page offer → reply handling → demo readiness → controlled outreach → first paid pilot.

The priority is not to build more features.

The priority is to create the commercial execution package and move one qualified prospect at a time.

---

## Core Rule

Do not start new development unless it directly supports the first paid client.

Roadmap changes are allowed only if the change clearly increases the chance of getting the first paid client or reduces a concrete execution risk.

---

## Strict Execution Order

### Step 1 — Swissroc Public Mini-Audit

Create:

`SWISSROC_ONE_PAGE_PUBLIC_MINI_AUDIT_2026_06_29.md`

Purpose:

- Prepare a public-only mini-audit for Swissroc.
- Use only publicly visible information.
- Do not claim internal problems.
- Do not diagnose their internal process.
- Use cautious wording such as "possible friction point", "could be reviewed", and "public contact path".

Status:

`TODO`

Exit criteria:

- Document created.
- Public-only note included.
- No unsupported claims.
- No email sent.

---

### Step 2 — French One-Page Pilot Offer

Create:

`SMARTFLOW_LEAD_FOLLOW_UP_PILOT_ONE_PAGER_FR.md`

Purpose:

- Prepare a short French client-facing one-pager.
- Explain the SmartFlow Lead & Follow-up Pilot clearly.

Required sections:

- Problème
- Solution
- Ce qui est inclus
- Déroulement
- Sécurité
- Prix pilote
- Prochaine étape

Status:

`TODO`

Exit criteria:

- French wording is clean.
- Price range is included carefully.
- No overpromising.
- No automatic email sending is promised.

---

### Step 3 — First Reply Handling

Create:

`FIRST_REPLY_HANDLING_FOR_PAID_PILOT.md`

Purpose:

- Prepare safe replies before any prospect responds.
- Avoid improvisation.

Required scenarios:

- Interested
- Wants more details
- Asks about price
- Wants an example
- Not interested
- No reply / follow-up timing

Status:

`TODO`

Exit criteria:

- French reply templates included.
- Manual review required before sending.
- CRM logging required after each reply.
- Follow-up logic included.

---

### Step 4 — Demo Before Client QA Checklist

Create:

`DEMO_BEFORE_CLIENT_QA_CHECKLIST.md`

Purpose:

- Make the demo visually clean before any client call.

Required checks:

- Demo sheet clean.
- Only 1–3 test rows visible.
- No personal data.
- No real client secrets.
- Make scenario OFF.
- Run once only.
- No Gmail module.
- CRM output clean.
- French wording clean.
- Browser tabs prepared.

Status:

`TODO`

Exit criteria:

- Checklist created.
- No Make/Sheets changes performed unless a separate controlled cleanup block is opened.

---

### Step 5 — Paid Pilot Demo Call Checklist

Create:

`PAID_PILOT_DEMO_CALL_CHECKLIST.md`

Purpose:

- Prepare a short 15-minute client call flow.

Call flow:

1. Who SmartFlow Suisse is.
2. The business problem.
3. What was observed publicly.
4. Lead Engine walkthrough.
5. Make demo walkthrough.
6. Follow-up task logic.
7. Paid pilot scope.
8. Next step.

Status:

`TODO`

Exit criteria:

- Call flow is clear.
- Demo remains manual.
- No automatic sending is shown or promised.

---

### Step 6 — Controlled Outreach Process

Create or update:

`CONTROLLED_PAID_PILOT_OUTREACH_PROCESS.md`

Purpose:

- Define how to contact each next company safely.

Required process:

1. Select one company.
2. Prepare public mini-audit.
3. Prepare manual email draft.
4. Review manually.
5. Send manually only after approval.
6. Mark Contacted only after confirmed send.
7. Create follow-up task.
8. Add activity history.

Status:

`TODO`

Exit criteria:

- Process documented.
- No mass outreach.
- No automatic sending.
- One company at a time.

---

### Step 7 — Next Candidate Mini-Audit

Only after Steps 1–6 are complete.

Priority candidates:

1. Implenia Suisse SA
2. CBC Entreprise Générale Sàrl
3. SD Construction
4. DMC only after separate review, because delivery remains unconfirmed

Status:

`BLOCKED UNTIL STEPS 1–6 COMPLETE`

---

## Do Not Do Now

Do not do the following before the roadmap requires it:

- Do not recheck Make/Sheets without a specific reason.
- Do not enable Make schedule.
- Do not add a Gmail module to Make.
- Do not create automatic email sending.
- Do not start mass outreach.
- Do not change production.
- Do not deploy to Vercel.
- Do not change database schema.
- Do not start public SaaS work.
- Do not polish UI unless it directly supports first-client execution.
- Do not create new features outside this roadmap.

---

## Allowed Work Before First Client

Allowed work must directly support first-client execution:

- public mini-audits;
- French offer documents;
- reply handling templates;
- demo QA checklist;
- demo call checklist;
- controlled outreach documentation;
- CRM/follow-up discipline;
- small documentation updates;
- small safety fixes only if they remove a concrete first-client risk.

---

## Daily Start Command

At the start of every work session, run:

```bash
cd ~/smartflow-lead-engine && \
echo "=== FIRST CLIENT EXECUTION CHECK ===" && \
git branch --show-current && \
git status && \
git log -5 --oneline && \
echo "" && \
echo "=== ROADMAP ===" && \
sed -n '1,240p' docs/outreach/readiness/FIRST_CLIENT_EXECUTION_ROADMAP.md
EDF
