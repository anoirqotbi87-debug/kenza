export type UILanguage = 'fr' | 'es' | 'en' | 'ar';

export const translations = {
  fr: {
    side: {
      today: "Aujourd'hui", path: "Mon parcours", phrases: "Carnet de phrases", review: "Révision du jour",
      learn: "APPRENDRE", oral: "PRATIQUE ORALE & IA", space: "TON ESPACE"
    },
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
      sessionCompleteDesc: 
"Vous avez révisé {count} mots avec succès. +{xp} XP gagnés !",
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
      continueGuest: "Continuer en mode invité", google: "Continuer avec Google"
    }
  },
  en: {
    side: {
      today: "Today", path: "My journey", phrases: "Phrasebook", review: "Daily review",
      learn: "LEARN", oral: "SPEAKING & AI", space: "YOUR SPACE"
    },
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
      trackA: "Grammar & Foundations", trackB: "Situations & Real Conversations"
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
      continueGuest: "Continue as guest", google: "Continue with Google"
    }
  },
  es: {
    side: {
      today: "Hoy", path: "Mi ruta", phrases: "Mis frases", review: "Repaso del día",
      learn: "APRENDER", oral: "PRÁCTICA ORAL & IA", space: "TU ESPACIO"
    },
    header: {
      guestMode: "Modo Invitado", logout: "Cerrar sesión", arabizi: "Arabizi (3afak)", arabic: "Árabe (عفاك)", duo: "Bilingüe"
    },
    dashboard: {
      xp: "XP", module: "Módulo", current: "ACTUAL", start: "Empezar",
      dailyTraining: "Entrenamiento Diario",
      reviewPrompt: "Repasa tus palabras difíciles para reforzar tu memoria.",
      dailyPractice: "Práctica del Día",
      currentStreak: "RACHA ACTUAL", streakDays: "Días", streakFreeze: "Congelación", streakFreezes: "Congelaciones",
      weeklyLeagues: "Ligas Semanales", yourTrophies: "Tus Trofeos", youGuest: "Tú (Invitado)",
      badgeCafeMaster: "Maestro del Café", badgeTaxiAce: "As del Taxi", badgeSoukNego: "Negociador del Zoco", badgePolyglot: "Políglota del Atlas",
      loading: "Cargando...", anonymous: "Anónimo", remainingCards: "Cartas restantes:",
      trackA: "Gramática y Fundamentos", trackB: "Situaciones y Conversaciones Reales"
    },
    lessons: {
      check: "Comprobar", continue: "Continuar", retry: "Reintentar", gameOver: "¡Sin vidas!",
      congrats: "¡Lección completada!", lives: "Vidas",
      excellent: "¡Excelente!", oops: "¡Ups!", chooseAnswer: "Elige tu respuesta:",
      grammarTitle: "Gramática Activa", grammarDesc: "Explora los mecanismos del idioma."
    },
    srs: {
      flip: "Girar tarjeta", again: "Otra vez", hard: "Difícil", good: "Bien", easy: "Fácil",
      dueToday: "Tarjetas para hoy", tapToFlip: "Toca para girar ->",
      answer: "RESPUESTA", translateArabizi: "Traduce al Arabizi", translateArabic: "Traduce al Árabe", translateDuo: "Traduce al Darija (Bilingüe)",
      allCaughtUp: "¡Todo al día!",
      allCaughtUpDesc: "No tienes tarjetas para repasar hoy. Vuelve mañana para consolidar tu memoria.",
      backToMenu: "Volver al Menú",
      sessionComplete: "Sesión Completada",
      sessionCompleteDesc: "Has repasado {count} palabras con éxito. ¡+{xp} XP ganados!",
      smartReviewsTitle: "Repasos Inteligentes",
      smartReviewsDesc: "Memoriza el vocabulario del Darija para siempre con nuestro sistema de repetición espaciada.",
      cardsToReview: "Tarjetas para repasar",
      startSession: "Comenzar sesión"
    },
    leagues: {
      bronze: "Bronce", silver: "Plata", gold: "Oro", diamond: "Diamante"
    },
    auth: {
      login: "Iniciar sesión", signup: "Registrarse", email: "Correo electrónico", password: "Contraseña",
      continueGuest: "Continuar como invitado", google: "Continuar con Google"
    }
  },
  ar: {
    side: {
      today: "اليوم", path: "مساري", phrases: "دفتر العبارات", review: "مراجعة اليوم",
      learn: "تعلّم", oral: "التحدث والذكاء الاصطناعي", space: "مساحتك"
    },
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
      allCaughtUp: "أنت على اكتمال!",
      allCaughtUpDesc: "لا توجد بطاقات للمراجعة اليوم. عد غداً لتثبيت ذاكرتك.",
      backToMenu: "العودة للقائمة",
      sessionComplete: "انتهت الجلسة",
      sessionCompleteDesc: "راجعت {count} كلمات بنجاح. +{xp} نقطة مكتسبة!",
      smartReviewsTitle: "المراجعات الذكية",
      smartReviewsDesc: "احفظ مفردات الدارجة للأبد بنظام التكرار المتباعد.",
      cardsToReview: "بطاقات للمراجعة",
      startSession: "ابدأ الجلسة"
    },
    leagues: {
      bronze: "برونزية", silver: "فضية", gold: "ذهبية", diamond: "ماسية"
    },
    auth: {
      login: "تسجيل الدخول", signup: "إنشاء حساب", email: "البريد الإلكتروني", password: "كلمة المرور",
      continueGuest: "المتابعة كضيف", google: "المتابعة عبر Google"
    }
  }
} as const;

export type Translations = typeof translations;
