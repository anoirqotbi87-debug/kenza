import { Lesson } from '../types/curriculum';

export const module5Lessons: Lesson[] = [
  {
    id: 'm5_l1_opinion',
    title: {
      fr: 'Exprimer son opinion & Nuancer le débat',
      en: 'Expressing Opinion & Nuancing Debate',
      es: 'Expresar Opinión y Matizar el Debate',
      ar: 'التعبير عن الرأي وتلطيف النقاش'
    },
    level: 5,
    description: {
      fr: 'Savoir exprimer et défendre une opinion avec nuance.',
      en: 'Know how to express and defend an opinion with nuance.',
      es: 'Saber expresar y defender una opinión con matices.',
      ar: 'معرفة كيفية التعبير عن الرأي والدفاع عنه بتفصيل.'
    },
    steps: [
      {
        id: 'm5_l1_s1',
        type: 'learning',
        content: {
          title: { fr: 'Exprimer un point de vue', en: 'Expressing a point of view', es: 'Expresar un punto de vista', ar: 'التعبير عن وجهة نظر' },
          description: { 
            fr: 'F ra2yi (À mon avis), Ban li bli... (Il me semble que...), Za3ma (C\'est-à-dire / genre).',
            en: 'F ra2yi (In my opinion), Ban li bli... (It seems to me that...), Za3ma (That is to say / like).',
            es: 'F ra2yi (En mi opinión), Ban li bli... (Me parece que...), Za3ma (Es decir / o sea).',
            ar: 'في رأيي، بان لي بلي...، زعما.'
          },
          arabizi: 'F ra2yi, had l-mouchkil s3ib.',
          arabic: 'في رأيي، هاد المشكل صعيب.',
          translation: { fr: 'À mon avis, ce problème est difficile.', en: 'In my opinion, this problem is difficult.', es: 'En mi opinión, este problema es difícil.', ar: 'في رأيي، هذه المشكلة صعبة.' }
        }
      },
      {
        id: 'm5_l1_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m5_l1_1',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Il me semble que..." ?', en: 'How to say "It seems to me that..."?', es: '¿Cómo decir "Me parece que..."?', ar: 'كيف تقول "يبدو لي أن..."؟' },
          options: [
            { id: 'o1', text: 'Za3ma', isCorrect: false },
            { id: 'o2', text: 'F ra2yi', isCorrect: false },
            { id: 'o3', text: 'Ban li bli...', isCorrect: true }
          ],
          answer: 'o3',
          explanation: { fr: 'Ban li = Il m\'a paru (Il me semble), bli = que.', en: 'Ban li = It seemed to me, bli = that.', es: 'Ban li = Me pareció, bli = que.', ar: 'بان لي = بدا لي، بلي = أن.' }
        }
      },
      {
        id: 'm5_l1_s3',
        type: 'learning',
        content: {
          title: { fr: 'Accord et désaccord', en: 'Agreement and disagreement', es: 'Acuerdo y desacuerdo', ar: 'الاتفاق والاختلاف' },
          description: { 
            fr: 'Mtefeq m3ak (D\'accord avec toi) vs Machi b daroura (Pas forcément), 3endek l-heqq walakin... (Tu as raison mais...).',
            en: 'Mtefeq m3ak (Agree with you) vs Machi b daroura (Not necessarily), 3endek l-heqq walakin... (You are right but...).',
            es: 'Mtefeq m3ak (De acuerdo contigo) vs Machi b daroura (No necesariamente), 3endek l-heqq walakin... (Tienes razón pero...).',
            ar: 'متفق معاك ضد ماشي بالضرورة، عندك الحق ولكن...'
          },
          arabizi: '3endek l-heqq walakin machi b daroura.',
          arabic: 'عندك الحق ولكن ماشي بالضرورة.',
          translation: { fr: 'Tu as raison mais ce n\'est pas forcément ça.', en: 'You are right but not necessarily.', es: 'Tienes razón pero no necesariamente.', ar: 'عندك الحق ولكن ليس بالضرورة.' }
        }
      },
      {
        id: 'm5_l1_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m5_l1_2',
          type: 'mcq',
          prompt: { fr: 'Que signifie "Machi b daroura" ?', en: 'What does "Machi b daroura" mean?', es: '¿Qué significa "Machi b daroura"?', ar: 'ماذا يعني "ماشي بالضرورة"؟' },
          options: [
            { id: 'o1', text: { fr: 'Je suis d\'accord', en: 'I agree', es: 'Estoy de acuerdo', ar: 'أنا موافق' }, isCorrect: false },
            { id: 'o2', text: { fr: 'Pas forcément', en: 'Not necessarily', es: 'No necesariamente', ar: 'ليس بالضرورة' }, isCorrect: true },
            { id: 'o3', text: { fr: 'Tu as tort', en: 'You are wrong', es: 'Estás equivocado', ar: 'أنت مخطئ' }, isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Daroura signifie "nécessité", donc machi b daroura = pas par nécessité (pas forcément).', en: 'Daroura means necessity.', es: 'Daroura significa necesidad.', ar: 'ضرورة تعني الحاجة.' }
        }
      },
      {
        id: 'm5_l1_s5',
        type: 'learning',
        content: {
          title: { fr: 'Connecteurs d\'argumentation', en: 'Argumentation connectors', es: 'Conectores de argumentación', ar: 'روابط الحجاج' },
          description: { 
            fr: 'Men jiha khora (D\'un autre côté), Kima kan l-7al (De toute façon).',
            en: 'Men jiha khora (On the other hand), Kima kan l-7al (Anyway).',
            es: 'Men jiha khora (Por otro lado), Kima kan l-7al (De todas formas).',
            ar: 'من جهة أخرى، كيما كان الحال.'
          },
          arabizi: 'Kima kan l-7al, gha-nmchiw.',
          arabic: 'كيما كان الحال، غانمشيو.',
          translation: { fr: 'De toute façon, nous irons.', en: 'Anyway, we will go.', es: 'De todas formas, iremos.', ar: 'على أي حال، سنذهب.' }
        }
      }
    ]
  },
  {
    id: 'm5_l2_hypothese',
    title: {
      fr: 'L\'hypothèse et le conditionnel (Ila vs Kon)',
      en: 'Hypothesis and Conditional (Ila vs Kon)',
      es: 'Hipótesis y Condicional (Ila vs Kon)',
      ar: 'الافتراض والشرط (إلا ضد كون)'
    },
    level: 5,
    description: {
      fr: 'Maîtriser les hypothèses réalisables et les regrets (Si... alors...).',
      en: 'Master realistic hypotheses and regrets (If... then...).',
      es: 'Dominar hipótesis realizables y arrepentimientos (Si... entonces...).',
      ar: 'إتقان الافتراضات الممكنة والندم (إذا... إذن...).'
    },
    steps: [
      {
        id: 'm5_l2_s1',
        type: 'learning',
        content: {
          title: { fr: 'L\'hypothèse réalisable (Ila)', en: 'Realistic hypothesis (Ila)', es: 'Hipótesis realizable (Ila)', ar: 'الافتراض الممكن (إلا)' },
          description: { 
            fr: 'On utilise "Ila" pour une condition réalisable : Ila + verbe au passé/présent + futur.',
            en: 'Use "Ila" for a realistic condition: Ila + past/present verb + future.',
            es: 'Se usa "Ila" para una condición realizable: Ila + verbo pasado/presente + futuro.',
            ar: 'نستخدم "إلا" لشرط ممكن: إلا + ماضي/مضارع + مستقبل.'
          },
          arabizi: 'Ila 3ndek l-weqt, gha-nmchiw.',
          arabic: 'إلا عندك الوقت، غانمشيو.',
          translation: { fr: 'Si tu as le temps, nous irons.', en: 'If you have time, we will go.', es: 'Si tienes tiempo, iremos.', ar: 'إذا كان لديك وقت، سنذهب.' }
        }
      },
      {
        id: 'm5_l2_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m5_l2_1',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "Si tu viens, on mangera"', en: 'Translate: "If you come, we will eat"', es: 'Traduce: "Si vienes, comeremos"', ar: 'ترجم: "إذا جئت، سنأكل"' },
          options: [
            { id: 'o1', text: 'Kon jiti, kon klina', isCorrect: false },
            { id: 'o2', text: 'Ila jiti, gha-naklou', isCorrect: true },
            { id: 'o3', text: 'Ila jiti, klina', isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Condition réalisable : Ila + passé (jiti) + futur (gha-naklou).', en: 'Realistic condition: Ila + past + future.', es: 'Condición realizable: Ila + pasado + futuro.', ar: 'شرط ممكن: إلا + ماضي + مستقبل.' }
        }
      },
      {
        id: 'm5_l2_s3',
        type: 'learning',
        content: {
          title: { fr: 'L\'irréel et le regret (Kon)', en: 'Unreal and regret (Kon)', es: 'Irreal y arrepentimiento (Kon)', ar: 'المستحيل والندم (كون)' },
          description: { 
            fr: 'On utilise "Kon" pour l\'irréel ou le regret (la construction Kon ... kon ...). Kon + verbe au passé + kon + verbe au passé.',
            en: 'Use "Kon" for unreal or regret. Kon + past + kon + past.',
            es: 'Usa "Kon" para irreal o arrepentimiento. Kon + pasado + kon + pasado.',
            ar: 'نستخدم "كون" للمستحيل أو الندم. كون + ماضي + كون + ماضي.'
          },
          arabizi: 'Kon 3reft, kon jite bekri.',
          arabic: 'كون عرفت، كون جيت بكري.',
          translation: { fr: 'Si j\'avais su, je serais venu plus tôt.', en: 'If I had known, I would have come earlier.', es: 'Si hubiera sabido, habría venido antes.', ar: 'لو كنت أعرف، لكنت جئت باكراً.' }
        }
      },
      {
        id: 'm5_l2_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m5_l2_2',
          type: 'mcq',
          prompt: { fr: 'Comment exprimer "S\'il n\'avait pas plu, nous serions sortis" ?', en: 'How to express "If it hadn\'t rained, we would have gone out"?', es: '¿Cómo expresar "Si no hubiera llovido, habríamos salido"?', ar: 'كيف تعبر عن "لو لم تمطر، لكنا خرجنا"؟' },
          options: [
            { id: 'o1', text: 'Ila ma-kant-ch chta, gha-nkhrejou', isCorrect: false },
            { id: 'o2', text: 'Kon ma-kant-ch chta, kon khrejna', isCorrect: true },
            { id: 'o3', text: 'Kon ma-kant-ch chta, gha-nkhrejou', isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Regret : Kon + condition passée + kon + conséquence passée.', en: 'Regret: Kon + past + kon + past.', es: 'Arrepentimiento: Kon + pasado + kon + pasado.', ar: 'الندم: كون + ماضي + كون + ماضي.' }
        }
      }
    ]
  },
  {
    id: 'm5_l3_travail',
    title: {
      fr: 'Le monde professionnel & administratif (L-Khdma)',
      en: 'Professional & Administrative World (L-Khdma)',
      es: 'Mundo Profesional y Administrativo (L-Khdma)',
      ar: 'العالم المهني والإداري (الخدمة)'
    },
    level: 5,
    description: {
      fr: 'S\'exprimer dans un contexte professionnel ou administratif.',
      en: 'Express yourself in a professional or administrative context.',
      es: 'Expresarse en un contexto profesional o administrativo.',
      ar: 'التعبير في سياق مهني أو إداري.'
    },
    steps: [
      {
        id: 'm5_l3_s1',
        type: 'learning',
        content: {
          title: { fr: 'Vocabulaire clé', en: 'Key vocabulary', es: 'Vocabulario clave', ar: 'مفردات أساسية' },
          description: { 
            fr: 'Ijtimā3 (Réunion), Mowaddef (Employé), Mochrou3 (Projet), Charika (Entreprise), Mow3id (Rendez-vous).',
            en: 'Ijtimā3 (Meeting), Mowaddef (Employee), Mochrou3 (Project), Charika (Company), Mow3id (Appointment).',
            es: 'Ijtimā3 (Reunión), Mowaddef (Empleado), Mochrou3 (Proyecto), Charika (Empresa), Mow3id (Cita).',
            ar: 'اجتماع، موظف، مشروع، شركة، موعد.'
          },
          arabizi: '3ndi ijtimā3 f charika.',
          arabic: 'عندي اجتماع ف الشركة.',
          translation: { fr: 'J\'ai une réunion à l\'entreprise.', en: 'I have a meeting at the company.', es: 'Tengo una reunión en la empresa.', ar: 'لدي اجتماع في الشركة.' }
        }
      },
      {
        id: 'm5_l3_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m5_l3_1',
          type: 'mcq',
          prompt: { fr: 'Que signifie "Mochrou3" ?', en: 'What does "Mochrou3" mean?', es: '¿Qué significa "Mochrou3"?', ar: 'ماذا يعني "مشروع"؟' },
          options: [
            { id: 'o1', text: { fr: 'Employé', en: 'Employee', es: 'Empleado', ar: 'موظف' }, isCorrect: false },
            { id: 'o2', text: { fr: 'Rendez-vous', en: 'Appointment', es: 'Cita', ar: 'موعد' }, isCorrect: false },
            { id: 'o3', text: { fr: 'Projet', en: 'Project', es: 'Proyecto', ar: 'مشروع' }, isCorrect: true }
          ],
          answer: 'o3',
          explanation: { fr: 'Mochrou3 = Projet.', en: 'Mochrou3 = Project.', es: 'Mochrou3 = Proyecto.', ar: 'مشروع = مشروع.' }
        }
      },
      {
        id: 'm5_l3_s3',
        type: 'learning',
        content: {
          title: { fr: 'Négociation & Accord', en: 'Negotiation & Agreement', es: 'Negociación y Acuerdo', ar: 'التفاوض والاتفاق' },
          description: { 
            fr: 'Tfehemna 3la l-khedma (Nous nous sommes entendus sur le travail). Gha-nsift lik l-email f l-3chiya (Je t\'enverrai l\'email cet après-midi).',
            en: 'Tfehemna 3la l-khedma (We agreed on the work). Gha-nsift lik l-email f l-3chiya (I will send you the email this afternoon).',
            es: 'Tfehemna 3la l-khedma (Acordamos el trabajo). Gha-nsift lik l-email f l-3chiya (Te enviaré el correo esta tarde).',
            ar: 'تفاهمنا على الخدمة. غانصيفط ليك الإيميل ف العشية.'
          },
          arabizi: 'Tfehemna 3la l-khedma, gha-nsift lik l-email.',
          arabic: 'تفاهمنا على الخدمة، غانصيفط ليك الإيميل.',
          translation: { fr: 'Nous nous sommes entendus sur le travail, je t\'enverrai l\'email.', en: 'We agreed on the work, I will send you the email.', es: 'Acordamos el trabajo, te enviaré el correo.', ar: 'اتفقنا على العمل، سأرسل لك الإيميل.' }
        }
      },
      {
        id: 'm5_l3_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m5_l3_2',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Nous nous sommes entendus" ?', en: 'How to say "We agreed"?', es: '¿Cómo decir "Acordamos"?', ar: 'كيف تقول "تفاهمنا"؟' },
          options: [
            { id: 'o1', text: 'Gha-nsift', isCorrect: false },
            { id: 'o2', text: 'Tfehemna', isCorrect: true },
            { id: 'o3', text: '3ndi ijtimā3', isCorrect: false }
          ],
          answer: 'o2',
          explanation: { fr: 'Tfehemna = Nous nous sommes entendus.', en: 'Tfehemna = We agreed.', es: 'Tfehemna = Acordamos.', ar: 'تفاهمنا = اتفقنا.' }
        }
      }
    ]
  },
  {
    id: 'm5_l4_proverbes',
    title: {
      fr: 'Proverbes & Tournures idiomatiques (L-Amtal Cha3biya)',
      en: 'Proverbs & Idioms (L-Amtal Cha3biya)',
      es: 'Proverbios y Modismos (L-Amtal Cha3biya)',
      ar: 'الأمثال والتعابير (الأمثال الشعبية)'
    },
    level: 5,
    description: {
      fr: 'Comprendre et utiliser des proverbes marocains.',
      en: 'Understand and use Moroccan proverbs.',
      es: 'Comprender y usar proverbios marroquíes.',
      ar: 'فهم واستخدام الأمثال المغربية.'
    },
    steps: [
      {
        id: 'm5_l4_s1',
        type: 'learning',
        content: {
          title: { fr: 'Dqqa b dqqa', en: 'Dqqa b dqqa', es: 'Dqqa b dqqa', ar: 'دقة بدقة' },
          description: { 
            fr: 'Dqqa b dqqa (Pas à pas / petit à petit).',
            en: 'Dqqa b dqqa (Step by step / little by little).',
            es: 'Dqqa b dqqa (Paso a paso / poco a poco).',
            ar: 'دقة بدقة (خطوة بخطوة).'
          },
          arabizi: 'T3elem l-lugha dqqa b dqqa.',
          arabic: 'تعلم اللغة دقة بدقة.',
          translation: { fr: 'Apprends la langue pas à pas.', en: 'Learn the language step by step.', es: 'Aprende el idioma paso a paso.', ar: 'تعلم اللغة خطوة بخطوة.' }
        }
      },
      {
        id: 'm5_l4_s2',
        type: 'learning',
        content: {
          title: { fr: 'Li fate mate', en: 'Li fate mate', es: 'Li fate mate', ar: 'اللي فات مات' },
          description: { 
            fr: 'Li fate mate (Ce qui est passé est passé — pour tourner la page).',
            en: 'Li fate mate (What is past is past — to turn the page).',
            es: 'Li fate mate (Lo pasado, pasado está — para pasar página).',
            ar: 'اللي فات مات (ما مضى قد مضى).'
          },
          arabizi: 'Nsaw l-mouchkil, li fate mate.',
          arabic: 'نساو المشكل، اللي فات مات.',
          translation: { fr: 'Oubliez le problème, ce qui est passé est passé.', en: 'Forget the problem, what is past is past.', es: 'Olviden el problema, lo pasado, pasado está.', ar: 'انسوا المشكلة، اللي فات مات.' }
        }
      },
      {
        id: 'm5_l4_s3',
        type: 'learning',
        content: {
          title: { fr: 'Khelli l-bir b ghettah', en: 'Khelli l-bir b ghettah', es: 'Khelli l-bir b ghettah', ar: 'خلي البير بغطاه' },
          description: { 
            fr: 'Khelli l-bir b ghettah (Garde le secret / n\'ouvre pas ce sujet, litt. "Laisse le puits avec son couvercle").',
            en: 'Khelli l-bir b ghettah (Keep the secret / don\'t open this subject, lit. "Leave the well with its cover").',
            es: 'Khelli l-bir b ghettah (Guarda el secreto / no abras este tema, lit. "Deja el pozo con su tapa").',
            ar: 'خلي البير بغطاه (احتفظ بالسر / لا تفتح هذا الموضوع).'
          },
          arabizi: 'Mn l-ahsan khelli l-bir b ghettah.',
          arabic: 'من الأحسن خلي البير بغطاه.',
          translation: { fr: 'Il vaut mieux ne pas en parler.', en: 'It is better not to talk about it.', es: 'Es mejor no hablar de ello.', ar: 'من الأفضل عدم الحديث عن ذلك.' }
        }
      },
      {
        id: 'm5_l4_s4',
        type: 'learning',
        content: {
          title: { fr: 'L-mregga bla melha', en: 'L-mregga bla melha', es: 'L-mregga bla melha', ar: 'المرقة بلا ملحة' },
          description: { 
            fr: 'L-mregga bla melha (Fade / sans saveur — au figuré pour une situation ou personne ennuyeuse).',
            en: 'L-mregga bla melha (Bland / tasteless — figuratively for a boring situation or person).',
            es: 'L-mregga bla melha (Insípido / sin sabor — figuradamente para una situación o persona aburrida).',
            ar: 'المرقة بلا ملحة (بدون طعم — مجازاً لشيء أو شخص ممل).'
          },
          arabizi: 'Had l-film ki l-mregga bla melha.',
          arabic: 'هاد الفيلم كي المرقة بلا ملحة.',
          translation: { fr: 'Ce film est ennuyeux (comme un bouillon sans sel).', en: 'This movie is boring.', es: 'Esta película es aburrida.', ar: 'هذا الفيلم ممل.' }
        }
      },
      {
        id: 'm5_l4_s5',
        type: 'exercise',
        exercise: {
          id: 'ex_m5_l4_1',
          type: 'mcq',
          prompt: { fr: 'Quel proverbe utiliser pour dire "Tournons la page" ?', en: 'Which proverb to use to say "Let\'s turn the page"?', es: '¿Qué proverbio usar para decir "Pasemos página"?', ar: 'أي مثل تستخدم لتقول "دعنا نطوي الصفحة"؟' },
          options: [
            { id: 'o1', text: 'Dqqa b dqqa', isCorrect: false },
            { id: 'o2', text: 'Khelli l-bir b ghettah', isCorrect: false },
            { id: 'o3', text: 'Li fate mate', isCorrect: true }
          ],
          answer: 'o3',
          explanation: { fr: 'Li fate mate = Ce qui est passé est passé.', en: 'Li fate mate = What is past is past.', es: 'Li fate mate = Lo pasado, pasado está.', ar: 'اللي فات مات.' }
        }
      }
    ]
  },
  {
    id: 'm5_checkpoint_b2',
    title: {
      fr: 'Checkpoint B2 (Visa Tanger — Grand Socco)',
      en: 'Checkpoint B2 (Visa Tangier)',
      es: 'Checkpoint B2 (Visa Tánger)',
      ar: 'نقطة تفتيش B2 (تأشيرة طنجة)'
    },
    level: 5,
    description: {
      fr: 'Validation finale du niveau B2. Obtenez votre Visa de Tanger.',
      en: 'Final validation of B2 level. Get your Tangier Visa.',
      es: 'Validación final del nivel B2. Obtén tu Visa de Tánger.',
      ar: 'التقييم النهائي لمستوى B2. احصل على تأشيرة طنجة.'
    },
    steps: [
      {
        id: 'chk_b2_1',
        type: 'exercise',
        exercise: {
          id: 'chk_b2_1_ex',
          type: 'mcq',
          prompt: { fr: 'Si j\'avais su, je serais venu.', en: 'If I had known, I would have come.', es: 'Si hubiera sabido, habría venido.', ar: 'لو كنت أعرف، لكنت جئت.' },
          options: [
            { id: 'o1', text: 'Ila 3reft, gha-nji', isCorrect: false },
            { id: 'o2', text: 'Kon 3reft, kon jite', isCorrect: true },
            { id: 'o3', text: 'Kon 3reft, gha-nji', isCorrect: false }
          ],
          answer: 'o2'
        }
      },
      {
        id: 'chk_b2_2',
        type: 'exercise',
        exercise: {
          id: 'chk_b2_2_ex',
          type: 'mcq',
          prompt: { fr: 'Je ne suis pas forcément d\'accord.', en: 'I do not necessarily agree.', es: 'No estoy necesariamente de acuerdo.', ar: 'لست متفقاً بالضرورة.' },
          options: [
            { id: 'o1', text: 'Machi b daroura', isCorrect: true },
            { id: 'o2', text: 'Mtefeq m3ak', isCorrect: false },
            { id: 'o3', text: '3endek l-heqq', isCorrect: false }
          ],
          answer: 'o1'
        }
      },
      {
        id: 'chk_b2_3',
        type: 'exercise',
        exercise: {
          id: 'chk_b2_3_ex',
          type: 'mcq',
          prompt: { fr: 'Quel mot signifie "Rendez-vous" en contexte professionnel ?', en: 'Which word means "Appointment" in a professional context?', es: '¿Qué palabra significa "Cita" en un contexto profesional?', ar: 'أي كلمة تعني "موعد" في السياق المهني؟' },
          options: [
            { id: 'o1', text: 'Ijtimā3', isCorrect: false },
            { id: 'o2', text: 'Mow3id', isCorrect: true },
            { id: 'o3', text: 'Mochrou3', isCorrect: false }
          ],
          answer: 'o2'
        }
      },
      {
        id: 'chk_b2_4',
        type: 'exercise',
        exercise: {
          id: 'chk_b2_4_ex',
          type: 'mcq',
          prompt: { fr: 'Que signifie "Khelli l-bir b ghettah" ?', en: 'What does "Khelli l-bir b ghettah" mean?', es: '¿Qué significa "Khelli l-bir b ghettah"?', ar: 'ماذا يعني "خلي البير بغطاه"؟' },
          options: [
            { id: 'o1', text: { fr: 'Garde le secret / N\'en parle pas', en: 'Keep it secret / Don\'t talk about it', es: 'Guárdalo en secreto / No lo menciones', ar: 'احفظ السر / لا تتحدث عنه' }, isCorrect: true },
            { id: 'o2', text: { fr: 'Ce qui est passé est passé', en: 'What\'s done is done', es: 'Lo pasado, pasado está', ar: 'ما فات مات' }, isCorrect: false },
            { id: 'o3', text: { fr: 'Petit à petit', en: 'Little by little', es: 'Poco a poco', ar: 'شيئاً فشيئاً' }, isCorrect: false }
          ],
          answer: 'o1'
        }
      },
      {
        id: 'chk_b2_5',
        type: 'exercise',
        exercise: {
          id: 'chk_b2_5_ex',
          type: 'mcq',
          prompt: { fr: 'Si tu as le temps, nous sortirons.', en: 'If you have time, we will go out.', es: 'Si tienes tiempo, saldremos.', ar: 'إذا كان لديك وقت، سنخرج.' },
          options: [
            { id: 'o1', text: 'Kon 3ndek l-weqt, kon khrejna', isCorrect: false },
            { id: 'o2', text: 'Ila 3ndek l-weqt, gha-nkhrejou', isCorrect: true },
            { id: 'o3', text: 'Ila 3ndek l-weqt, khrejna', isCorrect: false }
          ],
          answer: 'o2'
        }
      },
      {
        id: 'chk_b2_6',
        type: 'exercise',
        exercise: {
          id: 'chk_b2_6_ex',
          type: 'mcq',
          prompt: { fr: 'Il me semble que ce projet est difficile.', en: 'It seems to me that this project is difficult.', es: 'Me parece que este proyecto es difícil.', ar: 'يبدو لي أن هذا المشروع صعب.' },
          options: [
            { id: 'o1', text: 'Ban li bli had l-mochrou3 s3ib', isCorrect: true },
            { id: 'o2', text: 'F ra2yi had l-mochrou3 sahel', isCorrect: false },
            { id: 'o3', text: 'Za3ma had l-mochrou3 s3ib', isCorrect: false }
          ],
          answer: 'o1'
        }
      },
      {
        id: 'chk_b2_7',
        type: 'exercise',
        exercise: {
          id: 'chk_b2_7_ex',
          type: 'mcq',
          prompt: { fr: 'Nous nous sommes entendus sur le travail.', en: 'We agreed on the work.', es: 'Acordamos el trabajo.', ar: 'اتفقنا على العمل.' },
          options: [
            { id: 'o1', text: 'Gha-nsift l-khedma', isCorrect: false },
            { id: 'o2', text: 'Tfehemna 3la l-khedma', isCorrect: true },
            { id: 'o3', text: '3ndi l-khedma', isCorrect: false }
          ],
          answer: 'o2'
        }
      },
      {
        id: 'chk_b2_8',
        type: 'exercise',
        exercise: {
          id: 'chk_b2_8_ex',
          type: 'mcq',
          prompt: { fr: 'S\'il n\'avait pas plu, nous serions sortis.', en: 'If it hadn\'t rained, we would have gone out.', es: 'Si no hubiera llovido, habríamos salido.', ar: 'لو لم تمطر، لكنا خرجنا.' },
          options: [
            { id: 'o1', text: 'Kon ma-kant-ch chta, kon khrejna', isCorrect: true },
            { id: 'o2', text: 'Ila ma-kant-ch chta, gha-nkhrejou', isCorrect: false },
            { id: 'o3', text: 'Kon ma-kant-ch chta, gha-nkhrejou', isCorrect: false }
          ],
          answer: 'o1'
        }
      },
      {
        id: 'chk_b2_9',
        type: 'exercise',
        exercise: {
          id: 'chk_b2_9_ex',
          type: 'mcq',
          prompt: { fr: 'Quel est l\'équivalent de "Petit à petit" ?', en: 'What is the equivalent of "Little by little"?', es: '¿Cuál es el equivalente de "Poco a poco"?', ar: 'ما هو مرادف "خطوة بخطوة"؟' },
          options: [
            { id: 'o1', text: 'Dqqa b dqqa', isCorrect: true },
            { id: 'o2', text: 'L-mregga bla melha', isCorrect: false },
            { id: 'o3', text: 'Li fate mate', isCorrect: false }
          ],
          answer: 'o1'
        }
      },
      {
        id: 'chk_b2_10',
        type: 'exercise',
        exercise: {
          id: 'chk_b2_10_ex',
          type: 'mcq',
          prompt: { fr: 'Ce film est ennuyeux (fade).', en: 'This movie is boring (bland).', es: 'Esta película es aburrida (insípida).', ar: 'هذا الفيلم ممل (بدون طعم).' },
          options: [
            { id: 'o1', text: 'Had l-film ki l-mregga bla melha', isCorrect: true },
            { id: 'o2', text: 'Had l-film mtefeq m3ak', isCorrect: false },
            { id: 'o3', text: 'Had l-film dqqa b dqqa', isCorrect: false }
          ],
          answer: 'o1'
        }
      }
    ]
  }
];
