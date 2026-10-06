-- Nettoyage ponctuel des sondes CSP de test avant lancement de la fenêtre d'observation.
CREATE OR REPLACE FUNCTION public.clean_probe_csp_violations()
RETURNS integer AS $$
DECLARE
  deleted integer;
BEGIN
  DELETE FROM public.csp_violations
   WHERE blocked_uri LIKE '%probe.example.com%'
      OR blocked_uri LIKE '%evil.example.com%'
      OR blocked_uri LIKE '%t.example.com%';
  GET DIAGNOSTICS deleted = ROW_COUNT;
  RETURN deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
