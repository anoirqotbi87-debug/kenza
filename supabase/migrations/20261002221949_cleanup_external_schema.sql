-- Nettoyage des 5 tables d'un projet de conciergerie externe créées par erreur.
-- Supprime : cleaning_reports, bookings, financial_statements, leads, properties.
DROP TABLE IF EXISTS public.cleaning_reports, public.bookings,
                     public.financial_statements, public.leads, public.properties CASCADE;
