-- 20260927_fix_qa_audit.sql

-- 1. Securing claim_checkpoint_reward
-- Supprime l'ancienne surcharge 3-args (retour void) : elle laissait un client fournir
-- lui-meme le certificate_code, et CREATE OR REPLACE ne la remplace pas (signature differente).
DROP FUNCTION IF EXISTS public.claim_checkpoint_reward(text, integer, text);
-- Même raison pour la signature (text, integer) : la 20260929160000 renomme ses paramètres
-- en p_checkpoint_id/p_score, et CREATE OR REPLACE refuse de renommer un paramètre
-- (« cannot change name of input parameter »). Sans ce DROP, un rejeu de la chaîne complète
-- (scénario db push) échouerait ici. Sans effet sur la prod, où la migration est déjà
-- appliquée et ne sera pas rejouée.
DROP FUNCTION IF EXISTS public.claim_checkpoint_reward(text, integer);

CREATE OR REPLACE FUNCTION public.claim_checkpoint_reward(
  checkpoint_id text,
  score integer
)
RETURNS text AS $$
DECLARE
  lessons_completed INT;
  generated_code TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF score < 0 OR score > 100 THEN
    RAISE EXCEPTION 'Invalid score';
  END IF;

  -- Verify prerequisites (at least 3 completed lessons overall or for the specific track)
  -- For safety across different naming conventions (l1_, m3_, etc), we check if the user has a minimum of 3 lessons in their progress
  SELECT count(*) INTO lessons_completed 
  FROM public.lesson_progress 
  WHERE user_id = auth.uid() AND score > 0;

  IF lessons_completed < 3 THEN
    RAISE EXCEPTION 'Prerequisites not met';
  END IF;

  -- Generate certificate code server-side
  generated_code := 'KZ-' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8));

  -- Insert or update
  INSERT INTO public.user_checkpoints (user_id, checkpoint_id, score, certificate_code, passed_at)
  VALUES (auth.uid(), checkpoint_id, score, generated_code, now())
  ON CONFLICT (user_id, checkpoint_id) 
  DO UPDATE SET 
    score = EXCLUDED.score,
    certificate_code = EXCLUDED.certificate_code,
    passed_at = EXCLUDED.passed_at;

  RETURN generated_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;


-- 2. Securing sync_user_progress (Adding search_path)
CREATE OR REPLACE FUNCTION public.sync_user_progress(
  new_xp integer,
  new_streak_days integer,
  new_streak_freezes integer,
  new_badges jsonb
)
RETURNS void AS $$
DECLARE
  current_xp integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT xp INTO current_xp FROM public.profiles WHERE id = auth.uid();
  
  IF new_xp < current_xp THEN
    RAISE EXCEPTION 'XP cannot decrease';
  END IF;
  
  IF (new_xp - current_xp) > 1000 THEN
    RAISE EXCEPTION 'Suspicious XP gain';
  END IF;

  UPDATE public.profiles 
  SET 
    xp = new_xp,
    streak_days = new_streak_days,
    streak_freezes = new_streak_freezes,
    unlocked_badges = new_badges,
    updated_at = now()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Test script (DO block)
DO $$
DECLARE
  test_user UUID;
  returned_code TEXT;
BEGIN
  -- Create a dummy user for testing
  test_user := gen_random_uuid();
  
  -- Insert into auth.users (mock) - since we can't easily mock auth.uid() in DO blocks safely without setting role,
  -- we can just explain the test block. We will run it via psql with role manipulation.
END;
$$;
