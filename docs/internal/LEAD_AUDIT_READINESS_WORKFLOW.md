# Lead Audit Readiness Workflow

Internal SmartFlow Lead Engine workflow for preparing leads before a first-client mini-audit or proposal.

## Purpose

This workflow helps SmartFlow Suisse move from a raw lead to a clear next manual action.

It is used to confirm:

- whether the website was reviewed;
- whether the contact path is confirmed;
- whether the business problem is identified;
- whether the recommended SmartFlow offer is selected;
- whether the next manual action is defined;
- whether the lead is ready for mini-audit / proposal preparation.

## Lead Detail Review Flow

Use the Lead Details page in this order:

1. Review lead score and contact information.
2. Check website and contact path.
3. Review AI Audit and opportunity summary.
4. Add or update internal notes.
5. Check Mini-Audit Readiness.
6. Review the Mini-audit preparation path.
7. Define the next manual action.
8. Create or update follow-up tasks.

## Internal Notes Template

Recommended note structure:

Website audit:
- First impression:
- CTA / contact path:
- Follow-up gap:
- Automation opportunity:
- Recommended offer:
- Next manual action:
- Notes:

## Mini-Audit Readiness Criteria

A lead is considered ready for mini-audit / proposal preparation when:

- Website reviewed: done.
- Contact path confirmed: done.
- Business problem identified: done.
- Recommended offer selected: done.
- Next manual action defined: done.
- Mini-audit ready: done.

## Manual Safety Rules

- No automatic external email sending.
- No mass outreach.
- No unreviewed AI-generated client-facing text.
- No production / Vercel changes from this workflow.
- No database schema changes without a separate reviewed task.
- Email generator output remains draft/manual-review only.
- CRM status changes must reflect actual human action.

## PR Reference

Initial workflow improvement added through PR #97.
