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
  const [results, setResults] = useState<Record<string, CheckpointResultData>>({});
  const { user } = useAppStore();

  // Load from local storage initially, then sync with cloud if logged in
  useEffect(() => {
    try {
      const stored = localStorage.getItem('kenza_checkpoints');
      if (stored) {
        setResults(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load checkpoint progress', e);
    }

    if (user) {
      checkpointService.fetchCloudResults(user.id).then(cloudData => {
        if (Object.keys(cloudData).length > 0) {
          setResults(prev => {
            const merged = { ...prev, ...cloudData };
            try {
              localStorage.setItem('kenza_checkpoints', JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
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
