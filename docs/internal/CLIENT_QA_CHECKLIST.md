# SmartFlow Suisse — Client QA Checklist

## Purpose

This checklist is used before showing, testing, or delivering any SmartFlow Suisse client workflow.

The goal is to avoid unsafe delivery, wrong data routing, broken automations, incorrect AI output, or accidental external sending.

---

## When to use

Use this checklist before:

1. showing a client demo;
2. running a pilot with client data;
3. delivering a workflow;
4. enabling any scenario or automation;
5. handing over instructions to the client.

No client workflow should be considered ready without a manual QA check.

---

## 1. Scope check

Confirm:

- client name is correct;
- agreed workflow is clear;
- expected input is clear;
- expected output is clear;
- what is included is clear;
- what is excluded is clear;
- there is no hidden large implementation inside a small pilot;
- client approval exists for the current step.

Risk if skipped:

- unclear scope;
- unpaid extra work;
- wrong delivery expectations.

---

## 2. Access check

Confirm:

- all required access is known;
- access level is appropriate;
- unnecessary access was not requested;
- passwords are not stored in plain documents;
- shared files belong to the correct owner;
- client data is not mixed with demo data;
- access can be removed later if needed.

Risk if skipped:

- security issue;
- wrong account usage;
- client trust damage.

---

## 3. Input check

Confirm the workflow input.

Examples:

- website form;
- Google Form;
- email request;
- spreadsheet row;
- manual entry;
- CRM record;
- uploaded file.

Check:

- required fields exist;
- field names are understandable;
- test data is marked clearly;
- real client data is separated from demo data;
- duplicates are understood;
- empty fields do not break the workflow.

---

## 4. Processing check

Confirm:

- scenario/workflow uses the correct input;
- mapping uses the current row or current request;
- no hardcoded old test values remain;
- AI prompt uses the right client context;
- language is correct;
- output format is stable;
- errors are visible;
- no unnecessary modules are active.

Special Make check:

- scenario is in the correct workspace;
- Google connection uses the correct account;
- trigger source is correct;
- output destination is correct;
- scheduling is intentionally on or off;
- Run once test works before activation.

---

## 5. Output check

Confirm where the result goes.

Possible safe outputs:

- CRM row;
- Google Sheet row;
- internal AI summary;
- internal notification;
- draft text;
- manual task;
- handover note.

Check:

- output goes to the correct file/system;
- client name is correct;
- contact data is correct;
- no wrong recipient is used;
- no external email is sent unless explicitly approved;
- AI text is reviewed before client-facing use.

---

## 6. Email and communication safety

Default rule:

External emails must stay manual unless there is explicit written approval and a separate safety review.

Confirm:

- no mass outreach exists;
- no automatic external email sending is enabled;
- Gmail drafts are reviewed manually;
- recipients are checked manually;
- subject line is checked manually;
- client-facing text is approved before sending.

Risk if skipped:

- wrong recipient;
- reputational damage;
- accidental spam;
- legal/compliance issue.

---

## 7. AI output check

Confirm:

- AI summary is factual;
- AI does not invent client data;
- AI does not create unsupported promises;
- AI does not expose internal notes;
- AI output is in the correct language;
- AI output is short enough for practical use;
- human review is preserved.

If AI output is wrong:

- do not deliver;
- adjust prompt;
- rerun with safe test data;
- document the limitation.

---

## 8. Data safety check

Confirm:

- no sensitive data is used unnecessarily;
- test data is clearly fake or anonymized;
- client data is stored only where needed;
- access rights are correct;
- old test data is removed if it creates confusion;
- no passwords are stored in documents, chats, or spreadsheets.

---

## 9. Client test check

Before delivery, run at least one controlled test.

Record:

- test date:
- tester:
- input used:
- expected result:
- actual result:
- issue found:
- fix applied:
- final status:

Minimum pass condition:

- input works;
- processing works;
- output works;
- no unsafe external sending;
- client can understand the result.

---

## 10. Delivery readiness check

Before handover, confirm:

- workflow was tested;
- known limitations are written;
- client instructions are prepared;
- support rules are clear;
- next step is defined;
- invoice/scope status is clear;
- no unresolved critical issue remains.

Decision:

- Ready to show:
- Ready to deliver:
- Needs fix:
- Not safe yet:

---

## Final QA summary

Client:

Workflow:

Input:

Output:

Test result:

Risks:

Limitations:

Manual review required:

Delivery decision:

Next action:

