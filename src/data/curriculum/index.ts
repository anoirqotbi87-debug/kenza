import { module1Lessons } from '../module1';
import { lessonCafe } from '../lessons/lesson-cafe';
import { lessonTaxi } from '../lessons/lesson-taxi';
// On simule l'existence d'autres leçons pour l'UI, bien qu'elles soient à remplir plus tard
import { Lesson } from '../../types/curriculum';

export const module2Lessons: Lesson[] = [
  lessonCafe,
  lessonTaxi,
  {
    id: 'l_module2_souk_1',
    title: 'Au Souk',
    level: 2,
    description: 'Négociez les prix au marché.',
    steps: [] // Squelette pour la UI
  }
];

export const module3Lessons: Lesson[] = [
  { id: 'l_mod3_1', title: 'Le Présent (ka-)', level: 3, description: 'Verbes réguliers.', steps: [] },
  { id: 'l_mod3_2', title: 'La Négation', level: 3, description: 'ma-...-ch', steps: [] },
  { id: 'l_mod3_3', title: 'La Possession', level: 3, description: 'Utilisation de dyal.', steps: [] },
];

export const module4Lessons: Lesson[] = [
  { id: 'l_mod4_1', title: 'Le Passé', level: 4, description: 'Terminaisons du passé.', steps: [] },
  { id: 'l_mod4_2', title: 'Le Futur', level: 4, description: 'Utilisation de ghadi.', steps: [] },
  { id: 'l_mod4_3', title: 'Verbes Modaux', level: 4, description: 'Bgha, Qedd, Khass.', steps: [] },
];

export const module5Lessons: Lesson[] = [
  { id: 'l_mod5_1', title: 'Formules Religieuses', level: 5, description: 'Inshallah, Hamdullah.', steps: [] },
  { id: 'l_mod5_2', title: 'L\'Étiquette', level: 5, description: 'Hchouma, Smahli.', steps: [] },
];

export const fullCurriculum = {
  1: { title: "Les Fondations", lessons: module1Lessons },
  2: { title: "Survie Quotidienne", lessons: module2Lessons },
  3: { title: "Grammaire Active", lessons: module3Lessons },
  4: { title: "Temps & Modaux", lessons: module4Lessons },
  5: { title: "Immersion Culturelle", lessons: module5Lessons },
};

export const allLessonsList = [
  ...module1Lessons,
  ...module2Lessons,
  ...module3Lessons,
  ...module4Lessons,
  ...module5Lessons
];
