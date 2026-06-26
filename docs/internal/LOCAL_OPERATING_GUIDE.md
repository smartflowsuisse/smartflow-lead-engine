# SmartFlow Lead Engine - Local Operating Guide

Internal-only guide for using SmartFlow Lead Engine on the MacBook.

This tool is not a public SaaS product.
Do not deploy it as a client-facing application without a separate production-readiness review.

---

## 1. Current operating mode

SmartFlow Lead Engine is used as an internal CRM and lead workflow tool.

Primary use cases:

- lead database review;
- website analysis review;
- outreach queue management;
- missing contact workflow;
- manual email preparation;
- manual email sending;
- contacted / replied / meeting / proposal tracking;
- follow-up task planning;
- internal client readiness workflow.

Every generated outreach message must be manually reviewed before sending.

---

## 2. Start the app

Preferred local URL:

http://localhost:3000

Desktop launcher:

SmartFlow-Lead-Engine.command

Expected result:

- Terminal opens;
- local server starts;
- browser opens http://localhost:3000;
- app is available while the Terminal window remains open.

Do not close the Terminal window while using the app.

Terminal start command:

cd ~/smartflow-lead-engine
npm run dev

---

## 3. Stop the app

If the app was started in Terminal:

Control + C

If port 3000 remains busy:

lsof -tiTCP:3000 -sTCP:LISTEN | xargs kill -9 2>/dev/null || true

---

## 4. Daily start checklist

Before using the CRM:

1. Start the local app.
2. Open Dashboard.
3. Open Leads.
4. Open Outreach.
5. Open Missing Contacts.
6. Open Pipeline.
7. Open one Lead Details page.
8. Confirm no white screen or visible error.

Lead Details should show:

- Lead Details;
- Internal Workflow;
- Reply / Intake;
- Follow-up Tasks;
- AI Website Analysis;
- SmartFlow Email Generator.

---

## 5. Standard lead workflow

Use this sequence:

1. Import or add lead.
2. Review website, email, phone and contact page.
3. Run or review analysis.
4. Check lead score and priority.
5. Review next best action.
6. Generate draft email if needed.
7. Manually review the draft.
8. Manually send the email outside the app.
9. Mark as Contacted only after real manual sending.
10. Add follow-up task.
11. If the company replies, move status to Replied.
12. If a call is planned, move status to Meeting.
13. If proposal is prepared, move status to Proposal.
14. If accepted, move status to Won.
15. If clearly not relevant, move status to Lost.

---

## 6. Outreach rules

Do:

- keep outreach manual;
- check every email before sending;
- keep messages short and professional;
- mention only real observations;
- mark Contacted only after sending;
- add a follow-up task after sending.

Do not:

- send automatically;
- mark Contacted before sending;
- send bulk messages without review;
- promise technical results without audit;
- change Won or Lost casually;
- deploy the tool publicly.

---

## 7. Follow-up task presets

Available presets:

- Follow up in 2 days;
- Ask for discovery call;
- Prepare mini audit;
- Send proposal;
- Check reply next week.

Preset buttons only fill the task title and due date.
They do not create the task automatically.
To create the task, click Add manually.

---

## 8. CRM status meaning

Use statuses consistently:

- New: lead exists but is not reviewed.
- Analyzed: lead has been reviewed or analyzed.
- Contacted: manual outreach was sent.
- Replied: company replied.
- Meeting: call or meeting planned.
- Proposal: proposal is being prepared or sent.
- Won: real agreement or client accepted.
- Lost: not relevant, rejected, or not worth pursuing.

---

## 9. Safe development rule

Before code work:

cd ~/smartflow-lead-engine
git checkout main
git pull origin main
git status
git checkout -b descriptive-branch-name

Before merging:

npm test
npm run build
git status

Do not commit database files.
Do not deploy publicly.
Do not work directly on main except for checks.

---

## 10. Current stable checkpoint

Stable internal checkpoint after merged PRs:

- PR #62 - French outreach translation fix;
- PR #63 - Internal Client Readiness Kit;
- PR #64 - Internal Client Workflow Templates;
- PR #65 - Internal Lead Workflow Panel;
- PR #66 - Reply / Intake Workflow Panel;
- PR #67 - Follow-up Task Presets.

Smoke test passed for:

- Dashboard;
- Leads;
- Lead Details;
- Outreach;
- Missing Contacts;
- Pipeline;
- Templates.

---

## 11. Current operating setup — 2026-06-26

This section records the current operational setup for SmartFlow Suisse before first-client work.

### Google Drive setup

Primary working account:

- SmartFlow / ANZHELIKA MOROZ;
- smartflowsuisse@gmail.com.

Primary working Drive location:

- SmartFlow Suisse — Client Readiness.

Current Drive structure:

- SmartFlow Suisse — Client Readiness;
- SmartFlow CRM Demo;
- SmartFlow Demo Request Form;
- SmartFlow Demo Request Form (Responses / Ответы).

Old Vitalik structure:

- kept as an archive/source of previous client-readiness materials;
- linked from SmartFlow Drive through:
  - SmartFlow Suisse — Client Readiness / 00 Imported from Vitalik;
- do not delete the old Vitalik-owned folder unless ownership or full copy is confirmed;
- do not duplicate old files in bulk;
- if an old document is needed, open it through the shortcut and create a clean working copy in the SmartFlow account.up

Current verified scenarios:

- SmartFlow Demo — Form to CRM AI Summary;
- SmartFlow Demo — Sheet AI Summary.

Current safety status:

- scenarios remain inactive;
- no schedule is enabled;
- no Gmail sending module is used;
- no automatic external email sending exists;
- manual test history shows successful executions.

Verified CRM demo flow:

- Google Sheets — Watch New Rows;
- OpenAI — Generate a completion;
- Google Sheets — Add a Row.

Verified source:

- SmartFlow Demo Request Form (Ответы);
- sheet: Ответы на форму (1).

Verified target:

- SmartFlow CRM Demo;
- sheet: CRM Demo.

### Gmail setup

Primary Gmail account:

- smartflowsuisse@gmail.com.

Operational labels created:

- 01 New Leads;
- 02 Client Replies;
- 03 Proposals;
- 04 Follow-up;
- 05 Make Demo;
- 06 Technical / Accounts.

Draft email templates prepared:

- TEMPLATE — New lead reply FR;
- TEMPLATE — Follow-up FR;
- TEMPLATE — Mini-audit delivery FR;
- TEMPLATE — Proposal delivery FR.

Gmail signature configured and verified:

SmartFlow Suisse
AI, Automatisation & Web pour PME suisses

smartflowsuisse@gmail.com
smartflowsuisse.com

### Safety rules

- Do not send automatic emails to external recipients.
- Do not enable Make schedules without review.
- Do not mass-email leads.
- Do not delete old Drive folders before ownership/copy is confirmed.
- Do not push production changes without tests and QA.
- Keep client-facing emails manual and reviewed.
- Use Gmail drafts as templates only; adapt every message before sending.
- Keep SmartFlow account as the main working account for new client materials.
