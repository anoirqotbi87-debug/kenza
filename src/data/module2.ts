import { Lesson } from '../types/curriculum';
import { lessonCafe } from './lessons/lesson-cafe';
import { lessonTaxi } from './lessons/lesson-taxi';

/**
 * Module 2 — Survie Quotidienne.
 *
 * Deux leçons de roleplay (café, taxi) puis la leçon de négociation du souk,
 * qui donne les clés théoriques du marchandage avant que le scénario `soukFes`
 * ne les mette en pratique.
 */
export const module2Lessons: Lesson[] = [
  lessonCafe,
  lessonTaxi,
  {
    id: 'l_module2_souk_1',
    title: { fr: 'Au Souk', en: 'At the Souk', es: 'En el Zoco', ar: 'في السوق' },
    level: 2,
    description: {
      fr: 'Négociez les prix au marché : demander, objecter, proposer, conclure.',
      en: 'Negotiate prices at the market: ask, object, offer, close.',
      es: 'Negocia los precios en el mercado: preguntar, objetar, proponer, cerrar.',
      ar: 'تفاوض على الأسعار في السوق: اسأل، اعترض، اقترح، اتفق.',
    },
    steps: [
      {
        id: 'm2_l3_s1',
        type: 'learning',
        content: {
          title: { fr: 'Demander le prix', en: 'Asking the price', es: 'Preguntar el precio', ar: 'السؤال عن الثمن' },
          description: {
            fr: 'La question qui ouvre toute négociation.',
            en: 'The question that opens every negotiation.',
            es: 'La pregunta que abre toda negociación.',
            ar: 'السؤال الذي يفتح كل تفاوض.',
          },
          arabizi: 'Bch7al hada ? Bch7al hadi ?',
          arabic: 'بْشْحَالْ هَادَا؟ بْشْحَالْ هَادْيِ؟',
          translation: {
            fr: 'Combien coûte celui-ci ? Combien coûte celle-ci ?',
            en: 'How much is this one (m) ? How much is this one (f) ?',
            es: '¿Cuánto cuesta este? ¿Cuánto cuesta esta?',
            ar: 'بكم هذا؟ بكم هذه؟',
          },
          culturalNote: {
            fr: '« Hada » pour un objet masculin, « hadi » pour un objet féminin. On désigne l\'objet du doigt : au souk, c\'est parfaitement normal.',
            en: '"Hada" for a masculine object, "hadi" for a feminine one. You point at the item — perfectly normal at the souk.',
            es: '«Hada» para un objeto masculino, «hadi» para uno femenino. Se señala el objeto: es normal en el zoco.',
            ar: '«هادا» للمذكر و«هادي» للمؤنث. الإشارة إلى السلعة عادية في السوق.',
          },
        },
      },
  {
        id: 'm2_souk_tip_negociation',
        type: 'culture_tip',
        cultureTip: {
          title: 'Marchander, un jeu respectueux',
          badge: '🇳🇦 L’art du souk',
          content: 'Au souk, le prix affiché n’est qu’un point de départ. On marchande avec le sourire, jamais avec agressivité. La danse est codée : on s’exclame (« L-la !»(, on menace poliment de partir(« Bslama »(, et la poignée de main finale scelle l’accord. Refuser de marchander est perçu comme une impolitesse.',
          expressions: [
            { darija: 'Bch7al hada ?', arabicWithTashkeel: 'بْشْحَالْ هَادَا؟', french: 'Combien ça coûte ?' },
            { darija: 'L-la, ghali bzzaf.', arabicWithTashkeel: 'لَّا، غَالِي بْزَّافْ', french: 'Non, c’est trop cher.' },
            { darija: 'Bslama !', arabicWithTashkeel: 'بْسْلَامَةْ', french: 'Au revoir(menace polie de partir(' },
          ],
        },
      },
      {
        id: 'm2_l3_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m2_l3_1',
          type: 'mcq',
          prompt: {
            fr: 'Quelle phrase demande le prix d\'un objet ?',
            en: 'Which phrase asks the price of an item?',
            es: '¿Qué frase pregunta el precio de un objeto?',
            ar: 'أي عبارة تسأل عن ثمن سلعة؟',
          },
          options: [
            { id: 'o1', text: 'Bch7al hada ?', isCorrect: true },
            { id: 'o2', text: 'Fin hada ?', isCorrect: false },
            { id: 'o3', text: 'Chkoun hada ?', isCorrect: false },
          ],
          answer: 'o1',
          explanation: {
            fr: '« Bch7al » = combien. « Fin » = où, « chkoun » = qui : deux questions différentes.',
            en: '"Bch7al" = how much. "Fin" = where, "chkoun" = who: two different questions.',
            es: '«Bch7al» = cuánto. «Fin» = dónde, «chkoun» = quién.',
            ar: '«بشحال» = كم. «فين» = أين، «شكون» = من.',
          },
        },
      },
      {
        id: 'm2_l3_s3',
        type: 'learning',
        content: {
          title: { fr: 'L\'objection', en: 'The objection', es: 'La objeción', ar: 'الاعتراض' },
          description: {
            fr: 'Le réflexe attendu face à un premier prix.',
            en: 'The expected reflex to a first price.',
            es: 'El reflejo esperado ante un primer precio.',
            ar: 'الرد المعتاد على الثمن الأول.',
          },
          arabizi: 'Ghali bezzaf !',
          arabic: 'غَالِيْ بْزَّافْ!',
          translation: {
            fr: 'C\'est trop cher !',
            en: 'That is too expensive !',
            es: '¡Es demasiado caro!',
            ar: 'غالي جداً!',
          },
          culturalNote: {
            fr: 'Se plaindre du prix n\'est pas impoli : c\'est le début attendu de la négociation. Le vendeur ne s\'en offusque pas, il entre dans le jeu. Le premier prix n\'est jamais le prix réel.',
            en: 'Complaining about the price is not rude: it is the expected opening move. The seller is not offended, he plays along. The first price is never the real price.',
            es: 'Quejarse del precio no es grosero: es la apertura esperada. El vendedor no se ofende.',
            ar: 'التذمر من الثمن ليس وقاحة بل بداية التفاوض. الثمن الأول ليس الثمن الحقيقي.',
          },
        },
      },
      {
        id: 'm2_l3_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m2_l3_2',
          type: 'fill-blank',
          prompt: {
            fr: 'Complétez : « C\'est trop cher ! »',
            en: 'Complete: "That is too expensive!"',
            es: 'Completa: "¡Es demasiado caro!"',
            ar: 'أكمل: «غالي ___!»',
          },
          sentenceTemplate: 'Ghali ___ !',
          options: [
            { id: 'opt1', text: 'bezzaf', isCorrect: true },
            { id: 'opt2', text: 'chwiya', isCorrect: false },
            { id: 'opt3', text: 'mezyan', isCorrect: false },
          ],
          answer: 'opt1',
          explanation: {
            fr: '« Bezzaf » = beaucoup, trop. « Chwiya » = un peu, « mezyan » = bien.',
            en: '"Bezzaf" = a lot, too much. "Chwiya" = a little, "mezyan" = good.',
            es: '«Bezzaf» = mucho, demasiado. «Chwiya» = un poco.',
            ar: '«بزاف» = كثير. «شويا» = قليل.',
          },
        },
      },
      {
        id: 'm2_l3_s5',
        type: 'learning',
        content: {
          title: { fr: 'Négocier', en: 'Negotiating', es: 'Negociar', ar: 'التفاوض' },
          description: {
            fr: 'Demander une baisse, puis sonder le dernier prix.',
            en: 'Ask for a reduction, then probe the final price.',
            es: 'Pedir una rebaja y tantear el precio final.',
            ar: 'اطلب تخفيضاً ثم اسأل عن الثمن الأخير.',
          },
          arabizi: 'Naqass chwiya 3afak. Akhir taman dyalek ?',
          arabic: 'نْقَصْ شْوِيَا عَفَاكْ. آخِرْ تَمَنْ دْيَالِكْ؟',
          translation: {
            fr: 'Baisse un peu s\'il te plaît. C\'est ton dernier prix ?',
            en: 'Lower it a bit please. Is that your final price ?',
            es: 'Baja un poco por favor. ¿Es tu último precio?',
            ar: 'نقص قليلاً من فضلك. هل هذا آخر ثمن لديك؟',
          },
          culturalNote: {
            fr: '« Naqass » (baisse) est adouci par « chwiya » (un peu) et « 3afak ». « Akhir taman dyalek ? » met le vendeur face à sa limite : la réponse l\'engage, il ne peut plus reculer sans perdre la face.',
            en: '"Naqass" (lower) is softened by "chwiya" (a bit) and "3afak". "Akhir taman dyalek ?" pushes the seller to his limit: his answer commits him.',
            es: '«Naqass» se suaviza con «chwiya» y «3afak». «Akhir taman dyalek?» lleva al vendedor a su límite.',
            ar: '«نقص» تُلطَّف بـ«شويا» و«عفاك». «آخر تمن ديالك؟» تضع البائع أمام حده.',
          },
        },
      },
      {
        id: 'm2_l3_s6',
        type: 'exercise',
        exercise: {
          id: 'ex_m2_l3_3',
          type: 'scramble',
          prompt: {
            fr: 'Reconstituez : « Baisse un peu s\'il te plaît »',
            en: 'Reorder: "Lower it a bit please"',
            es: 'Reconstruye: "Baja un poco por favor"',
            ar: 'أعد الترتيب: «نقص شويا عفاك»',
          },
          options: [
            { id: 'word1', text: 'chwiya', isCorrect: true },
            { id: 'word2', text: 'Naqass', isCorrect: true },
            { id: 'word3', text: '3afak', isCorrect: true },
          ],
          answer: ['word2', 'word1', 'word3'],
          explanation: {
            fr: 'Le verbe d\'abord (Naqass), puis la mesure (chwiya), et « 3afak » en fin de phrase.',
            en: 'The verb first (Naqass), then the amount (chwiya), and "3afak" at the end.',
            es: 'Primero el verbo (Naqass), luego la medida (chwiya), y «3afak» al final.',
            ar: 'الفعل أولاً ثم المقدار ثم «عفاك» في النهاية.',
          },
        },
      },
      {
        id: 'm2_l3_s7',
        type: 'exercise',
        exercise: {
          id: 'ex_m2_l3_4',
          type: 'matching',
          prompt: {
            fr: 'Reliez chaque mot du souk à sa traduction :',
            en: 'Match each souk word to its translation:',
            es: 'Relaciona cada palabra del zoco con su traducción:',
            ar: 'اربط كل كلمة من السوق بترجمتها:',
          },
          pairs: [
            { id: 'p1', left: { text: 'l-berrad' }, right: { text: { fr: 'La théière', en: 'The teapot', es: 'La tetera', ar: 'البراد' } } },
            { id: 'p2', left: { text: 'n-n7as' }, right: { text: { fr: 'Le cuivre', en: 'Copper', es: 'El cobre', ar: 'النحاس' } } },
            { id: 'p3', left: { text: 'derhem' }, right: { text: { fr: 'Le dirham', en: 'The dirham', es: 'El dirham', ar: 'الدرهم' } } },
            { id: 'p4', left: { text: 'mya w khemsin' }, right: { text: { fr: 'Cent cinquante', en: 'One hundred and fifty', es: 'Ciento cincuenta', ar: 'مية وخمسين' } } },
          ],
          answer: {},
          explanation: {
            fr: 'Le souk de Fès est réputé pour le cuivre (« n7as ») et ses théières (« berrad ») travaillées à la main.',
            en: 'The souk of Fès is famous for copper ("n7as") and its hand-worked teapots ("berrad").',
            es: 'El zoco de Fez es famoso por el cobre («n7as») y sus teteras («berrad»).',
            ar: 'سوق فاس مشهور بالنحاس والبرادات المصنوعة يدوياً.',
          },
        },
      },
      {
        id: 'm2_l3_s8',
        type: 'learning',
        content: {
          title: { fr: 'Valider ou temporiser', en: 'Closing or stalling', es: 'Cerrar o aplazar', ar: 'الاتفاق أو التأجيل' },
          description: {
            fr: 'Deux issues à la négociation : conclure, ou partir pour revenir.',
            en: 'Two outcomes: close the deal, or leave and come back.',
            es: 'Dos salidas: cerrar el trato o irse y volver.',
            ar: 'نتيجتان: الاتفاق أو المغادرة والعودة.',
          },
          arabizi: 'Wakha. Nchouf ou n-rje3.',
          arabic: 'وَاْخَا. نْشُوفْ وْ نْرْجَعْ.',
          translation: {
            fr: 'D\'accord. Je regarde et je reviens.',
            en: 'Alright. I will look around and come back.',
            es: 'De acuerdo. Miro y vuelvo.',
            ar: 'حسناً. سأنظر وأعود.',
          },
          culturalNote: {
            fr: '« Wakha » scelle l\'accord. « Nchouf ou n-rje3 » est une temporisation polie : partir est une vraie technique. Si le vendeur tient à la vente, il vous rappellera — souvent avec un meilleur prix.',
            en: '"Wakha" seals the deal. "Nchouf ou n-rje3" is a polite stall: walking away is a real technique. If the seller wants the sale, he will call you back — often with a better price.',
            es: '«Wakha» sella el acuerdo. «Nchouf ou n-rje3» es una dilación cortés: irse es una técnica real.',
            ar: '«واخا» تحسم الاتفاق. «نشوف و نرجع» تأجيل مهذب، والمغادرة تقنية حقيقية.',
          },
        },
      },
      {
        id: 'm2_l3_s9',
        type: 'exercise',
        exercise: {
          id: 'ex_dialogue_souk',
          type: 'dialogue',
          prompt: {
            fr: 'Négociez le prix de la théière',
            en: 'Negotiate the price of the teapot',
            es: 'Negocia el precio de la tetera',
            ar: 'تفاوض على ثمن البراد',
          },
          dialogueContext: {
            fr: 'Négociation d\'une théière en cuivre au souk de Fès',
            en: 'Negotiating a copper teapot at the souk of Fès',
            es: 'Negociación de una tetera de cobre en el zoco de Fez',
            ar: 'التفاوض على براد نحاسي في سوق فاس',
          },
          npcStartLine: {
            arabizi: 'Mre7ba bik a khoya ! Dkhol tferrej, kolchi zwin.',
            arabic: 'مَرْحْبَا بِيك أَ خُويَا! دْخُلْ تْفَرَّجْ، كُلْشِي زْوِينْ.',
            translation: {
              fr: 'Bienvenue mon frère ! Entre regarder, tout est beau.',
              en: 'Welcome my brother! Come in and look, everything is beautiful.',
              es: '¡Bienvenido hermano! Entra a mirar, todo es bonito.',
              ar: 'مرحبا بك يا أخي! ادخل وشاهد، كل شيء جميل.',
            },
          },
          answer: '',
          explanation: '',
          dialogueChoices: [
            {
              id: 'c1',
              text: {
                arabizi: 'Bch7al had l-berrad d-n-n7as 3afak ?',
                arabic: 'بْشْحَالْ هَادْ البَرَّادْ دْ النْحَاسْ عَفَاكْ؟',
                translation: {
                  fr: 'Combien coûte cette théière en cuivre s\'il vous plaît ?',
                  en: 'How much is this copper teapot please?',
                  es: '¿Cuánto cuesta esta tetera de cobre por favor?',
                  ar: 'بكم هذا البراد النحاسي من فضلك؟',
                },
              },
              isOptimal: true,
              nextNpcLine: 'Hadak n7as 7orr d-Fas, kan7esbo b-myatayn derhem.',
              feedback: {
                fr: 'Bien joué : vous avez demandé le prix sans vous engager. La négociation peut commencer.',
                en: 'Well done: you asked the price without committing. The negotiation can start.',
                es: 'Bien hecho: preguntaste el precio sin comprometerte.',
                ar: 'أحسنت: سألت عن الثمن دون التزام.',
              },
            },
            {
              id: 'c2',
              text: {
                arabizi: 'Ghali bezzaf !',
                arabic: 'غَالِيْ بْزَّافْ!',
                translation: {
                  fr: 'C\'est trop cher !',
                  en: 'That is too expensive!',
                  es: '¡Es demasiado caro!',
                  ar: 'غالي جداً!',
                },
              },
              isOptimal: false,
              nextNpcLine: 'Chno ghali ? Ma 3reftich taman baqi !',
              feedback: {
                fr: 'Trop tôt : vous n\'avez pas encore entendu le prix. On objecte après l\'annonce, pas avant.',
                en: 'Too early: you have not heard the price yet. You object after the quote, not before.',
                es: 'Demasiado pronto: aún no has oído el precio.',
                ar: 'مبكر جداً: لم تسمع الثمن بعد.',
              },
            },
            {
              id: 'c3',
              text: {
                arabizi: 'Ma bghitch.',
                arabic: 'مَا بْغِيتْشْ.',
                translation: {
                  fr: 'Je ne veux pas.',
                  en: 'I do not want it.',
                  es: 'No quiero.',
                  ar: 'لا أريد.',
                },
              },
              isOptimal: false,
              nextNpcLine: 'Wakha, bslama.',
              feedback: {
                fr: 'Refuser sans négocier ferme la porte. Ici, on veut faire baisser le prix, pas renoncer.',
                en: 'Refusing without negotiating closes the door. Here you want a lower price, not to give up.',
                es: 'Rechazar sin negociar cierra la puerta.',
                ar: 'الرفض دون تفاوض يغلق الباب.',
              },
            },
            {
              id: 'c4',
              text: {
                arabizi: 'Naqass chwiya 3afak, akhir taman dyalek ?',
                arabic: 'نْقَصْ شْوِيَا عَفَاكْ، آخِرْ تَمَنْ دْيَالِكْ؟',
                translation: {
                  fr: 'Baisse un peu s\'il te plaît, c\'est ton dernier prix ?',
                  en: 'Lower it a bit please, is that your final price?',
                  es: 'Baja un poco por favor, ¿es tu último precio?',
                  ar: 'نقص قليلاً من فضلك، هل هذا آخر ثمن لديك؟',
                },
              },
              isOptimal: true,
              nextNpcLine: 'Safi, b-r-rba7, nkhellih lik b-mya w khemsin 7it 3jebtini.',
              feedback: {
                fr: 'Exactement : demande de baisse adoucie, puis question sur le dernier prix. Le vendeur cède.',
                en: 'Exactly: a softened request for a reduction, then the final-price question. The seller gives in.',
                es: 'Exacto: petición suavizada y luego el precio final. El vendedor cede.',
                ar: 'بالضبط: طلب تخفيض ملطّف ثم سؤال عن الثمن الأخير.',
              },
            },
          ],
        },
      },
      {
        id: 'm2_l3_s10',
        type: 'exercise',
        exercise: {
          id: 'ex_m2_l3_5',
          type: 'mcq',
          prompt: {
            fr: 'Le vendeur accepte. Que dit-il ?',
            en: 'The seller agrees. What does he say?',
            es: 'El vendedor acepta. ¿Qué dice?',
            ar: 'البائع يقبل. ماذا يقول؟',
          },
          options: [
            { id: 'o1', text: 'Safi, b-r-rba7.', isCorrect: true },
            { id: 'o2', text: 'Bch7al hada ?', isCorrect: false },
            { id: 'o3', text: 'Fin jat l-medina ?', isCorrect: false },
          ],
          answer: 'o1',
          explanation: {
            fr: '« Safi, b-r-rba7 » = d\'accord, c\'est une affaire. Le vendeur annonce qu\'il conclut, même à petit bénéfice.',
            en: '"Safi, b-r-rba7" = alright, it is a deal. The seller closes, even on a thin margin.',
            es: '«Safi, b-r-rba7» = de acuerdo, es un trato.',
            ar: '«صافي، بالرباح» = حسناً، إنها صفقة.',
          },
        },
      },
      {
        id: 'm2_boss_challenge',
        type: 'exercise',
        exercise: {
          id: 'ex_m2_boss_hassan',
          type: 'roleplay_challenge',
          prompt: {
            fr: 'Épreuve finale : négociez une paire de babouches avec Hassan au Souk de Fès.',
            en: 'Final challenge: negotiate a pair of babouches with Hassan at the souk of Fès.',
            es: 'Desafío final: negocia un par de babuchas con Hassan en el zoco de Fez.',
            ar: 'التحدي الختامي: تفاوض على زوج من البلغة مع حسن في سوق فاس.',
          },
          dialogueContext: {
            fr: 'Vous êtes devant l\'étal de Hassan, au Souk de Fès.',
            en: 'You stand in front of Hassan\'s stall, at the souk of Fès.',
            es: 'Estás delante del puesto de Hassan, en el zoco de Fez.',
            ar: 'أنت أمام دكان حسن، في سوق فاس.',
          },
          npcStartLine: {
            arabizi: 'Mre7ba bik a khoya ! 3ndna babouj d-l-jeld d-Fas, kolchi mzyan.',
            arabic: 'مَرْحْبَا بِيك أَ خُويَا ! عَنْدْنَا بَابُوجْ دْ الجِلْدْ دْ فَاسْ، كُلْشِي مْزْيَانْ.',
            translation: {
              fr: 'Bienvenue mon frère ! Nous avons des babouches en cuir de Fès, tout est beau.',
              en: 'Welcome my brother! We have Fès leather babouches, everything is beautiful.',
              es: '¡Bienvenido hermano! Tenemos babuchas de cuero de Fez, todo es bonito.',
              ar: 'مرحبا بك يا أخي! عندنا بلغة من جلد فاس، كل شيء جميل.',
            },
          },
          answer: '',
          explanation: {
            fr: 'Vous demandez le prix avant de vous engager, puis vous faites baisser sans braquer le vendeur. Ces mêmes réflexes se jouent ensuite en dialogue ouvert avec Hassan.',
            en: 'You ask the price before committing, then lower it without alienating the seller. The same reflexes then play out in open dialogue with Hassan.',
            es: 'Pides el precio antes de comprometerte y luego lo bajas sin ofender al vendedor.',
            ar: 'تسأل عن الثمن قبل الالتزام ثم تخفضه دون إحراج البائع.',
          },
          dialogueChoices: [
            {
              id: 'boss_c1',
              text: {
                arabizi: 'Bch7al had l-babouj 3afak ?',
                arabic: 'بْشْحَالْ هَادْ البَابُوجْ عَفَاكْ ؟',
                translation: {
                  fr: 'Combien coûtent ces babouches s\'il vous plaît ?',
                  en: 'How much are these babouches please?',
                  es: '¿Cuánto cuestan estas babuchas por favor?',
                  ar: 'بكم هذه البلغة من فضلك؟',
                },
              },
              isOptimal: true,
              nextNpcLine: 'Hadou jeld 7orr, kan7esbo b-tlata mya derhem.',
              feedback: {
                fr: 'Bien joué : vous demandez le prix sans vous engager. La négociation peut commencer.',
                en: 'Well done: you ask the price without committing. The negotiation can start.',
                es: 'Bien hecho: preguntas el precio sin comprometerte.',
                ar: 'أحسنت: سألت عن الثمن دون التزام.',
              },
            },
            {
              id: 'boss_c2',
              text: {
                arabizi: 'Ghali bezzaf !',
                arabic: 'غَالِيْ بْزَّافْ !',
                translation: {
                  fr: 'C\'est trop cher !',
                  en: 'That is too expensive!',
                  es: '¡Es demasiado caro!',
                  ar: 'غالي جداً!',
                },
              },
              isOptimal: false,
              nextNpcLine: 'Chno ghali ? Ma sme3tich taman baqi !',
              feedback: {
                fr: 'Trop tôt : vous n\'avez pas encore entendu le prix. On objecte après l\'annonce, pas avant.',
                en: 'Too early: you have not heard the price yet. You object after the quote, not before.',
                es: 'Demasiado pronto: aún no has oído el precio.',
                ar: 'مبكر جداً: لم تسمع الثمن بعد.',
              },
            },
            {
              id: 'boss_c3',
              text: {
                arabizi: 'Naqass chwiya 3afak, akhir taman dyalek ?',
                arabic: 'نْقَصْ شْوِيَا عَفَاكْ، آخِرْ تَمَنْ دْيَالِكْ ؟',
                translation: {
                  fr: 'Baisse un peu s\'il te plaît, c\'est ton dernier prix ?',
                  en: 'Lower it a bit please, is that your final price?',
                  es: 'Baja un poco por favor, ¿es tu último precio?',
                  ar: 'نقص قليلاً من فضلك، هل هذا آخر ثمن لديك؟',
                },
              },
              isOptimal: true,
              nextNpcLine: 'Safi, nkhellih lik b-myatayn w khemsin, 3la rass w l-3ayn !',
              feedback: {
                fr: 'Exactement : demande de baisse adoucie, puis question sur le dernier prix. Hassan cède.',
                en: 'Exactly: a softened request for a reduction, then the final-price question. Hassan gives in.',
                es: 'Exacto: petición suavizada y luego el precio final.',
                ar: 'بالضبط: طلب تخفيض ملطّف ثم سؤال عن الثمن الأخير.',
              },
            },
            {
              id: 'boss_c4',
              text: {
                arabizi: 'Ma bghitch, bslama.',
                arabic: 'مَا بْغِيتْشْ، بْسْلَامَةْ.',
                translation: {
                  fr: 'Je ne veux pas, au revoir.',
                  en: 'I do not want it, goodbye.',
                  es: 'No quiero, adiós.',
                  ar: 'لا أريد، وداعاً.',
                },
              },
              isOptimal: false,
              nextNpcLine: 'Wakha a khoya, bslama.',
              feedback: {
                fr: 'Refuser sans négocier ferme la porte. Ici, on veut faire baisser le prix, pas renoncer.',
                en: 'Refusing without negotiating closes the door. Here you want a lower price, not to give up.',
                es: 'Rechazar sin negociar cierra la puerta.',
                ar: 'الرفض دون تفاوض يغلق الباب.',
              },
            },
          ],
        },
      },
  {
        id: 'm2_souk_tip_hospitalite',
        type: 'culture_tip',
        cultureTip: {
          title: 'L’hospitalité et le refus doux',
          badge: '🇳🇦 Code social — gestes',
          content: 'Quand un Marocain t’offre quelque chose — thé, repas, service — refuser brutalement est perçu comme une offense. On décline avec la main posée sur le cœur, en disant « Allah ybarek fik »(que Dieu te bénisse( ou « La, shokran, bzzaf de l’honneur ». Ce geste de la main sur le cœur accompagne aussi le « merci » sincère.',
          expressions: [
            { darija: 'Allah ybarek fik', arabicWithTashkeel: 'اللّٰه يْبَارِكْ فِيكْ', french: 'Que Dieu te bénisse' },
            { darija: 'Bzzaf de l’honneur', arabicWithTashkeel: 'بْزَّافْ دْ لُونُورْ', french: 'C’est trop d’honneur(refus poli(' },
            { darija: 'La, shokran', arabicWithTashkeel: 'لَا، شُكْرًا', french: 'Non merci(poli(' },
          ],
        },
      },

    ],
  },
];
