-- Migration 2026: Gamification (Badges & Streak Freezes)

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS unlocked_badges TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS streak_freezes INTEGER DEFAULT 1;

-- Note: We might want to add a trigger or scheduled function to replenish streak_freezes every month,
-- but for now, they are managed via the app logic.
