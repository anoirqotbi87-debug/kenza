-- PRIORITÉ 0 bis — sync_user_progress était ambiguë.
--
-- `CREATE OR REPLACE FUNCTION` ne remplace pas une fonction dont la signature diffère : il
-- en crée une seconde. La version jsonb du 27/09 et la version text[] du 29/09 coexistaient
-- donc, et PostgREST — qui reçoit `new_badges: []` sans cast explicite — ne savait pas
-- laquelle choisir : `function public.sync_user_progress(...) is not unique`. syncService
-- n'affichant l'erreur qu'en console.error, l'XP et les séries ne se synchronisaient plus
-- silencieusement.
--
-- Les deux signatures sont supprimées puis une seule est recréée en text[] :
-- `store.unlockedBadges` est `string[]` (src/store/useAppStore.ts), donc PostgREST envoie
-- un tableau JSON de chaînes, que PostgreSQL convertit en text[]. Le type jsonb était le
-- mauvais choix.

DROP FUNCTION IF EXISTS public.sync_user_progress(integer, integer, integer, jsonb);
DROP FUNCTION IF EXISTS public.sync_user_progress(integer, integer, integer, text[]);

CREATE OR REPLACE FUNCTION public.sync_user_progress(
  new_xp integer,
  new_streak_days integer,
  new_streak_freezes integer,
  new_badges text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_xp integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT xp INTO current_xp FROM public.profiles WHERE id = auth.uid();

  IF current_xp IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

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
$$;
