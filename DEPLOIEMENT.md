# Déploiement Kenza

Guide de mise en production sur Vercel. Pour l'installation locale, voir `README.md`.

## 1. Pré-requis

- Un projet Supabase (migrations appliquées, voir `README.md`).
- Un compte Stripe avec deux prix configurés (annuel et mensuel, en EUR et MAD).
- Un projet Vercel connecté au dépôt.

## 2. Variables d'environnement

Toutes les variables sont documentées dans `.env.example` (versionné, sans secret).
À définir dans **Vercel > Project Settings > Environment Variables** sur l'environnement
*Production* **et** *Preview*.

| Variable | Portée | Obligatoire | Conséquence si absente |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | client + serveur | oui | L'application ne démarre pas (auth cassée). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client + serveur | oui | Idem. |
| `SUPABASE_SERVICE_ROLE_KEY` | serveur uniquement | oui | Le webhook ne peut pas écrire `is_premium` : un paiement réussi n'accorde **aucun** accès. |
| `STRIPE_SECRET_KEY` | serveur uniquement | oui | Checkout et portail renvoient `503`. |
| `STRIPE_WEBHOOK_SECRET` | serveur uniquement | oui | Le webhook rejette toutes les requêtes (signature invalide). |
| `GOOGLE_GENERATIVE_AI_API_KEY` | serveur uniquement | oui | Le roleplay IA échoue. |
| `NEXT_PUBLIC_APP_URL` | serveur | recommandé | Redirections Stripe vers l'origine par défaut codée en dur. |

> **Ne jamais** préfixer une clé secrète par `NEXT_PUBLIC_` : tout ce préfixe est inliné dans le
> bundle client et devient public. `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`,
> `STRIPE_WEBHOOK_SECRET` et `GOOGLE_GENERATIVE_AI_API_KEY` sont strictement serveur.

## 3. Webhook Stripe

Dans **Stripe > Developers > Webhooks**, ajouter un endpoint :

- URL : `https://<domaine>/api/stripe/webhook`
- Événements : `checkout.session.completed`, `customer.subscription.updated`,
  `customer.subscription.deleted`

Copier le *signing secret* (`whsec_...`) dans `STRIPE_WEBHOOK_SECRET`, puis redéployer.
Le webhook est la **seule** voie d'attribution du premium : sans lui, un utilisateur peut payer
sans jamais être débloqué.

## 4. Base de données

Appliquer les migrations de `supabase/migrations/` **avant** le déploiement applicatif : le code
lit des colonnes (`profiles.is_premium`, `profiles.stripe_customer_id`) qui doivent exister.
Voir la section *Base de données* du `README.md` pour l'ordre et la vérification par rejeu.

## 5. Déployer

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

Ces quatre étapes sont bloquantes en CI (`.github/workflows/ci.yml`). Une fois vertes localement,
pousser sur `main` (ou ouvrir une PR) : Vercel déploie automatiquement.

## 6. Vérifications après déploiement

1. **Devise** — `GET /api/geo/currency` doit renvoyer `MAD` depuis le Maroc et `EUR` ailleurs :
   ```bash
   curl -s https://<domaine>/api/geo/currency
   ```
   Sans header d'infrastructure (appel direct), la réponse dépend du fuseau `?tz=` puis retombe
   sur `EUR`.
2. **Checkout** — `POST /api/stripe/checkout` avec une clé de test Stripe crée une session dont le
   montant correspond à `src/config/pricing.ts` (59,00 € annuel, 9,00 € mensuel).
3. **Essai gratuit** — la session annuelle doit porter `subscription_data.trial_period_days = 7` ;
   la session mensuelle ne doit en porter aucun.
4. **Webhook** — après un paiement test, `profiles.is_premium` passe à `true` pour l'utilisateur.
5. **PWA** — `public/sw.js` est généré au build ; ne pas le commiter.

## 7. Tarifs

Les montants, les libellés produits et les chaînes affichées vivent dans **`src/config/pricing.ts`**.
C'est la source unique : le paywall, la CGU et la route Stripe en dérivent tous. Un test
(`src/config/pricing.test.ts`) échoue si un prix formaté réapparaît en dur ailleurs, et vérifie que
le badge de remise annuelle correspond au prix réellement facturé.

Pour changer un tarif, modifier uniquement ce fichier, puis relancer `npm test`.
