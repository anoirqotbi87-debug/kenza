-- PRIORITÉ 0 — claim_checkpoint_reward était inutilisable.
--
-- Deux défauts dans la version précédente :
--
-- 1. Le paramètre s'appelait `score`, comme la colonne `score` de lesson_progress et
--    de user_checkpoints. PL/pgSQL ne peut pas trancher dans le WHERE/INSERT :
--    `column reference "score" is ambiguous`. L'appel échouait donc systématiquement.
--    Tous les paramètres sont préfixés `p_`, et les variables locales `v_`.
--
-- 2. Le prérequis testait `score > 0`, or le client n'écrit JAMAIS `lesson_progress.score`
--    (syncService n'envoie que lesson_id/completed/completed_at ; le CHECK de la policy
--    autorise 0..100, et la colonne garde sa valeur par défaut 0). Le critère était donc
--    structurellement impossible à satisfaire pour un utilisateur honnête : personne ne
--    pouvait obtenir de certificat. Le signal réellement écrit par l'app est `completed`.
--
-- Reste ouvert : le prérequis ne dépend toujours pas de `p_checkpoint_id` (n'importe quel
-- checkpoint est débloqué par 3 leçons terminées, quel que soit le module). Le lier au
-- module réel suppose une correspondance checkpoint -> leçons qui n'existe nulle part :
-- pas de table `lessons` en base, et les identifiants envoyés par le client sont les clés
-- de module ('1'..'7'), pas les ids du curriculum. Décision à confirmer — voir le rapport.

DROP FUNCTION IF EXISTS public.claim_checkpoint_reward(text, integer, text);
-- La signature (text, integer) existe déjà, mais avec des paramètres nommés
-- `checkpoint_id`/`score`. `CREATE OR REPLACE` refuse de les renommer (« cannot change
-- name of input parameter ») : il faut supprimer la fonction avant de la recréer.
DROP FUNCTION IF EXISTS public.claim_checkpoint_reward(text, integer);

CREATE OR REPLACE FUNCTION public.claim_checkpoint_reward(
  p_checkpoint_id text,
  p_score integer
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lessons_completed integer;
  v_generated_code text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_score < 0 OR p_score > 100 THEN
    RAISE EXCEPTION 'Invalid score';
  END IF;

  IF p_checkpoint_id IS NULL OR length(trim(p_checkpoint_id)) = 0 THEN
    RAISE EXCEPTION 'Invalid checkpoint';
  END IF;

  SELECT count(*) INTO v_lessons_completed
  FROM public.lesson_progress
  WHERE user_id = auth.uid()
    AND completed = true;

  IF v_lessons_completed < 3 THEN
    RAISE EXCEPTION 'Prerequisites not met';
  END IF;

  v_generated_code := 'KZ-' || upper(substring(gen_random_uuid()::text, 1, 8));

  INSERT INTO public.user_checkpoints (user_id, checkpoint_id, score, certificate_code, passed_at)
  VALUES (auth.uid(), p_checkpoint_id, p_score, v_generated_code, now())
  ON CONFLICT (user_id, checkpoint_id)
  DO UPDATE SET
    score = EXCLUDED.score,
    certificate_code = EXCLUDED.certificate_code,
    passed_at = EXCLUDED.passed_at;

  RETURN v_generated_code;
END;
$$;
