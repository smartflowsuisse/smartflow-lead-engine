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
