-- 1. Create Tables

-- Table: profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  xp INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  hearts INTEGER DEFAULT 3,
  script_preference TEXT DEFAULT 'duo' CHECK (script_preference IN ('arabizi', 'arabic', 'duo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: lesson_progress
CREATE TABLE public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, lesson_id)
);

-- Table: srs_items
CREATE TABLE public.srs_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  word_id TEXT NOT NULL,
  interval INTEGER DEFAULT 0,
  repetition INTEGER DEFAULT 0,
  ease_factor NUMERIC DEFAULT 2.5,
  due_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  state TEXT DEFAULT 'new' CHECK (state IN ('new', 'learning', 'review')),
  UNIQUE(user_id, word_id)
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srs_items ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies

-- Profiles Policies
CREATE POLICY "Users can view their own profile."
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Lesson Progress Policies
CREATE POLICY "Users can view their own lesson progress."
  ON public.lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own lesson progress."
  ON public.lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress."
  ON public.lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- SRS Items Policies
CREATE POLICY "Users can view their own SRS items."
  ON public.srs_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own SRS items."
  ON public.srs_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SRS items."
  ON public.srs_items FOR UPDATE
  USING (auth.uid() = user_id);


-- 4. Create Triggers for Automatic Profile Creation

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, xp, streak_days, hearts, script_preference)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    0,
    0,
    3,
    'duo'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
