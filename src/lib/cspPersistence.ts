import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getErrorMessage } from '@/lib/errors';

export type CspViolation = {
  directive: string;
  blockedUri: string;
  documentUri: string;
};

/** `undefined` = pas encore tenté, `null` = configuration absente (ne pas réessayer). */
let cachedClient: SupabaseClient | null | undefined;

/**
 * Client `service_role`, en lecture seule de portée module.
 *
 * La clé anon est publique (embarquée dans le bundle client) : l'autoriser à écrire
 * dans `csp_violations` offrirait un vecteur de remplissage de table illimité. La table
 * est donc réservée au service_role, et la route n'utilise que cette clé.
 */
function getServiceClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  cachedClient = url && key ? createClient(url, key) : null;
  return cachedClient;
}

/**
 * Persiste les violations pour la fenêtre d'observation.
 *
 * Ne lève jamais : la collecte est une tâche de fond, une panne de persistance ne doit
 * pas transformer une réponse 204 en erreur (même stratégie fail-open que le rate limiting).
 * L'échec est journalisé, donc visible dans les logs — on perd la ligne, pas la réponse.
 */
export async function persistCspViolations(violations: CspViolation[]): Promise<void> {
  if (violations.length === 0) return;

  const supabase = getServiceClient();
  if (!supabase) {
    console.error('[CSP Persist] NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY absent : violations non persistées.');
    return;
  }

  try {
    const { error } = await supabase.from('csp_violations').insert(
      violations.map((violation) => ({
        directive: violation.directive,
        blocked_uri: violation.blockedUri,
        document_uri: violation.documentUri,
      }))
    );
    if (error) console.error('[CSP Persist] insertion refusée :', error.message);
  } catch (error: unknown) {
    console.error('[CSP Persist] échec :', getErrorMessage(error));
  }
}
