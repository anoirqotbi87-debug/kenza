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
    title: { fr: 'Au Souk', en: 'At the Souk', es: 'En el Zoco', ar: 'في السوق' },
    level: 2,
    description: { fr: 'Négociez les prix au marché.', en: 'Negotiate prices at the market.', es: 'Negocia los precios en el mercado.', ar: 'تفاوض على الأسعار في السوق.' },
    steps: [] // Squelette pour la UI
  }
];

import { module3Lessons } from '../module3';
import { module4Lessons } from '../module4';
import { module5Lessons } from '../module5';

export const fullCurriculum = {
  1: { 
    title: { fr: "Les Fondations", en: "Foundations", es: "Los Cimientos", ar: "الأساسيات" }, 
    lessons: module1Lessons 
  },
  2: { 
    title: { fr: "Survie Quotidienne", en: "Daily Survival", es: "Supervivencia Diaria", ar: "البقاء اليومي" }, 
    lessons: module2Lessons 
  },
  3: { 
    title: { fr: "Grammaire Active", en: "Active Grammar", es: "Gramática Activa", ar: "قواعد نشطة" }, 
    lessons: module3Lessons 
  },
  4: { 
    title: { fr: "Temps & Modaux", en: "Tenses & Modals", es: "Tiempos y Modales", ar: "الأزمنة والأفعال الناقصة" }, 
    lessons: module4Lessons 
  },
  5: { 
    title: { fr: "Immersion Culturelle", en: "Cultural Immersion", es: "Inmersión Cultural", ar: "الانغماس الثقافي" }, 
    lessons: module5Lessons 
  },
};

export const allLessonsList = [
  ...module1Lessons,
  ...module2Lessons,
  ...module3Lessons,
  ...module4Lessons,
  ...module5Lessons
];
