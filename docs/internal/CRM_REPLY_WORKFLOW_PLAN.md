# CRM Reply Workflow Plan

Internal document for SmartFlow Suisse.

Purpose: define the safest architecture for handling client replies, next actions, and follow-up decisions inside SmartFlow Lead Engine.

This document is a planning note only. It does not change code, database schema, Make scenarios, Gmail modules, or production behavior.

---

## 1. Current state

SmartFlow Lead Engine already has several CRM workflow building blocks:

- lead status;
- outreach status;
- lead notes;
- contacted timestamp;
- contacted language;
- lead activity history;
- lead tasks;
- reply intake visual checklist;
- email draft generation panel.

Current lead fields already include:

- `status`;
- `outreach_status`;
- `notes`;
- `contacted_at`;
- `contacted_language`.

The current database does not include dedicated fields such as:

- `reply_category`;
- `reply_summary`;
- `next_action`;
- `follow_up`.

---

## 2. Key architecture decision

Do not add a `next_action` column directly to the `leads` table for now.

Reason: the project already has a proper lead task system.

The correct architecture is:

- next action = a lead task;
- follow-up reminder = a lead task with a due date;
- completed follow-up = completed lead task;
- multiple next actions = multiple lead tasks.

This avoids duplicating workflow logic in both `leads` and `lead_tasks`.

---

## 3. Existing task system

The existing task system already supports:

- creating a task for a lead;
- listing tasks by lead;
- updating a task;
- marking a task completed;
- deleting a task;
- protecting tasks from being deleted under the wrong lead.

Relevant functions:

- `createLeadTask`;
- `getTasksByLeadId`;
- `updateLeadTask`;
- `deleteLeadTask`.

Relevant API routes:

- `/api/leads/[id]/tasks`;
- `/api/leads/[id]/tasks/[taskId]`.

---

## 4. Reply handling model

A client reply should be handled in this order:

1. Read the reply manually.
2. Update lead notes with a short summary.
3. Set CRM / outreach status only if appropriate.
4. Create a lead task for the next action.
5. Keep human review before any client-facing response.
6. Do not send automatic external emails.

Recommended reply categories for future UX:

- Interested;
- Needs more information;
- Not now;
- Not relevant;
- Meeting requested;
- Wrong contact;
- No clear action.

For now, these categories can be stored in notes until a dedicated structured field is justified.

---

## 5. Recommended next action task examples

Examples of safe task titles:

- Reply to client with clarification;
- Prepare mini audit;
- Schedule discovery call;
- Send proposal draft for review;
- Follow up in 7 days;
- Mark as not relevant after review.

Examples of due dates:

- same day for hot replies;
- 1–2 days for interested leads;
- 7 days for normal follow-up;
- 30 days for not-now replies.

---

## 6. LeadReplyIntakePanel status

`LeadReplyIntakePanel` currently acts as a visual checklist.

It shows the workflow stages:

1. Outreach sent;
2. Reply received;
3. Discovery call;
4. Proposal decision;
5. Client accepted.

Current role: guidance and visibility.

It is not yet a full reply intake form.

---

## 7. Future improvement options

Option A: imove documentation only.

- Lowest risk.
- No code change.
- Good before first client.

Option B: improve UI labels in `LeadReplyIntakePanel`.

- Low risk.
- Keeps current architecture.
- Helps manual workflow.

Option C: add a lightweight reply intake form.

Possible fields:

- reply category;
- reply summary;
- recommended next task;
- due date;
- internal notes.

Risk: requires careful code, API, tests, and database decisions.

Option D: add dedicated database fields.

Possible fields:

- `reply_category`;
- `reply_summary`;
- `last_reply_at`.

Risk: higher. Should only be done after real usage shows notes + tasks are not enough.

---

## 8. Safety rules

- No automatic external email sending.
- No mass outreach.
- No automatic CRM status changes from email content.
- No real client data in demo/testing.
- Human review before any client-facing response.
- Do not add database fields unless there is a clear workflow need.
- Prefer lead tasks over new lead columns for next actions.

---

## 9. Completed implementation note

Completed in PR #99: `LeadReplyIntakePanel` copy was clarified to reinforce that:

- reply processing is manual;
- next actions should be chosen only after human review;
- follow-up, onboarding, and next manual actions should be created as lead tasks;
- automatic external email sending remains disabled;
- CRM status changes should not be made automatically from email content.

No database, API, migration, automation, production deployment, or email sending changes were made.
