// Suivi des sources d'acquisition et du parcours utilisateur (tables Supabase : funnel_events, user_attribution).
// Ne bloque jamais l'application : toutes les erreurs de suivi sont silencieuses.
import { supabase } from './supabase';

const ANON_KEY = 'kenza_anon_id';
const TOUCH_KEY = 'kenza_first_touch';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

type UtmKey = (typeof UTM_KEYS)[number];
export type FirstTouch = Partial<Record<UtmKey, string>> & {
  referrer?: string;
  landing_page?: string;
  first_seen_at?: string;
};

const isBrowser = () => typeof window !== 'undefined';

function randomId(): string {
  if (isBrowser() && window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export function getAnonymousId(): string {
  if (!isBrowser()) return '';
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return randomId();
  }
}

/** Source de la toute première visite (first-touch), conservée jusqu'à l'inscription. */
export function getFirstTouch(): FirstTouch {
  if (!isBrowser()) return {};
  try {
    const saved = localStorage.getItem(TOUCH_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }

  const params = new URLSearchParams(window.location.search);
  const externalReferrer =
    document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : undefined;
  const touch: FirstTouch = {
    referrer: externalReferrer,
    landing_page: window.location.pathname + window.location.search,
    first_seen_at: new Date().toISOString(),
  };
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) touch[k] = v;
  });
  try {
    localStorage.setItem(TOUCH_KEY, JSON.stringify(touch));
  } catch {
    /* ignore */
  }
  return touch;
}

/**
 * Enregistre un événement du parcours.
 * @param pagePath chemin « virtuel » (ex. '/learn') : l'app est une page unique à onglets.
 */
export async function track(eventName: string, properties: Record<string, unknown> = {}, pagePath?: string) {
  if (!isBrowser()) return;
  try {
    const touch = getFirstTouch();
    const params = new URLSearchParams(window.location.search);
    const { data } = await supabase.auth.getSession();

    await supabase.from('funnel_events').insert({
      anonymous_id: getAnonymousId(),
      user_id: data.session?.user.id ?? null,
      event_name: eventName,
      page_path: pagePath ?? window.location.pathname,
      referrer: touch.referrer ?? null,
      utm_source: params.get('utm_source') ?? touch.utm_source ?? null,
      utm_medium: params.get('utm_medium') ?? touch.utm_medium ?? null,
      utm_campaign: params.get('utm_campaign') ?? touch.utm_campaign ?? null,
      utm_content: params.get('utm_content') ?? touch.utm_content ?? null,
      utm_term: params.get('utm_term') ?? touch.utm_term ?? null,
      properties,
    });
  } catch {
    /* le suivi ne doit jamais casser l'app */
  }
}

/** Inscription e-mail : transmet la source au trigger Supabase handle_new_user. */
export async function signUpWithTracking(email: string, password: string, extra: Record<string, unknown> = {}) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { ...extra, ...getFirstTouch(), anonymous_id: getAnonymousId() },
      emailRedirectTo: isBrowser() ? window.location.origin : undefined,
    },
  });
}

/** Inscription Google/OAuth : rattache la source au compte après le retour de connexion. */
export async function claimAttribution() {
  try {
    await supabase.rpc('claim_attribution', { p: { ...getFirstTouch(), anonymous_id: getAnonymousId() } });
  } catch {
    /* ignore */
  }
}
