export const checkpointB2 = {
  id: 'checkpoint_b2',
  title: 'Palier B2 — Visa Tanger (Grand Socco) & Aisance Culturelle',
  certificateCode: 'KNZ-B2-',
  questions: [
    {
      id: 'b2_q1',
      prompt: 'Si j\'avais su, je serais venu plus tôt (Regret)',
      answerId: 'a1',
      arabizi: 'Kon 3reft, kon jite bekri',
      arabic: 'كُونْ عْرَفْتْ، كُونْ جِيتْ بْكْرِيْ',
      options: [
        { id: 'a1', arabizi: 'Kon 3reft, kon jite bekri', arabic: 'كُونْ عْرَفْتْ، كُونْ جِيتْ بْكْرِيْ', translation: 'Si j\'avais su, je serais venu plus tôt' },
        { id: 'd1', arabizi: 'Ila 3reft, gha-nji bekri', arabic: 'إِلَا عْرَفْتْ، غَانْجِيْ بْكْرِيْ', translation: 'Si je sais, je viendrai plus tôt' },
        { id: 'd2', arabizi: 'Kon 3reft, gha-nji bekri', arabic: 'كُونْ عْرَفْتْ، غَانْجِيْ بْكْرِيْ', translation: 'Construction incorrecte' }
      ]
    },
    {
      id: 'b2_q2',
      prompt: 'Il me semble que ce problème est difficile',
      answerId: 'a1',
      arabizi: 'Ban li bli had l-mouchkil s3ib',
      arabic: 'بَانْ لِيْ بْلِيْ هَادْ المُشْكِلْ صْعِيبْ',
      options: [
        { id: 'a1', arabizi: 'Ban li bli had l-mouchkil s3ib', arabic: 'بَانْ لِيْ بْلِيْ هَادْ المُشْكِلْ صْعِيبْ', translation: 'Il me semble que ce problème est difficile' },
        { id: 'd1', arabizi: 'Mtefeq bli had l-mouchkil s3ib', arabic: 'مْتَفِقْ بْلِيْ هَادْ المُشْكِلْ صْعِيبْ', translation: 'D\'accord que ce problème est difficile' },
        { id: 'd2', arabizi: 'Za3ma had l-mouchkil sahel', arabic: 'زْعَمَا هَادْ المُشْكِلْ سَاهِلْ', translation: 'Genre ce problème est facile' }
      ]
    },
    {
      id: 'b2_q3',
      prompt: 'Que fais-tu ? (Variante du Nord / Tanger)',
      answerId: 'a1',
      arabizi: 'Chni kat-3mel ?',
      arabic: 'شْنِي كَتْعْمَلْ ؟',
      options: [
        { id: 'a1', arabizi: 'Chni kat-3mel ?', arabic: 'شْنِي كَتْعْمَلْ ؟', translation: 'Que fais-tu ? (Tanger)' },
        { id: 'd1', arabizi: 'Chno kat-dir ?', arabic: 'شْنُوْ كَتْدِيرْ ؟', translation: 'Que fais-tu ? (Casablanca / Centre)' },
        { id: 'd2', arabizi: 'Fayn machi ?', arabic: 'فَايْن مَاشِيْ ؟', translation: 'Où vas-tu ? (Tanger)' }
      ]
    },
    {
      id: 'b2_q4',
      prompt: 'Ce qui est passé est passé / Tournons la page (Proverbe)',
      answerId: 'a1',
      arabizi: 'Li fate mate',
      arabic: 'اللِّيْ فَاتْ مَاتْ',
      options: [
        { id: 'a1', arabizi: 'Li fate mate', arabic: 'اللِّيْ فَاتْ مَاتْ', translation: 'Ce qui est passé est passé' },
        { id: 'd1', arabizi: 'Dqqa b dqqa', arabic: 'دَقَّةْ بْدَقَّةْ', translation: 'Pas à pas' },
        { id: 'd2', arabizi: 'Khelli l-bir b ghettah', arabic: 'خَلِّيْ الْبِيرْ بْغَطَاهْ', translation: 'Garde le secret' }
      ]
    },
    {
      id: 'b2_q5',
      prompt: 'Nous nous sommes entendus sur le travail (Professionnel)',
      answerId: 'a1',
      arabizi: 'Tfehemna 3la l-khedma',
      arabic: 'تَفَاهَمْنَا عْلَى الْخَدْمَةْ',
      options: [
        { id: 'a1', arabizi: 'Tfehemna 3la l-khedma', arabic: 'تَفَاهَمْنَا عْلَى الْخَدْمَةْ', translation: 'Nous nous sommes entendus sur le travail' },
        { id: 'd1', arabizi: 'Khassna l-khedma', arabic: 'خَصَّنَا الْخَدْمَةْ', translation: 'Nous avons besoin du travail' },
        { id: 'd2', arabizi: 'Gha-nsift l-khedma', arabic: 'غَانْصَيْفَطْ الْخَدْمَةْ', translation: 'J\'enverrai le travail' }
      ]
    },
    {
      id: 'b2_q6',
      prompt: 'Toi (masculin ou féminin — Variante Chamali / Tanger)',
      answerId: 'a1',
      arabizi: 'Ntina',
      arabic: 'نْتِينَا',
      options: [
        { id: 'a1', arabizi: 'Ntina', arabic: 'نْتِينَا', translation: 'Toi (Tanger - mixte)' },
        { id: 'd1', arabizi: 'Ntouma', arabic: 'نْتُومَا', translation: 'Vous (pluriel)' },
        { id: 'd2', arabizi: 'Houwa', arabic: 'هُوْ', translation: 'Lui' }
      ]
    },
    {
      id: 'b2_q7',
      prompt: 'Garde le secret / Ne rouvre pas ce dossier (Proverbe)',
      answerId: 'a1',
      arabizi: 'Khelli l-bir b ghettah',
      arabic: 'خَلِّيْ الْبِيرْ بْغَطَاهْ',
      options: [
        { id: 'a1', arabizi: 'Khelli l-bir b ghettah', arabic: 'خَلِّيْ الْبِيرْ بْغَطَاهْ', translation: 'Laisse le puits avec son couvercle' },
        { id: 'd1', arabizi: 'L-mregga bla melha', arabic: 'الْمَرْقَةْ بْلَا مَلْحَةْ', translation: 'C\'est fade / sans saveur' },
        { id: 'd2', arabizi: 'Li fate mate', arabic: 'اللِّيْ فَاتْ مَاتْ', translation: 'Ce qui est passé est passé' }
      ]
    },
    {
      id: 'b2_q8',
      prompt: 'Pas forcément / Pas nécessairement (Nuancer)',
      answerId: 'a1',
      arabizi: 'Machi b daroura',
      arabic: 'مَاشِيْ بْالضَّرُورَةْ',
      options: [
        { id: 'a1', arabizi: 'Machi b daroura', arabic: 'مَاشِيْ بْالضَّرُورَةْ', translation: 'Pas forcément' },
        { id: 'd1', arabizi: 'B daroura', arabic: 'بْالضَّرُورَةْ', translation: 'Forcément' },
        { id: 'd2', arabizi: '3endek l-heqq', arabic: 'عَنْدَكْ الْحَقْ', translation: 'Tu as raison' }
      ]
    },
    {
      id: 'b2_q9',
      prompt: 'Où vas-tu ? (Variante du Nord / Tanger)',
      answerId: 'a1',
      arabizi: 'Fayn machi ?',
      arabic: 'فَايْن مَاشِي ؟',
      options: [
        { id: 'a1', arabizi: 'Fayn machi ?', arabic: 'فَايْن مَاشِي ؟', translation: 'Où vas-tu ? (Tanger)' },
        { id: 'd1', arabizi: 'Fin ghadi ?', arabic: 'فِينْ غَادِيْ ؟', translation: 'Où vas-tu ? (Standard)' },
        { id: 'd2', arabizi: 'Mnin nta ?', arabic: 'مْنِينْ نْتَا ؟', translation: 'D\'où es-tu ?' }
      ]
    },
    {
      id: 'b2_q10',
      prompt: 'J\'ai un rendez-vous et un projet à l\'entreprise',
      answerId: 'a1',
      arabizi: '3ndi mow3id w mochrou3 f charika',
      arabic: 'عَنْدِي مَوْعِدْ وْمَشْرُوعْ فْ الشَّرِكَةْ',
      options: [
        { id: 'a1', arabizi: '3ndi mow3id w mochrou3 f charika', arabic: 'عَنْدِي مَوْعِدْ وْمَشْرُوعْ فْ الشَّرِكَةْ', translation: 'J\'ai un rendez-vous et un projet à l\'entreprise' },
        { id: 'd1', arabizi: '3ndi ijtimā3 bla charika', arabic: 'عَنْدِي اِجْتِمَاعْ بْلَا شَرِكَةْ', translation: 'J\'ai une réunion sans entreprise' },
        { id: 'd2', arabizi: 'Mowaddef f l-khedma', arabic: 'مُوَظَّفْ فْ الْخَدْمَةْ', translation: 'Employé au travail' }
      ]
    },
    {
      id: 'b2_q11',
      prompt: 'Magnifique / Formidable (Variante Chamali / Tanger)',
      answerId: 'a1',
      arabizi: 'Hayel',
      arabic: 'هَايَلْ',
      options: [
        { id: 'a1', arabizi: 'Hayel', arabic: 'هَايَلْ', translation: 'Magnifique / Superbe (Nord)' },
        { id: 'd1', arabizi: 'Zwin bzzaf', arabic: 'زْوِينْ بْزَافْ', translation: 'Très beau (Standard)' },
        { id: 'd2', arabizi: 'Khayeb', arabic: 'خَايِبْ', translation: 'Mauvais' }
      ]
    },
    {
      id: 'b2_q12',
      prompt: 'Petit à petit, l\'oiseau fait son nid (Proverbe)',
      answerId: 'a1',
      arabizi: 'Dqqa b dqqa',
      arabic: 'دَقَّةْ بْدَقَّةْ',
      options: [
        { id: 'a1', arabizi: 'Dqqa b dqqa', arabic: 'دَقَّةْ بْدَقَّةْ', translation: 'Pas à pas / Doucement' },
        { id: 'd1', arabizi: 'Dghya dghya', arabic: 'دْغِيَا دْغِيَا', translation: 'Vite vite' },
        { id: 'd2', arabizi: 'Bekri', arabic: 'بْكْرِيْ', translation: 'Tôt' }
      ]
    }
  ]
};
