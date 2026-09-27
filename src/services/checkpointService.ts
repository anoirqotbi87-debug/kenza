import { supabase, withSessionRefresh } from '../lib/supabase';
import { CheckpointResultData } from '../hooks/useCheckpointProgress';

/**
 * Service to handle synchronization of checkpoints to Supabase.
 * Fails gracefully so offline users are not blocked.
 */
export const checkpointService = {
  /**
   * Save a single checkpoint result to Supabase
   */
  async syncResultToCloud(userId: string, result: CheckpointResultData): Promise<void> {
    try {
      await withSessionRefresh(async () => {
        const { data, error } = await supabase.rpc('claim_checkpoint_reward', {
          checkpoint_id: result.levelId,
          score: result.score
        });

        if (error) {
          console.warn("[Sync Checkpoint] Failed to sync to cloud:", error.message);
        } else if (data) {
          // data contains the generated certificate code from the server
          result.passportId = data as string;
        }
      });
    } catch (e) {
      console.warn("[Sync Checkpoint] Network error:", e);
    }
  },

  /**
   * Fetch all checkpoints for the current user
   */
  async fetchCloudResults(userId: string): Promise<Record<string, CheckpointResultData>> {
    try {
      const { data, error } = await supabase
        .from('user_checkpoints')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.warn("[Fetch Checkpoint] Failed to fetch from cloud:", error.message);
        return {};
      }

      const results: Record<string, CheckpointResultData> = {};
      
      data.forEach(row => {
        results[row.checkpoint_id] = {
          levelId: row.checkpoint_id,
          levelName: `Palier ${row.checkpoint_id}`, // In real app, we'd map this properly
          score: row.score,
          passed: true,
          date: new Date(row.passed_at).toLocaleDateString('fr-FR'),
          passportId: row.certificate_code
        };
      });

      return results;
    } catch (e) {
      console.warn("[Fetch Checkpoint] Network error:", e);
      return {};
    }
  }
};
