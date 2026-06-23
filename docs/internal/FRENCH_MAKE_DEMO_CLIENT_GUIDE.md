# Guide client — Démo Make SmartFlow

## Objectif

Ce guide sert à présenter une démo simple et sécurisée du workflow SmartFlow à un client potentiel.

La démo montre comment une demande client peut être structurée, résumée et préparée pour une action humaine, sans envoi automatique.

## Positionnement

SmartFlow Suisse ne présente pas cette démo comme un logiciel public ou un SaaS.

La démo sert uniquement à expliquer une approche possible pour améliorer le suivi des demandes clients.

## Message simple au client

Nous pouvons vous montrer un exemple simple de système de suivi des demandes.

L’idée est de partir d’une demande entrante, par exemple depuis un formulaire, puis de la transformer en information claire pour votre équipe.

Le système peut aider à :

1. centraliser les nouvelles demandes;
2. créer un résumé interne;
3. proposer une prochaine action;
4. garder une trace du traitement;
5. éviter les oublis dans le suivi.

## Ce que la démo montre

La démo peut montrer le flux suivant :

1. Une ligne de demande est ajoutée dans Google Sheets.
2. Make détecte cette nouvelle ligne.
3. OpenAI crée un résumé interne court.
4. Make met à jour la même ligne dans Google Sheets.
5. L’équipe humaine relit le résultat avant toute action externe.

## Ce que la démo ne montre pas

La démo ne doit pas montrer :

- un envoi automatique d’email;
- une campagne de prospection;
- une prise de contact réelle;
- une promesse de gain fixe;
- un accès à des données sensibles;
- un système final prêt à être utilisé sans adaptation.

## Phrase de sécurité à dire

Pour cette première version, rien n’est envoyé automatiquement à l’extérieur.

Le système prépare uniquement une information interne pour aider l’équipe à décider de la prochaine action.

Toute réponse client doit rester validée manuellement.

## Données à utiliser pendant la démo

Utiliser uniquement des données fictives ou anonymisées.

Exemple :

- Entreprise: Demo Renovation Sàrl
- Contact: Claire Demo
- Email: demo@example.com
- Téléphone: +41 79 000 00 00
- Source: Website form
- Besoin: Website contact flow
- Message: Demande de contact pour un projet de rénovation.
- Langue: FR

## Déroulement recommandé

### 1. Contexte

Expliquer brièvement le problème :

Beaucoup de petites entreprises reçoivent des demandes par email, téléphone, formulaire ou WhatsApp, mais le suivi reste manuel et parfois dispersé.

### 2. Exemple

Montrer une demande fictive dans Google Sheets.

### 3. Traitement

Lancer une exécution manuelle contrôlée dans Make uniquement si la démo est préparée.

Ne pas activer le scénario automatique.

### 4. Résultat

Montrer le résumé interne généré dans Google Sheets.

Vérifier que la colonne de brouillon client reste vide si ce n’est pas l’objet de la démo.

### 5. Discussion

Demander au client :

- comment les demandes arrivent aujourd’hui;
- qui les traite;
- où les informations sont stockées;
- quelles étapes sont souvent oubliées;
- quelles actions doivent toujours rester validées par un humain.

## Règles de sécurité

- Ne pas utiliser de vraies données client sans accord.
- Ne pas envoyer d’email  pas montrer de données sensibles.
- Ne pas connecter un compte client sans vérifier les accès.
- Garder la validation humaine avant toute communication externe.

## Limites à expliquer

La démo est volontairement simple.

Elle ne remplace pas un vrai audit du processus du client.

Avant une mise en place réelle, il faut vérifier :

- les outils utilisés par le client;
- les sources des demandes;
- les personnes responsables;
- les droits d’accès;
- les règles de confidentialité;
- les étapes qui doivent rester manuelles.

## Prochaine étape proposée

Après la démo, proposer un court audit du workflow actuel.

Objectif de l’audit :

- comprendre le processus réel;
- identifier les points de friction;
- définir une première automatisation utile;
- préparer une solution simple, maintenable et sécurisée.

## Internal status

This is an internal French demo guide.

No automatic external sending is included.

No production deployment is required.

No database change is required.

Human review remains mandatory before any real client-facing use.
