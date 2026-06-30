# First Reply Handling for Paid Pilot

Document type: Reply handling templates  
Status: Draft  
Audience: Internal use before any prospect reply is sent  
Related roadmap step: Step 3 — First Reply Handling

---

## 1. Purpose

This document prepares safe French reply templates before any prospect responds.

The goal is to avoid improvisation, keep replies short, and maintain a controlled manual process.

No reply should be sent automatically.

Every reply must be reviewed manually before sending.

Every sent reply must be logged in CRM after sending.

---

## 2. Core Rules

Rules for all replies:

- Do not send automatically.
- Do not use mass outreach.
- Do not promise guaranteed leads.
- Do not promise guaranteed revenue.
- Do not promise Google ranking.
- Do not promise a full automation before scope is clear.
- Do not give a fixed price before the scope is confirmed.
- Keep the reply short and useful.
- Give value before pushing a call.
- Confirm the next action manually.
- Log the reply in CRM after sending.
- Create or update a follow-up task after each reply.

---

## 3. Reply Type: Interested

Use when the prospect replies positively and seems open to the idea.

### French template

Subject: Re: Suivi des demandes entrantes

Bonjour,

Merci pour votre retour.

Je peux vous préparer une première version courte du mini-audit, basée uniquement sur ce qui est visible publiquement : parcours de contact, clarté de la demande entrante et pistes simples pour mieux structurer le suivi.

L’objectif n’est pas de remplacer votre fonctionnement actuel, mais d’identifier une amélioration concrète et limitée qui pourrait être testée sans risque.

Je vous envoie cela de manière synthétique, puis vous pourrez voir si cela mérite une discussion plus approfondie.

Cordialement,

Andrii Moroz  
SmartFlow Suisse  
https://smartflowsuisse.com

### Internal action after sending

- CRM: log reply type `Interested`.
- CRM: add note that mini-audit may be sent next.
- Follow-up task: prepare or send relevant mini-audit.
- Do not mark as paid pilot until explicit agreement exists.

---

## 4. Reply Type: Wants More Details

Use when the prospect asks what the pilot includes or how it works.

### French template

Subject: Re: Détails du pilote Lead & Follow-up

Bonjour,

Bien sûr.

Le pilote est volontairement simple : il sert à mieux structurer les demandes entrantes avant le suivi manuel.

Concrètement, il peut aider à :

- résumer une demande entrante ;
- identifier le type de demande ;
- repérer les informations manquantes ;
- proposer une prochaine action interne ;
- garder une revue humaine avant toute réponse au client.

Il ne s’agit pas d’un système d’envoi automatique d’emails, ni d’une campagne de masse.

Le premier objectif serait de tester un petit périmètre contrôlé, puis de décider si cela apporte suffisamment de valeur.

Cordialement,

Andrii Moroz  
SmartFlow Suisse  
https://smartflowsuisse.com

### Internal action after sending

- CRM: log reply type `Wants more details`.
- CRM: add note about details sent.
- Follow-up task: check whether prospect asks for call, price, or example.
- If no answer after follow-up window, use no-reply logic.

---

## 5. Reply Type: Asks About Price

Use when the prospect asks about budget or price.

### French template

Subject: Re: Budget du pilote

Bonjour,

Pour un pilote simple autour des demandes entrantes et du suivi manuel, le budget indicatif se situe généralement autour de 1,200–1,500 CHF, selon le périmètre confirmé.

Le prix final dépend surtout de trois éléments :

- les outils déjà utilisés ;
- le nombre de canaux à prendre en compte ;
- le niveau d’intégration nécessaire.

Je préfère éviter de donner un prix fixe avant d’avoir confirmé le périmètre, afin de rester précis et raisonnable.

Si le besoin est plus limité, par exemple une courte analyse ou une amélioration simple du parcours de contact, un budget plus bas peut être proposé séparément.

Cordialement,

Andrii Moroz  
SmartFlow Suisse  
https://smartflowsuisse.com

### Internal action after sending

