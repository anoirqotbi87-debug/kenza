-- PRIORITÉ 1 — `profiles` restait modifiable en direct.
--
-- `REVOKE UPDATE (xp, ...) ON public.profiles` ne retire que ces colonnes. Supabase accorde
-- UPDATE sur TOUTE LA TABLE à `authenticated` par défaut, et ce privilège de table reste
-- accordé : `UPDATE profiles SET xp = 999999` continuait donc de passer. Le revoke doit
-- être fait au niveau TABLE, puis une allowlist de colonnes est réaccordée.
--
-- Colonnes réellement écrites en direct par le client (grep `from('profiles')` dans src/) :
--   - script_preference (src/lib/syncService.ts) — la seule, et elle est indispensable
--     (preferredNotation est persisté localement puis poussé à la connexion).
--   - `regional_variant` n'apparaît nulle part dans src/ : aucune colonne à accorder.
-- Les autres écritures passent par le service_role (webhook Stripe : is_premium,
-- stripe_subscription_id), qui n'est pas concerné par ces privilèges.
--
-- `auth.uid() = id` : avec l'allowlist, on ne peut plus s'attribuer du premium, mais sans
-- WITH CHECK on pourrait encore déplacer SA ligne vers l'id d'un autre utilisateur
-- (`UPDATE profiles SET id = '<autre uuid>'`). La clause ferme ce chemin.

REVOKE UPDATE ON public.profiles FROM authenticated, anon;

GRANT UPDATE (script_preference) ON public.profiles TO authenticated;

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
