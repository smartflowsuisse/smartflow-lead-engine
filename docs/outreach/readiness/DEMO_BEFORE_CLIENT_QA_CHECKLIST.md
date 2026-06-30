# Demo Before Client QA Checklist

Document type: Demo QA checklist
Status: Draft
Audience: Internal use before any paid pilot or client demo
Related roadmap step: Step 4 — Demo Before Client QA Checklist

---

## 1. Purpose

This checklist must be completed before showing the SmartFlow Lead & Follow-up demo to a prospect or client.

The goal is to make sure the demo is safe, controlled, understandable, and manually reviewed.

This checklist does not require any Make, Google Sheets, Gmail, production, API, or database change.

---

## 2. Demo Scope

The demo should show a simple controlled workflow:

1. A demo lead or request is created or selected.
2. The request is processed in a controlled demo flow.
3. An AI summary is generated.
4. The request is classified.
5. A next manual action is suggested.
6. The result is reviewed by a human before any client-facing use.

The demo must stay limited.

It must not be presented as a complete internal system, full CRM replacement, or guaranteed sales solution.

---

## 3. Pre-Demo Safety Checklist

Before the demo, confirm:

- [ ] Demo uses fake, public, or explicitly approved data only.
- [ ] No sensitive client data is visible.
- [ ] No real private client account is connected without access review.
- [ ] No Gmail module is used.
- [ ] No automatic external email sending is enabled.
- [ ] No mass outreach is enabled.
- [ ] No production, Vercel, API, or database change is required.
- [ ] No Make or Google Sheets change is performed unless a separate controlled cleanup block is opened.
- [ ] Human review remains mandatory before any real client-facing communication.

---

## 4. Make Scenario QA

Before showing the Make demo, confirm:

- [ ] Scenario is used manually.
- [ ] Run once only.
- [ ] Scheduled automation is OFF.
- [ ] Every 15 minutes is OFF.
- [ ] No Gmail module exists in the scenario.
- [ ] No external email module exists in the scenario.
- [ ] Google Sheets source is the expected demo source.
- [ ] CRM output sheet is the expected demo CRM sheet.
- [ ] OpenAI output is written only into the demo CRM output.
- [ ] No real client destination is configured.

Do not modify Make during a client call unless this is a separate controlled work block.

---

## 5. Google Sheets / CRM Demo QA

Before the demo, confirm:

- [ ] Source sheet is a demo sheet.
- [ ] CRM output sheet is a demo sheet.
- [ ] Test row is safe and non-sensitive.
- [ ] Phone field does not create a spreadsheet error.
- [ ] CRM output row is clean.
- [ ] Priority is clear and not written as Manual.
- [ ] Manual review is written as a next action, not as a priority.
- [ ] Client draft or email fields remain empty unless explicitly part of the demo.
- [ ] No real client data is shown without approval.

Expected safe output pattern:

- Priority: Low, Medium, or High.
- Next action: manual review, follow-up preparation, or another human-controlled step.
- No automatic reply.

---

## 6. AI Output QA

Before presenting the AI result, confirm:

- [ ] Summary is short and understandable.
- [ ] Priority is reasonable.
- [ ] Next action is manual and safe.
- [ ] No unsupported claim is generated.
- [ ] No personal or sensitive information is exposed.
- [ ] No promise of guaranteed result is included.
- [ ] French wording is clean if the prospect is French-speaking.
- [ ] English wording is clean if the prospect is English-speaking.
- [ ] German wording is not used unless reviewed separately.

If the AI output is unclear, do not show it as final. Explain that it is a draft requiring human review.

---

## 7. Browser / Screen Share QA

Before screen sharing, confirm:

- [ ] Only required browser tabs are open.
- [ ] Personal inbox tabs are closed.
- [ ] Personal Google Drive tabs are closed unless required.
- [ ] Make tab shows only the demo scenario.
- [ ] Google Sheets tabs show only demo sheets.
- [ ] No unrelated client, financial, private, or credential data is visible.
- [ ] Notifications are muted if possible.
- [ ] Browser zoom and layout are readable.

Prepared tabs:

- [ ] Demo form or source sheet.
- [ ] Make scenario.
- [ ] CRM output sheet.
- [ ] One-page offer if needed.
- [ ] Reply handling document if needed.
- [ ] Client-facing demo guide if needed.

---

## 8. French Client-Facing Wording

Safe wording during the demo:

La démonstration est volontairement simple.

L’objectif est de montrer comment une demande entrante peut être structurée, résumée et préparée pour un suivi manuel.

Il ne s’agit pas d’un système d’envoi automatique d’emails.

La validation humaine reste nécessaire avant toute communication externe.

Avoid saying:

- Le système répond automatiquement aux clients.
- Nous pouvons garantir plus de leads.
- Le CRM est remplacé.
- Tout peut être automatisé immédiatement.

---

## 9. Demo Talk Track

Suggested short flow:

1. Show where the request comes from.
2. Show how the request is structured.
3. Run the demo manually if appropriate.
4. Show the CRM demo output.
5. Explain the AI summary.
6. Explain the suggested next manual action.
7. Explain safety limits.
8. Ask how the prospect currently receives and follows requests.

Questions to ask:

- How do requests arrive today?
- Who reviews them?
- Where are they stored?
- Which information is often missing?
- Which actions must always stay manual?
- What would make follow-up easier without creating risk?

---

## 10. Stop Conditions

Stop the demo or pause before continuing if:

- real private data appears unexpectedly;
- Make scenario is not in manual mode;
- a Gmail or email module appears;
- scheduled automation appears active;
- CRM output is not clean;
- AI output contains unsupported claims;
- the prospect asks for automatic sending before safety rules are discussed;
- access rights are unclear;
- screen share exposes unrelated sensitive information.

If a stop condition occurs, do not improvise. Pause, explain that the demo needs a safety check, and continue only after review.

---

## 11. Post-Demo Actions

After the demo:

- [ ] Write a short internal note.
- [ ] Log what was shown.
- [ ] Log any prospect question.
- [ ] Do not mark anything as paid pilot unless explicitly agreed.
- [ ] Do not send a follow-up email without manual review.
- [ ] If the prospect is interested, use the reply handling document.
- [ ] If price is discussed, use the pricing guide.
- [ ] If a call is needed, use the paid pilot demo call checklist when created.

---

## 12. Exit Criteria

Current status:

- Checklist created.
- Run once only requirement included.
- No Gmail module requirement included.
- CRM output clean requirement included.
- French wording check included.
- Browser tabs preparation included.
- No Make/Sheets changes performed.
- No production/Vercel/API/database changes performed.
- No email sent.
- No automatic sending enabled.
- No mass outreach enabled.
