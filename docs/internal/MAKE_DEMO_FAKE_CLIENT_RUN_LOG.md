# SmartFlow Suisse — Make Demo Fake Client Run Log

## Purpose

This document records the result of a manual Make demo run using a fake client scenario.

The goal is to prove that the Make demo workflow can support the first-client operating process safely.

---

## Test status

Selected status:

- Passed with minor issue

Reason:

- The full Make chain completed successfully.
- One fake source row was processed.
- One CRM output row was created.
- OpenAI generated an internal summary.
- No Gmail module was used.
- No external email was sent.
- Scenario remained inactive / not scheduled.
- Minor issue: AI summary returned priority as “Manuel” instead of “Medium”.

---

## Test date

Date:

28.06.2026

Time:

12:40

Tester:

SmartFlow internal manual test

Environment:

- Browser: Chrome / SmartFlow working profile
- Make workspace: My Organization / My Team
- Make user visible in UI: ANZHELIKA MOROZ
- Google account / files: SmartFlow Google Drive / SmartFlow Google Sheets c- Source sheet: SmartFlow Demo Request Form (Ответы)
- Source tab: Ответы на форму (1)
- CRM / output sheet: SmartFlow CRM Demo
- Output tab: CRM Demo
- Scenario name: SmartFlow Demo — Form to CRM AI Summary

---

## Safety before test

Confirmed before running:

- main repository was clean;
- no production code changes;
- no production website changes;
- no real client data;
- no passwords used in documents;
- no Gmail sending module active;
- no mass outreach;
- no automatic external email sending;
- Make scenario was run manually with Run once;
- fake data was clearly marked as fake.

Safety result:

- Pass: yes
- Fail: no
- Notes: Scenario was inactive before the manual run. Every 15 minutes schedule toggle was visible and off.

---

## Fake client data used

Company:

Demo Menuiserie Genève 8

Contact person:

Jean Demo Test 8

Email:

jean.demo8@example.com

Phone:

+41 22 000 00 08

Important phone formatting note:

- Source sheet was filled with an apostrophe before the phone number to keep the phone as text in Google Sheets.
- Displayed value in Google Sheets: +41 22 000 00 08

Service requested:

Kitchen renovation

Location:

Geneva / Genève

Message:

Fake client run log test. Kitchen renovation request in Geneva. Manual review only. No email sent.

Preferred language:

FR

Source:

Website form

Status:

New

Priority:

Medium

Next action:

Manual review and call preparation

---

## Expected workflow

Expected flow:

1. Fake request is entered in the source sheet.
2. Source sheet receives fake request.
3. Make scenario is run manually with Run once.
4. OpenAI generates internal summary.
5. CRM / tracking sheet receives result.
6. Human reviews AI output.
7. No external email is sent.
8. QA checklist is completed.
9. Handover notes can be prepared.

---

## Actual workflow result

Record what actually happened:

1. Fake request created: yes
2. Source sheet updated: yes
3. Make scenario run manually: yes
4. OpenAI module executed: yes
5. CRM / output sheet updated: yes
6. AI summary generated: yes
7. No external email sent: yes
8. QA completed: partial visual QA completed
9. Handover possible: yes, for demo/internal use

Notes:

- Make showed successful execution on all three modules.
- Each module displayed one processed item.
- CRM row for Demo Menuiserie Genève 8 was created.
- Scenario schedule remained off.

---

## Make scenario check

Scenario name:

SmartFlow Demo — Form to CRM AI Summary

Scenario active/inactive:

Inactive

Run method:

- Run once

Expected safe method:

Run once only.

Modules involved:

1. Google Sheets — Watch New Rows
2. OpenAI — Generate a completion
3. Google Sheets — Add a Row

Modules not allowed:

- Gmail send;
- automatic external email;
- mass outreach;
- real client data processing.

Result:

- Pass

Notes:

- No Gmail module was visible.
- No email module was used.
- No automatic scenario schedule was enabled.

---

## Google account / ownership check

Confirmed:

- source sheet belongs to the SmartFlow working structure;
- CRM demo sheet belongs to the SmartFlow working structure;
- Make connection uses SmartFlow Google Sheets connection;
- old personal/Vitalik account was not used for this test based on visible Make and Google Drive workflow;
- files are in expected SmartFlow Drive / demo location;
- access was not changed during test.

Result:

- Pass

---

## AI summary check

Expected AI summary should include:

- request summary;
- service needed;
- contact;
- priority;
- suggested next action;
- manual follow-up note.

Actual AI output summary observed in CRM:

Résumé interne:
- Entreprise: Demo Menuiserie Genève 8
- Contact: Jean Demo Test 8
- Besoin: Kitchen renovation
- Priorité: Manuel
- Prochaine action: Revue manuelle uniquement

AI quality:

- factual: yes
- useful: yes
- correct language: acceptable, French output
- no invented facts: yes
- internal-only: yes
- needs prompt improvement: minor

Decision:

- Passed with minor issue

Minor issue:

