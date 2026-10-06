import { module1Lessons } from '../module1';
import { module2Lessons } from '../module2';
import { module3Lessons } from '../module3';
import { module4Lessons } from '../module4';
import { module5Lessons } from '../module5';
import { module6Lessons } from '../module6';
import { module7Lessons } from '../module7';
import { Lesson, MultiLangText } from '../../types/curriculum';

export const fullCurriculum: Record<string, { title: MultiLangText, lessons: Lesson[] }> = {
  1: { 
    title: { fr: "Les Fondations", en: "Foundations", es: "Los Cimientos", ar: "الْأَسَاسِيَّاتْ" }, 
    lessons: module1Lessons 
  },
  2: { 
    title: { fr: "Survie Quotidienne", en: "Daily Survival", es: "Supervivencia Diaria", ar: "الْبَقَاءْ الْيَوْمِيْ" }, 
    lessons: module2Lessons 
  },
  3: { 
    title: { fr: "Autonomie & Riad", en: "Autonomy & Riad", es: "Autonomía y Riad", ar: "الِاسْتِقْلَالِيَّةْ وَالرِّيَاضْ" }, 
    lessons: module3Lessons 
  },
  4: { 
    title: { fr: "Grammaire Active & Temps", en: "Active Grammar & Tenses", es: "Gramática Activa y Tiempos", ar: "قَوَاعِدْ نَشِطَةْ وَالْأَزْمِنَةْ" }, 
    lessons: module4Lessons 
  },
  5: { 
    title: { fr: "Niveau B2 - Tanger (Le Grand Socco)", en: "Level B2 - Tangier (Le Grand Socco)", es: "Nivel B2 - Tánger (Le Grand Socco)", ar: "الْمُسْتَوَى B2 - طَنْجَةْ (السُّوقْ الْكَبِيرْ)" }, 
    lessons: module5Lessons 
  },
  6: {
    title: { fr: "Niveau B1 - Autonomie", en: "Level B1 - Autonomy", es: "Nivel B1 - Autonomía", ar: "الْمُسْتَوَى B1 - الِاسْتِقْلَالِيَّةْ" },
    lessons: module6Lessons
  },
  7: {
    title: { fr: "Niveau B2 - Aisance", en: "Level B2 - Fluency", es: "Nivel B2 - Fluidez", ar: "الْمُسْتَوَى B2 - الطَّلَاقَةْ" },
    lessons: module7Lessons
  }
};

export const allLessonsList = [
  ...module1Lessons,
  ...module2Lessons,
  ...module3Lessons,
  ...module4Lessons,
  ...module5Lessons,
  ...module6Lessons,
  ...module7Lessons
];
