# Cerithe — Contexte agent

Ce fichier est le point d'entrée pour tout agent (Claude Code) qui travaille sur ce repo. Il regroupe ce qui est stable (pitch, architecture, méthode de travail). Ce qui bouge souvent (état d'avancement, dette, décisions produit, ADR) reste dans le vault vault-perso, pointé par chemin absolu ci-dessous plutôt que dupliqué ici — ne jamais recopier un statut ou une décision datée depuis ces fichiers, toujours les lire à la demande pour avoir l'état réel.

Racine du vault : `/Users/gillescobigo/Documents/Gilles/vault-perso/Projets/Cerithe/`

## 1. Pitch et cible

Cerithe est un carnet de santé numérique du bâtiment : le propriétaire consigne travaux, documents, projets sur ses biens. **Feature signature** : transmission complète de l'historique lors d'une vente (token opaque, flux vendeur/destinataire avec acceptation puis confirmation).

MVP livré en prod le 17/07/2026 (100%, cf `cerithe-blocs-mvp.md` pour le détail bloc par bloc, source unique du pourcentage — ne jamais le recalculer autrement ni le recopier d'un autre fichier). Phase actuelle : post-MVP, cf section 2.

Origine du nom : le cérithe est un coquillage choisi par le bernard-l'hermite comme première maison. "s'hérite" fait écho direct à la transmission.

Profil recruteur visé par ce projet (à garder en tête pour le niveau de qualité attendu, ce n'est pas qu'un exercice) : penser comme un dev senior même junior, comprendre le pourquoi pas juste le comment, profil BTP comme vrai avantage, apprentissage rapide et structuré.

## 2. Phase actuelle : mise au carré avant nouvelles fonctionnalités

**Règle dure, non négociable : aucune nouvelle fonctionnalité tant que cette phase n'est pas close.** Décidée le 22/07. Périmètre exact (vérifier l'état réel des cases dans `cerithe-etat.md#Phase 1 du pilotage d'agent`, cette liste peut être obsolète) :

- Tests automatisés : unitaires backend en priorité sur `transmission.service.ts`, puis les autres services critiques (auth, property)
- CI/CD backend : pipeline GitHub Actions, déploiement auto sur le VPS après push sur `main`, tests exécutés **avant** le déploiement, jamais après
- Setup Git propre (détail en section 5) : `main`/`dev` protégées, branche de feature par tâche, PR obligatoire, CI qui bloque le merge si les tests échouent
- Corriger la dette qui viole déjà des règles actées : cf `cerithe-dette.md` pour le détail exact des points identifiés le 22/07
- Secrets en CI : clé SSH de déploiement et `.env.prod` dans GitHub Secrets, jamais en dur dans le repo ni le fichier de workflow
- Monitoring léger : healthcheck externe simple sur `/health`
- Migration BDD Supabase → Postgres natif VPS (même pattern que Nexio, déjà en place sur le VPS)

Une idée de feature qui émerge en cours de route (ex. réflexion modèle économique documentée dans `cerithe-modele-economique.md`) se note, ne se code pas avant la fermeture de cette phase.

## 3. Stack

**Backend** (`/backend`) : Node.js, Express 5.2, TypeScript 6.0, Prisma 7.8 (adapter `PrismaPg`), PostgreSQL. Auth JWT (access token + refresh token), argon2 (jamais bcrypt), Zod 4.4. Runner dev `tsx` + nodemon (jamais `ts-node`), port 3000. Client Prisma généré dans `prisma/generated/`, `"type": "module"`, `verbatimModuleSyntax: true`, `exactOptionalPropertyTypes: true`.

**Frontend** (`/frontend`) : React 19.2, TypeScript, Tailwind v4, Vite 8.0, React Router. TanStack Query 5.101 + Axios 1.18 (intercepteur AT) + Zustand 5.0 (jamais Context API pour la logique métier) + React Hook Form 7.79 + shadcn/ui.

Schéma Prisma (modèles/enums détaillés dans `cerithe-stack.md`) : `User` → `Profile` → `Property` → `Room`, `Project`, `Task`, `Document`, `Transmission`, `TransmissionToken`. Le champ `Profile.role` (`PROFESSIONAL`/`INDIVIDUAL`) existe déjà mais n'est pas exploité (codé en dur à `INDIVIDUAL` à l'inscription, pas de switch de profil) — ne pas construire de logique qui suppose un `Profile` monolithique pour autant, ce bloc viendra en phase 2.

Architecture en couches obligatoire, sans exception : route > middleware > controller > service. Le service ne connaît jamais `req`/`res`. Validation Zod sur toute entrée. Ownership vérifié sur tout CRUD dès l'écriture du controller. Ces règles et les autres conventions générales (nommage, TypeScript, gestion d'erreurs) sont dans `~/.claude/CLAUDE.md`, section "Back-end (Node/Express)" et "Checklist V1 native" — supposées connues, pas reformulées ici.

Infrastructure : frontend sur Vercel (`cerithe.gillescobigo.com`), backend sur VPS Hetzner (`cerithe-api.gillescobigo.com`), stockage Supabase Storage (bucket `documents`, privé, 10MB, PDF/JPG/PNG).

