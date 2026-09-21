import { Lesson } from '../types/curriculum';

export const module5Lessons: Lesson[] = [
  {
    id: 'l_mod5_1',
    title: { fr: 'Politesse Religieuse', en: 'Religious Politeness', es: 'Cortesía Religiosa', ar: 'الآداب الدينية' },
    level: 5,
    description: { fr: 'Les formules religieuses quotidiennes.', en: 'Daily religious formulas.', es: 'Fórmulas religiosas diarias.', ar: 'العبارات الدينية اليومية.' },
    steps: [
      {
        id: 's1_learn_inshallah',
        type: 'learning',
        content: {
          title: { fr: 'Inshallah', en: 'Inshallah', es: 'Inshallah', ar: 'إن شاء الله' },
          description: { 
            fr: 'Expression omniprésente pour tout événement futur.',
            en: 'Ubiquitous expression for any future event.',
            es: 'Expresión omnipresente para cualquier evento futuro.',
            ar: 'تعبير واسع الانتشار لأي حدث مستقبلي.'
          },
          arabizi: 'Inshallah',
          arabic: 'إن شاء الله',
          translation: { fr: 'Si Dieu le veut', en: 'God willing', es: 'Si Dios quiere', ar: 'إن شاء الله' },
          culturalNote: {
            fr: 'Equivalent historique direct de "Ojalá" en Espagnol.',
            en: 'Direct historical equivalent of "Ojalá" in Spanish.',
            es: '"Inshallah" es el origen etimológico directo de "Ojalá".',
            ar: 'المعادل التاريخي المباشر لـ "Ojalá" في الإسبانية.'
          }
        }
      }
    ]
  },
  {
    id: 'l_mod5_2',
    title: { fr: 'L\'Étiquette (Hchouma)', en: 'Etiquette (Hchouma)', es: 'Etiqueta (Hchouma)', ar: 'الإتيكيت (حشومة)' },
    level: 5,
    description: { fr: 'Comprendre la notion de honte sociale.', en: 'Understand the concept of social shame.', es: 'Comprender el concepto de vergüenza social.', ar: 'فهم مفهوم العيب الاجتماعي.' },
    steps: [
      {
        id: 's1_learn_hchouma',
        type: 'learning',
        content: {
          title: { fr: 'Hchouma', en: 'Hchouma', es: 'Hchouma', ar: 'حشومة' },
          description: { 
            fr: 'Signifie "C\'est une honte" ou "C\'est mal vu". C\'est le pilier du comportement en public.',
            en: 'Means "It\'s a shame" or "It\'s frowned upon". It is the pillar of public behavior.',
            es: 'Significa "Es una vergüenza" o "Está mal visto". Es el pilar del comportamiento en público.',
            ar: 'تعني "عيب" أو "غير لائق". هي أساس السلوك العام.'
          },
          arabizi: 'Hchouma 3lik',
          arabic: 'حشومة عليك',
          translation: { fr: 'Honte à toi', en: 'Shame on you', es: 'Qué vergüenza', ar: 'عيب عليك' },
          culturalNote: {
            fr: 'La "Hchouma" régule tout ce qu\'on ne doit pas faire en public (crier, s\'embrasser, etc).',
            en: '"Hchouma" regulates everything that should not be done in public.',
            es: '"Hchouma" regula todo lo que no se debe hacer en público.',
            ar: 'تنظم "حشومة" كل ما لا ينبغي القيام به في الأماكن العامة.'
          }
        }
      }
    ]
  }
];