- CRM: log reply type `Asks about price`.
- CRM: add price range mentioned: `1,200–1,500 CHF indicative`.
- Follow-up task: clarify scope before any fixed proposal.
- Do not create invoice or proposal until scope is confirmed.

---

## 6. Reply Type: Wants an Example

Use when the prospect asks for an example, demo, or concrete output.

### French template

Subject: Re: Exemple concret

Bonjour,

Oui, je peux vous montrer un exemple simple.

L’exemple peut prendre la forme d’une demande entrante structurée avec :

- un résumé court ;
- le type de demande ;
- les informations manquantes ;
- une priorité apparente ;
- une prochaine action proposée ;
- une note interne pour le suivi.

Le point important est que la réponse finale reste toujours revue par une personne avant toute communication externe.

Je peux vous préparer un exemple court et non sensible, basé sur un cas fictif ou sur un parcours public.

Cordialement,

Andrii Moroz  
SmartFlow Suisse  
https://smartflowsuisse.com

### Internal action after sending

- CRM: log reply type `Wants an example`.
- CRM: add note about example/demo request.
- Follow-up task: prepare safe demo or fictive example.
- Do not use private client data.
- Do not connect Make, Gmail, Sheets, or CRM automation unless explicitly planned later.

---

## 7. Reply Type: Not Interested

Use when the prospect clearly refuses or says it is not a priority.

### French template

Subject: Re: Merci pour votre retour

Bonjour,

Merci pour votre retour.

Aucun souci si ce n’est pas une priorité pour vous actuellement.

Je ne vais pas insister. Si le sujet du suivi des demandes entrantes devient utile plus tard, vous pouvez simplement me recontacter.

Bonne continuation à vous.

Cordialement,

Andrii Moroz  
SmartFlow Suisse  
https://smartflowsuisse.com

### Internal action after sending

- CRM: log reply type `Not interested`.
- CRM: update status according to current CRM rules.
- Follow-up task: do not create a pushy follow-up.
- No further follow-up unless the prospect reopens the conversation.

---

## 8. No Reply / Follow-up Timing

Use only if an initial manual email was already sent and no reply was received.

### Timing

Suggested timing:

- wait at least 5–7 business days before one polite follow-up;
- send only one follow-up unless there is a clear reason to continue;
- do not pressure the prospect;
- do not create a sequence or automated campaign.

### French follow-up template

Subject: Re: Suivi des demandes entrantes

Bonjour,

Je me permets une courte relance concernant mon message précédent.

L’idée était simplement de partager une piste concrète pour mieux structurer les demandes entrantes et le suivi manuel, sans automatiser les réponses externes.

Si ce n’est pas une priorité pour vous actuellement, aucun souci.

Cordialement,

Andrii Moroz  
SmartFlow Suisse  
https://smartflowsuisse.com

### Internal action after sending

- CRM: log follow-up sent.
- CRM: add follow-up date.
- Follow-up task: close or pause after one polite follow-up.
- Do not send repeated follow-ups.
- Do not add to mass outreach.

---

## 9. CRM Logging Rules

After every manually sent reply, log:

- company;
- contact email;
- reply type;
- reply date;
- subject;
- language;
- next action;
- follow-up date if needed;
- manual send confirmation;
- short note about what was sent.

Do not mark as `Contacted` or `Replied` unless the CRM status rules support that exact update.

Do not mark as paid pilot unless the prospect explicitly agrees to a paid next step.

---

## 10. Manual Review Checklist Before Sending

Before sending any reply, confirm:

- the reply matches the prospect’s actual message;
- the tone is polite and Swiss B2B appropriate;
- no unsupported claim is included;
- no guaranteed result is promised;
- no automatic email sending is promised;
- price is presented as indicative unless scope is confirmed;
- next action is clear;
- CRM logging task is ready.

---

## 11. Status

Current status:

- French reply templates included.
- Manual review required before sending.
- CRM logging required after each reply.
- Follow-up logic included.
- No automatic sending proposed.
- No mass outreach proposed.
- No Gmail/email automation proposed.
- No Make/Google Sheets changes proposed.
- No production/Vercel/API/database changes.