## 4. La boucle de travail

Chaque tâche non triviale (tout sauf un renommage ou une correction d'une ligne) suit ces étapes dans l'ordre, sans sauter à l'implémentation :

**1. Spec** — Gilles formule le résultat attendu, pas seulement l'action technique : comportement attendu, cas limites qui comptent, ce qui est explicitement hors périmètre.

**2. Contexte** — relire ce qui est nécessaire (fichiers concernés, `cerithe-etat.md`, `cerithe-adr.md` si pertinent) avant de proposer quoi que ce soit. Aucune supposition sur l'état du code.

**3. Plan (obligatoire avant tout code)** :
```
PHASE 1 — AUDIT (obligatoire avant code)
Fichiers concernés, mécanisme actuel, plan d'action proposé.
Rendre compte avant d'écrire la moindre ligne.

PHASE 2 — IMPLÉMENTATION (uniquement après validation explicite)
Périmètre exact, contraintes, ce qui est interdit.
```
Si un point de la spec est ambigu, poser la question avant de proposer un plan plutôt que deviner.

**4. Implémentation** — diffs petits, une seule chose modifiée à la fois. Jamais plusieurs services/fichiers non liés dans le même lot.

**5. Vérification par preuve, pas par affirmation** — jamais "ça fonctionne" sans preuve : commande exécutée, sortie réelle du test, ou capture d'écran. La preuve doit être suffisante pour trancher sans réexécuter.

**6. Revue (checklist ci-dessous), jamais raccourcie.**

**7. Commit** — un commit = un changement logique, conventionnel (`feat:`, `fix:`, `refactor:`...), jamais plusieurs sujets mélangés.

### Checklist de revue, spécifique au code généré par IA

Les signaux de surface (formatage propre, nommage cohérent) ne prouvent rien sur du code généré par IA, il est bien formaté par défaut. La revue va plus loin que sur du code humain :

1. **Fidélité à la spec** : correspond exactement à ce qui était demandé, pas juste quelque chose de plausible qui y ressemble
2. **Logique et cas limites** : cas null, zéro, valeur limite, entrée vide, accès concurrent, tracés manuellement pour chaque fonction touchée
3. **Intégrité des appels externes** : chaque appel à une librairie/API vérifié contre la version réellement installée (`package.json`), jamais supposé correct. Vigilance spécifique aux API inventées (existe, mais pas avec cette signature)
4. **Sécurité** : ownership sur tout CRUD, validation Zod, pas de fuite d'info dans les erreurs, JWT — plus spécifiquement : contournement d'auth, secret en dur, entrée non assainie
5. **Conscience du contexte non fourni à l'IA** : le code tient-il compte de contraintes que l'agent ne pouvait pas connaître sans qu'on les lui dise (limite de débit, contrainte transactionnelle, comportement du VPS en prod) ?
6. **Tests** : un test généré par l'IA seul ne suffit jamais (couvre presque toujours que le cas nominal). Toute fonction touchée doit avoir au moins un test pour une entrée vide, une entrée invalide, et un cas d'erreur

Principe directeur : ce qui devient rare et différenciant n'est plus la génération de code, c'est la vérification et la capacité à revenir en arrière. Chaque diff est lu en entier par Gilles avant commit, jamais un "ça a l'air bon" en survolant.

## 5. Git

Modèle révisé le 23/07 (cf ADR) : `main` = prod, une branche de feature par tâche, PR directement vers `main`, jamais de commit direct sur `main`. Pas de branche `dev` intermédiaire : testée sans effet pour un développeur seul (tests faits sur la branche en local, pas d'environnement `dev` déployé séparément), et source d'une confusion réelle le 23/07 (un fix mergé sur `dev` mais pas remonté sur `main` à cause de l'ordre de deux PR).

Protection de branche active sur `main` (GitHub) : PR obligatoire, push direct interdit y compris pour l'admin, pas de force-push, pas de suppression de branche. Pas encore de check automatique requis (dépend des items Tests automatisés/CI-CD, non traités, section 2).

Commits conventionnels (`feat:`, `fix:`, `refactor:`, `chore:`...) systématiquement.

## 6. Pointeurs vers l'historique

En cas de doute sur une décision déjà prise ou une raison passée, lire plutôt que deviner :

- `cerithe-etat.md` — état d'avancement, planning, phase en cours
- `cerithe-adr.md` — décisions techniques (ADR)
- `cerithe-decisions-produit.md` — décisions produit (partis pris fonctionnels)
- `cerithe-dette.md` — dette technique et points de vigilance
- `cerithe-lessons.md` — erreurs déjà faites et corrigées, pour ne pas les refaire
- `cerithe-modele-economique.md` — réflexion modèle économique (non tranché, hors scope tant que la Phase 1 n'est pas close)
- `transmission-modele.md`, `transmission-flux.md`, `transmission-endpoints.md` — détail de la feature signature

Tous ces fichiers sont dans `/Users/gillescobigo/Documents/Gilles/vault-perso/Projets/Cerithe/`.