- Priority should preferably be “Medium”, because CRM priority field is Medium.
- AI returned “Manuel”, likely because the prompt emphasized manual review.
- This is not a workflow failure, but prompt can be improved later.

---

## CRM / tracking output check

Expected output fields:

- Company name
- Contact person
- Email
- Phone
- Service requested
- Message
- Preferred language
- Source
- Status
- Priority
- AI summary
- Notes
- Owner
- Next action

Actual output result:

- Correct row created: yes
- Correct company: yes
- Correct contact: yes
- Correct email: yes
- Correct phone: yes
- Correct source: yes
- Correct request type: yes
- Correct message: yes
- Correct language: yes
- Status: New
- Priority: Medium
- AI summary: created
- Notes: Imported from response by Make demo. No email sent.
- Owner: SmartFlow
- Next action: AI summary and prepare manual next step
- No duplicate observed: yes
- No wrong destination observed: yes

Notes:

- Phone displayed correctly as +41 22 000 00 08.
- No #ERROR! phone formatting issue observed.

---

## QA result

Use:

- docs/internal/CLIENT_QA_CHECKLIST.md

QA summary:

- Scope check: pass
- Access check: pass based on visible SmartFlow connections and sheets
- Input check: pass
- Processing check: pass
- Output check: pass
- Email safety: pass
- AI output: passed with minor priority wording issue
- Data safety: pass
- Client test: fake-client only
- Delivery readiness: internally ready for demo evidence

Final QA decision:

- Ready for demo: yes, with minor prompt improvement noted
- Needs fix: no blocking fix
- Not safe yet: no

---

## Issues found

Issue 1:

- Description: AI summary returned priority as “Manuel” instead of “Medium”.
- Severity: low
- Cause: Prompt likely emphasizes manual review and did not explicitly instruct priority mapping.
- Fix: Later update prompt to set priority from CRM/default logic or output “Medium” when priority is Medium.
- Status: open / non-blocking

Issue 2:

- Description: None observed.
- Severity:
- Cause:
- Fix:
- Status:

---

## Handover readiness

Use:

- docs/internal/CLIENT_HANDOVER_PACK.md

Can handover be prepared?

- Yes, for internal demo / first-client preparation.

Handover notes needed:

1. Explain that the workflow imports a fake form/request row into CRM.
2. Explain that OpenAI creates an internal summary only.
3. Explain that no email is sent automatically.
4. Explain that human review remains mandatory.
5. Mention known limitation: priority wording in AI summary needs small prompt improvement.

Known limitations to mention:

1. No automatic external email sending.
2. No real-client data test completed yet.
3. AI summary must be manually reviewed.
4. Priority wording may need prompt refinement.

---

## Scope/payment conclusion

Use:

- docs/internal/CLIENT_SCOPE_PAYMENT_RULES.md

Commercial conclusion:

- first paid pilot: suitable
- larger implementation: only after discovery, intake, and scope review
- not ready: no

Recommended first offer:

Paid diagnostic + first controlled pilot

Reason:

- The demo proves a safe lead intake → AI summary → CRM tracking workflow.
- It is suitable to show value without promising a complex CRM or full automation.
- Human review and manual next action remain built into the process.
- Scope, payment, access, and QA rules are documented.

---

## Final decision

Result:

- Passed with minor issue

Decision:

- The Make demo workflow is safe enough for internal demo use and controlled first-client discussion.
- Do not enable scheduling.
- Do not add Gmail sending.
- Do not use real client data until intake, access, scope, payment, and QA rules are complete.

Next action:

- Commit this completed run log.
- Optionally create a later small prompt improvement task for priority wording.
- Continue first-client preparation using controlled paid diagnostic / first pilot path.

---

## Final notes

This test remained internal.

No real client data was used.

No automatic external email was sent.

No production system was changed.

The Make scenario was executed manually with Run once only.

CRM output was created successfully for Demo Menuiserie Genève 8.

---

## Prompt improvement verification — Demo Menuiserie Genève 9

Status:

- Passed.

Purpose:

- Verify that the updated Make OpenAI prompt no longer returns `Priorité: Manuel`.
- Confirm that manual review stays under `Prochaine action`.
- Confirm that lead priority is shown as `Medium`.

Fake client data used:

- Company: Demo Menuiserie Genève 9
- Contact: Claire Demo Test 9
- Email: claire.demo9@example.com
- Phone: +41 22 000 00 09
- Source: Website form
- Request typthroom renovation
- Message: Fake priority prompt test. Bathroom renovation request in Geneva. Manual review only. No email sent.
- Language: FR

Observed CRM output:

- CRM row for `Demo Menuiserie Genève 9` was created.
- AI summary returned `Priorité: Medium`.
- AI summary returned `Prochaine action: Revue manuelle uniquement`.
- The previous wording issue `Priorité: Manuel` was not reproduced.

Safety confirmation:

- Make scenario was run manually with `Run once`.
- Scenario scheduling remained off.
- Nmail sending module was used.
- No automatic external email was sent.
- No real client data was used.
- No production system was changed.

Decision:

- The Make prompt priority wording fix is accepted for the internal demo workflow.
