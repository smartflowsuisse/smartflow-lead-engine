# Email Source Notes Workflow QA

Date: 2026-06-20  
Status: PASSED  
Mode: local/manual QA only  
Emails sent: NO  
Mass outreach: NO  

## What was tested

Workflow tested:

1. Open Missing Contact Queue.
2. Click Add Email for a missing-contact lead.
3. Confirm edit page opens with:
   - returnTo=/outreach/missing-contacts
   - noteHint=email-source
4. Confirm Notes field receives email source template.
5. Save Changes.
6. Confirm return to /outreach/missing-contacts.
7. Clean test email and test note template from local database.
8. Confirm missing email count returns to original count.

## Confirmed behavior

The Add Email workflow correctly opens the edit page with an email-source note template.

Template confirmed:

Email source: Website / Contact page / Imprint / Manual check  
Checked:  
Notes:

## Data safety

No real outreach email was sent.

A temporary placeholder email was used only for local QA and then removed from lead 66.

After cleanup:

- email: empty
- notes: Imported from Discovery

## Current decision

Do not add a new database column for email source.

Use the existing `notes` field for email/contact source tracking.

## Next action

Continue readiness preparation before any controlled manual outreach test.

AG Construction remains prepared as a possible first test candidate, but no email has been sent.
