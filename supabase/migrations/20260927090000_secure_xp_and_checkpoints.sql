-- 1. WITH CHECK clauses (bornes statiques)

-- lesson_progress
DROP POLICY IF EXISTS "Users can update own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can update own lesson progress" 
  ON public.lesson_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (score BETWEEN 0 AND 100);

DROP POLICY IF EXISTS "Users can insert own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can insert own lesson progress" 
  ON public.lesson_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND score BETWEEN 0 AND 100);

-- srs_items
DROP POLICY IF EXISTS "Users can update own SRS items" ON public.srs_items;
CREATE POLICY "Users can update own SRS items" 
  ON public.srs_items 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (ease_factor >= 1.3 AND interval >= 0 AND repetition >= 0 AND state IN ('new', 'learning', 'review', 'relearning'));

DROP POLICY IF EXISTS "Users can insert own SRS items" ON public.srs_items;
CREATE POLICY "Users can insert own SRS items" 
  ON public.srs_items 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND ease_factor >= 1.3 AND interval >= 0 AND repetition >= 0 AND state IN ('new', 'learning', 'review', 'relearning'));


-- 2. Logique d'intégrité dynamique (XP & Certificats)

-- Revoke UPDATE on sensitive columns in profiles
REVOKE UPDATE (xp, streak_days, streak_freezes, unlocked_badges) ON public.profiles FROM authenticated, anon;

-- Revoke INSERT/UPDATE on user_checkpoints to force using the RPC
DROP POLICY IF EXISTS "Users can update own checkpoints" ON public.user_checkpoints;
DROP POLICY IF EXISTS "Users can insert own checkpoints" ON public.user_checkpoints;
-- No INSERT/UPDATE policy for user_checkpoints => denied by default for authenticated


-- RPC for syncing profile progress
CREATE OR REPLACE FUNCTION public.sync_user_progress(
  new_xp integer,
  new_streak_days integer,
  new_streak_freezes integer,
  new_badges jsonb
)
RETURNS void AS $$
DECLARE
  current_xp integ
er;
BEGIN
  -- Verify caller
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Get current XP
  SELECT xp INTO current_xp FROM public.profiles WHERE id = auth.uid();
  
  -- Delta check: XP cannot decrease, and cannot jump by more than 1000 in one sync (plausible delta)
  IF new_xp < current_xp THEN
    RAISE EXCEPTION 'XP cannot decrease';
  END IF;
  
  IF (new_xp - current_xp) > 1000 THEN
    RAISE EXCEPTION 'Suspicious XP gain';
  END IF;

  -- Use SECURITY DEFINER to bypass the REVOKE UPDATE
  UPDATE public.profiles 
  SET 
    xp = new_xp,
    streak_days = new_streak_days,
    streak_freezes = new_streak_freezes,
    unlocked_badges = new_badges,
    updated_at = now()
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- RPC for claiming checkpoint
CREATE OR REPLACE FUNCTION public.claim_checkpoint_reward(
  checkpoint_id text,
  score integer,
  certificate_code text
)
RETURNS void AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF score < 0 OR score > 100 THEN
    RAISE EXCEPTION 'Invalid score';
  END IF;

  -- Insert or update
  INSERT INTO public.user_checkpoints (user_id, checkpoint_id, score, certificate_code, passed_at)
  VALUES (auth.uid(), checkpoint_id, score, certificate_code, now())
  ON CONFLICT (user_id, checkpoint_id) 
  DO UPDATE SET 
    score = EXCLUDED.score,
    certificate_code = EXCLUDED.certificate_code,
    passed_at = EXCLUDED.passed_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
