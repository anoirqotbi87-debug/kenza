#!/usr/bin/env node
/**
 * Script de diagnostic et pré-vol Stripe (Live / Test Readiness).
 *
 * RÈGLE D'OR ZERO TRUST :
 * Ne JAMAIS afficher la valeur complète d'un secret (uniquement préfixe et longueur).
 *
 * Usage :
 *   node scripts/verify-stripe-readiness.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// Chargement léger de .env.local ou .env s'ils existent et que les variables ne sont pas déjà injectées
function loadEnvFile(fileName) {
  const filePath = path.resolve(projectRoot, fileName);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

console.log('='.repeat(65));
console.log('  🔍 KENZA — AUDIT DE PRÉ-VOL MONÉTISATION STRIPE (LIVE/TEST)');
console.log('='.repeat(65));
console.log();

let hasErrors = false;
let hasWarnings = false;

// 1. Masquage sécurisé pour diagnostic
function maskSecret(val, prefixLen = 8) {
  if (!val) return '(NON DÉFINIE)';
  const visible = val.slice(0, prefixLen);
  return `${visible}... [longueur: ${val.length} caractères]`;
}

// 2. Vérification des variables d'environnement
const pubKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const secKey = process.env.STRIPE_SECRET_KEY || '';
const whSec = process.env.STRIPE_WEBHOOK_SECRET || '';
const appUrl = process.env.NEXT_PUBLIC_APP_URL || '';
const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const sbService = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('📋 1. État des Variables d\'Environnement :');
console.log(`   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : ${pubKey ? maskSecret(pubKey, 8) : '❌ NON DÉFINIE (Optionnel côté client si redirect direct)'}`);
console.log(`   - STRIPE_SECRET_KEY                  : ${secKey ? maskSecret(secKey, 8) : '❌ NON DÉFINIE'}`);
console.log(`   - STRIPE_WEBHOOK_SECRET              : ${whSec ? maskSecret(whSec, 8) : '❌ NON DÉFINIE'}`);
console.log(`   - NEXT_PUBLIC_APP_URL                : ${appUrl || '❌ NON DÉFINIE'}`);
console.log(`   - NEXT_PUBLIC_SUPABASE_URL           : ${sbUrl ? maskSecret(sbUrl, 16) : '❌ NON DÉFINIE'}`);
console.log(`   - SUPABASE_SERVICE_ROLE_KEY          : ${sbService ? maskSecret(sbService, 12) : '❌ NON DÉFINIE'}`);
console.log();

// 3. Analyse du mode Stripe
let detectedMode = 'UNKNOWN';
if (secKey.startsWith('sk_live_')) {
  detectedMode = 'LIVE';
} else if (secKey.startsWith('sk_test_')) {
  detectedMode = 'TEST';
} else if (!secKey) {
  detectedMode = 'MISSING';
}

console.log('⚖️ 2. Cohérence & Contrôle des Paires de Clés :');

if (detectedMode === 'MISSING') {
  console.log('   ❌ ERREUR : STRIPE_SECRET_KEY est absente.');
  hasErrors = true;
} else {
  console.log(`   ✅ STRIPE_SECRET_KEY : Mode ${detectedMode} détecté.`);
}

if (pubKey) {
  const pubMode = pubKey.startsWith('pk_live_') ? 'LIVE' : pubKey.startsWith('pk_test_') ? 'TEST' : 'INVALID';
  if (pubMode !== detectedMode && detectedMode !== 'MISSING') {
    console.log(`   ❌ ERREUR DE COHÉRENCE : Mix interdit ! Clé publique en mode ${pubMode} et clé secrète en mode ${detectedMode}.`);
    hasErrors = true;
  } else {
    console.log(`   ✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY : Alignée en mode ${pubMode}.`);
  }
}

if (!whSec) {
  console.log('   ⚠️ ATTENTION : STRIPE_WEBHOOK_SECRET est manquant. Les abonnements payés ne seront pas activés.');
  hasWarnings = true;
} else if (!whSec.startsWith('whsec_')) {
  console.log('   ⚠️ ATTENTION : STRIPE_WEBHOOK_SECRET ne commence pas par "whsec_". Vérifiez le secret de signature.');
  hasWarnings = true;
} else {
  console.log('   ✅ STRIPE_WEBHOOK_SECRET : Format valide (whsec_...).');
}

if (!appUrl) {
  console.log('   ⚠️ ATTENTION : NEXT_PUBLIC_APP_URL n\'est pas défini (fallback: https://kenza-dusky.vercel.app).');
  hasWarnings = true;
} else if (!appUrl.startsWith('https://')) {
  console.log(`   ⚠️ ATTENTION : NEXT_PUBLIC_APP_URL (${appUrl}) n'est pas en HTTPS.`);
  hasWarnings = true;
} else {
  console.log(`   ✅ NEXT_PUBLIC_APP_URL : ${appUrl} (HTTPS valide).`);
}

if (!sbUrl || !sbService) {
  console.log('   ❌ ERREUR : Configuration Supabase Admin incomplète pour le Webhook Stripe.');
  hasErrors = true;
} else {
  console.log('   ✅ Supabase Admin (URL + Service Role) : Configuré pour le Webhook.');
}

console.log();

// 4. Test d'appel en lecture seule Stripe (si clé secrète présente)
async function testStripeApi() {
  if (!secKey) {
    console.log('⏩ 3. Test API Stripe ignoré (STRIPE_SECRET_KEY manquante).');
    return;
  }

  console.log('📡 3. Test de Connexion API Stripe (Lecture Seule) :');
  try {
    const stripePath = path.resolve(projectRoot, 'node_modules', 'stripe', 'cjs', 'stripe.cjs.node.js');
    let Stripe;
    if (fs.existsSync(stripePath)) {
      const mod = await import(`file://${stripePath.replace(/\\/g, '/')}`);
      Stripe = mod.default || mod;
    } else {
      const mod = await import('stripe');
      Stripe = mod.default || mod;
    }

    const stripe = new Stripe(secKey, {
      apiVersion: '2025-02-24.acacia',
    });

    const balance = await stripe.balance.retrieve();
    console.log('   ✅ Connexion Stripe réussie !');
    console.log(`   - livemode               : ${balance.livemode ? '🟢 VRAI (PRODUCTION LIVE)' : '🟡 FAUX (MODE TEST)'}`);
    console.log(`   - Devises disponibles    : ${balance.available.map((b) => b.currency.toUpperCase()).join(', ') || 'N/A'}`);
    
    if (detectedMode === 'LIVE' && !balance.livemode) {
      console.log('   ❌ ALERTE : La clé commence par sk_live_ mais Stripe renvoie livemode: false.');
      hasErrors = true;
    }
  } catch (err) {
    console.log(`   ❌ Échec de l'appel API Stripe : ${err.message}`);
    hasErrors = true;
  }
}

await testStripeApi();

console.log();
console.log('='.repeat(65));
if (hasErrors) {
  console.log('❌ RÉSULTAT : DES ERREURS BLOQUANTES DOIVENT ÊTRE CORRIGÉES.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️ RÉSULTAT : PRÉ-VOL RÉUSSI AVEC AVERTISSEMENTS.');
  process.exit(0);
} else {
  console.log(`🎉 RÉSULTAT : PRÉ-VOL VALIDE ! PRÊT POUR LE MODE ${detectedMode}.`);
  process.exit(0);
}
