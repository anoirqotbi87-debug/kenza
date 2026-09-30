-- Referentiel checkpoint -> lecons, et prerequis reellement lie au checkpoint demande.
--
-- Avant : `count(*) FROM lesson_progress WHERE score > 0 >= 3`. Trois lignes bidon
-- (completed=true, lesson_id quelconque, RLS l'autorise) suffisaient a obtenir un
-- certificat pour un checkpoint qui n'existe dans aucun curriculum.
--
-- La correspondance est celle de `fullCurriculum` (src/data/curriculum/index.ts), dont la
-- liste des lecons a ete extraite en EXECUTANT le code du curriculum, pas en le parsant.
-- 30 lecons, aucun doublon d'id.
--
-- Conventions retenues :
--   * checkpoint_id = la cle de module ('1'..'7'), celle que le client envoie deja
--     (CheckpointResult -> claim_checkpoint_reward(checkpoint_id: levelId)).
--   * Les modules 4 et 5 incluent leurs lecons `*_checkpoint_*` : ce sont de vraies lecons
--     du curriculum (des exercices a etapes), donc des prerequis legitimes. Point a confirmer.
--   * Les modules 6 et 7 ont un champ `level` incoherent (1..4 au lieu de 6/7) : la
--     correspondance est construite sur les ids reels (prefixes l_mod6_/l_mod7_), jamais
--     sur `level`.

CREATE TABLE IF NOT EXISTS public.checkpoint_lessons (
  checkpoint_id text NOT NULL,
  lesson_id text NOT NULL,
  PRIMARY KEY (checkpoint_id, lesson_id)
);

-- Referentiel en lecture seule : aucune ecriture cliente. Il ne se modifie que par migration.
ALTER TABLE public.checkpoint_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read checkpoint lessons" ON public.checkpoint_lessons;
CREATE POLICY "Anyone can read checkpoint lessons"
  ON public.checkpoint_lessons FOR SELECT USING (true);

GRANT SELECT ON public.checkpoint_lessons TO anon, authenticated;
-- Supabase accorde ALL par defaut sur les nouvelles tables : sans ce REVOKE, anon et
-- authenticated pourraient reecrire le referentiel et donc fabriquer leurs propres prerequis.
REVOKE INSERT, UPDATE, DELETE ON public.checkpoint_lessons FROM anon, authenticated;

-- ON CONFLICT DO NOTHING : le remplissage reste rejouable (idempotence).
INSERT INTO public.checkpoint_lessons (checkpoint_id, lesson_id) VALUES
  -- Module 1 — Les Fondations (6)
  ('1', 'l1_phonetics_1'),
  ('1', 'l2_greetings_1'),
  ('1', 'l3_greetings_2'),
  ('1', 'l4_greetings_3'),
  ('1', 'l5_politeness_1'),
  ('1', 'l6_pronouns_1'),
  -- Module 2 — Survie Quotidienne (3)
  ('2', 'l_module2_cafe_1'),
  ('2', 'l_module2_taxi_1'),
  ('2', 'l_module2_souk_1'),
  -- Module 3 — Autonomie & Riad (4)
  ('3', 'm3_l1_checkin'),
  ('3', 'm3_l2_maintenance'),
  ('3', 'm3_l3_pharmacie'),
  ('3', 'm3_l4_orientation'),
  -- Module 4 — Grammaire Active & Temps (5)
  ('4', 'm4_l1_passe'),
  ('4', 'm4_l2_present'),
  ('4', 'm4_l3_futur_negation'),
  ('4', 'm4_l4_modaux'),
  ('4', 'm4_checkpoint_b1'),
  -- Module 5 — B2 Tanger (5)
  ('5', 'm5_l1_opinion'),
  ('5', 'm5_l2_hypothese'),
  ('5', 'm5_l3_travail'),
  ('5', 'm5_l4_proverbes'),
  ('5', 'm5_checkpoint_b2'),
  -- Module 6 — B1 Autonomie (4)
  ('6', 'l_mod6_1'),
  ('6', 'l_mod6_2'),
  ('6', 'l_mod6_3'),
  ('6', 'l_mod6_4'),
  -- Module 7 — B2 Aisance (3)
  ('7', 'l_mod7_1'),
  ('7', 'l_mod7_2'),
  ('7', 'l_mod7_3')
ON CONFLICT (checkpoint_id, lesson_id) DO NOTHING;

-- Prerequis lie au checkpoint demande.
--   * checkpoint inconnu  -> 'Unknown checkpoint'  (distinct du cas ci-dessous)
--   * lecons manquantes   -> 'Prerequisites not met'
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
  v_checkpoint_id text;
  v_required integer;
  v_completed integer;
  v_generated_code text;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF p_score < 0 OR p_score > 100 THEN
    RAISE EXCEPTION 'Invalid score';
  END IF;

  -- Variable locale prefixee v_ : jamais de collision avec une colonne (cf. le bug
  -- d'ambiguite sur `score` corrige en 20260929160000).
  v_checkpoint_id := trim(coalesce(p_checkpoint_id, ''));
  IF v_checkpoint_id = '' THEN
    RAISE EXCEPTION 'Invalid checkpoint';
  END IF;

  SELECT count(*) INTO v_required
  FROM public.checkpoint_lessons
  WHERE checkpoint_id = v_checkpoint_id;

  IF v_required = 0 THEN
    RAISE EXCEPTION 'Unknown checkpoint';
  END IF;

  SELECT count(*) INTO v_completed
  FROM public.checkpoint_lessons cl
  JOIN public.lesson_progress lp
    ON lp.lesson_id = cl.lesson_id
   AND lp.user_id = auth.uid()
   AND lp.completed = true
  WHERE cl.checkpoint_id = v_checkpoint_id;

  IF v_completed < v_required THEN
    RAISE EXCEPTION 'Prerequisites not met';
  END IF;

  v_generated_code := 'KZ-' || upper(substring(gen_random_uuid()::text, 1, 8));

  INSERT INTO public.user_checkpoints (user_id, checkpoint_id, score, certificate_code, passed_at)
  VALUES (auth.uid(), v_checkpoint_id, p_score, v_generated_code, now())
  ON CONFLICT (user_id, checkpoint_id)
  DO UPDATE SET
    score = EXCLUDED.score,
    certificate_code = EXCLUDED.certificate_code,
    passed_at = EXCLUDED.passed_at;

  RETURN v_generated_code;
END;
$$;
