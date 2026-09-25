import { supabase, withSessionRefresh } from './supabase';
import { useAppStore } from '../store/useAppStore';
import { SRSCard } from '../types/srs';

export const syncService = {
  /**
   * Migrate local data from Zustand store to Supabase when a user signs up/logs in for the first time.
   */
  async migrateGuestDataToCloud(userId: string | null) {
    if (!userId) return false;
    
    const store = useAppStore.getState();
    
    await withSessionRefresh(async () => {
      // 1. Update Profile (XP, streak, notation)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          xp: store.xp,
          streak_days: store.streakDays,
          streak_freezes: store.streakFreezes,
          unlocked_badges: store.unlockedBadges,
          script_preference: store.preferredNotation,
        })
        .eq('id', userId);

      if (profileError) console.error("Error migrating profile:", profileError);

      // 2. Migrate Lesson Progress
      if (store.completedLessons.length > 0) {
        const lessonInserts = store.completedLessons.map(lessonId => ({
          user_id: userId,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString()
        }));

        const { error: lessonError } = await supabase
          .from('lesson_progress')
          .upsert(lessonInserts, { onConflict: 'user_id,lesson_id' });
          
        if (lessonError) console.error("Error migrating lessons:", lessonError);
      }

      // 3. Migrate SRS Deck
      const srsKeys = Object.keys(store.srsDeck);
      if (srsKeys.length > 0) {
        const srsInserts = srsKeys.map(wordId => {
          const card = store.srsDeck[wordId];
          return {
            user_id: userId,
            word_id: wordId,
            interval: card.interval,
            repetition: card.repetition,
            ease_factor: card.easeFactor,
            due_date: card.dueDate,
            state: card.state
          };
        });

        const { error: srsError } = await supabase
          .from('srs_items')
          .upsert(srsInserts, { onConflict: 'user_id,word_id' });

        if (srsError) console.error("Error migrating SRS:", srsError);
      }
    });
    
    return true;
  },

  /**
   * Pull data from Supabase and update local Zustand store
   */
  async syncCloudToLocal(userId: string | null) {
    if (!userId) return false;
    
    // 1. Fetch Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profile) {
      // Merge badges
      const cloudBadges = Array.isArray(profile.unlocked_badges) ? profile.unlocked_badges : [];
      const localBadges = useAppStore.getState().unlockedBadges;
      const mergedBadges = Array.from(new Set([...cloudBadges, ...localBadges]));

      useAppStore.setState({
        xp: profile.xp,
        streakDays: profile.streak_days,
        streakFreezes: profile.streak_freezes ?? 1,
        unlockedBadges: mergedBadges,
        preferredNotation: profile.script_preference
      });
    }

    // 2. Fetch Lessons
    const { data: lessons } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('completed', true);

    if (lessons) {
      useAppStore.setState({
        completedLessons: lessons.map(l => l.lesson_id)
      });
    }

    // 3. Fetch SRS
    const { data: srsItems } = await supabase
      .from('srs_items')
      .select('*')
      .eq('user_id', userId);

    if (srsItems) {
      const newDeck: Record<string, SRSCard> = {};
      srsItems.forEach(item => {
        newDeck[item.word_id] = {
          id: `card_${item.word_id}`,
          wordId: item.word_id,
          interval: item.interval,
          repetition: item.repetition,
          easeFactor: Number(item.ease_factor),
          dueDate: item.due_date,
          state: item.state as any
        };
      });
      useAppStore.setState({ srsDeck: newDeck });
    }
  },
  
  /**
   * Helper to update XP on both local and cloud if logged in
   */
  async updateXp(userId: string | null, newXp: number) {
    useAppStore.getState().addXp(newXp - useAppStore.getState().xp); // just force set conceptually
    
    if (!userId) return;
    
    await supabase
      .from('profiles')
      .update({ xp: newXp })
      .eq('id', userId);
  }
};
