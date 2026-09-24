export type UILanguage = 'fr' | 'es' | 'en' | 'ar';

export const translations = {
  fr: {
    header: {
      guestMode: "Mode Invité", logout: "Déconnexion", arabizi: "Arabizi (3afak)", arabic: "Arabe (عفاك)", duo: "Bilingue"
    },
    dashboard: {
      xp: "XP", module: "Module", current: "ACTUEL", start: "Commencer",
      dailyTraining: "Entraînement Quotidien",
      reviewPrompt: "Révisez vos mots difficiles pour renforcer votre mémoire.",
      dailyPractice: "Pratique du Jour",
      currentStreak: "SÉRIE ACTUELLE", streakDays: "Jours", streakFreeze: "Gel", streakFreezes: "Gels",
      weeklyLeagues: "Ligues Hebdomadaires", yourTrophies: "Vos Trophées", youGuest: "Vous (Invité)",
      badgeCafeMaster: "Maître du Café", badgeTaxiAce: "As du Taxi", badgeSoukNego: "Négociateur du Souk", badgePolyglot: "Polyglotte de l'Atlas",
      loading: "Chargement...", anonymous: "Anonyme", remainingCards: "Cartes restantes :",
      trackA: "Grammaire & Fondations", trackB: "Situations & Conversations Réelles"
    },
    lessons: {
      check: "Vérifier", continue: "Continuer", retry: "Réessayer", gameOver: "Plus de vies !",
      congrats: "Leçon terminée !", lives: "Vies",
      excellent: "Excellent !", oops: "Oups !", chooseAnswer: "Choisissez votre réponse :",
      grammarTitle: "Grammaire Active", grammarDesc: "Explorez les mécanismes de la langue."
    },
    srs: {
      flip: "Retourner la carte", again: "À revoir", hard: "Difficile", good: "Bon", easy: "Facile",
      dueToday: "Cartes dues aujourd'hui", tapToFlip: "Appuyez pour retourner ->",
      answer: "RÉPONSE", translateArabizi: "Traduisez en Arabizi", translateArabic: "Traduisez en Arabe", translateDuo: "Traduisez en Darija (Bilingue)",
      allCaughtUp: "Tout est à jour !",
      allCaughtUpDesc: "Vous n'avez aucune carte à réviser aujourd'hui. Revenez demain pour consolider votre mémoire.",
      backToMenu: "Retour au Menu",
      sessionComplete: "Session Terminée",
      sessionCompleteDesc: "Vous avez révisé {count} mots avec succès. +{xp} XP gagnés !",
      smartReviewsTitle: "Révisions Intelligentes",
      smartReviewsDesc: "Mémorisez le vocabulaire de la Darija pour toujours grâce à notre système de répétition espacée.",
      cardsToReview: "Cartes à réviser",
      startSession: "Commencer la session"
    },
    leagues: {
      bronze: "Bronze", silver: "Argent", gold: "Or", diamond: "Diamant"
    },
    auth: {
      login: "Connexion", signup: "Inscription", email: "Email", password: "Mot de passe",
      continueGuest: "Continuer en mode invité", google: "Continuer avec Google",
      headerLogin: "Se connecter", checkEmail: "Compte créé. Confirmez votre adresse via l'e-mail que nous venons d'envoyer, puis revenez ici : votre progression sera sauvegardée."
    },
    savePrompt: {
      title: "Ne perdez pas vos progrès",
      body: "Créez votre compte gratuit pour garder vos XP, votre série et reprendre sur n'importe quel appareil.",
      reminderTitle: "Vos progrès ne sont pas encore sauvegardés",
      reminderBody: "Vous avez déjà {xp} XP et {lessons} leçons terminées. Ils ne sont enregistrés que sur cet appareil : créez un compte gratuit pour ne rien perdre.",
      cta: "Sauvegarder ma progression",
      later: "Plus tard",
      reassurance: "Gratuit · 30 secondes · Avec Google ou e-mail"
    }
  },
  en: {
    header: {
      guestMode: "Guest Mode", logout: "Logout", arabizi: "Arabizi (3afak)", arabic: "Arabic (عفاك)", duo: "Bilingual"
    },
    dashboard: {
      xp: "XP", module: "Module", current: "CURRENT", start: "Start",
      dailyTraining: "Daily Training",
      reviewPrompt: "Review difficult words to strengthen your memory.",
      dailyPractice: "Daily Practice",
      currentStreak: "CURRENT STREAK", streakDays: "Days", streakFreeze: "Freeze", streakFreezes: "Freezes",
      weeklyLeagues: "Weekly Leagues", yourTrophies: "Your Trophies", youGuest: "You (Guest)",
      badgeCafeMaster: "Cafe Master", badgeTaxiAce: "Taxi Ace", badgeSoukNego: "Souk Negotiator", badgePolyglot: "Atlas Polyglot",
      loading: "Loading...", anonymous: "Anonymous", remainingCards: "Remaining cards:",
      trackA: "Grammar & Foundations", trackB: "Situations & Conversations"
    },
    lessons: {
      check: "Check", continue: "Continue", retry: "Retry", gameOver: "Out of lives!",
      congrats: "Lesson complete!", lives: "Lives",
      excellent: "Excellent!", oops: "Oops!", chooseAnswer: "Choose your answer:",
      grammarTitle: "Active Grammar", grammarDesc: "Explore the mechanics of the language."
    },
    srs: {
      flip: "Flip card", again: "Again", hard: "Hard", good: "Good", easy: "Easy",
      dueToday: "Due cards today", tapToFlip: "Tap to flip ->",
      answer: "ANSWER", translateArabizi: "Translate to Arabizi", translateArabic: "Translate to Arabic", translateDuo: "Translate to Darija (Duo)",
      allCaughtUp: "All caught up!",
      allCaughtUpDesc: "You have no cards to review today. Come back tomorrow to consolidate your memory.",
      backToMenu: "Back to Menu",
      sessionComplete: "Session Complete",
      sessionCompleteDesc: "You successfully reviewed {count} words. +{xp} XP earned!",
      smartReviewsTitle: "Smart Reviews",
      smartReviewsDesc: "Memorize Darija vocabulary forever with our spaced repetition system.",
      cardsToReview: "Cards to review",
      startSession: "Start session"
    },
    leagues: {
      bronze: "Bronze", silver: "Silver", gold: "Gold", diamond: "Diamond"
    },
    auth: {
      login: "Login", signup: "Sign up", email: "Email", password: "Password",
      continueGuest: "Continue as guest", google: "Continue with Google",
      headerLogin: "Log in", checkEmail: "Account created. Confirm your address using the email we just sent, then come back here: your progress will be saved."
    },
    savePrompt: {
      title: "Don't lose your progress",
      body: "Create your free account to keep your XP and streak, and pick up on any device.",
      reminderTitle: "Your progress isn't saved yet",
      reminderBody: "You already have {xp} XP and {lessons} lessons completed. They're only stored on this device: create a free account so you don't lose anything.",
      cta: "Save my progress",
      later: "Later",
      reassurance: "Free · 30 seconds · With Google or email"
    }
  },
  es: {
    header: {
      guestMode: "Modo Invitado", logout: "Cerrar sesión", arabizi: "Arabizi (3afak)", arabic: "Árabe (عفاك)", duo: "Bilingüe"
    },
    dashboard: {
      xp: "XP", module: "Módulo", current: "ACTUAL", start: "Empezar",
      dailyTraining: "Entrenamiento Diario",
      reviewPrompt: "Repasa tus palabras difíciles para reforzar tu memoria.",
      dailyPractice: "Práctica del Día",
      currentStreak: "RACHA ACTUAL", streakDays: "Días", streakFreeze: "Congelador", streakFreezes: "Congeladores",
      weeklyLeagues: "Ligas Semanales", yourTrophies: "Tus Trofeos", youGuest: "Tú (Invitado)",
      badgeCafeMaster: "Maestro del Café", badgeTaxiAce: "As del Taxi", badgeSoukNego: "Negociador del Zoco", badgePolyglot: "Políglota del Atlas",
      loading: "Cargando...", anonymous: "Anónimo", remainingCards: "Cartas restantes:",
      trackA: "Gramática y Fundamentos", trackB: "Situaciones y Conversaciones"
    },
    lessons: {
      check: "Comprobar", continue: "Continuar", retry: "Reintentar", gameOver: "¡Sin vidas!",
      congrats: "¡Lección completada!", lives: "Vidas",
      excellent: "¡Excelente!", oops: "¡Uy!", chooseAnswer: "Elige tu respuesta:",
      grammarTitle: "Gramática Activa", grammarDesc: "Explora los mecanismos del idioma."
    },
    srs: {
      flip: "Girar tarjeta", again: "Repetir", hard: "Difícil", good: "Bueno", easy: "Fácil",
      dueToday: "Tarjetas para hoy", tapToFlip: "Toca para voltear ->",
      answer: "RESPUESTA", translateArabizi: "Traduce al Arabizi", translateArabic: "Traduce al Arabe", translateDuo: "Traduce al Darija (Bilingüe)",
      allCaughtUp: "¡Todo al día!",
      allCaughtUpDesc: "No tienes tarjetas para repasar hoy. Vuelve mañana para consolidar tu memoria.",
      backToMenu: "Volver al Menú",
      sessionComplete: "Sesión Completada",
      sessionCompleteDesc: "Has repasado {count} palabras con éxito. ¡+{xp} XP ganados!",
      smartReviewsTitle: "Repasos Inteligentes",
      smartReviewsDesc: "Memoriza el vocabulario de Darija para siempre con nuestro sistema de repetición espaciada.",
      cardsToReview: "Tarjetas por repasar",
      startSession: "Comenzar sesión"
    },
    leagues: {
      bronze: "Bronce", silver: "Plata", gold: "Oro", diamond: "Diamante"
    },
    auth: {
      login: "Iniciar sesión", signup: "Registrarse", email: "Correo", password: "Contraseña",
      continueGuest: "Continuar como invitado", google: "Continuar con Google",
      headerLogin: "Iniciar sesión", checkEmail: "Cuenta creada. Confirma tu dirección con el correo que te acabamos de enviar y vuelve aquí: tu progreso se guardará."
    },
    savePrompt: {
      title: "No pierdas tu progreso",
      body: "Crea tu cuenta gratuita para conservar tus XP y tu racha, y continuar en cualquier dispositivo.",
      reminderTitle: "Tu progreso aún no está guardado",
      reminderBody: "Ya tienes {xp} XP y {lessons} lecciones completadas. Solo están guardados en este dispositivo: crea una cuenta gratuita para no perder nada.",
      cta: "Guardar mi progreso",
      later: "Más tarde",
      reassurance: "Gratis · 30 segundos · Con Google o correo"
    }
  },
  ar: {
    header: {
      guestMode: "وضع الضيف", logout: "تسجيل الخروج", arabizi: "عربيزي (3afak)", arabic: "عربي (عفاك)", duo: "مزدوج"
    },
    dashboard: {
      xp: "نقاط", module: "وحدة", current: "الحالي", start: "ابدأ",
      dailyTraining: "التدريب اليومي",
      reviewPrompt: "راجع كلماتك الصعبة لتعزيز ذاكرتك.",
      dailyPractice: "تمرين اليوم",
      currentStreak: "السلسلة الحالية", streakDays: "أيام", streakFreeze: "تجميد", streakFreezes: "تجميد",
      weeklyLeagues: "الدوريات الأسبوعية", yourTrophies: "جوائزك", youGuest: "أنت (ضيف)",
      badgeCafeMaster: "خبير المقهى", badgeTaxiAce: "بطل التاكسي", badgeSoukNego: "مفاوض السوق", badgePolyglot: "متحدث لغات الأطلس",
      loading: "جاري التحميل...", anonymous: "مجهول", remainingCards: "البطاقات المتبقية:",
      trackA: "القواعد والأساسيات", trackB: "المواقف والمحادثات اليومية"
    },
    lessons: {
      check: "تحقق", continue: "استمر", retry: "حاول مجدداً", gameOver: "لقد نفذت محاولاتك!",
      congrats: "اكتمل الدرس!", lives: "محاولات",
      excellent: "ممتاز!", oops: "عفواً!", chooseAnswer: "اختر إجابتك:",
      grammarTitle: "القواعد النشطة", grammarDesc: "اكتشف آليات اللغة."
    },
    srs: {
      flip: "اقلب البطاقة", again: "مجدداً", hard: "صعب", good: "جيد", easy: "سهل",
      dueToday: "بطاقات اليوم", tapToFlip: "انقر للقلب ->",
      answer: "الإجابة", translateArabizi: "ترجم إلى العَرَبيزي", translateArabic: "ترجم إلى العربية", translateDuo: "ترجم إلى الدارجة (ثنائي)",
      allCaughtUp: "أنت مواكب لكل شيء!",
      allCaughtUpDesc: "ليس لديك بطاقات لمراجعتها اليوم. عد غداً لتعزيز ذاكرتك.",
      backToMenu: "العودة للقائمة",
      sessionComplete: "انتهت الجلسة",
      sessionCompleteDesc: "لقد راجعت {count} كلمات بنجاح. +{xp} نقطة مكتسبة!",
      smartReviewsTitle: "\u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u0630\u0643\u064a\u0629",
      smartReviewsDesc: "\u0627\u062d\u0641\u0638 \u0645\u0641\u0631\u062f\u0627\u062a \u0627\u0644\u062f\u0627\u0631\u062c\u0629 \u0625\u0644\u0649 \u0627\u0644\u0623\u0628\u062f \u0628\u0641\u0636\u0644 \u0646\u0638\u0627\u0645 \u0627\u0644\u062a\u0643\u0631\u0627\u0631 \u0627\u0644\u0645\u062a\u0628\u0627\u0639\u062f.",
      cardsToReview: "\u0628\u0637\u0627\u0642\u0627\u062a \u0644\u0644\u0645\u0631\u0627\u062c\u0639\u0629",
      startSession: "\u0627\u0628\u062f\u0623 \u0627\u0644\u062c\u0644\u0633\u0629"
    },
    leagues: {
      bronze: "برونزية", silver: "فضية", gold: "ذهبية", diamond: "ماسية"
    },
    auth: {
      login: "تسجيل الدخول", signup: "إنشاء حساب", email: "البريد الإلكتروني", password: "كلمة المرور",
      continueGuest: "الاستمرار كضيف", google: "الاستمرار مع جوجل",
      headerLogin: "تسجيل الدخول", checkEmail: "تم إنشاء الحساب. أكّد بريدك الإلكتروني عبر الرسالة التي أرسلناها للتو، ثم عد إلى هنا: سيتم حفظ تقدّمك."
    },
    savePrompt: {
      title: "لا تفقد تقدّمك",
      body: "أنشئ حسابك المجاني للاحتفاظ بنقاط XP وسلسلة أيامك، والمتابعة على أي جهاز.",
      reminderTitle: "تقدّمك غير محفوظ بعد",
      reminderBody: "لديك بالفعل {xp} XP و{lessons} دروس مكتملة. إنها محفوظة على هذا الجهاز فقط: أنشئ حسابًا مجانيًا حتى لا تفقد شيئًا.",
      cta: "احفظ تقدّمي",
      later: "لاحقًا",
      reassurance: "مجاني · 30 ثانية · عبر جوجل أو البريد الإلكتروني"
    }
  }
};
