import re

with open('src/data/module4.ts', 'r', encoding='utf-8') as f:
    text = f.read()

new_modaux = '''  {
    id: 'm4_l4_modaux',
    title: {
      fr: 'Les Modaux (Khas, Qedd, Bgha)',
      en: 'Modals (Khas, Qedd, Bgha)',
      es: 'Modales (Khas, Qedd, Bgha)',
      ar: '??????? ???????'
    },
    level: 4,
    description: {
      fr: 'Obligation (Khasni), Capacité (Qedd), Volonté (Bgha).',
      en: 'Obligation, Ability, Will.',
      es: 'Obligación, Capacidad, Voluntad.',
      ar: '????????? ??????? ???????.'
    },
    steps: [
      {
        id: 'm4_l4_s1',
        type: 'learning',
        content: {
          title: { fr: 'L\\'obligation (Khasni)', en: 'Obligation (Khasni)', es: 'Obligación (Khasni)', ar: '???????? (?????)' },
          description: { fr: 'Le verbe "devoir" (khass) se conjugue avec des pronoms objets : Khass-ni, khass-ek, khass-ou, khass-ha, khass-na, khass-koum, khass-houm. Le verbe qui suit est à l\\'inaccompli SANS "ka-".', en: 'Khass takes object pronouns. The following verb is imperfective WITHOUT "ka-".', es: 'Khass toma pronombres objeto. El verbo siguiente va sin "ka-".', ar: '????? "???" ???? ????? ???????. ????? ?????? ???? ?? ??????? ???? "??-".' },
          arabizi: 'Khassna nchoufou l-tbib.',
          arabic: '????? ????? ??????.',
          translation: { fr: "Nous devons voir le médecin.", en: "We must see the doctor.", es: "Debemos ver al médico.", ar: "??? ?? ??? ??????." }
        }
      },
      {
        id: 'm4_l4_s2',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l4_1',
          type: 'mcq',
          prompt: { fr: 'Traduisez : "Je dois partir"', en: 'Translate: "I must go"', es: 'Traduce: "Debo irme"', ar: '????: "??? ?? ????"' },
          options: [
            { id: 'o1', text: 'Khassni nemchi', isCorrect: true },
            { id: 'o2', text: 'Khassni ka-nmchi', isCorrect: false },
            { id: 'o3', text: 'Khass nemchi', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Khassni + verbe sans ka- (nemchi).', en: 'Khassni + verb without ka- (nemchi).', es: 'Khassni + verbo sin ka- (nemchi).', ar: '????? + ??? ???? ??-.' }
        }
      },
      {
        id: 'm4_l4_s3',
        type: 'learning',
        content: {
          title: { fr: 'La volonté (Bgha)', en: 'Will (Bgha)', es: 'Voluntad (Bgha)', ar: '??????? (???)' },
          description: { fr: 'Pour exprimer un souhait au présent, on utilise le verbe Bgha au PASSÉ ! Bghit (Je veux), Bghiti (Tu veux), Bgha (Il veut), Bghat (Elle veut).', en: 'To express a present wish, use Bgha in the PAST tense! Bghit (I want), Bghiti (You want).', es: 'Para expresar un deseo presente, ¡usa Bgha en PASADO! Bghit (Quiero), Bghiti (Quieres).', ar: '??????? ?? ???? ?? ??????? ?????? ????? ??? ?? ??????! ???? (????)? ????? (????).' },
          arabizi: 'Bghit nchreb qahwa.',
          arabic: '???? ???? ????.',
          translation: { fr: "Je voudrais boire un café.", en: "I would like to drink a coffee.", es: "Me gustaría beber un café.", ar: "???? ?? ???? ????." }
        }
      },
      {
        id: 'm4_l4_s4',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l4_2',
          type: 'mcq',
          prompt: { fr: 'Comment dire "Tu veux" ?', en: 'How to say "You want"?', es: '¿Cómo decir "Quieres"?', ar: '??? ???? "????"?' },
          options: [
            { id: 'o1', text: 'Ka-tbghi', isCorrect: false },
            { id: 'o2', text: 'Bghit', isCorrect: false },
            { id: 'o3', text: 'Bghiti', isCorrect: true }
          ],
          answer: 'o3',
          explanation: { fr: 'Bgha au passé pour "Tu" devient Bghiti.', en: 'Bgha in past for "You" is Bghiti.', es: 'Bgha en pasado para "Tú" es Bghiti.', ar: '"???" ?? ?????? ?? "???" ?? "?????".' }
        }
      },
      {
        id: 'm4_l4_s5',
        type: 'learning',
        content: {
          title: { fr: 'Capacité : Qedd vs Moumkin', en: 'Capacity: Qedd vs Moumkin', es: 'Capacidad: Qedd vs Moumkin', ar: '??????: ?? ?? ????' },
          description: { fr: 'Qedd indique une capacité physique/temporelle (Tqedd t3awenni ? = Peux-tu m\\'aider ?). Moumkin est invariable et indique une possibilité générale (Moumkin nchouf l-menu ?).', en: 'Qedd = physical capacity. Moumkin = general possibility.', es: 'Qedd = capacidad física. Moumkin = posibilidad general.', ar: '?? = ?????? ???????/???????. ???? = ??????? ????.' },
          arabizi: 'Moumkin nchouf l-menu ? Tqedd t3awenni 3afak ?',
          arabic: '???? ???? ??????? ???? ?????? ?????',
          translation: { fr: "Puis-je voir le menu ? Peux-tu m'aider s'il te plaît ?", en: "May I see the menu? Can you help me please?", es: "¿Puedo ver el menú? ¿Puedes ayudarme por favor?", ar: "?? ?????? ???? ???????? ?? ????? ??????? ?? ?????" }
        }
      },
      {
        id: 'm4_l4_s6',
        type: 'exercise',
        exercise: {
          id: 'ex_m4_l4_3',
          type: 'mcq',
          prompt: { fr: 'Pour demander poliment "Est-il possible de...", on dit :', en: 'To politely ask "Is it possible to...", we say:', es: 'Para preguntar cortésmente "¿Es posible...", decimos:', ar: '???? "?? ?? ??????..." ????:' },
          options: [
            { id: 'o1', text: 'Moumkin', isCorrect: true },
            { id: 'o2', text: 'Khass', isCorrect: false },
            { id: 'o3', text: 'Bghit', isCorrect: false }
          ],
          answer: 'o1',
          explanation: { fr: 'Moumkin = Est-il possible.', en: 'Moumkin = Is it possible.', es: 'Moumkin = ¿Es posible?', ar: '???? = ?? ?? ??????.' }
        }
      }
    ]
  },
  {
    id: 'm4_checkpoint_b1',
    title: {
      fr: 'Checkpoint B1',
      en: 'Checkpoint B1',
      es: 'Checkpoint B1',
      ar: '???? ????? B1'
    },
    level: 4,
    description: {
      fr: 'Validation du niveau B1 (Temps, Négation, Modaux).',
      en: 'Validation of B1 level.',
      es: 'Validación del nivel B1.',
      ar: '????? ????? B1.'
    },
    steps: [
      {
        id: 'chk_b1_1',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_1_ex',
          type: 'mcq',
          prompt: { fr: 'Hier, Fatima est allée au souk', en: 'Yesterday, Fatima went to the souk', es: 'Ayer, Fátima fue al zoco', ar: '???????? ???? ????? ??? ?????' },
          options: [
            { id: 'o1', text: 'Mcha', isCorrect: false },
            { id: 'o2', text: 'Mchat', isCorrect: true },
            { id: 'o3', text: 'Mchit', isCorrect: false }
          ],
          answer: 'o2'
        }
      },
      {
        id: 'chk_b1_2',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_2_ex',
          type: 'mcq',
          prompt: { fr: 'Ils ont écrit le message', en: 'They wrote the message', es: 'Escribieron el mensaje', ar: '????? ???????' },
          options: [
            { id: 'o1', text: 'Ketbat', isCorrect: false },
            { id: 'o2', text: 'Kteb', isCorrect: false },
            { id: 'o3', text: 'Ketbou', isCorrect: true }
          ],
          answer: 'o3'
        }
      },
      {
        id: 'chk_b1_3',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_3_ex',
          type: 'mcq',
          prompt: { fr: 'Tu bois (à une femme) du thé chaque matin', en: 'You (f) drink tea every morning', es: 'Bebes (a una mujer) té cada mañana', ar: '???? ?????? ????? ?? ????' },
          options: [
            { id: 'o1', text: 'Ka-tchrebi', isCorrect: true },
            { id: 'o2', text: 'Ka-tchreb', isCorrect: false },
            { id: 'o3', text: 'Chrebti', isCorrect: false }
          ],
          answer: 'o1'
        }
      },
      {
        id: 'chk_b1_4',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_4_ex',
          type: 'mcq',
          prompt: { fr: 'Nous habitons à Fès', en: 'We live in Fez', es: 'Vivimos en Fez', ar: '??? ???? ?? ???' },
          options: [
            { id: 'o1', text: 'Ka-nsoknou', isCorrect: true },
            { id: 'o2', text: 'Ka-nskon', isCorrect: false },
            { id: 'o3', text: 'Skenna', isCorrect: false }
          ],
          answer: 'o1'
        }
      },
      {
        id: 'chk_b1_5',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_5_ex',
          type: 'mcq',
          prompt: { fr: 'Demain, nous voyagerons', en: 'Tomorrow, we will travel', es: 'Mañana, viajaremos', ar: '???? ??????' },
          options: [
            { id: 'o1', text: 'Gha-ka-nsafrou', isCorrect: false },
            { id: 'o2', text: 'Safrou', isCorrect: false },
            { id: 'o3', text: 'Gha-nsafrou', isCorrect: true }
          ],
          answer: 'o3'
        }
      },
      {
        id: 'chk_b1_6',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_6_ex',
          type: 'mcq',
          prompt: { fr: 'Je n\\'ai pas compris', en: 'I didn\\'t understand', es: 'No entendí', ar: '?? ????' },
          options: [
            { id: 'o1', text: 'Ma-ka-nfhem-ch', isCorrect: false },
            { id: 'o2', text: 'Ma-fhemt-ch', isCorrect: true },
            { id: 'o3', text: 'Machi fhemt', isCorrect: false }
          ],
          answer: 'o2'
        }
      },
      {
        id: 'chk_b1_7',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_7_ex',
          type: 'mcq',
          prompt: { fr: 'Il ne mange pas de viande', en: 'He doesn\\'t eat meat', es: 'Él no come carne', ar: '?? ?? ???? ?????' },
          options: [
            { id: 'o1', text: 'Ma-kla-ch', isCorrect: false },
            { id: 'o2', text: 'Machi yakol', isCorrect: false },
            { id: 'o3', text: 'Ma-ka-yakol-ch', isCorrect: true }
          ],
          answer: 'o3'
        }
      },
      {
        id: 'chk_b1_8',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_8_ex',
          type: 'mcq',
          prompt: { fr: 'Ce n\\'est pas cher', en: 'It\\'s not expensive', es: 'No es caro', ar: '??? ??? ?????' },
          options: [
            { id: 'o1', text: 'Ma-ghali-ch', isCorrect: false },
            { id: 'o2', text: 'Ma-ka-ghalich', isCorrect: false },
            { id: 'o3', text: 'Machi ghali', isCorrect: true }
          ],
          answer: 'o3'
        }
      },
      {
        id: 'chk_b1_9',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_9_ex',
          type: 'mcq',
          prompt: { fr: 'Nous devons partir maintenant', en: 'We must leave now', es: 'Debemos irnos ahora', ar: '??? ?? ????? ????' },
          options: [
            { id: 'o1', text: 'Khassna nemchiw', isCorrect: true },
            { id: 'o2', text: 'Khassni nemchi', isCorrect: false },
            { id: 'o3', text: 'Ka-nkhassou', isCorrect: false }
          ],
          answer: 'o1'
        }
      },
      {
        id: 'chk_b1_10',
        type: 'exercise',
        exercise: {
          id: 'chk_b1_10_ex',
          type: 'mcq',
          prompt: { fr: 'Peux-tu m\\'aider s\\'il te plaît ?', en: 'Can you help me please?', es: '¿Puedes ayudarme por favor?', ar: '?? ????? ??????? ?? ?????' },
          options: [
            { id: 'o1', text: 'Khassni n3awnek', isCorrect: false },
            { id: 'o2', text: 'Bghit t3awenni', isCorrect: false },
            { id: 'o3', text: 'Tqedd t3awenni 3afak ?', isCorrect: true }
          ],
          answer: 'o3'
        }
      }
    ]
  }
];'''

idx = text.find(\"  {\\n    id: 'm4_l4_modaux',\")
if idx != -1:
    final = text[:idx] + new_modaux
    with open('src/data/module4.ts', 'w', encoding='utf-8') as f:
        f.write(final)
    print('Success')
else:
    print('Not found')
