-- PRIORITÉ 3 — `lesson_progress` reste modifiable en direct.
--
-- La table gate desormais les certificats (20260929190000) : un utilisateur pouvait donc
-- obtenir n'importe quel certificat sans jamais faire une lecon.
--
-- Pourquoi `REVOKE UPDATE` seul ne suffit pas (verifie empiriquement) : l'ecriture reelle de
-- l'application est un UPSERT. Sur une ligne qui n'existe pas encore, `ON CONFLICT ... DO UPDATE`
-- ne declenche jamais le chemin UPDATE : c'est un simple INSERT. Seul le privilege INSERT est
-- consomme, et `REVOKE UPDATE` ne le retire pas. Le revoke doit donc porter sur INSERT *et*
-- UPDATE, et l'ecriture passer par un RPC SECURITY DEFINER.
--
-- Partie 1 : lesson_progress — RPC dedie (cette table gate les certificats).
-- Partie 2 : srs_items — correctif cosmetique seulement, l'ecriture directe reste possible par
--            conception (voir le commentaire en fin de fichier).

-- =====================================================================================
-- PARTIE 1 — lesson_progress
-- =====================================================================================

REVOKE INSERT, UPDATE ON public.lesson_progress FROM authenticated, anon;

-- Le trou documente : la policy UPDATE filtrait bien sur `auth.uid() = user_id` en USING,
-- mais son WITH CHECK ne le repetait pas (contrairement a la policy INSERT). Le client n'a
-- plus UPDATE, donc cette clause ne le concerne plus ; elle garde la policy correcte pour
-- toute ecriture future, y compris via SECURITY DEFINER.
DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can update own lesson progress"
  ON public.lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND score BETWEEN 0 AND 100);

-- Cas normal : une lecon terminee.
-- SECURITY DEFINER : le corps s'execute en tant que proprietaire de la fonction (postgres),
-- qui n'est pas soumis au REVOKE ci-dessus. `user_id` est toujours `auth.uid()` : le client ne
-- peut donc pas ecrire la progression d'autrui.
CREATE OR REPLACE FUNCTION public.complete_lesson(
  p_lesson_id text,
  p_score integer DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_lesson_id IS NULL OR trim(p_lesson_id) = '' THEN
    RAISE EXCEPTION 'Invalid lesson';
  END IF;

  -- `public.lesson_progress.score` est qualifie : sans schema, `score` serait ambigu dans le
  -- DO UPDATE (colonne existante vs EXCLUDED). C'est exactement le piege corrige en 20260929160000.
  INSERT INTO public.lesson_progress (user_id, lesson_id, completed, completed_at, score)
  VALUES (auth.uid(), p_lesson_id, true, now(), COALESCE(p_score, 0))
  ON CONFLICT (user_id, lesson_id)
  DO UPDATE SET
    completed = true,
    completed_at = now(),
    score = COALESCE(p_score, public.lesson_progress.score);
END;
$$;

-- Migration invite : plusieurs lecons d'un coup a l'inscription. Reutilise complete_lesson
-- pour que la logique d'ecriture reste unique.
CREATE OR REPLACE FUNCTION public.complete_lessons_bulk(p_lesson_ids text[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_lesson_id text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_lesson_ids IS NULL THEN
    RETURN;
  END IF;

  FOREACH v_lesson_id IN ARRAY p_lesson_ids LOOP
    PERFORM public.complete_lesson(v_lesson_id);
  END LOOP;
END;
$$;

-- PostgreSQL accorde EXECUTE a PUBLIC par defaut, et Supabase l'accorde en plus a anon et
-- authenticated sur les nouvelles fonctions. On ferme les deux avant d'ouvrir au seul role
-- authentifie : un utilisateur anonyme ne doit pas pouvoir ecrire de progression.
REVOKE ALL ON FUNCTION public.complete_lesson(text, integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.complete_lessons_bulk(text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.complete_lesson(text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_lessons_bulk(text[]) TO authenticated;

-- =====================================================================================
-- PARTIE 2 — srs_items : correctif cosmetique uniquement
-- =====================================================================================
--
-- Meme trou que lesson_progress : le WITH CHECK de la policy UPDATE ne repetait pas
-- `auth.uid() = user_id`. On l'ajoute, sans toucher aux privileges.
--
-- Les privileges INSERT/UPDATE de srs_items restent OUVERTS, par conception : un deck SRS
-- fabrique ne fausse que les statistiques de revision propres a l'utilisateur, sans effet sur
-- les certificats ou le contenu premium. Le cout d'un RPC dedie n'est pas justifie ici.
DROP POLICY IF EXISTS "Users can update own SRS items" ON public.srs_items;
CREATE POLICY "Users can update own SRS items"
  ON public.srs_items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id
              AND ease_factor >= 1.3
              AND interval >= 0
              AND repetition >= 0
              AND state IN ('new', 'learning', 'review', 'relearning'));
