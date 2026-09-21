# 🐪 KENZA — Plateforme d'apprentissage de la Darija Marocaine

**KENZA** est une application web moderne (Progressive Web App) et interactive conçue pour l'apprentissage de la Darija marocaine (arabe dialectal). 
Elle combine des parcours pédagogiques (Modules), des exercices interactifs, un simulateur de dialogues, et un système de révision intelligent (SRS - Spaced Repetition System).

L'application est construite avec **Next.js 15**, **Tailwind CSS**, **Zustand**, et **Supabase**.

## 🛠️ Installation Locale

1. **Cloner le dépôt et installer les dépendances :**
   ```bash
   cd darija-quest
   npm install
   ```

2. **Configuration des variables d'environnement :**
   Renommez le fichier `.env.example` en `.env.local` et ajoutez vos clés Supabase :
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anonyme
   ```

3. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000`.

## ☁️ Base de données (Supabase)

Avant de pouvoir utiliser la sauvegarde Cloud, vous devez exécuter le script SQL :
1. Créez un projet sur [Supabase](https://supabase.com).
2. Rendez-vous dans le **SQL Editor**.
3. Copiez-collez le contenu de `supabase/schema.sql` et exécutez-le.

## 🚀 Déploiement

DarijaQuest est optimisé pour être déployé en un clic sur **Vercel** :

1. Poussez votre code sur GitHub.
2. Sur Vercel, importez le dépôt.
3. N'oubliez pas d'ajouter les *Environment Variables* `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Cliquez sur **Deploy**.

## 📱 Progressive Web App (PWA)
Un `manifest.json` est inclus. Les utilisateurs peuvent ajouter DarijaQuest à leur écran d'accueil (iOS/Android) pour une expérience plein écran, comme une application native.
