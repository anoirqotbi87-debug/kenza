# Formulaire de Déclaration de Sécurité des Données — Google Play Data Safety

Synthèse des réponses à cocher sur la Google Play Console pour Kenza(app.kenza.darija)。

## Données collectées

| Type | Détail | Destination |
|---|---|---|---|
| **Identifiants personnels** | Adresse email — uniquement si création de compte via **Supabase Auth** pour synchronisation de la progression | Supabase |
| **Activité sur l'application** | Progression des leçons, révisions SRS et XP | Supabase |
| **Données vocales** | **Aucun enregistrement audio n'est conservé sur nos serveurs** : la reconnaissance vocale utilise la **Web Speech API locale** du terminal | — |

## Partage tiers
- **Aucun partage à des fins publicitaires.**
- **Sous-traitants techniques** necessaires au fonctionnement :
  - **Supabase** : hébergement cloud chiffré (TLS/AES) — auth, base de données de progression.
  - **Stripe** : paiement sécurisé certifié **PCI-DSS** — abonnements Kenza Pro.



## Chiffrement & Sécurité
- **En transit** : Oui — HTTPS obligatoire.).
- **Au repos** : Chiffrement côté Supabase(AES)。

## Suppression des données
- **L'utilisateur peut demander la suppression de son compte et de ses données à tout moment** (procédure accessible via support : anoirqotbi87@gmail.com)。

## Politique de confidentialité
- URL publique : https://kenza-dusky.vercel.app/privacy — doit être en ligne et accessible avant la soumission。
- ⚠️ **État constaté (2026-10-03) : `/privacy` → 404 en prod** ; la page existe sous
  `/confidentialite` (https://kenza-dusky.vercel.app/confidentialite, contenu conforme — données, Supabase, Stripe,
  droits & suppression)。 → Décision requise (alias `/privacy` ou URL `/confidentialite` dans la fiche) avant upload。
- 📧 **Email de contact côté app** : `support@kenza.app` (page policy) — le prompt Play Store indique
  `anoirqotbi87@gmail.com`(support listing)。 À harmoniser chez le propriétaire。