-- Rate limiting durable côté serveur (audit #4 #5)
-- Table accessible UNIQUEMENT via la RPC check_rate_limit (SECURITY DEFINER).
-- RLS activée sans policy => accès direct refusé pour anon/authenticated.

CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  reset_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Fenêtre fixe atomique : incrément si la fenêtre est valide, sinon reset.
-- Retourne true si la requête est autorisée (count <= p_limit).
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_ms bigint
)
RETURNS boolean AS $$
DECLARE
  new_count integer;
BEGIN
  INSERT INTO public.api_rate_limits (key, count, reset_at)
  VALUES (p_key, 1, now() + (p_window_ms || ' milliseconds')::interval)
  ON CONFLICT (key) DO UPDATE SET
    count = CASE
      WHEN public.api_rate_limits.reset_at > now()
      THEN public.api_rate_limits.count + 1
      ELSE 1
    END,
    reset_at = CASE
      WHEN public.api_rate_limits.reset_at > now()
      THEN public.api_rate_limits.reset_at
      ELSE now() + (p_window_ms || ' milliseconds')::interval
    END
  RETURNING count INTO new_count;

  RETURN new_count <= p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Nettoyage périodique des entrées expirées (à lancer manuellement ou via pg_cron).
CREATE OR REPLACE FUNCTION public.purge_expired_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.api_rate_limits WHERE reset_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
