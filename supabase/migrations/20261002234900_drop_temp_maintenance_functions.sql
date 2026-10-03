-- Suppression des fonctions d'administration temporaires.
DROP FUNCTION IF EXISTS public.clean_probe_csp_violations();
DROP FUNCTION IF EXISTS public.cleanup_external_schema();
