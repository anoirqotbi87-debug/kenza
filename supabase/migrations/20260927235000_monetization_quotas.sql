-- Ajout des colonnes de monétisation
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_ai_usage_date DATE,
ADD COLUMN IF NOT EXISTS daily_ai_messages_count INTEGER DEFAULT 0;

-- Fonction RPC pour consommer un quota IA
CREATE OR REPLACE FUNCTION public.consume_ai_quota()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_is_premium boolean;
  v_last_date date;
  v_count integer;
  c_max_free_messages constant integer := 8; -- 8 répliques gratuites / jour
BEGIN
  IF v_user_id IS NULL THEN
    RETURN false;
  END IF;

  SELECT is_premium, last_ai_usage_date, daily_ai_messages_count
  INTO v_is_premium, v_last_date, v_count
  FROM public.profiles
  WHERE id = v_user_id;

  -- Accès illimité pour les abonnés Premium
  IF v_is_premium IS TRUE THEN
    RETURN true;
  END IF;

  -- Réinitialisation automatique si nouvelle journée
  IF v_last_date IS NULL OR v_last_date < CURRENT_DATE THEN
    UPDATE public.profiles
    SET last_ai_usage_date = CURRENT_DATE,
        daily_ai_messages_count = 1
    WHERE id = v_user_id;
    RETURN true;
  END IF;

  -- Vérification du plafond freemium
  IF v_count < c_max_free_messages THEN
    UPDATE public.profiles
    SET daily_ai_messages_count = daily_ai_messages_count + 1
    WHERE id = v_user_id;
    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$;
