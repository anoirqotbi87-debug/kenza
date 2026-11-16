import type { MultiLangText } from '../types/curriculum';

export interface ModuleUnitWord {
  id: string;
  arabizi: string;
  arabic: string;
  translation: MultiLangText;
  phonetic?: string;
  category?: string;
  example?: {
    arabizi: string;
    arabic: string;
    translation: MultiLangText;
  };
}

export interface ModuleUnit {
  id: string;
  title: MultiLangText;
  description: MultiLangText;
  words: ModuleUnitWord[];
}

export interface AdvancedModule {
  id: number;
  moduleNumber: number;
  level: string;
  title: MultiLangText;
  description: MultiLangText;
  units: ModuleUnit[];
}

export const MODULES_8_10_DATA: AdvancedModule[] = [
  // =========================================================================
  // MODULE 8 : DARIJA PROFESSIONNEL & AFFAIRES (C1)
  // =========================================================================
  {
    id: 8,
    moduleNumber: 8,
    level: 'C1',
    title: {
      fr: 'Darija Professionnel & Affaires',
      en: 'Professional Darija & Business',
      es: 'Darija Profesional y Negocios',
      ar: 'الدَّارِجَة الْمِهْنِيَّة وَالْأَعْمَالْ',
    },
    description: {
      fr: 'Vocabulaire d’entreprise, réunions, contrats, banque et démarches administratives.',
      en: 'Corporate vocabulary, meetings, contracts, banking, and administrative procedures.',
      es: 'Vocabulario empresarial, reuniones, contratos, banca y trámites administrativos.',
      ar: 'مُفْرَدَاتُ الشَّرِكَاتِ، الِاجْتِمَاعَاتِ، الْعُقُودِ، الْمُعَامَلَاتِ الْبَنْكِيَّةِ وَالْإِدَارِيَّةِ.',
    },
    units: [
      {
        id: 'unit_8_1',
        title: {
          fr: 'Réunions & Entreprise',
          en: 'Meetings & Corporate',
          es: 'Reuniones y Empresa',
          ar: 'الِاجْتِمَاعَاتْ وَالشَّرِكَة',
        },
        description: {
          fr: 'Vocabulaire pour diriger ou participer à une réunion professionnelle.',
          en: 'Vocabulary to lead or participate in a business meeting.',
          es: 'Vocabulario para dirigir o participar en una reunión profesional.',
          ar: 'مُفْرَدَاتٌ لِإِدَارَةِ أَوْ الْمُشَارَكَةِ فِي اجْتِمَاعٍ مِهْنِيٍّ.',
        },
        words: [
          {
            id: 'm8_u1_w1',
            arabizi: 'charika',
            arabic: 'شَرِكَة',
            translation: {
              fr: 'Société / Entreprise',
              en: 'Company / Firm',
              es: 'Empresa / Sociedad',
              ar: 'شَرِكَة / مُؤَسَّسَة',
            },
            category: 'business',
            example: {
              arabizi: 'Charika dyalna kbert bzaf.',
              arabic: 'الشَّرِكَة دْيَالْنَا كْبْرَتْ بْزَّافْ.',
              translation: {
                fr: 'Notre entreprise s’est beaucoup développée.',
                en: 'Our company has grown a lot.',
                es: 'Nuestra empresa ha crecido mucho.',
                ar: 'شَرِكَتُنَا نَمَتْ كَثِيرًا.',
              },
            },
          },
          {
            id: 'm8_u1_w2',
            arabizi: 'ijtima3',
            arabic: 'اِجْتِمَاعْ',
            translation: {
              fr: 'Réunion',
              en: 'Meeting',
              es: 'Reunión',
              ar: 'اِجْتِمَاعْ',
            },
            category: 'business',
            example: {
              arabizi: '3ndna ijtima3 m3a l-modir l-yom.',
              arabic: 'عَنْدْنَا اِجْتِمَاعْ مْعَ الْمُدِيرْ الْيَوْمْ.',
              translation: {
                fr: 'Nous avons une réunion avec le directeur aujourd’hui.',
                en: 'We have a meeting with the director today.',
                es: 'Tenemos una reunión con el director hoy.',
                ar: 'لَدَيْنَا اجْتِمَاعٌ مَعَ الْمُدِيرِ الْيَوْمَ.',
              },
            },
          },
          {
            id: 'm8_u1_w3',
            arabizi: 'modir',
            arabic: 'مُدِيرْ',
            translation: {
              fr: 'Directeur / Manager',
              en: 'Director / Manager',
              es: 'Director / Gerente',
              ar: 'مُدِيرْ',
            },
            category: 'business',
          },
          {
            id: 'm8_u1_w4',
            arabizi: 'khddam',
            arabic: 'خَدَّامْ',
            translation: {
              fr: 'Employé / Travailleur',
              en: 'Employee / Worker',
              es: 'Empleado / Trabajador',
              ar: 'مُوَظَّفْ / عَامِلْ',
            },
            category: 'business',
          },
          {
            id: 'm8_u1_w5',
            arabizi: 'machrou3',
            arabic: 'مَشْرُوعْ',
            translation: {
              fr: 'Projet',
              en: 'Project',
              es: 'Proyecto',
              ar: 'مَشْرُوعْ',
            },
            category: 'business',
          },
          {
            id: 'm8_u1_w6',
            arabizi: 'ittifaq',
            arabic: 'اِتِّفَاقْ',
            translation: {
              fr: 'Accord / Convention',
              en: 'Agreement / Deal',
              es: 'Acuerdo / Convenio',
              ar: 'اِتِّفَاقْ',
            },
            category: 'business',
          },
        ],
      },
      {
        id: 'unit_8_2',
        title: {
          fr: 'Banque & Négociations',
          en: 'Banking & Negotiations',
          es: 'Banca y Negociaciones',
          ar: 'الْبَنْكَة وَالْمُفَاوَضَاتْ',
        },
        description: {
          fr: 'Termes financiers, négociations de prix et contrats d’affaires.',
          en: 'Financial terms, price negotiations, and business contracts.',
          es: 'Términos financieros, negociaciones de precios y contratos comerciales.',
          ar: 'مُصْطَلَحَاتٌ مَالِيَّةٌ، مُفَاوَضَاتُ الْأَسْعَارِ وَعُقُودُ الْأَعْمَالِ.',
        },
        words: [
          {
            id: 'm8_u2_w1',
            arabizi: 'kontra',
            arabic: 'كُونْطْرَا',
            translation: {
              fr: 'Contrat',
              en: 'Contract',
              es: 'Contrato',
              ar: 'عَقْدْ / كُونْطْرَا',
            },
            category: 'finance',
          },
          {
            id: 'm8_u2_w2',
            arabizi: 'tamwil',
            arabic: 'تَمْوِيلْ',
            translation: {
              fr: 'Financement',
              en: 'Funding / Financing',
              es: 'Financiación',
              ar: 'تَمْوِيلْ',
            },
            category: 'finance',
          },
          {
            id: 'm8_u2_w3',
            arabizi: '7ssab',
            arabic: 'حْسَابْ',
            translation: {
              fr: 'Compte bancaire / Facture',
              en: 'Bank account / Bill',
              es: 'Cuenta bancaria / Factura',
              ar: 'حِسَابْ بَنْكِيْ / فَاتُورَة',
            },
            category: 'finance',
          },
          {
            id: 'm8_u2_w4',
            arabizi: 'fayda',
            arabic: 'فَايْدَة',
            translation: {
              fr: 'Bénéfice / Intérêt',
              en: 'Profit / Benefit',
              es: 'Beneficio / Interés',
              ar: 'فَائِدَة / رِبْحْ',
            },
            category: 'finance',
          },
          {
            id: 'm8_u2_w5',
            arabizi: 'kridi',
            arabic: 'كْرِيدِي',
            translation: {
              fr: 'Crédit / Prêt',
              en: 'Credit / Loan',
              es: 'Crédito / Préstamo',
              ar: 'قَرْضْ / كْرِيدِي',
            },
            category: 'finance',
          },
          {
            id: 'm8_u2_w6',
            arabizi: 'moufawada',
            arabic: 'مُفَاوَضَة',
            translation: {
              fr: 'Négociation',
              en: 'Negotiation',
              es: 'Negociación',
              ar: 'مُفَاوَضَة',
            },
            category: 'business',
          },
        ],
      },
      {
        id: 'unit_8_3',
        title: {
          fr: 'Administration & Démarches',
          en: 'Administration & Procedures',
          es: 'Administración y Trámites',
          ar: 'الْإِدَارَة وَالْإِجْرَاءَاتْ',
        },
        description: {
          fr: 'Documents légaux, formalités administratives et certifications.',
          en: 'Legal documents, administrative formalities, and certifications.',
          es: 'Documentos legales, trámites administrativos y certificaciones.',
          ar: 'الْوَثَائِقُ الْقَانُونِيَّةُ، الْإِجْرَاءَاتُ الْإِدَارِيَّةُ وَالتَّوْثِيقُ.',
        },
        words: [
          {
            id: 'm8_u3_w1',
            arabizi: 'idara',
            arabic: 'إِدَارَة',
            translation: {
              fr: 'Administration / Bureau',
              en: 'Administration / Department',
              es: 'Administración / Oficina',
              ar: 'إِدَارَة',
            },
            category: 'administration',
          },
          {
            id: 'm8_u3_w2',
            arabizi: 'waraqa',
            arabic: 'وَرَقَة',
            translation: {
              fr: 'Document officiel / Feuille',
              en: 'Official document / Paper',
              es: 'Documento oficial / Papel',
              ar: 'وَرَقَة رَسْمِيَّة',
            },
            category: 'administration',
          },
          {
            id: 'm8_u3_w3',
            arabizi: 'toussiq',
            arabic: 'تَوْثِيقْ',
            translation: {
              fr: 'Légalisation / Certification',
              en: 'Notarization / Certification',
              es: 'Legalización / Certificación',
              ar: 'تَوْثِيقْ / مُصَادَقَة',
            },
            category: 'administration',
          },
          {
            id: 'm8_u3_w4',
            arabizi: 'wakala',
            arabic: 'وَكَالَة',
            translation: {
              fr: 'Procuration / Agence',
              en: 'Power of attorney / Agency',
              es: 'Poder legal / Agencia',
              ar: 'وَكَالَة',
            },
            category: 'administration',
          },
          {
            id: 'm8_u3_w5',
            arabizi: 'driba',
            arabic: 'ضْرِيبَة',
            translation: {
              fr: 'Taxe / Impôt',
              en: 'Tax / Duty',
              es: 'Impuesto / Tasa',
              ar: 'ضَرِيبَة',
            },
            category: 'administration',
          },
          {
            id: 'm8_u3_w6',
            arabizi: 'chahada',
            arabic: 'شَهَادَة',
            translation: {
              fr: 'Attestation / Diplôme',
              en: 'Certificate / Diploma',
              es: 'Certificado / Título',
              ar: 'شَهَادَة',
            },
            category: 'administration',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // MODULE 9 : MÉDIAS, DÉBAT & SOCIÉTÉ (C1)
  // =========================================================================
  {
    id: 9,
    moduleNumber: 9,
    level: 'C1',
    title: {
      fr: 'Médias, Société & Débat',
      en: 'Media, Society & Debate',
      es: 'Medios, Sociedad y Debate',
      ar: 'الْإِعْلَامْ، الْمُجْتَمَعْ وَالنِّقَاشْ',
    },
    description: {
      fr: 'Exprimer des opinions nuancées, argumenter, comprendre l’actualité et analyser la société.',
      en: 'Express nuanced opinions, argue, understand current events, and analyze society.',
      es: 'Expresar opiniones matizadas, argumentar, entender la actualidad y analizar la sociedad.',
      ar: 'التَّعْبِيرُ عَنْ آرَاءٍ دَقِيقَةٍ، الْمُنَاقَشَةُ، فَهْمُ الْأَخْبَارِ وَتَحْلِيلُ الْمُجْتَمَعِ.',
    },
    units: [
      {
        id: 'unit_9_1',
        title: {
          fr: 'Argumentation & Points de Vue',
          en: 'Argumentation & Perspectives',
          es: 'Argumentación y Puntos de Vista',
          ar: 'الْحِجَاجْ وَوِجْهَاتْ النَّظَرْ',
        },
        description: {
          fr: 'Structurer sa pensée et débattre avec nuance en Darija.',
          en: 'Structure your thoughts and debate with nuance in Darija.',
          es: 'Estructurar el pensamiento y debatir con matices en Darija.',
          ar: 'تَرْتِيبُ الْأَفْكَارِ وَالْمُنَاقَشَةُ بِبَلَاغَةٍ فِي الدَّارِجَةِ.',
        },
        words: [
          {
            id: 'm9_u1_w1',
            arabizi: 'f-ra2yi',
            arabic: 'فْ رَأْيِي',
            translation: {
              fr: 'À mon avis',
              en: 'In my opinion',
              es: 'En mi opinión',
              ar: 'فِي رَأْيِي',
            },
            category: 'debate',
          },
          {
            id: 'm9_u1_w2',
            arabizi: '7ojja',
            arabic: 'حُجَّة',
            translation: {
              fr: 'Preuve / Argument',
              en: 'Argument / Proof',
              es: 'Argumento / Prueba',
              ar: 'حُجَّة / بُرْهَانْ',
            },
            category: 'debate',
          },
          {
            id: 'm9_u1_w3',
            arabizi: 'i9tina3',
            arabic: 'اِقْتِنَاعْ',
            translation: {
              fr: 'Conviction',
              en: 'Conviction / Persuasion',
              es: 'Convicción',
              ar: 'اِقْتِنَاعْ',
            },
            category: 'debate',
          },
          {
            id: 'm9_u1_w4',
            arabizi: 'khtilaf',
            arabic: 'اِخْتِلَافْ',
            translation: {
              fr: 'Désaccord / Différence',
              en: 'Disagreement / Difference',
              es: 'Desacuerdo / Diferencia',
              ar: 'اِخْتِلَافْ',
            },
            category: 'debate',
          },
          {
            id: 'm9_u1_w5',
            arabizi: 'ta7lil',
            arabic: 'تَحْلِيلْ',
            translation: {
              fr: 'Analyse',
              en: 'Analysis',
              es: 'Análisis',
              ar: 'تَحْلِيلْ',
            },
            category: 'debate',
          },
          {
            id: 'm9_u1_w6',
            arabizi: 'mowqif',
            arabic: 'مَوْقِفْ',
            translation: {
              fr: 'Position / Prise de position',
              en: 'Stance / Position',
              es: 'Postura / Posición',
              ar: 'مَوْقِفْ',
            },
            category: 'debate',
          },
        ],
      },
      {
        id: 'unit_9_2',
        title: {
          fr: 'Médias & Actualités',
          en: 'Media & News',
          es: 'Medios y Actualidad',
          ar: 'الْإِعْلَامْ وَالْأَخْبَارْ',
        },
        description: {
          fr: 'Comprendre les reportages, articles de presse et réseaux sociaux marocains.',
          en: 'Understand news reports, press articles, and Moroccan social media.',
          es: 'Entender reportajes, artículos de prensa y redes sociales marroquíes.',
          ar: 'فَهْمُ التَّقَارِيرِ، الْمَقَالَاتِ الصُّحُفِيَّةِ وَشَبَكَاتِ التَّوَاصُلِ الْمَغْرِبِيَّةِ.',
        },
        words: [
          {
            id: 'm9_u2_w1',
            arabizi: 'i3lam',
            arabic: 'إِعْلَامْ',
            translation: {
              fr: 'Presse / Médias',
              en: 'Media / Press',
              es: 'Medios / Prensa',
              ar: 'إِعْلَامْ',
            },
            category: 'media',
          },
          {
            id: 'm9_u2_w2',
            arabizi: 'a5bar',
            arabic: 'أَخْبَارْ',
            translation: {
              fr: 'Nouvelles / Actualités',
              en: 'News',
              es: 'Noticias / Actualidad',
              ar: 'أَخْبَارْ',
            },
            category: 'media',
          },
          {
            id: 'm9_u2_w3',
            arabizi: 'ma9ala',
            arabic: 'مَقَالَة',
            translation: {
              fr: 'Article de journal',
              en: 'Article',
              es: 'Artículo',
              ar: 'مَقَالَة',
            },
            category: 'media',
          },
          {
            id: 'm9_u2_w4',
            arabizi: '7iwar',
            arabic: 'حِوَارْ',
            translation: {
              fr: 'Interview / Débat',
              en: 'Interview / Dialogue',
              es: 'Entrevista / Diálogo',
              ar: 'حِوَارْ',
            },
            category: 'media',
          },
          {
            id: 'm9_u2_w5',
            arabizi: 'taqrir',
            arabic: 'تَقْرِيرْ',
            translation: {
              fr: 'Rapport / Reportage',
              en: 'Report',
              es: 'Informe / Reportaje',
              ar: 'تَقْرِيرْ',
            },
            category: 'media',
          },
          {
            id: 'm9_u2_w6',
            arabizi: 'chabaka',
            arabic: 'شَبَكَة',
            translation: {
              fr: 'Réseau / Web',
              en: 'Network / Web',
              es: 'Red / Web',
              ar: 'شَبَكَة',
            },
            category: 'media',
          },
        ],
      },
      {
        id: 'unit_9_3',
        title: {
          fr: 'Société & Mutations',
          en: 'Society & Changes',
          es: 'Sociedad y Cambios',
          ar: 'الْمُجْتَمَعْ وَالتَّحَوُّلَاتْ',
        },
        description: {
          fr: 'Discuter des traditions, de la jeunesse et des évolutions culturelles.',
          en: 'Discuss traditions, youth, and cultural developments.',
          es: 'Hablar de tradiciones, juventud y evolución cultural.',
          ar: 'مُنَاقَشَةُ التَّقَالِيدِ، الشَّبَابِ وَالتَّطَوُّرَاتِ الثَّقَافِيَّةِ.',
        },
        words: [
          {
            id: 'm9_u3_w1',
            arabizi: 'moujtama3',
            arabic: 'مُجْتَمَعْ',
            translation: {
              fr: 'Société',
              en: 'Society',
              es: 'Sociedad',
              ar: 'مُجْتَمَعْ',
            },
            category: 'society',
          },
          {
            id: 'm9_u3_w2',
            arabizi: 'taqalid',
            arabic: 'تَقَالِيدْ',
            translation: {
              fr: 'Traditions',
              en: 'Traditions',
              es: 'Tradiciones',
              ar: 'تَقَالِيدْ',
            },
            category: 'society',
          },
          {
            id: 'm9_u3_w3',
            arabizi: 'hadara',
            arabic: 'حَضَارَة',
            translation: {
              fr: 'Civilisation',
              en: 'Civilization',
              es: 'Civilización',
              ar: 'حَضَارَة',
            },
            category: 'society',
          },
          {
            id: 'm9_u3_w4',
            arabizi: 'thawra',
            arabic: 'ثَوْرَة',
            translation: {
              fr: 'Révolution / Transformation',
              en: 'Revolution / Breakthrough',
              es: 'Revolución / Transformación',
              ar: 'ثَوْرَة / تَحَوُّلْ',
            },
            category: 'society',
          },
          {
            id: 'm9_u3_w5',
            arabizi: 'tanmiya',
            arabic: 'تَنْمِيَة',
            translation: {
              fr: 'Développement',
              en: 'Development',
              es: 'Desarrollo',
              ar: 'تَنْمِيَة',
            },
            category: 'society',
          },
          {
            id: 'm9_u3_w6',
            arabizi: 'howiya',
            arabic: 'هُوِيَّة',
            translation: {
              fr: 'Identité',
              en: 'Identity',
              es: 'Identidad',
              ar: 'هُوِيَّة',
            },
            category: 'society',
          },
        ],
      },
    ],
  },

  // =========================================================================
  // MODULE 10 : ÉLOQUENCE, MELHOUN & SAGESSE POPULAIRE (C2)
  // =========================================================================
  {
    id: 10,
    moduleNumber: 10,
    level: 'C2',
    title: {
      fr: 'Éloquence, Sagesse & Patrimoine',
      en: 'Eloquence, Wisdom & Heritage',
      es: 'Elocuencia, Sabiduría y Patrimonio',
      ar: 'الْبَلَاغَة، الْحِكْمَة وَالتُّرَاثْ',
    },
    description: {
      fr: 'Maîtrise totale des métaphores, poésie Melhoun, proverbes rares et finesse rhétorique.',
      en: 'Full mastery of metaphors, Melhoun poetry, rare proverbs, and rhetorical elegance.',
      es: 'Dominio total de metáforas, poesía Melhoun, refranes raros y elegancia retórica.',
      ar: 'التَّمَكُّنُ التَّامُّ مِنَ الِاسْتِعَارَاتِ، شِعْرِ الْمَلْحُونِ، الْأَمْثَالِ النَّادِرَةِ وَالْبَلَاغَةِ الْمَغْرِبِيَّةِ.',
    },
    units: [
      {
        id: 'unit_10_1',
        title: {
          fr: 'Proverbes & Sagesses Ancestrales',
          en: 'Proverbs & Ancestral Wisdom',
          es: 'Refranes y Sabiduría Ancestral',
          ar: 'الْأَمْثَالْ وَالْحِكَمْ الْأَصِيلَة',
        },
        description: {
          fr: 'Proverbes marocains raffinés et sagesses populaires.',
          en: 'Refined Moroccan proverbs and popular wisdom.',
          es: 'Refranes marroquíes refinados y sabiduría popular.',
          ar: 'أَمْثَالٌ مَغْرِبِيَّةٌ بَلِيغَةٌ وَحِكَمٌ شَعْبِيَّةٌ.',
        },
        words: [
          {
            id: 'm10_u1_w1',
            arabizi: '7ekma',
            arabic: 'حِكْمَة',
            translation: {
              fr: 'Sagesse / Maxime',
              en: 'Wisdom',
              es: 'Sabiduría',
              ar: 'حِكْمَة',
            },
            category: 'wisdom',
          },
          {
            id: 'm10_u1_w2',
            arabizi: 'm-matal',
            arabic: 'الْمْتَلْ',
            translation: {
              fr: 'Le proverbe / Dicton',
              en: 'Proverb / Saying',
              es: 'El refrán / Dicho',
              ar: 'الْمَثَلْ',
            },
            category: 'wisdom',
          },
          {
            id: 'm10_u1_w3',
            arabizi: 'm3na',
            arabic: 'مْعْنَى',
            translation: {
              fr: 'Sens caché / Portée',
              en: 'Hidden meaning / Significance',
              es: 'Significado profundo',
              ar: 'مَعْنَى',
            },
            category: 'wisdom',
          },
          {
            id: 'm10_u1_w4',
            arabizi: 'qaddem',
            arabic: 'قَدَّمْ',
            translation: {
              fr: 'Prioriser / Faire passer avant',
              en: 'Prioritize / Put first',
              es: 'Priorizar / Anteponer',
              ar: 'قَدَّمَ / أَوْلَوِيَّة',
            },
            category: 'wisdom',
          },
          {
            id: 'm10_u1_w5',
            arabizi: 'sber',
            arabic: 'صْبَرْ',
            translation: {
              fr: 'Patience / Endurance',
              en: 'Patience / Endurance',
              es: 'Paciencia / Resistencia',
              ar: 'صَبْرْ',
            },
            category: 'wisdom',
          },
          {
            id: 'm10_u1_w6',
            arabizi: 'niya',
            arabic: 'نِيَّة',
            translation: {
              fr: 'Bonne foi / Intention pure',
              en: 'Good faith / Pure intent',
              es: 'Buena fe / Intención pura',
              ar: 'نِيَّة صَادِقَة',
            },
            category: 'wisdom',
          },
        ],
      },
      {
        id: 'unit_10_2',
        title: {
          fr: 'Poésie Melhoun & Registre Élevé',
          en: 'Melhoun Poetry & High Register',
          es: 'Poesía Melhoun y Registro Alto',
          ar: 'شِعْرْ الْمَلْحُونْ وَالْمُسْتَوَى الرَّفِيعْ',
        },
        description: {
          fr: 'Terminologie poétique du Melhoun et métaphores littéraires.',
          en: 'Poetic terminology of Melhoun and literary metaphors.',
          es: 'Terminología poética del Melhoun y metáforas literarias.',
          ar: 'مُصْطَلَحَاتُ شِعْرِ الْمَلْحُونِ وَالِاسْتِعَارَاتُ الْأَدَبِيَّةُ.',
        },
        words: [
          {
            id: 'm10_u2_w1',
            arabizi: 'mal7oun',
            arabic: 'مَلْحُونْ',
            translation: {
              fr: 'Melhoun (art poétique marocain)',
              en: 'Melhoun (traditional sung poetry)',
              es: 'Melhoun (poesía tradicional cantada)',
              ar: 'الْمَلْحُونْ',
            },
            category: 'poetry',
          },
          {
            id: 'm10_u2_w2',
            arabizi: 'qasida',
            arabic: 'قَصِيدَة',
            translation: {
              fr: 'Poème / Ode',
              en: 'Poem / Ode',
              es: 'Poema / Oda',
              ar: 'قَصِيدَة',
            },
            category: 'poetry',
          },
          {
            id: 'm10_u2_w3',
            arabizi: 'b7our',
            arabic: 'بْحُورْ',
            translation: {
              fr: 'Métrique poétique / Océans',
              en: 'Poetic meter / Seas',
              es: 'Métrica poética / Mares',
              ar: 'بُحُورُ الشِّعْرْ',
            },
            category: 'poetry',
          },
          {
            id: 'm10_u2_w4',
            arabizi: 'ghram',
            arabic: 'غْرَامْ',
            translation: {
              fr: 'Amour profond / Passion noble',
              en: 'Deep passion / Devotion',
              es: 'Pasión noble / Amor profundo',
              ar: 'غَرَامْ',
            },
            category: 'poetry',
          },
          {
            id: 'm10_u2_w5',
            arabizi: 'klam',
            arabic: 'كْلَامْ',
            translation: {
              fr: 'Verbe / Parole d’honneur',
              en: 'Word / Eloquent speech',
              es: 'Palabra / Discurso elocuente',
              ar: 'كَلَامْ بَلِيغْ',
            },
            category: 'poetry',
          },
          {
            id: 'm10_u2_w6',
            arabizi: 'naghma',
            arabic: 'نَغْمَة',
            translation: {
              fr: 'Mélodie / Nuance vocale',
              en: 'Tune / Vocal inflection',
              es: 'Melodía / Matiz vocal',
              ar: 'نَغْمَة',
            },
            category: 'poetry',
          },
        ],
      },
      {
        id: 'unit_10_3',
        title: {
          fr: 'Rhétorique & Darija Soutenue',
          en: 'Rhetoric & Formal Darija',
          es: 'Retórica y Darija Culta',
          ar: 'الْبَلَاغَة وَالْبَيَانْ',
        },
        description: {
          fr: 'Figures de style, éloquence et expressions de haut niveau.',
          en: 'Figures of speech, eloquence, and advanced phrasing.',
          es: 'Figuras retóricas, elocuencia y giros de alto nivel.',
          ar: 'الْأَسَالِيبُ الْبَلَاغِيَّةُ، الْفَصَاحَةُ وَالتَّعَابِيرُ الرَّاقِيَةُ.',
        },
        words: [
          {
            id: 'm10_u3_w1',
            arabizi: 'bayan',
            arabic: 'بَيَانْ',
            translation: {
              fr: 'Clarté / Éloquence',
              en: 'Clarity / Eloquence',
              es: 'Claridad / Elocuencia',
              ar: 'بَيَانْ',
            },
            category: 'rhetoric',
          },
          {
            id: 'm10_u3_w2',
            arabizi: 'badi3',
            arabic: 'بَدِيعْ',
            translation: {
              fr: 'Splendeur / Brio créatif',
              en: 'Splendor / Creative ingenuity',
              es: 'Esplendor / Ingenio creativo',
              ar: 'بَدِيعْ',
            },
            category: 'rhetoric',
          },
          {
            id: 'm10_u3_w3',
            arabizi: 'isti3ara',
            arabic: 'اِسْتِعَارَة',
            translation: {
              fr: 'Métaphore',
              en: 'Metaphor',
              es: 'Metáfora',
              ar: 'اِسْتِعَارَة',
            },
            category: 'rhetoric',
          },
          {
            id: 'm10_u3_w4',
            arabizi: 'kinaya',
            arabic: 'كِنَايَة',
            translation: {
              fr: 'Allégorie / Métonymie',
              en: 'Allusion / Metonymy',
              es: 'Alegoría / Metonimia',
              ar: 'كِنَايَة',
            },
            category: 'rhetoric',
          },
          {
            id: 'm10_u3_w5',
            arabizi: 'fahem',
            arabic: 'فَاهِمْ',
            translation: {
              fr: 'Perspicace / Érudit',
              en: 'Discerning / Sagacious',
              es: 'Perspicaz / Erudito',
              ar: 'فَاهِمْ / ذَكِيْ',
            },
            category: 'rhetoric',
          },
          {
            id: 'm10_u3_w6',
            arabizi: '7daga',
            arabic: 'حْدَاگَة',
            translation: {
              fr: 'Dextérité / Brio',
              en: 'Deftness / Mastery',
              es: 'Destreza / Maestría',
              ar: 'حْدَاكَة / حِذْقْ',
            },
            category: 'rhetoric',
          },
        ],
      },
    ],
  },
];
