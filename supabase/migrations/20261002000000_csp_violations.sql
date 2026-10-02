-- Persistance des violations CSP (ticket #30) — support de la fenêtre d'observation.
--
-- Pourquoi une table : la rétention des runtime logs Vercel est de 1 h (Hobby) / 24 h (Pro).
-- Une fenêtre d'observation de 48 h ne peut donc PAS s'appuyer sur `console.warn` : les
-- violations de la veille seraient purgées avant la fin de la fenêtre, et on conclurait
-- « aucune violation légitime » sur un échantillon tronqué.
--
-- Modèle d'accès : la table n'est lue et écrite QUE par le service_role, depuis la route
-- `/api/csp-report`. Elle est volontairement INACCESSIBLE à `anon` et `authenticated` :
--   - la clé anon est PUBLIQUE (embarquée dans le bundle client), donc une policy d'insert
--     pour `anon` offrirait à n'importe qui un vecteur de remplissage de table illimité ;
--   - aucune interface ne lit ces données côté client.
-- C'est le même choix que `api_rate_limits` : RLS active, aucune policy, accès direct refusé.
-- Le REVOKE explicite est une défense en profondeur (cf. 20260929180000_revoke_profiles_table_update.sql,
-- où un privilège de table accordé par défaut survivait à un revoke de colonnes).

CREATE TABLE IF NOT EXISTS public.csp_violations (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  directive TEXT NOT NULL DEFAULT '',
  blocked_uri TEXT NOT NULL DEFAULT '',
  document_uri TEXT NOT NULL DEFAULT '',
  -- La route tronque déjà à 200 caractères ; cette borne (plus large) protège contre
  -- tout autre écrivain sans risquer de rejeter une ligne légitime.
  CONSTRAINT csp_violations_field_lengths CHECK (
    char_length(directive) <= 500
    AND char_length(blocked_uri) <= 500
    AND char_length(document_uri) <= 500
  )
);

-- Lecture de la fenêtre d'observation : `WHERE created_at > now() - interval '48 hours'`.
CREATE INDEX IF NOT EXISTS csp_violations_created_at_idx
  ON public.csp_violations (created_at DESC);

ALTER TABLE public.csp_violations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.csp_violations FROM anon, authenticated;
REVOKE ALL ON SEQUENCE public.csp_violations_id_seq FROM anon, authenticated;

GRANT INSERT, SELECT ON public.csp_violations TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.csp_violations_id_seq TO service_role;

-- Purge de rétention. Les violations CSP n'ont pas vocation à s'accumuler indéfiniment :
-- au-delà de la fenêtre d'observation elles n'ont plus d'usage, et la table ne doit pas
-- devenir un journal permanent d'URLs visitées.
CREATE OR REPLACE FUNCTION public.purge_old_csp_violations(p_keep_days integer DEFAULT 30)
RETURNS integer AS $$
DECLARE
  deleted integer;
BEGIN
  DELETE FROM public.csp_violations
   WHERE created_at < now() - (p_keep_days || ' days')::interval;
  GET DIAGNOSTICS deleted = ROW_COUNT;
  RETURN deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supabase accorde EXECUTE à PUBLIC par défaut : sans ce revoke, la purge serait
-- appelable par n'importe quel porteur de la clé anon.
REVOKE ALL ON FUNCTION public.purge_old_csp_violations(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_old_csp_violations(integer) TO service_role;
