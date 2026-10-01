import { describe, expect, it } from 'vitest';
import { fullCurriculum, allLessonsList } from './curriculum';
import { getPlayableLessons } from './homeCurriculum';
import type { ExerciseType, LessonStep } from '@/types/curriculum';

const STEP_TYPES: LessonStep['type'][] = ['learning', 'exercise', 'grammar'];
const EXERCISE_TYPES: ExerciseType[] = ['mcq', 'reorder', 'match', 'matching', 'fill-blank', 'dialogue'];

const lessonSteps = Object.values(fullCurriculum).flatMap((module) => module.lessons);

describe('curriculum — intégration des pages et du moteur d’exercices', () => {
  it('expose les sept modules réels et chaque leçon jouable une seule fois sur /etudier', () => {
    expect(Object.keys(fullCurriculum)).toEqual(['1', '2', '3', '4', '5', '6', '7']);

    const allIds = lessonSteps.map((lesson) => lesson.id);
    expect(new Set(allIds).size).toBe(allIds.length);
    expect(allLessonsList.map((lesson) => lesson.id)).toEqual(allIds);
    expect(getPlayableLessons('fr').map((lesson) => lesson.id)).toEqual(
      lessonSteps.filter((lesson) => lesson.steps.length > 0).map((lesson) => lesson.id)
    );
  });

  it('ne contient aucune leçon vide ni étape sans rendu associé', () => {
    for (const lesson of lessonSteps) {
      expect(lesson.steps.length, lesson.id).toBeGreaterThan(0);
      const stepIds = lesson.steps.map((step) => step.id);
      expect(new Set(stepIds).size, lesson.id).toBe(stepIds.length);

      for (const step of lesson.steps) {
        const where = `${lesson.id}.${step.id}`;
        expect(STEP_TYPES, where).toContain(step.type);
        if (step.type === 'learning' || step.type === 'grammar') {
          expect(step.content, `${where} sans contenu pédagogique`).toBeDefined();
        }
        if (step.type === 'exercise') {
          expect(step.exercise, `${where} sans exercice`).toBeDefined();
          expect(EXERCISE_TYPES, `${where} sans renderer`).toContain(step.exercise!.type);
          expect(step.exercise!.prompt, `${where} sans consigne`).toBeTruthy();
        }
      }
    }
  });

  it('chaque réponse correspond aux options que le runner affiche', () => {
    for (const lesson of lessonSteps) {
      for (const step of lesson.steps) {
        const exercise = step.exercise;
        if (!exercise) continue;
        const where = `${lesson.id}.${step.id}`;

        if (exercise.type === 'mcq') {
          const ids = exercise.options?.map((option) => option.id) ?? [];
          expect(ids.length, `${where} sans options`).toBeGreaterThan(1);
          expect(new Set(ids).size, `${where} IDs MCQ dupliqués`).toBe(ids.length);
          expect(ids, `${where} réponse MCQ absente des options`).toContain(exercise.answer);
        }

        if (exercise.type === 'reorder') {
          const optionIds = exercise.options?.map((option) => option.id) ?? [];
          expect(Array.isArray(exercise.answer), `${where} réponse reorder non ordonnée`).toBe(true);
          const answerIds = exercise.answer as string[];
          expect(new Set(optionIds).size, `${where} tuiles dupliquées`).toBe(optionIds.length);
          expect(new Set(answerIds).size, `${where} réponse avec doublon`).toBe(answerIds.length);
          expect([...answerIds].sort(), `${where} réponse reorder incomplète`).toEqual([...optionIds].sort());
        }

        if (exercise.type === 'fill-blank') {
          const optionIds = exercise.options?.map((option) => option.id) ?? [];
          expect(exercise.sentenceTemplate, `${where} sans marqueur de trou`).toMatch(/\{blank\}|_{3,}/);
          expect(optionIds, `${where} réponse fill-blank absente des options`).toContain(exercise.answer);
        }

        if (exercise.type === 'match' || exercise.type === 'matching') {
          const pairIds = exercise.pairs?.map((pair) => pair.id) ?? [];
          expect(pairIds.length, `${where} sans paires`).toBeGreaterThanOrEqual(2);
          expect(new Set(pairIds).size, `${where} IDs de paires dupliqués`).toBe(pairIds.length);
        }

        if (exercise.type === 'dialogue') {
          expect(exercise.npcStartLine, `${where} sans réplique de départ`).toBeDefined();
          expect(exercise.dialogueChoices?.length ?? 0, `${where} sans choix`).toBeGreaterThan(1);
          expect(exercise.dialogueChoices?.some((choice) => choice.isOptimal), `${where} sans choix optimal`).toBe(true);
        }
      }
    }
  });
});
