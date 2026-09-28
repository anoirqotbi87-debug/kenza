-- Kenza Supabase Schema
-- UTF-8 Encoding Standard

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 1,
  streak_freezes INTEGER DEFAULT 1,
  unlocked_badges JSONB DEFAULT '[]'::jsonb,
  script_preference TEXT DEFAULT 'arabizi',
  regional_variant TEXT DEFAULT 'casablanca'
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, xp, streak_days, streak_freezes, unlocked_badges)
  VALUES (new.id, 0, 1, 1, '[]'::jsonb);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop if exists to avoid errors on run
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  score INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, lesson_id)
);

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson progress" 
  ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress" 
  ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);


-- 3. SRS Items Table (Vocabulary)
CREATE TABLE IF NOT EXISTS public.srs_items (
  user_id UUID REFERENCES auth.
users(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  interval INTEGER DEFAULT 0,
  repetition INTEGER DEFAULT 0,
  ease_factor DOUBLE PRECISION DEFAULT 2.5,
  due_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  state TEXT DEFAULT 'new',
  PRIMARY KEY (user_id, word_id)
);

ALTER TABLE public.srs_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own SRS items" 
  ON public.srs_items FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own SRS items" 
  ON public.srs_items FOR ALL USING (auth.uid() = user_id);


-- 4. User Checkpoints (Exams & Passports)
CREATE TABLE IF NOT EXISTS public.user_checkpoints (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  checkpoint_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  certificate_code TEXT,
  passed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (user_id, checkpoint_id)
);

ALTER TABLE public.user_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checkpoints" 
  ON public.user_checkpoints FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own checkpoints" 
  ON public.user_checkpoints FOR ALL USING (auth.uid() = user_id);
