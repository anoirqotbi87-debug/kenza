// src/lib/supabaseAdmin.ts (NOUVEAU FICHIER)
//
// Client Supabase à clé service_role. SERVEUR UNIQUEMENT : ne jamais l'importer
// depuis un composant 'use client', car la clé contourne la RLS.
// Utilisé par le limiteur de débit (src/lib/rateLimit.ts), dont les fonctions SQL
// ne sont plus exécutables par `anon` / `authenticated` après la migration.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

/** Retourne le client admin, ou null si la configuration serveur est incomplète. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  adminClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
