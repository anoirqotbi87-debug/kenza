import { NextRequest, NextResponse, after } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { getErrorMessage } from '@/lib/errors';
import { persistCspViolations, type CspViolation } from '@/lib/cspPersistence';

/** Un rapport CSP légitime fait quelques centaines d'octets. */
const MAX_BODY_BYTES = 8 * 1024;

/** Longueur maximale des champs journalisés. */
const MAX_FIELD_LENGTH = 200;

const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

/**
 * Neutralise une valeur avant journalisation.
 *
 * Un rapport CSP est une entrée entièrement contrôlée par le client : sans ce
 * filtrage, un `blocked-uri` contenant des retours à la ligne permet de forger
 * de fausses lignes dans les logs.
 */
function sanitize(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.replace(CONTROL_CHARS, ' ').slice(0, MAX_FIELD_LENGTH);
}

type Violation = CspViolation;

/** Extrait les violations des deux formats : `csp-report` (legacy) et Reporting API. */
function extractViolations(payload: unknown): Violation[] {
  const entries: unknown[] = Array.isArray(payload) ? payload : [payload];
  const violations: Violation[] = [];

  for (const entry of entries) {
    if (typeof entry !== 'object' || entry === null) continue;
    const record = entry as Record<string, unknown>;
    // Reporting API : { type, body }. Format legacy : { 'csp-report': {...} }.
    const raw = (record.body ?? record['csp-report'] ?? record) as Record<string, unknown>;
    if (typeof raw !== 'object' || raw === null) continue;

    const directive = sanitize(raw['effective-directive'] ?? raw['violated-directive']);
    const blockedUri = sanitize(raw['blocked-uri']);
    const documentUri = sanitize(raw['document-uri']);
    if (!directive && !blockedUri) continue;

    violations.push({ directive, blockedUri, documentUri });
  }

  return violations;
}

/**
 * Collecte des rapports de violation CSP.
 *
 * Le contrôle d'origine fail-closed des autres routes n'est **pas** appliqué
 * ici : un navigateur n'envoie ni `Origin` ni `Referer` sur un rapport CSP, donc
 * l'appliquer rejetterait 100 % des rapports légitimes. Le corps est en revanche
 * traité comme une entrée hostile : taille bornée, champs filtrés, caractères de
 * contrôle neutralisés avant journalisation.
 *
 * Les violations sont persistées dans `csp_violations` (service_role) pour la fenêtre
 * d'observation de 48 h : la rétention des logs Vercel (1 h en Hobby, 24 h en Pro) ne
 * permet pas de couvrir cette durée. L'écriture est planifiée via `after()` : elle
 * s'exécute une fois la réponse envoyée, donc sans ajouter de latence au navigateur.
 *
 * Le rate limiting est volontairement **fail-open** (contrairement à `/api/tts`) :
 * ce point de collecte ne fait aucun travail coûteux pour le client, et le rendre
 * fail-closed le rendrait aveugle au moment précis où l'infrastructure vacille —
 * soit exactement le défaut que ce collecteur corrige.
 */
export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'PAYLOAD_TOO_LARGE' }, { status: 413 });
    }

    const rate = await checkRateLimit(`csp-report:ip:${getClientIp(req)}`, 60, 60 * 1000);
    if (rate.error) {
      console.warn('[CSP Report] rate limit indisponible, rapport accepté :', rate.error);
    } else if (!rate.allowed) {
      return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
    }

    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
    }

    const violations = extractViolations(payload);
    for (const violation of violations) {
      console.warn('[CSP Violation]', JSON.stringify(violation));
    }

    if (violations.length > 0) {
      // Tache de fond : `after()` s'execute apres l'envoi de la reponse, donc la
      // persistance ne retarde pas le navigateur.
      after(() => persistCspViolations(violations));
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    console.error('[CSP Report Error]:', getErrorMessage(error));
    return NextResponse.json({ error: 'CSP_REPORT_FAILED' }, { status: 500 });
  }
}
