BEGIN;

-- Create a dummy user
CREATE TEMP TABLE temp_auth_user (id UUID);
INSERT INTO temp_auth_user VALUES (gen_random_uuid());

-- Mock auth.uid()
CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
  SELECT id FROM temp_auth_user LIMIT 1;
$$ LANGUAGE sql;

-- Try claiming WITHOUT prerequisites
DO $$
DECLARE
  v_code TEXT;
BEGIN
  v_code := public.claim_checkpoint_reward('A1', 95);
  RAISE NOTICE 'Success! Code: %', v_code;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Test 1 (No Prereq) - Caught expected exception: %', SQLERRM;
END;
$$;

-- Add prerequisites
INSERT INTO public.lesson_progress (user_id, lesson_id, score, completed)
SELECT id, 'm1_l1', 100, true FROM temp_auth_user UNION ALL
SELECT id, 'm1_l2', 100, true FROM temp_auth_user UNION ALL
SELECT id, 'm1_l3', 100, true FROM temp_auth_user;

-- Try claiming WITH prerequisites
DO $$
DECLARE
  v_code TEXT;
BEGIN
  v_code := public.claim_checkpoint_reward('A1', 95);
  RAISE NOTICE 'Test 2 (With Prereq) - Success! Generated Code: %', v_code;
END;
$$;

ROLLBACK;
