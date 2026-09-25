'use client';

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kenza_checkpoints');
      if (stored) {
        setResults(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load checkpoint progress', e);
    }
  }, []);

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
