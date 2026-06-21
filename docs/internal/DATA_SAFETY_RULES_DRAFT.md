# SmartFlow Suisse — Data Safety Rules Draft

## 1. Purpose

These rules define how SmartFlow Suisse handles client data, AI tools, automation, email, CRM records, and access during early client work.

The goal is to keep first-client projects simple, safe, transparent, and manually controlled.

## 2. Core principle

SmartFlow Suisse does not automate risky client actions by default.

Default mode:

- human review;
- manual approval;
- simple tools;
- clear backups;
- limited access;
- no unnecessary data collection;
- no automated client-facing sending without explicit approval.

## 3. AI usage rule

AI tools may be used for:

- drafting emails;
- summarizing public website information;
- preparing mini-audits;
- generating internal checklists;
- improving proposal text;
- identifying workflow opportunities.

AI tools must not be used for sensitive client data unless the client has approved it.

Sensitive data includes:

- client customer lists;
- personal customer data;
- private emails;
- contracts;
- invoices;
- salaries;
- financial documents;
- medical/legal/confidential documents;
- access credentials;
- internal passwords or API keys.

Default rule:

> Public information can be analyzed. Private client data requires approval.

## 4. Email safety

Rules:

- no mass email sending;
- no hidden automated sending;
- no bulk outreach system;
- no LinkedIn automation;
- no automatic follow-up emails without explicit client approval;
- all first-client emails are reviewed by a human;
- all outbound outreach is manual unless explicitly changed later.

For SmartFlow internal outreach:

- AI may prepare a draft;
- Apple Mail/Gmail may open a manual draft;
- human reviews;
- human sends;
- CRM is updated only after actual sending.

## 5. CRM and lead data safety

Rules:

- do not mark a lead as Contacted unless a real contact happened;
- do not mark a lead as Replied unless a reply was received;
- do not mark Won unless there is a real agreement;
- do not delete leads without review;
- do not overwrite notes without reason;
- use clear notes for manual checks and email sources;
- keep follow-up tasks explicit and non-risky.

Safe status flow:

New / Analyzed → Contacted → Replied → Meeting → Proposal → Won / Lost.

## 6. Backup rules

Create a backup before:

- bulk data changes;
- CRM status cleanup;
- task cleanup;
- schema changes;
- import cleanup;
- irreversible operations.

Backup should include:

- date;
- reason;
- database copy;
- integrity check if possible.

Minimum check:

- `PRAGMA integrity_check` should return `ok`.

## 7. Access rules

Before accessing a client system, confirm:

- what access is needed;
- who approved it;
- what will be changed;
- whether backup is needed;
- whether changes can be reversed;
- who owns the account.

Do not request broad access if limited access is enough.

Avoid:

- admin access when viewer/editor is enough;
- deleting accounts;
- changing DNS without written confirmation;
- changing email routing without backup;
- changing production website without preview.

## 8. Website and production safety

Rules:

- do not change production blindly;
- test locally or in preview first;
- check forms after changes;
- check mobile layout;
- check language switching if relevant;
- check email notifications if forms are touched;
- do not deploy large changes without review.

For SmartFlow internal projects:

- no production deploy unless explicitly approved;
- documentation-only changes may be pushed to GitHub safely.

## 9. Client automation safety

Before activating an automation, confirm:

- trigger;
- action;
- data used;
- recipient;
- frequency;
- failure behavior;
- owner;
- manual override;
- logging;
- rollback plan.

High-risk automation examples:

- sending emails automatically;
- deleting files;
- updating accounting data;
- changing CRM statuses automatically;
- sending customer messages;
- moving or renaming large folders.

Low-risk demo automation examples:

- form → Google Sheets row;
- request → internal notification;
- lead → draft text;
- follow-up task creation;
- weekly internal summary.

## 10. Data minimization

Collect only what is needed.

For first workflow audits, prefer:

- company name;
- website;
- public contact email;
- public phone;
- workflow description;
- non-sensitive examples.

Avoid collecting:

- full customer databases;
- private inbox exports;
- passwords;
- invoices;
- contracts;
- unnecessary personal data.

## 11. Client communication rule

Be transparent.

Tell the client:

- what we check;
- what tools we use;
- what data is needed;
- what is manual;
- what is automated;
- what is not changed;
- what requires approval.

Do not overpromise.

Avoid saying:

- “fully automated” unless it is true;
- “AI will handle everything”;
- “guaranteed more sales”;
- “no risk”;
- “we need all your data”.

## 12. First-client safe implementation path

Recommended path:

1. Public website/workflow audit.
2. Mini-audit summary.
3. Simple Google Sheets CRM demo.
4. Make demo using test data.
5. Client approval.
6. Limited live test.
7. Manual monitoring.
8. Documentation.
9. Optional monthly support.

## 13. Red flags

Stop and review before continuing if:

- client asks for automated mass messaging;
- client wants to upload sensitive data without agreement;
- access requested is broader than needed;
- production DNS/email changes are involved;
- no backup exists before risky changes;
- the process is not understandable to the client;
- there is no manual review step.

## 14. Internal rule for SmartFlow Suisse

Until first-client process is mature:

- SmartFlow Lead Engine remains internal only;
- no public SaaS;
- no bulk sending;
- no automated outreach;
- no new outreach wave before follow-up tasks are reviewed;
- focus on tools, documents, demos, and client readiness.

## 15. Next work

Need to create:

1. French client-facing data-safety explanation.
2. Client onboarding checklist.
3. Make demo safety checklist.
4. Google Sheets CRM permissions checklist.
5. Production change checklist.
