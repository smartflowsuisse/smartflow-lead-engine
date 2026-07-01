# SmartFlow AI Operations — Execution Plan

## 1. Main Decision

SmartFlow Suisse is developed as:

**SmartFlow AI Operations Studio**

The main product direction is:

**Website + AI Client Operations System**

SmartFlow does not only build websites. It builds client operation systems:

- requests / emails / PDF
- AI summary
- tasks
- draft replies
- Approval
- follow-up
- history
- client control

---

## 2. Main Goal for the Next Weeks

The goal is to reach a working demo:

**Lead Engine + Client Hub + Make + AI summary**

The demo must show:

1. how a lead becomes a client;
2. how a client request enters the Client Hub;
3. how AI creates a summary;
4. how a task is created;
5. how a reply waits for Approval;
6. how everything is stored in history.

---

## 3. What We Do Not Build Now

| Do not build now | Reason |
|---|---|
| Public SaaS | Too early |
| Auto-send emails | Reputation risk |
| Gmail intake immediately | Demo first |
| Real PDF intake immediately | Structure first |
| Airtable / Relay / Retool | External complexity |
| GraphQL | Unnecessary complexity |
| Multi-tenant | Later |
| Batch approve | Too early |
| Production push without QA | Forbidden |
| Large PRs | Hard to review |

---

## 4. General Architecture

SmartFlow AI Operations System:

- Lead Engine
  - Leads
  - Outreach
  - Mini-audit
  - Proposal
  - Convert to Client

- SmartFlow Client Hub
  - Clients
  - Client Inbox
  - Requests
  - Documents / PDFs
  - Tasks
  - Approval Queue
  - Follow-up
  - Metrics
  - Audit Log

- Automation Layer
  - Make
  - OpenAI
  - Gmail
  - Google Drive
  - Google Forms
  - Google Sheets backup

- Development Workflow
  - ChatGPT planning
  - Cursor implementation
  - GitHub PR workflow
  - GitHub Actions
  - smoke tests
  - .cursorrules

---

## 5. Work Rules

| Rule | Status |
|---|---|
| Check Git first | Required |
| Work only in feature branches | Required |
| Do not work directly on main | Required |
| Each block goes through a small PR | Required |
| Explain consequences before changes | Required |
| Verify result after changes | Required |
| Do not touch production without QA | Required |
| AI never sends emails automatically | Required |
| External actions only through Approval | Required |
| Important actions must be logged | Required |

---

## 6. MVP Stages

## MVP0 — Architecture and Stack Check

**Time:** 1 day  
**Goal:** Fix the direction and understand the current project stack.

### Actions

1. Check Git.
2. Check the project stack.
3. Create a feature branch.
4. Create an architecture / execution document.
5. Commit.
6. Open PR.

### Initial Git Check

Command:

    git status && git branch --show-current && pwd

### Stack Check

Command:

    ls && find . -maxdepth 2 \( -name "package.json" -o -name "prisma" -o -name "schema.prisma" -o -name "drizzle.config.*" -o -name "supabase" -o -name "app" -o -name "pages" -o -name ".github" -o -name ".cursorrules" \) -print

### MVP0 Documentation Scope

The documentation must fix:

1. Strategic decision
2. Lead Engine role
3. Client Hub role
4. Data model
5. API plan
6. Automation plan
7. AI processing plan
8. Approval Queue
9. Audit Log
10. Metrics
11. MVP roadmap
12. Development workflow
13. Cursor / AI rules
14. Safety rules
15. Monetization direction
16. What not to automate now

---

## MVP1 — First Client Hub Screen

**Time:** 3–5 working days  
**Goal:** See the Client Hub inside the application.

### Build

- /client-hub
- Clients list
- Client Inbox
- Requests list
- Approval Queue mock
- Demo data

### Do Not Build

- Gmail
- PDF
- Make
- Real AI
- Production deploy

### MVP1 Result

Opening /client-hub shows:

1. clients list;
2. incoming requests;
3. statuses;
4. mock AI summary;
5. mock suggested reply;
6. mock Approval Queue.

---

## MVP2 — Convert to Client

**Time:** 2–3 days  
**Goal:** Connect Lead Engine and Client Hub.

### Build

Lead Engine -> Won -> Convert to Client -> Client Hub

### MVP2 Result

A lead with status Won can be converted into a client.

The new client appears in the Client Hub.

---

## MVP3 — Make + AI Intake Demo

**Time:** 4–6 days  
**Goal:** Create the first working automation demo.

### Build

Make test webhook -> Client Hub Request -> AI summary -> urgency -> suggested reply

### Do Not Build

- Real Gmail intake
- Real PDF intake
- Auto-send
- Batch approve

### MVP3 Result

The demo shows:

1. a new request arrives;
2. AI creates a summary;
3. the system suggests a task;
4. the reply waits for Approval.

### After MVP3

Prepare:

1. short demo video;
2. one-page offer;
3. list of 3–5 pilot clients.

---

## MVP4 — Gmail / PDF Intake

**Time:** after MVP3  
**Goal:** Connect real intake channels.

### Gmail Intake

Known client email -> Make -> AI -> Client Hub

### PDF Intake

PDF -> Google Drive client folder -> AI summary / extraction -> Document record

### Important Rule

Only known clients first.

No auto-replies.

---

## MVP5 — Approval Actions

**Goal:** Create controlled human-approved actions.

### Build

- Approve -> Gmail draft
- Edit -> save revised draft
- Reject -> log reason

### Do Not Build

Approve -> auto-send

At the start, approval creates only a draft.

---

## 7. Later Roadmap After MVP5

| Block | Timing |
|---|---|
| Metrics dashboard | After first real requests |
| Google Sheets backup | After base data model |
| .cursorrules | After stack audit |
| Strengthen GitHub Actions | After current CI check |
| Issue templates | After MVP0 / MVP1 |
| AI Operations landing page | After MVP3 demo |
| PDF offer | After MVP3 demo |
| Pilot outreach | After MVP3 demo |
| Multi-tenant | Only after first clients |

---

## 8. Sales and Pilots

### Niche Focus

Construction and service companies in Suisse romande.

### First Offer

**Website + AI Operations Starter**

### Offer Summary

SmartFlow creates a system that collects requests, emails and PDFs.

AI creates:

- summaries;
- tasks;
- draft replies.

The owner approves important actions before anything external happens.

### Price Direction

| Package | Price |
|---|---:|
| Starter / Lite | 3'500–5'000 CHF |
| Pro | 6'000–9'000 CHF |
| Monthly support | 200–600 CHF / month |

Prices are not fixed yet. They will be refined after the demo.

---

## 9. Control Timeline

Assuming 5–6 hours of work per day:

| Stage | Time |
|---|---|
| MVP0 | 1 day |
| MVP1 | 3–5 days |
| MVP2 | 2–3 days |
| MVP3 | 4–6 days |
| First working demo | 2–3 weeks |
| First pilot offers | 3–4 weeks |
| First revenue | 6–12 weeks |

---

## 10. Current Execution Step

Start with state verification.

Command:

    git status && git branch --show-current && pwd

After the result, do not continue blindly. Review the output first, then proceed to the next safe step.
