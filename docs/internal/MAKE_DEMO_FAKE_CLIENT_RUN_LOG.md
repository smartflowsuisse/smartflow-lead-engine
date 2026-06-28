# SmartFlow Suisse — Make Demo Fake Client Run Log

## Purpose

This document records the result of a manual Make demo run using a fake client scenario.

It must be completed only after a controlled manual test.

The goal is to prove that the Make demo workflow can support the first-client operating process safely.

---

## Test status

Status options:

- Planned
- In progress
- Passed
- Passed with issues
- Failed
- Blocked

Selected status:

-

---

## Test date

Date:

Time:

Tester:

Environment:

- Browser:
- Make workspace:
- Google account:
- Google Drive location:
- Source sheet:
- CRM / output sheet:
- Scenario name:

---

## Safety before test

Confirm before running anything:

- main repository is clean;
- no production code changes;
- no production website changes;
- no real client data;
- no passwords used in documents;
- no Gmail sending module active;
- no mass outreach;
- no automatic external email sending;
- Make scenario will be run manually with Run once;
- fake data is clearly marked as fake.

Safety result:

- Pass:
- Fail:
- Notes:

---

## Fake client data used

Company:

Demo Menuiserie Genève

Contact person:

Jean Demo

Email:

jean.demo@example.com

Phone:

+41 22 000 00 00

Service requested:

Kitchen renovation

Location:

Genève

Message:

Bonjour, nous souhaitons rénover une cuisine à Genève. Pouvez-vous nous rappeler pour discuter du projet et préparer une estimation ?

Preferred language:

French

Source:

Fake demo

Status:

New

Priority:

Medium

Next action:

Manual review and call preparation

---

## Expected workflow

Expected flow:

1. Fake request is entered or submitted.
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

1. Fake request created:
2. Source sheet updated:
3. Make scenario run manually:
4. OpenAI module executed:
5. CRM / output sheet updated:
6. AI summary generated:
7. No external email sent:
8. QA completed:
9. Handover possible:

Notes:

---

## Make scenario check

Scenario name:

Scenario active/inactive:

Run method:

- Run once
- Scheduled
- Other

Expected safe method:

Run once only.

Modules involved:

1.
2.
3.
4.

Modules not allowed:

- Gmail send;
- automatic external email;
- mass outreach;
- real client data processing.

Result:

---

## Google account / ownership check

Confirm:

- source sheet belongs to correct SmartFlow account;
- CRM demo sheet belongs to correct SmartFlow account;
- Make connection uses correct SmartFlow Google connection;
- old personal/Vitalik account is not used for this test;
- files are in correct Drive location;
- access is not public unless intentionally set for test.

Result:

---

## AI summary check

Expected AI summary should include:

- request summary;
- service needed;
- location;
- urgency/priority;
- suggested next action;
- missing information;
- manual follow-up note.

Actual AI output:

Paste or summarize AI output here.

AI quality:

- factual:
- useful:
- correct language:
- no invented facts:
- internal-only:
- needs prompt improvement:

Decision:

---

## CRM / tracking output check

Expected output fields:

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
- AI summary
- Next action

Actual output result:

- Correct row created:
- Correct fields:
- Correct formatting:
- Phone handled correctly:
- No duplicate:
- No wrong destination:

Notes:

---

## QA result

Use:

- docs/internal/CLIENT_QA_CHECKLIST.md

QA summary:

- Scope check:
- Access check:
- Input check:
- Processing check:
- Output check:
- Email safety:
- AI output:
- Data safety:
- Client test:
- Delivery readiness:

Final QA decision:

- Ready for demo:
- Needs fix:
- Not safe yet:

---

## Issues found

Issue 1:

- Description:
- Severity:
- Cause:
- Fix:
- Status:

Issue 2:

- Description:
- Severity:
- Cause:
- Fix:
- Status:

---

## Handover readiness

Use:

- docs/internal/CLIENT_HANDOVER_PACK.md

Can handover be prepared?

- Yes:
- No:

Handover notes needed:

1.
2.
3.

Known limitations to mention:

1.
2.
3.

---

## Scope/payment conclusion

Use:

- docs/internal/CLIENT_SCOPE_PAYMENT_RULES.md

Commercial conclusion:

- free discussion only:
- paid diagnostic:
- first paid pilot:
- larger implementation:
- not ready:

Recommended first offer:

-

Reason:

-

---

## Final decision

Result:

- Passed
- Passed with issues
- Failed
- Blocked

Decision:

-

Next action:

-

---

## Final notes

This test must remain internal.

No real client data was used.

No automatic external email was sent.

No production system was changed.
