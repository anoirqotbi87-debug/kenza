import { supabase, withSessionRefresh } from './supabase';
import { useAppStore, type Notation } from '../store/useAppStore';
import { SRSCard } from '../types/srs';

export const syncService = {
  /**
   * Migrate local data from Zustand store to Supabase when a user signs up/logs in for the first time.
   */
  async migrateGuestDataToCloud(userId: string | null) {
    if (!userId) return false;
    
    const store = useAppStore.getState();
    
    await withSessionRefresh(async () => {
      // Call RPC for sensitive data
      const { error: rpcError } = await supabase.rpc('sync_user_progress', {
        new_xp: store.xp,
        new_streak_days: store.streakDays,
        new_streak_freezes: store.streakFreezes,
        new_badges: store.unlockedBadges
      });
      if (rpcError) console.error("Error migrating profile progress:", rpcError);

      // Call normal update for non-sensitive data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          script_preference: store.preferredNotation,
        })
        .eq('id', userId);

      if (profileError) console.error("Error migrating profile:", profileError);

      // 2. Migrate Lesson Progress
      // Plus d'upsert direct : les privileges INSERT/UPDATE sont retires au client sur
      // lesson_progress (elle gate les certificats). On passe par le RPC SECURITY DEFINER
      // complete_lessons_bulk, qui ecrit user_id = auth.uid() cote serveur.
      if (store.completedLessons.length > 0) {
        const { error: lessonError } = await supabase.rpc('complete_lessons_bulk', {
          p_lesson_ids: store.completedLessons
        });

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

    // Compte cloud encore vide (nouvelle inscription) alors que l'invite a deja progresse :
    // on envoie la progression locale au lieu de l'ecraser.
    const { count: cloudLessons } = await supabase
      .from('lesson_progress')
      .select('lesson_id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);
    if ((cloudLessons ?? 0) === 0 && useAppStore.getState().completedLessons.length > 0) {
      await this.migrateGuestDataToCloud(userId);
      return true;
    }
    
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
        xp: profile.xp ?? 0,
        streakDays: profile.streak_days ?? 0,
        streakFreezes: profile.streak_freezes ?? 1,
        unlockedBadges: mergedBadges,
        preferredNotation: (profile.script_preference as Notation) ?? 'arabizi'
      });
    }

    // 2. Fetch Lessons
    const { data: lessons } = await supabase
      .from('lesson_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('completed', true);

    if (lessons) {
      const cloudLessonIds = lessons.map((lesson) => lesson.lesson_id);
      const cloudLessonSet = new Set(cloudLessonIds);
      const localLessonIds = useAppStore.getState().completedLessons;
      const mergedLessonIds = Array.from(new Set([...cloudLessonIds, ...localLessonIds]));
      useAppStore.setState({ completedLessons: mergedLessonIds });

      const localOnlyLessons = localLessonIds.filter((lessonId) => !cloudLessonSet.has(lessonId));
      if (localOnlyLessons.length > 0) {
        const { error: lessonError } = await supabase.rpc('complete_lessons_bulk', {
          p_lesson_ids: localOnlyLessons,
        });
        if (lessonError) console.error('Error syncing local lesson progress:', lessonError);
      }
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
          interval: item.interval ?? 0,
          repetition: item.repetition ?? 0,
          easeFactor: Number(item.ease_factor) || 2.5,
          dueDate: item.due_date ?? new Date().toISOString(),
          state: (item.state as SRSCard['state']) || 'new'
        };
      });
      useAppStore.setState({ srsDeck: newDeck });
    }
  },

  /** Persiste une leçon terminée via le RPC RLS-safe, puis synchronise l’XP du store. */
  async persistLessonCompletion(lessonId: string): Promise<boolean> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) console.warn('Unable to read session for lesson completion:', sessionError.message);
      if (!session?.user) return false;

      const { error: lessonError } = await supabase.rpc('complete_lesson', {
        p_lesson_id: lessonId,
      });
      if (lessonError) {
        console.error('Error syncing lesson completion:', lessonError);
        return false;
      }

      const store = useAppStore.getState();
      const { error: progressError } = await supabase.rpc('sync_user_progress', {
        new_xp: store.xp,
        new_streak_days: store.streakDays,
        new_streak_freezes: store.streakFreezes,
        new_badges: store.unlockedBadges,
      });
      if (progressError) console.error('Error syncing profile progress:', progressError);
      return true;
    } catch (error) {
      console.error('Unable to persist lesson completion:', error);
      return false;
    }
  },
  
  /**
   * Helper to update XP on both local and cloud if logged in
   */
  async updateXp(userId: string | null, newXp: number) {
    useAppStore.getState().addXp(newXp - useAppStore.getState().xp); // just force set conceptually
    
    if (!userId) return;
    
    await supabase.rpc('sync_user_progress', {
      new_xp: newXp,
      new_streak_days: useAppStore.getState().streakDays,
      new_streak_freezes: useAppStore.getState().streakFreezes,
      new_badges: useAppStore.getState().unlockedBadges
    });
  }
};
