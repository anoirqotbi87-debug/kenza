-- Révocation des droits d'exécution de la fonction de nettoyage ponctuelle.
REVOKE ALL ON FUNCTION public.clean_probe_csp_violations() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.clean_probe_csp_violations() TO service_role;
