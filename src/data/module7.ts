import { Lesson } from '../types/curriculum';

export const module7Lessons: Lesson[] = [
  {
    id: 'l_mod7_1',
    title: { fr: 'Raconter au passé', en: 'Storytelling in the Past', es: 'Contar historias en pasado', ar: 'السرد في الماضي' },
    level: 1,
    description: { fr: 'F wa7ed n-nhar..., Men be3d...', en: 'Once upon a time..., After that...', es: 'Érase una vez..., Después de eso...', ar: 'فواحد النهار...، من بعد...' },
    steps: [
      {
        id: 's1_learn_connectors',
        type: 'learning',
        content: {
          title: { fr: 'Les Connecteurs Logiques', en: 'Logical Connectors', es: 'Conectores Lógicos', ar: 'الروابط المنطقية' },
          description: { 
            fr: 'Pour raconter une histoire, utilisez : F wa7ed n-nhar (Un jour), F l-lowwel (Au début), Men be3d (Ensuite), Melli / Fash (Lorsque), et F l-lekher (À la fin).', 
            en: 'To tell a story, use: F wa7ed n-nhar (One day), F l-lowwel (At first), Men be3d (Then), Melli / Fash (When), and F l-lekher (In the end).', 
            es: 'Para contar una historia, usa: F wa7ed n-nhar (Un día), F l-lowwel (Al principio), Men be3d (Luego), Melli / Fash (Cuando) y F l-lekher (Al final).', 
            ar: 'لسرد قصة، استخدم: فواحد النهار (في يوم من الأيام)، فاللول (في البداية)، من بعد (ثم)، مللي / فاش (عندما)، وفي اللخر (في النهاية).' 
          },
          arabizi: 'F wa7ed n-nhar... Men be3d...',
          arabic: 'فْ وَاحْدْ النْهَارْ... مَنْ بَعْدْ...',
          translation: { fr: 'Un jour... Ensuite...', en: 'One day... Then...', es: 'Un día... Luego...', ar: 'في يوم ما... ثم...' },
          culturalNote: { fr: 'Les Marocains sont de grands conteurs (7layqia). Bien utiliser ces connecteurs rendra votre Darija très fluide.', en: 'Moroccans are great storytellers (7layqia). Using these connectors will make your Darija very fluent.', es: 'Los marroquíes son grandes narradores (7layqia). Usar estos conectores hará que tu Darija sea muy fluida.', ar: 'المغاربة رواة قصص رائعون. استخدام هذه الروابط سيجعل دارجتك سلسة جداً.' }
        }
      },
      {
        id: 's2_exercise_reorder',
        type: 'exercise',
        exercise: {
          id: 'ex_reorder_story',
          type: 'reorder',
          prompt: { fr: 'Reconstituez : "Au début j\'ai vu l\'endroit, et ensuite je suis allé à la maison."', en: 'Reorder: "At first I saw the place, and then I went to the house."', es: 'Reconstruye: "Al principio vi el lugar, y luego fui a la casa."', ar: 'أعد ترتيب: "في البداية رأيت المكان، ومن بعد ذهبت إلى المنزل."' },
          options: [
            { id: 'w1', text: 'F l-lowwel', isCorrect: true },
            { id: 'w2', text: 'chof-t', isCorrect: true },
            { id: 'w3', text: 'l-makan,', isCorrect: true },
            { id: 'w4', text: 'w', isCorrect: true },
            { id: 'w5', text: 'men be3d', isCorrect: true },
            { id: 'w6', text: 'mchi-t', isCorrect: true },
            { id: 'w7', text: 'l', isCorrect: true },
            { id: 'w8', text: 'd-dar', isCorrect: true }
          ],
          answer: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8'],
          explanation: { 
            fr: 'Excellente construction chronologique !', 
            en: 'Excellent chronological construction!', 
            es: '¡Excelente construcción cronológica!', 
            ar: 'بناء زمني ممتاز!' 
          }
        }
      },
      {
        id: 's3_exercise_mcq',
        type: 'exercise',
        exercise: {
          id: 'ex_mcq_melli',
          type: 'mcq',
          prompt: { fr: 'Comment dit-on "Lorsque je suis arrivé" ?', en: 'How do you say "When I arrived"?', es: '¿Cómo se dice "Cuando llegué"?', ar: 'كيف تقول "عندما وصلت"؟' },
          options: [
            { id: 'opt1', text: 'Melli wsel-t', isCorrect: true },
            { id: 'opt2', text: 'Men be3d wsel-t', isCorrect: false },
            { id: 'opt3', text: 'F l-lowwel wsel-t', isCorrect: false },
            { id: 'opt4', text: 'Wakha wsel-t', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: '"Melli" (ou "Fash") signifie "Lorsque/Quand".', 
            en: '"Melli" (or "Fash") means "When".', 
            es: '"Melli" (o "Fash") significa "Cuando".', 
            ar: '"مللي" (أو "فاش") تعني "عندما".' 
          }
        }
      },
      {
        id: 's4_learn_dialogue',
        type: 'learning',
        content: {
          title: { fr: 'Anecdote à Fès', en: 'Anecdote in Fes', es: 'Anécdota en Fez', ar: 'حكاية في فاس' },
          description: { 
            fr: 'Vous : "F wa7ed n-nhar, koun-t f l-medina dyal Fes. F l-lowwel, tleff-t f d-drouba... Melli swwel-t wa7ed s-siyed, na3t liya t-triq. F l-lekher, wsel-t b-khir!"\n\nAmi : "L-medina dyal Fes kbira bzzaf, 3adi t-tlef fiha!"', 
            en: 'You: "F wa7ed n-nhar, koun-t f l-medina dyal Fes. F l-lowwel, tleff-t f d-drouba... Melli swwel-t wa7ed s-siyed, na3t liya t-triq. F l-lekher, wsel-t b-khir!"\n\nFriend: "L-medina dyal Fes kbira bzzaf, 3adi t-tlef fiha!"', 
            es: 'Tú: "F wa7ed n-nhar, koun-t f l-medina dyal Fes. F l-lowwel, tleff-t f d-drouba... Melli swwel-t wa7ed s-siyed, na3t liya t-triq. F l-lekher, wsel-t b-khir!"\n\nAmigo: "L-medina dyal Fes kbira bzzaf, 3adi t-tlef fiha!"', 
            ar: 'أنت: "فواحد النهار، كنت فالمدينة ديال فاس. فاللول، تلفت فالدروبة... مللي سولت واحد السيد، نعت ليا الطريق. في اللخر، وصلت بخير!"\nصديق: "المدينة ديال فاس كبيرة بزاف، عادي تتلف فيها!"' 
          },
          arabizi: 'Melli swwel-t... F l-lekher wsel-t',
          arabic: 'مَلِّيْ سُولْتْ... فِيْ لْلَخَرْ وْصَلْتْ',
          translation: { fr: 'L\'art de raconter une histoire', en: 'The art of storytelling', es: 'El arte de contar historias', ar: 'فن سرد القصص' }
        }
      }
    ]
  },
  {
    id: 'l_mod7_2',
    title: { fr: 'Proverbes populaires', en: 'Popular Proverbs', es: 'Proverbios Populares', ar: 'أمثال شعبية' },
    level: 2,
    description: { fr: 'Lli fat mat, Drba b drba...', en: 'What is past is dead, blow by blow...', es: 'Lo pasado, pasado está...', ar: 'اللي فات مات، ضربة بضربة...' },
    steps: [
      {
        id: 's1_learn_proverbs',
        type: 'learning',
        content: {
          title: { fr: 'La Sagesse Populaire', en: 'Popular Wisdom', es: 'Sabiduría Popular', ar: 'الحكمة الشعبية' },
          description: { 
            fr: 'La Darija est riche en proverbes (mtal) :\n- "Lli fat mat" (Ce qui est passé est mort = Tourner la page)\n- "Drba b drba kat-bna d-dar" (Coup après coup se bâtit la maison = La patience paie)\n- "Zrbat matat" (La précipitation est morte = Rien ne sert de courir).', 
            en: 'Darija is rich in proverbs (mtal):\n- "Lli fat mat" (What is past is dead = Turn the page)\n- "Drba b drba kat-bna d-dar" (Blow by blow the house is built = Patience pays)\n- "Zrbat matat" (Haste is dead = No need to rush).', 
            es: 'La Darija es rica en proverbios (mtal):\n- "Lli fat mat" (Lo pasado ha muerto = Pasar página)\n- "Drba b drba kat-bna d-dar" (Golpe a golpe se construye la casa = La paciencia paga)\n- "Zrbat matat" (La prisa ha muerto = No hay necesidad de correr).', 
            ar: 'الدارجة غنية بالأمثال:\n- "اللي فات مات" (اطوِ الصفحة)\n- "ضربة بضربة كتبنى الدار" (الصبر مفتاح الفرج)\n- "الزربات ماتات" (في التأني السلامة).' 
          },
          arabizi: 'Lli fat mat / Zrbat matat',
          arabic: 'اللِّيْ فَاتْ مَاتْ / الزَّرْبَاتْ مَاتَاتْ',
          translation: { fr: 'Les classiques de la sagesse', en: 'Classics of wisdom', es: 'Clásicos de la sabiduría', ar: 'كلاسيكيات الحكمة' },
          culturalNote: { fr: 'Citer un proverbe au bon moment impressionnera toujours les Marocains et montre votre maîtrise du contexte culturel.', en: 'Quoting a proverb at the right time will always impress Moroccans and shows your mastery of the cultural context.', es: 'Citar un proverbio en el momento adecuado siempre impresionará a los marroquíes y demuestra tu dominio del contexto cultural.', ar: 'استشهادك بمثل في الوقت المناسب سيبهر المغاربة دائماً ويدل على فهمك للثقافة.' }
        }
      },
      {
        id: 's2_exercise_match',
        type: 'exercise',
        exercise: {
          id: 'ex_match_proverbs',
          type: 'matching',
          prompt: { fr: 'Associez chaque proverbe à son sens profond :', en: 'Match each proverb with its deep meaning:', es: 'Empareja cada proverbio con su significado profundo:', ar: 'اربط كل مثل بمعناه العميق:' },
          pairs: [
            { id: 'p1', left: { text: 'Lli fat mat' }, right: { text: { fr: 'Tourner la page', en: 'Turn the page', es: 'Pasar la página', ar: 'طوّي الصفحة' } } },
            { id: 'p2', left: { text: 'Drba b drba' }, right: { text: { fr: 'Patience et régularité', en: 'Patience and consistency', es: 'Paciencia y constancia', ar: 'الصبر والانتظام' } } },
            { id: 'p3', left: { text: 'Zrbat matat' }, right: { text: { fr: 'Rien ne sert de courir', en: 'No point in rushing', es: 'No sirve de nada correr', ar: 'لا فائدة من الاستعجال' } } }
          ],
          answer: "all",
          explanation: {
            fr: "Associez chaque proverbe marocain à son sens équivalent.",
            en: "Match each Moroccan proverb to its equivalent meaning.",
            es: "Relaciona cada proverbio marroquí con su significado equivalente.",
            ar: "طابق كل مثل مغربي مع معناه المناسب."
          }
        }
      },
      {
        id: 's3_exercise_fill',
        type: 'exercise',
        exercise: {
          id: 'ex_fill_mat',
          type: 'fill-blank',
          prompt: { fr: 'Complétez : "Lli fat ___"', en: 'Complete: "Lli fat ___"', es: 'Completa: "Lli fat ___"', ar: 'أكمل: "اللي فات ___"' },
          sentenceTemplate: 'Lli fat ___',
          options: [
            { id: 'opt1', text: 'mat', isCorrect: true },
            { id: 'opt2', text: 'zarba', isCorrect: false },
            { id: 'opt3', text: 'dar', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'Lli fat mat (Ce qui est passé est mort).', 
            en: 'Lli fat mat (What is past is dead).', 
            es: 'Lli fat mat (Lo pasado ha muerto).', 
            ar: 'اللي فات مات.' 
          }
        }
      },
      {
        id: 's4_exercise_mcq',
        type: 'exercise',
        exercise: {
          id: 'ex_mcq_drba',
          type: 'mcq',
          prompt: { fr: 'Ton ami stresse pour apprendre la Darija, quel proverbe lui dis-tu ?', en: 'Your friend is stressed about learning Darija, which proverb do you tell him?', es: 'Tu amigo está estresado por aprender Darija, ¿qué proverbio le dices?', ar: 'صديقك متوتر من تعلم الدارجة، أي مثل تقول له؟' },
          options: [
            { id: 'opt1', text: 'Drba b drba kat-bna d-dar', isCorrect: true },
            { id: 'opt2', text: 'Lli fat mat', isCorrect: false },
            { id: 'opt3', text: 'Zrbat matat', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: 'Coup par coup, la maison se construit. Cela lui rappelle que l\'apprentissage demande du temps et de la régularité.', 
            en: 'Blow by blow, the house is built. It reminds him that learning takes time and consistency.', 
            es: 'Golpe a golpe, se construye la casa. Le recuerda que el aprendizaje requiere tiempo y constancia.', 
            ar: 'ضربة بضربة كتبنى الدار. لتذكيره بأن التعلم يتطلب الوقت والمواظبة.' 
          }
        }
      }
    ]
  },
  {
    id: 'l_mod7_3',
    title: { fr: 'Variations régionales', en: 'Regional Variations', es: 'Variaciones Regionales', ar: 'اختلافات إقليمية' },
    level: 3,
    description: { fr: 'Parler de Fès, Casablanca et du Nord', en: 'Dialects of Fes, Casablanca and the North', es: 'Dialectos de Fez, Casablanca y el Norte', ar: 'لهجة فاس، الدار البيضاء والشمال' },
    steps: [
      {
        id: 's1_learn_regions',
        type: 'learning',
        content: {
          title: { fr: 'Les Accents du Maroc', en: 'Accents of Morocco', es: 'Acentos de Marruecos', ar: 'لهجات المغرب' },
          description: { 
            fr: 'Nord (Chamali) : Le "Qaf" est très net. On dit "3ayel/3ayla" (garçon/fille) et "Fayn machi?" (Où vas-tu?).\nCentre/Fès : Le "Qaf" se prononce souvent comme une Hamza (ex: "Qhwa" -> "Ahwa").\nChaouia/Casa : Le "Qaf" devient parfois "Gaf" (ex: "Qal" -> "Gal").', 
            en: 'North (Chamali): "Qaf" is very clear. They say "3ayel/3ayla" (boy/girl) and "Fayn machi?" (Where are you going?).\nCenter/Fes: "Qaf" is often pronounced like a Hamza ("Qhwa" -> "Ahwa").\nChaouia/Casa: "Qaf" sometimes becomes "Gaf" ("Qal" -> "Gal").', 
            es: 'Norte (Chamali): La "Qaf" es muy clara. Dicen "3ayel/3ayla" (chico/chica) y "Fayn machi?" (¿A dónde vas?).\nCentro/Fez: La "Qaf" a menudo se pronuncia como Hamza ("Qhwa" -> "Ahwa").\nChaouia/Casa: La "Qaf" a veces se convierte en "Gaf" ("Qal" -> "Gal").', 
            ar: 'الشمال (شمالي): القاف واضحة جداً. يقولون "عيل/عيلة" (ولد/بنت) و"فاين ماشي؟" (أين تذهب؟).\nالوسط/فاس: تُنطق القاف غالباً كهمزة ("قهوة" -> "أهوة").\nالشاوية/كازا: تصبح القاف أحياناً "گاف" ("قال" -> "گال").' 
          },
          arabizi: '3ayel (Nord) / Daba (Centre)',
          arabic: 'عَايَلْ / دَابَا',
          translation: { fr: 'Richesse des dialectes', en: 'Richness of dialects', es: 'Riqueza de dialectos', ar: 'غنى اللهجات' }
        }
      },
      {
        id: 's2_exercise_mcq',
        type: 'exercise',
        exercise: {
          id: 'ex_mcq_chamali',
          type: 'mcq',
          prompt: { fr: 'Lequel de ces mots est typiquement "Chamali" (du Nord) ?', en: 'Which of these words is typically "Chamali" (from the North)?', es: '¿Cuál de estas palabras es típicamente "Chamali" (del Norte)?', ar: 'أي من هذه الكلمات "شمالية" بامتياز؟' },
          options: [
            { id: 'opt1', text: '3ayla', isCorrect: true },
            { id: 'opt2', text: 'Daba', isCorrect: false },
            { id: 'opt3', text: 'Bzzaf', isCorrect: false }
          ],
          answer: 'opt1',
          explanation: { 
            fr: '"3ayla" veut dire "fille/jeune fille" au Nord de Tanger à Tétouan.', 
            en: '"3ayla" means "girl/young girl" in the North from Tangier to Tetouan.', 
            es: '"3ayla" significa "chica/joven" en el Norte, de Tánger a Tetuán.', 
            ar: '"عيلة" تعني "فتاة/شابة" في الشمال من طنجة إلى تطوان.' 
          }
        }
      },
      {
        id: 's3_learn_dialogue',
        type: 'learning',
        content: {
          title: { fr: 'Choc des cultures', en: 'Culture shock', es: 'Choque cultural', ar: 'صدمة ثقافية' },
          description: { 
            fr: 'Tangérois : "Fayn machi a l-3ayel ?" (Où vas-tu mon gars ?)\n\nCasawi : "Ghadi l d-dar a khoya, w nta fin ghadi ?" (Je vais à la maison mon frère, et toi où vas-tu ?)', 
            en: 'Tangier: "Fayn machi a l-3ayel?" (Where are you going man?)\n\nCasawi: "Ghadi l d-dar a khoya, w nta fin ghadi?" (I\'m going home bro, and you?)', 
            es: 'Tangerino: "¿Fayn machi a l-3ayel?" (¿A dónde vas, chico?)\n\nCasawi: "Ghadi l d-dar a khoya, w nta fin ghadi?" (Voy a casa hermano, ¿y tú?)', 
            ar: 'طنجاوي: "فاين ماشي أ العيل؟"\nكازاوي: "غادي للدار أخويا، ونتا فين غادي؟"' 
          },
          arabizi: 'Fayn machi? vs Fin ghadi?',
          arabic: 'فَايْنْ مَاشِيْ؟ / فِينْ غَادِيْ؟',
          translation: { fr: 'Deux façons de dire "Où vas-tu ?"', en: 'Two ways to say "Where are you going?"', es: 'Dos formas de decir "¿A dónde vas?"', ar: 'طريقتان لقول "إلى أين تذهب؟"' }
        }
      },
      {
        id: 's4_exercise_scramble',
        type: 'exercise',
        exercise: {
          id: 'ex_m7_l4_scramble',
          type: 'scramble',
          prompt: { fr: 'Reconstituez : « Combien coûte le loyer de cet appartement par mois ? »', en: 'Reorder: "How much is the rent for this apartment per month?"', es: 'Reconstruye: "¿Cuánto es el alquiler de este apartamento al mes?"', ar: 'أعد ترتيب: "شحال الكرا ديال هاد الشقة فالشهر؟"' },
          options: [
            { id: 'w1', text: 'Chhal', isCorrect: true },
            { id: 'w2', text: 'l-kra', isCorrect: true },
            { id: 'w3', text: 'd had', isCorrect: true },
            { id: 'w4', text: 'ch-cheqqa', isCorrect: true },
            { id: 'w5', text: 'f', isCorrect: true },
            { id: 'w6', text: 'ch-chher?', isCorrect: true }
          ],
          answer: ['w1', 'w2', 'w3', 'w4', 'w5', 'w6'],
          explanation: {
            fr: 'Structure : interrogatif (Chhal)+ nom (l-kra)+ complément (d had)+ objet (ch-cheqqa)+ préposition (f)+ complément de temps (ch-chher.).',
            en: 'Structure: question word (Chhal)+ noun (l-kra)+ complement (d had)+ object (ch-cheqqa)+ preposition (f)+ time complement (ch-chher.).',
            es: 'Estructura: interrogativo (Chhal)+ sustantivo (l-kra)+ complemento (d had)+ objeto (ch-cheqqa)+ preposición (f)+ complemento temporal (ch-chher.).',
            ar: 'التركيب: أداة استفهام(شحال)+ اسم(الكرا)+ متمم(د هاد)+ مفعول(الشقة)+ حرف جر(ف)+ متمم زمني(الشهر.)..'
          }
        }
      },
      {
        id: 's5_boss_riad',
        type: 'exercise',
        exercise: {
          id: 'ex_m7_boss_riad',
          type: 'roleplay_challenge',
          prompt: { fr: "Épreuve finale du parcours : relevez le défi « Riad à Fès » puis enchaînez sur l'onglet Parler. Vous faites le check-in dans un riad, faites l'état des lieux et négociez.", en: "Final challenge of the course: take on the 'Riad in Fes' challenge, then move on to the Parler tab. You check in to a riad, do the inventory and negotiate.", es: 'Desafio final del curso: supera el reto «Riad en Fez» y luego continúaen la pestana Parler. Te registras en un riad, haces el inventario y negocias.', ar: 'التحدي الختامي للمسار: خض مغامرة «رياض في فاس» ثم انتقل إلى تبويب Parler. تسجل الدخول في رياض، وتجرد الحالة وتتفاوض.' },
          dialogueContext: { fr: "Vous arrivez au Riad Yasmine à Fès. Le gérant vous accueille et vous fait visiter la chambre, l'état des lieux (wifi, eau chaude), puis la négociation du prix de la nuit.", en: "You arrive at Riad Yasmine in Fes. The manager welcomes you, shows youthe room, the inventory(wifi, hot water), then negotiates the price per night.", es: 'Llegas al Riad Yasmineen Fez. El gerente te recibe, te enseña la habitación, el inventario(wifi, agua caliente) y luego negocia el precio por noche.', ar: 'تصل إلى رياض ياسمين في فاس. يستقبلك المدير ويريك الغرفة وجرد الحالة(الواي فاي، الماء الساخن)ثم يفاوض على سعر الليلة.' },
          npcStartLine: { arabizi: 'Merhba bik f Riad Yasmine ! Bghiti chi ghourfa wla wahda m3a t-tarrass ?', arabic: 'مَرْحْبَا بِيكْ فْ رِيَاضْ يَاسْمِينْ ! بْغِيتِيْ شِيْ غُورْفَةْ وَالَّا وَاحْدَةْ مْعَا تْرَّاسْ ؟', translation: { fr: 'Bienvenue au Riad Yasmine ! Voulez-vous une chambre avec terrasse ?', en: 'Welcome to Riad Yasmine! Would you like a room with a roof terrace?', es: '¡Bienvenido al Riad Yasmine! ¿Quieres una habitación con terraza?', ar: 'مرحبا بك في رياض ياسمين! هل تريد غرفة مع تراس؟' } },
          answer: '',
          explanation: { fr: "Vous répondez à l'accueil, posez les questions d'état des lieux (wifi, eau( et négociez poliment le prix. Ce défi final consolide tout le parcours et vous lance dans les dialogues ouverts de l'onglet Parler.", en: "You answer the welcome, ask inventory questions(wifi, water(and negotiate the price politely. This final challenge consolidates the wholeroad and launches you into the open dialogues of the Parler tab.", es: 'Respondes al recibimiento, haces preguntas del inventario(wifi, agua( y negocias el precio con cortesía. Este reto final consolida todo el recorrido y te lanza a los diálogos abiertos de la pestana Parler.', ar: 'ترد على الترحيب، وتسأل عن جرد الحالة(الواي فاي، الماء( وتتفاوض على السعر باحترام. هذا التحدي الختامي يرسخ كل المسار ويطلقك نحو الحوارات المفتوحة في تبويب Parler.' },
          dialogueChoices: [
            {
              id: 'boss_c1',
              text: { arabizi: 'Merhba ! Ya3ni fiha chi ghourfa m3a t-tarrass w l-wifi khdam ?', arabic: 'مَرْحْبَا ! يَعْنِيْ فِيهَا شِيْ غُورْفَةْ مْعَا تْرَّاسْ وْ لْوَايْ فَايْ خْدَامْ ؟', translation: { fr: "Bienvenue ! Cela signifie-t-il qu'il y a une chambre avec terrasse et que le wifi fonctionne ?", en: "Welcome! Does this mean there is a room withaterrace and the wifi works?", es: '¡Bienvenido! ¿Significa que hay una habitación con terraza y que el wifi funciona?', ar: 'مرحبا! هل يعني ذلك وجود غرفة مع تراس وأن الواي فاي يعمل؟' } },
              isOptimal: true,
              nextNpcLine: 'Na3am, w t-tarrass fiha mniyya bzzaf. W l-ma skhoun mawjoud 24 s3a.',
              feedback: { fr: "Excellent ! Vous confirmez l'accueil, précisez vos besoins(terrasse) et vérifiez les équipements (wifi).", en: "Excellent! You confirm the welcome, specify your needs (terrace) and check the equipment (wifi).", es: '¡Excelente! Confirmas el recibimiento, precisas tus necesidades (terraza) y verificas los equipos (wifi).', ar: 'ممتاز! تؤكد الترحيب، تحدد احتياجاتك(الترس) وتتحقق من التجهيزات(الواي فاي).' }
            },
            {
              id: 'boss_c2',
              text: { arabizi: 'Daba, t9der t-nqess liya f l-kra, 3la 7sab belli ana ghadi nbed marrat?', arabic: 'دَابَا، تْقَدَّرْ تْنَقَّصْ لِيَّا فْ لْكْرَا، عْلَا حْسَابْ بَلِّيْ أَنَا غَادِيْ نْبَدْ مَرَّاتْ ؟', translation: { fr: "Maintenant, pouvez-vous baisser le prix, vu que je vais rester plusieurs fois ?", en: "Now, can you lower the price, since I will stay several times?", es: 'Ahora, ¿puedes bajar el precio, ya que me voy a quedar varias veces?', ar: 'الآن، هل يمكنك تخفيض السعر، بما أنني سأبقى عدة مرات؟' } },
              isOptimal: false,
              nextNpcLine: 'Wakha a sidi, n-3tik 10% t-khfid 7seb.',
              feedback: { fr: "Très bien — la négociation commence ! En revanche, pensez d'abord à confirmer l'état des lieux avant de discuter du prix.", en: "Very good — negotiation begins! However, first confirm the inventory before discussing the price.", es: 'Muy bien — ¡comienza la negociación! Sin embargo, primero confirma el inventario antes de discutir el precio.', ar: 'جيد جدا — تبدأ المفاوضة! لكن، ثبّت حالة المكان أولاً قبل مناقشة السعر.' }
            },
            {
              id: 'boss_c3',
              text: { arabizi: 'Wakha, nakhodha. 3tini s-swaret d bab d-dar. Shokran !', arabic: 'وَاخَا، نَاخْدَهَا. عْطِينِيْ السَّوَارَتْ دْ بَابْ الدَّارْ. شُكْرًا !', translation: { fr: "D'accord, je la prends. Donnez-moi les clés de la porte. Merci !", en: "Ok, I will take it. Give me the keys of the door. Thank you!", es: 'Ok, la tomo. Dame las llaves de la puerta. ¡Gracias!', ar: 'حسنا، سآخذها. أعطني مفاتيح باب الدار. شكرا!' } },
              isOptimal: false,
              nextNpcLine: 'Sme7li, walakin qbel hadak khassek tfhem 3la l-3adad dyal liyali w l-kra.',
              feedback: { fr: "Un peu pressé ! Avant de prendre les clés, vérifiez la durée du séjour et le prix convenu.", en: "A bit hasty! Before taking the keys, confirm the length of stay and the agreed price.", es: '¡Un poco apresurado! Antes de tomar las llaves, confirma duración de la estancia y el precio acordado.', ar: 'مستعجل قليلا! قبل أخذ المفاتيح، ثبّت مدة الإقامة والسعر المتفق عليه.' }
            }
          ]
        }
      }
    ]
  }
];
