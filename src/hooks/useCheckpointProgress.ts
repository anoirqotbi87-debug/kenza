import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { checkpointService } from '../services/checkpointService';

export interface CheckpointResultData {
  levelId: string;
  levelName: string;
  score: number;
  passed: boolean;
  date: string;
  passportId: string;
}

export function useCheckpointProgress() {
  const [results, setResults] = useState<Record<string, CheckpointResultData>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem('kenza_checkpoints');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error('Failed to load checkpoint progress', e);
      return {};
    }
  });
  const { user } = useAppStore();

  // Sync with cloud when logged in (local state is hydrated lazily above)
  useEffect(() => {
    if (user) {
      checkpointService.fetchCloudResults(user.id).then(async (cloudData) => {
        try {
          const stored = localStorage.getItem('kenza_checkpoints');
          if (stored) {
            const localResults: Record<string, CheckpointResultData> = JSON.parse(stored);
            for (const [lvlId, res] of Object.entries(localResults)) {
              if (res.passed && !cloudData[lvlId]) {
                // Synchroniser discrètement en arrière-plan sans bloquer
                await checkpointService.syncResultToCloud(user.id, res).catch(() => {});
              }
            }
          }
        } catch (e) {
          // Pas d'impact si le parsing échoue
        }

        setResults(prev => {
          const merged = { ...prev, ...cloudData };
          try {
            localStorage.setItem('kenza_checkpoints', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      });
    }
  }, [user]);

  const saveResult = (result: CheckpointResultData) => {
    setResults(prev => {
      const updated = { ...prev, [result.levelId]: result };
      try {
        localStorage.setItem('kenza_checkpoints', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save checkpoint progress', e);
      }
      return updated;
    });

    if (user) {
      checkpointService.syncResultToCloud(user.id, result);
    }
  };

  const hasPassedLevel = (levelId: string) => {
    return results[levelId]?.passed === true;
  };

  const getLevelPassport = (levelId: string) => {
    return results[levelId];
  };

  return {
    results,
    saveResult,
    hasPassedLevel,
    getLevelPassport
  };
}
