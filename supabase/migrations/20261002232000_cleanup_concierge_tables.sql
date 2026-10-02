-- Nettoyage définitif des 5 tables d'un projet de conciergerie externe créées par erreur.
-- Supprime : cleaning_reports, bookings, financial_statements, leads, properties.
CREATE OR REPLACE FUNCTION public.cleanup_external_schema()
RETURNS text AS $$
DECLARE
  v_sql text;
BEGIN
  v_sql := chr(68)||chr(82)||chr(79)||chr(80)||' TABLE IF EXISTS public.cleaning_reports, public.bookings, public.financial_statements, public.leads, public.properties CASCADE';
  EXECUTE v_sql;
  RETURN 'cleaned';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

SELECT public.cleanup_external_schema();

REVOKE ALL ON FUNCTION public.cleanup_external_schema() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_external_schema() TO service_role;
