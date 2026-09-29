export type UILanguage = 'fr' | 'es' | 'en' | 'ar';

export const translations = {
  fr: {
    side: {
      today: "Aujourd'hui", path: "Mon parcours", phrases: "Carnet de phrases", review: "Révision du jour",
      learn: "APPRENDRE", oral: "PRATIQUE ORALE & IA", space: "TON ESPACE"
    },
    nav: {
      home: "Accueil", parcours: "Parcours", phrasebook: "Phrases", review: "Réviser",
      speech: "Pratique Orale", profile: "Profil", learn: "Apprendre", grammar: "Grammaire",
      speak: "Parler", revise: "Réviser"
    },
    header: {
      guestMode: "Mode Invité", logout: "Déconnexion", arabizi: "Arabizi (3afak)", arabic: "Arabe (عفاك)", duo: "Bilingue",
      menu: "Menu", settings: "Réglages", profile: "Voir profil", login: "Se connecter / S'inscrire",
      notation: "Notation :", dialect: "Dialecte :", uiLanguage: "Langue UI :",
      sound: "Son", soundOn: "Son activé", soundOff: "Son coupé", offline: "Hors-ligne", offlineReady: "Prêt hors-ligne",
      openMenu: "Ouvrir le menu de navigation", closeMenu: "Fermer le menu", preferences: "Préférences linguistiques"
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
      grammarTitle: "Grammaire Active", grammarDesc: "Explorez les mécanismes de la langue.",
      steps: "étapes", level: "Niveau", locked: "Verrouillé", completed: "Terminé",
      unavailable: "Leçon indisponible",
      unavailableDesc: "La leçon demandée n'a pas pu être chargée ou ne contient aucune étape.",
      backToDashboard: "Retour au tableau de bord", keepGoing: "Continue comme ça !",
      xpEarned: "XP gagnés", wellDone: "Bien joué !", tryAgain: "Presque — retiens ceci.",
      whyWrong: "Pourquoi ai-je faux ?", whyWrongDefault: "Cette réponse est incorrecte. Observez bien la bonne réponse en vert et comparez les prononciations.",
      finish: "Terminer", nextStep: "Étape suivante"
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
    },
    common: {
      back: "Retour", loading: "Chargement...", close: "Fermer", save: "Enregistrer", cancel: "Annuler",
      continue: "Continuer", retry: "Réessayer", start: "Commencer", check: "Vérifier", next: "Suivant",
      previous: "Précédent", yes: "Oui", no: "Non", ok: "OK", error: "Erreur", success: "Succès",
      language: "Langue", interfaceLanguage: "Langue de l'interface", chooseLanguage: "Choisir la langue",
      offline: "Hors-ligne", offlineReady: "Prêt hors-ligne", online: "En ligne", guest: "Invité",
      premium: "Premium", free: "Gratuit", locked: "Verrouillé", unlock: "Débloquer",
      days: "Jours", day: "Jour", minutes: "min", level: "Niveau", xp: "XP", streak: "Série",
      module: "Module", lessons: "Leçons", words: "mots", progress: "Progression", seeAll: "Tout voir",
      comingSoon: "Bientôt disponible", search: "Rechercher", all: "Tout voir", menu: "Menu",
      profile: "Profil", login: "Se connecter", signup: "S'inscrire", logout: "Déconnexion",
      home: "Accueil", steps: "étapes", rights: "Tous droits réservés", madeWith: "Fait avec",
      unavailable: "Leçon indisponible",
      unavailableDesc: "La leçon demandée n'a pas pu être chargée ou ne contient aucune étape.",
      backToDashboard: "Retour au tableau de bord"
    },
    pages: {
      etudier: { badge: "Parcours complet", title: "Ton parcours complet — 7 modules", module: "Module", steps: "étapes", level: "Niveau", premium: "Kenza Pro" },
      grammaire: { badge: "Grammaire Active", title: "Grammaire & Conjugaison", conjugationTable: "Tableau de conjugaison", grammarLessons: "Leçons de grammaire (Module 4)", steps: "étapes" },
      parler: { badge: "Pratique Orale", title: "Entraînement de prononciation" },
      revisions: {
        badge: "Révisions & Progression", title: "Révisions & Paquets de cartes",
        tabSrs: "Révision intelligente", tabDecks: "Mes paquets de cartes", tabGamification: "Progression & Badges",
        activityMap: "Carte d'activité", myBadges: "Mes badges", weeklyLeague: "Ligues hebdomadaires"
      }
    },
    footer: { tagline: "Apprends la Darija marocaine, un pas à la fois.", rights: "Tous droits réservés." },
    modules: {
      srs: { spacedRepetition: "Répétition Espacée", relisten: "Réécouter", revealHint: "Cliquer ou Espace pour révéler la réponse" },
      decks: { title: "Gestionnaire de Decks", cardsInCollection: "cartes dans votre collection", newWord: "Nouveau mot", searchPlaceholder: "Rechercher un mot, une traduction...", toReview: "À réviser", noCards: "Aucune carte trouvée", noCardsDesc: "Essayez un autre mot-clé ou modifiez vos filtres de recherche.", all: "Tous", learning: "En apprentissage", mastered: "Acquis", roleplay: "Roleplay", manual: "Manuel", module: "Module", deleteConfirm: "Voulez-vous vraiment supprimer cette carte ?", audioOffline: "Audio non disponible hors-ligne"},
      speech: { listenModel: "Écouter le modèle", listening: "Écoute en cours...", pressMic: "Appuyez sur le micro pour parler", keepPracticing: "Continuez à vous entraîner !", veryClear: "Très compréhensible, bien joué !", excellent: "Excellente prononciation !", speechRecognition: "Reconnaissance vocale :"},
      grammar: { positive: "Positif", negative: "Négatif", toMe: "À moi", toYou: "À toi", toHim: "À lui", understood: "J'ai compris", notUnderstood: "Je n'ai pas compris", iEat: "Je mange", iDontEat: "Je ne mange pas", iWillGo: "Je vais partir", youWillGo: "Tu vas partir" },
      badges: { cafeLesson: "Terminer la leçon du café", taxi: "Gérer le petit taxi avec succès", souk: "Maîtriser le marchandage", earnXp: "Gagner 500 XP"},
      roleplay: { addedToSrs: "Expression ajoutée au carnet SRS !", saveToSrs: "Sauvegarder dans mon carnet (SRS)", listeningSpeak: "Écoute en cours (parlez)...", inputPlaceholder: "Votre message en Darija ou Français...", missionComplete: "Mission accomplie ! Vous avez tenu la conversation.", claimXp: "Récupérer mes +25 XP et Quitter"},
      scenario: { subtitle: "Pratiquez avec des personnages marocains immersifs", dialoguesTitle: "Dialogues scénarisés (Situations réelles)", dialoguesDesc: "Entraîne-toi sur des situations réelles avec correction automatique", exploreMore: "Explorer plus", fullPath: "Parcours complet (7 modules)", pronunciation: "Entraînement de prononciation", revisions: "Révisions & Paquets de cartes", internetRequired: "Connexion Internet Requise", internetDesc: "Les conversations libres avec l'IA nécessitent une connexion réseau. En attendant, vos modules hors-ligne restent disponibles.", launchSrs: "Lancer une révision SRS", modalTitle: "Mises en situation IA", grammar: "Grammaire & Conjugaison", back: "Retour"},
      paywall: { errorInit: "Erreur lors de l'initialisation du paiement", upgradeSuccess: "Compte mis à niveau avec succès vers Kenza Pro (Mode Démo) !", errorRetry: "Impossible d'initialiser le paiement. Veuillez réessayer.", closeLabel: "Fermer la modale", advancedPath: "PARCOURS AVANCÉ", unlockB1B2: "Débloquez les Modules B1 & B2", advancedDesc: "Poursuivez votre voyage vers Tanger et approfondissez les subtilités du dialecte marocain.", aiImmersion: "IMMERSION IA SANS LIMITE", unlimitedAi: "Conversations IA Illimitées", aiSubtitle: "Vous avez terminé votre session IA gratuite du jour. Passez à Kenza Pro pour échanger librement avec tous les personas.", culturalKicker: "PASSEPORT CULTUREL", masterDarija: "Maîtrisez la Darija sans limites", culturalSubtitle: "Libérez tout le potentiel de votre apprentissage de la Darija avec l'accès complet à l'écosystème Kenza.", benefit1: "Accès intégral aux Modules 3, 4 et 5 (Niveaux B1 & B2)", benefit2: "Roleplay IA illimité (Tous les personas et scénarios sans quota)", benefit3: "Synthèse vocale (TTS) naturelle & mode 100% hors-ligne", benefit4: "Visas officiels du Passeport Culturel & suivi de maîtrise", certified: "Apprentissage certifié — Garanti sans engagement", plansTitle: "Formules Kenza Pro", chooseCadence: "Choisissez votre cadence", cadenceDesc: "Investissez dans votre aisance orale. Modifiable à tout instant.", bestOffer: "-40% · Meilleure offre", yearly: "Abonnement Annuel", billed: "Facturé {total}", perMonth: "/ mois", monthly: "Abonnement Mensuel", monthlyDesc: "Liberté totale, sans engagement", preparing: "Préparation du paiement...", unlockCta: "Débloquer Kenza Pro", securePayment: "Paiement chiffré et sécurisé · Annulation en 1 clic à tout moment." },
      install: { title: "Installer KENZA", iosHintA: "Touchez l'icône", iosHintB: "puis « Sur l'écran d'accueil » pour un accès rapide.", androidHint: "Ajoutez l'app sur votre écran d'accueil pour une expérience optimale.", button: "Installer l'application" },
      passport: { title: "Mon Passeport Darija", guest: "INVITÉ(E)", copied: "Copié !", shareText: "J'ai validé mon {level} de Darija marocaine sur KENZA avec un score de {score}% !", passportTitle: "PASSEPORT DARIJA", holder: "Titulaire", levelValidated: "Niveau Validé", score: "SCORE", validated: "VALIDÉ", save: "Enregistrer", share: "Partager" },
      ui: { navReview: "Réviser", offlineActive: "Mode Hors-Ligne actif — Modules et révisions SRS disponibles sans connexion", onlineRestored: "Connexion rétablie", voiceRetry: "À retravailler, écoutez à nouveau Jamal.", voiceUnderstandable: "Compréhensible, travaillez les sons ci-dessous.", readingSpeed: "Vitesse de lecture", addNewWord: "Ajouter un nouveau mot", notePlaceholder: "ex. Entendu au café, utile pour prendre congé.", addToReviews: "Ajouter à mes révisions", excellentAnswer: "Excellente réponse !", verify: "Vérifier", hideTranslation: "Masquer la traduction", showTranslation: "Voir la traduction", listeningNow: "Écoute en cours...", holdToTalk: "Maintenez ou touchez pour parler", accuracy: "Précision", editWord: "Modifier l'expression", inDarijaArabizi: "En Darija (Arabizi)", translationLabel: "Traduction", inArabicLetters: "En lettres arabes (optionnel)", notesContext: "Notes / Contexte (optionnel)", incorrect: "Incorrect", correctAnswer: "Réponse correcte :" },
      home: { seeAll: "Tout voir", googleError: "Impossible d'initier la connexion Google.", proActivated: "Félicitations ! Votre abonnement Kenza Pro est activé.", phrasesDesc: "Vocabulaire du quotidien avec audio naturel.", audioPronAria: "Prononciation audio de la phrase.", phraseCopied: "Phrase copiée dans le presse-papiers.", graded: "Noté : {grade}", gradeAgain: "à revoir", gradeHard: "difficile", gradeGood: "bon", gradeEasy: "facile", resetConfirm: "Effacer la progression locale sur cet appareil ?", resetDone: "Progression locale réinitialisée.", dailyGoal: "Objectif quotidien : 10 minutes de pratique chaque jour.", langSwitcher: "Sélecteur de langue", switchToFr: "Passer en français", switchToEn: "Switch to English", switchToEs: "Cambiar a español", switchToAr: "Passer en arabe", openSpace: "Ouvrir mon espace", closeLesson: "Fermer la leçon", explorePath: "Explorer le parcours", lessonLocked: "{title}, verrouillée", startLesson: "Commencer {title}", reviewLesson: "Revoir {title}", catEssentials: "LES ESSENTIELS", catDaily: "AU QUOTIDIEN", catLocate: "SE REPÉRER", catAdvanced: "IMMERSION AVANCÉE", validated: "Validé ✓", removeFav: "Retirer des favoris", addFav: "Ajouter aux favoris" , imgMedina: "Médina de Maroc", imgMintTea: "Thé à la menthe", inProgress: "En cours" },
    }
  },
  en: {
    side: {
      today: "Today", path: "My journey", phrases: "Phrasebook", review: "Daily review",
      learn: "LEARN", oral: "SPEAKING & AI", space: "YOUR SPACE"
    },
    nav: {
      home: "Home", parcours: "Journey", phrasebook: "Phrases", review: "Review",
      speech: "Speaking", profile: "Profile", learn: "Learn", grammar: "Grammar",
      speak: "Speak", revise: "Review"
    },
    header: {
      guestMode: "Guest Mode", logout: "Logout", arabizi: "Arabizi (3afak)", arabic: "Arabic (عفاك)", duo: "Bilingual",
      menu: "Menu", settings: "Settings", profile: "View profile", login: "Log in / Sign up",
      notation: "Notation:", dialect: "Dialect:", uiLanguage: "UI language:",
      sound: "Sound", soundOn: "Sound on", soundOff: "Sound off", offline: "Offline", offlineReady: "Ready offline",
      openMenu: "Open navigation menu", closeMenu: "Close menu", preferences: "Language preferences"
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
      grammarTitle: "Active Grammar", grammarDesc: "Explore the mechanics of the language.",
      steps: "steps", level: "Level", locked: "Locked", completed: "Completed",
      unavailable: "Lesson unavailable",
      unavailableDesc: "The requested lesson could not be loaded or contains no steps.",
      backToDashboard: "Back to dashboard", keepGoing: "Keep it up!",
      xpEarned: "XP earned", wellDone: "Well done!", tryAgain: "Almost — remember this.",
      whyWrong: "Why is this wrong?", whyWrongDefault: "This answer is incorrect. Look at the correct answer highlighted in green and compare the pronunciations.",
      finish: "Finish", nextStep: "Next step"
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
    },
    common: {
      back: "Back", loading: "Loading...", close: "Close", save: "Save", cancel: "Cancel",
      continue: "Continue", retry: "Retry", start: "Start", check: "Check", next: "Next",
      previous: "Previous", yes: "Yes", no: "No", ok: "OK", error: "Error", success: "Success",
      language: "Language", interfaceLanguage: "Interface language", chooseLanguage: "Choose language",
      offline: "Offline", offlineReady: "Ready offline", online: "Online", guest: "Guest",
      premium: "Premium", free: "Free", locked: "Locked", unlock: "Unlock",
      days: "Days", day: "Day", minutes: "min", level: "Level", xp: "XP", streak: "Streak",
      module: "Module", lessons: "Lessons", words: "words", progress: "Progress", seeAll: "See all",
      comingSoon: "Coming soon", search: "Search", all: "See all", menu: "Menu",
      profile: "Profile", login: "Log in", signup: "Sign up", logout: "Logout",
      home: "Home", steps: "steps", rights: "All rights reserved", madeWith: "Made with",
      unavailable: "Lesson unavailable",
      unavailableDesc: "The requested lesson could not be loaded or contains no steps.",
      backToDashboard: "Back to dashboard"
    },
    pages: {
      etudier: { badge: "Full Curriculum", title: "Your full journey — 7 modules", module: "Module", steps: "steps", level: "Level", premium: "Kenza Pro" },
      grammaire: { badge: "Active Grammar", title: "Grammar & Conjugation", conjugationTable: "Conjugation table", grammarLessons: "Grammar lessons (Module 4)", steps: "steps" },
      parler: { badge: "Speaking Practice", title: "Pronunciation trainer" },
      revisions: {
        badge: "Reviews & Progress", title: "Reviews & Card Decks",
        tabSrs: "Smart Review", tabDecks: "My Card Decks", tabGamification: "Progress & Badges",
        activityMap: "Activity map", myBadges: "My badges", weeklyLeague: "Weekly leagues"
      }
    },
    footer: { tagline: "Learn Moroccan Darija, one step at a time.", rights: "All rights reserved." },
    modules: {
      srs: { spacedRepetition: "Spaced Repetition", relisten: "Replay", revealHint: "Click or press Space to reveal the answer" },
      decks: { title: "Deck Manager", cardsInCollection: "cards in your collection", newWord: "New word", searchPlaceholder: "Search a word, a translation...", toReview: "To review", noCards: "No cards found", noCardsDesc: "Try another keyword or change your search filters.", all: "All", learning: "Learning", mastered: "Mastered", roleplay: "Roleplay", manual: "Manual", module: "Module", deleteConfirm: "Are you sure you want to delete this card?", audioOffline: "Audio unavailable offline"},
      speech: { listenModel: "Listen to the model", listening: "Listening...", pressMic: "Tap the mic to speak", keepPracticing: "Keep practicing!", veryClear: "Very clear, well done!", excellent: "Excellent pronunciation!", speechRecognition: "Speech recognition:"},
      grammar: { positive: "Positive", negative: "Negative", toMe: "To me", toYou: "To you", toHim: "To him", understood: "I understood", notUnderstood: "I didn't understand", iEat: "I eat", iDontEat: "I don't eat", iWillGo: "I will go", youWillGo: "You will go" },
      badges: { cafeLesson: "Complete the café lesson", taxi: "Handle the petit taxi successfully", souk: "Master bargaining", earnXp: "Earn 500 XP"},
      roleplay: { addedToSrs: "Phrase added to your SRS deck!", saveToSrs: "Save to my deck (SRS)", listeningSpeak: "Listening (speak)...", inputPlaceholder: "Your message in Darija or French...", missionComplete: "Mission accomplished! You held the conversation.", claimXp: "Claim my +25 XP and leave"},
      scenario: { subtitle: "Practice with immersive Moroccan characters", dialoguesTitle: "Scripted dialogues (Real-life situations)", dialoguesDesc: "Practice real-life situations with automatic correction", exploreMore: "Explore more", fullPath: "Full path (7 modules)", pronunciation: "Pronunciation training", revisions: "Reviews & Card decks", internetRequired: "Internet Connection Required", internetDesc: "Free AI conversations require a network connection. Meanwhile, your offline modules remain available.", launchSrs: "Start an SRS review", modalTitle: "AI Roleplay Situations", grammar: "Grammar & Conjugation", back: "Back"},
      paywall: { errorInit: "Error initializing payment", upgradeSuccess: "Account upgraded to Kenza Pro (Demo Mode)!", errorRetry: "Could not initialize payment. Please try again.", closeLabel: "Close dialog", advancedPath: "ADVANCED PATH", unlockB1B2: "Unlock Modules B1 & B2", advancedDesc: "Continue your journey to Tangier and deepen your grasp of the Moroccan dialect.", aiImmersion: "UNLIMITED AI IMMERSION", unlimitedAi: "Unlimited AI Conversations", aiSubtitle: "You have used your free AI session for today. Go Kenza Pro to chat freely with all personas.", culturalKicker: "CULTURAL PASSPORT", masterDarija: "Master Darija without limits", culturalSubtitle: "Unlock the full potential of your Darija learning with complete access to the Kenza ecosystem.", benefit1: "Full access to Modules 3, 4 and 5 (Levels B1 & B2)", benefit2: "Unlimited AI roleplay (All personas and scenarios, no quota)", benefit3: "Natural text-to-speech (TTS) & 100% offline mode", benefit4: "Official Cultural Passport visas & mastery tracking", certified: "Certified learning — Guaranteed no commitment", plansTitle: "Kenza Pro plans", chooseCadence: "Choose your pace", cadenceDesc: "Invest in your speaking confidence. Change anytime.", bestOffer: "-40% · Best offer", yearly: "Yearly Plan", billed: "Billed {total}", perMonth: "/ month", monthly: "Monthly Plan", monthlyDesc: "Total freedom, no commitment", preparing: "Preparing payment...", unlockCta: "Unlock Kenza Pro", securePayment: "Encrypted and secure payment · Cancel in 1 click anytime." },
      install: { title: "Install KENZA", iosHintA: "Tap the share icon", iosHintB: "then \"Add to Home Screen\" for quick access.", androidHint: "Add the app to your home screen for the best experience.", button: "Install the app" },
      passport: { title: "My Darija Passport", guest: "GUEST", copied: "Copied!", shareText: "I passed my {level} of Moroccan Darija on KENZA with a score of {score}%!", passportTitle: "DARIJA PASSPORT", holder: "Holder", levelValidated: "Level Passed", score: "SCORE", validated: "VALIDATED", save: "Save", share: "Share" },
      ui: { navReview: "Review", offlineActive: "Offline Mode active — Modules and SRS reviews available without connection", onlineRestored: "Connection restored", voiceRetry: "Needs work, listen to Jamal again.", voiceUnderstandable: "Understandable, work on the sounds below.", readingSpeed: "Reading speed", addNewWord: "Add a new word", notePlaceholder: "e.g. Heard at the café, useful to say goodbye.", addToReviews: "Add to my reviews", excellentAnswer: "Excellent answer!", verify: "Check", hideTranslation: "Hide translation", showTranslation: "Show translation", listeningNow: "Listening...", holdToTalk: "Hold or tap to speak", accuracy: "Accuracy", editWord: "Edit expression", inDarijaArabizi: "In Darija (Arabizi)", translationLabel: "Translation", inArabicLetters: "In Arabic letters (optional)", notesContext: "Notes / Context (optional)" },
      home: { seeAll: "See all", googleError: "Could not start Google sign-in.", proActivated: "Congratulations! Your Kenza Pro subscription is active.", phrasesDesc: "Everyday vocabulary with natural audio.", audioPronAria: "Audio pronunciation of the phrase.", phraseCopied: "Phrase copied to clipboard.", graded: "Graded: {grade}", gradeAgain: "to review", gradeHard: "hard", gradeGood: "good", gradeEasy: "easy", resetConfirm: "Clear local progress on this device?", resetDone: "Local progress reset.", dailyGoal: "Daily goal: 10 minutes of practice every day.", langSwitcher: "Language selector", switchToFr: "Switch to French", switchToEn: "Switch to English", switchToEs: "Switch to Spanish", switchToAr: "Switch to Arabic", openSpace: "Open my space", closeLesson: "Close lesson", explorePath: "Explore the path", lessonLocked: "{title}, locked", startLesson: "Start {title}", reviewLesson: "Review {title}", catEssentials: "THE ESSENTIALS", catDaily: "EVERYDAY", catLocate: "GET AROUND", catAdvanced: "ADVANCED IMMERSION", validated: "Passed ✓", removeFav: "Remove from favorites", addFav: "Add to favorites" , imgMedina: "Moroccan medina", imgMintTea: "Mint tea", inProgress: "In progress" },
    }
  },
  es: {
    side: {
      today: "Hoy", path: "Mi ruta", phrases: "Mis frases", review: "Repaso del día",
      learn: "APRENDER", oral: "PRÁCTICA ORAL & IA", space: "TU ESPACIO"
    },
    nav: {
      home: "Inicio", parcours: "Ruta", phrasebook: "Frases", review: "Repasar",
      speech: "Práctica oral", profile: "Perfil", learn: "Aprender", grammar: "Gramática",
      speak: "Hablar", revise: "Repasar"
    },
    header: {
      guestMode: "Modo Invitado", logout: "Cerrar sesión", arabizi: "Arabizi (3afak)", arabic: "Árabe (عفاك)", duo: "Bilingüe",
      menu: "Menú", settings: "Ajustes", profile: "Ver perfil", login: "Iniciar sesión / Registrarse",
      notation: "Notación:", dialect: "Dialecto:", uiLanguage: "Idioma de la interfaz:",
      sound: "Sonido", soundOn: "Sonido activado", soundOff: "Sonido desactivado", offline: "Sin conexión", offlineReady: "Listo sin conexión",
      openMenu: "Abrir el menú de navegación", closeMenu: "Cerrar el menú", preferences: "Preferencias de idioma"
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
      grammarTitle: "Gramática Activa", grammarDesc: "Explora los mecanismos del idioma.",
      steps: "pasos", level: "Nivel", locked: "Bloqueado", completed: "Completado",
      unavailable: "Lección no disponible",
      unavailableDesc: "La lección solicitada no se pudo cargar o no contiene pasos.",
      backToDashboard: "Volver al panel", keepGoing: "¡Sigue así!",
      xpEarned: "XP ganados", wellDone: "¡Bien hecho!", tryAgain: "Casi — recuerda esto.",
      whyWrong: "¿Por qué me equivoqué?", whyWrongDefault: "Esta respuesta es incorrecta. Observa la respuesta correcta en verde y compara las pronunciaciones.",
      finish: "Terminar", nextStep: "Siguiente paso"
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
    },
    common: {
      back: "Atrás", loading: "Cargando...", close: "Cerrar", save: "Guardar", cancel: "Cancelar",
      continue: "Continuar", retry: "Reintentar", start: "Empezar", check: "Comprobar", next: "Siguiente",
      previous: "Anterior", yes: "Sí", no: "No", ok: "OK", error: "Error", success: "Éxito",
      language: "Idioma", interfaceLanguage: "Idioma de la interfaz", chooseLanguage: "Elegir idioma",
      offline: "Sin conexión", offlineReady: "Listo sin conexión", online: "En línea", guest: "Invitado",
      premium: "Premium", free: "Gratis", locked: "Bloqueado", unlock: "Desbloquear",
      days: "Días", day: "Día", minutes: "min", level: "Nivel", xp: "XP", streak: "Racha",
      module: "Módulo", lessons: "Lecciones", words: "palabras", progress: "Progreso", seeAll: "Ver todo",
      comingSoon: "Próximamente", search: "Buscar", all: "Ver todo", menu: "Menú",
      profile: "Perfil", login: "Iniciar sesión", signup: "Registrarse", logout: "Cerrar sesión",
      home: "Inicio", steps: "pasos", rights: "Todos los derechos reservados", madeWith: "Hecho con",
      unavailable: "Lección no disponible",
      unavailableDesc: "La lección solicitada no se pudo cargar o no contiene pasos.",
      backToDashboard: "Volver al panel"
    },
    pages: {
      etudier: { badge: "Currículo completo", title: "Tu recorrido completo — 7 módulos", module: "Módulo", steps: "pasos", level: "Nivel", premium: "Kenza Pro" },
      grammaire: { badge: "Gramática Activa", title: "Gramática y Conjugación", conjugationTable: "Tabla de conjugación", grammarLessons: "Lecciones de gramática (Módulo 4)", steps: "pasos" },
      parler: { badge: "Práctica Oral", title: "Entrenador de pronunciación" },
      revisions: {
        badge: "Repasos y Progreso", title: "Repasos y Mazos de tarjetas",
        tabSrs: "Repaso inteligente", tabDecks: "Mis mazos de tarjetas", tabGamification: "Progreso y Logros",
        activityMap: "Mapa de actividad", myBadges: "Mis logros", weeklyLeague: "Ligas semanales"
      }
    },
    footer: { tagline: "Aprende Darija marroquí, paso a paso.", rights: "Todos los derechos reservados." },
    modules: {
      srs: { spacedRepetition: "Repetición Espaciada", relisten: "Volver a escuchar", revealHint: "Haz clic o pulsa Espacio para revelar la respuesta" },
      decks: { title: "Gestor de mazos", cardsInCollection: "tarjetas en tu colección", newWord: "Nueva palabra", searchPlaceholder: "Buscar una palabra, una traducción...", toReview: "Por repasar", noCards: "No se encontraron tarjetas", noCardsDesc: "Prueba otra palabra clave o cambia tus filtros de búsqueda.", all: "Todas", learning: "En aprendizaje", mastered: "Adquiridas", roleplay: "Roleplay", manual: "Manual", module: "Módulo", deleteConfirm: "¿Seguro que quieres eliminar esta tarjeta?", audioOffline: "Audio no disponible sin conexión"},
      speech: { listenModel: "Escuchar el modelo", listening: "Escuchando...", pressMic: "Toca el micrófono para hablar", keepPracticing: "¡Sigue practicando!", veryClear: "¡Muy claro, bien hecho!", excellent: "¡Excelente pronunciación!", speechRecognition: "Reconocimiento de voz:"},
      grammar: { positive: "Positivo", negative: "Negativo", toMe: "A mí", toYou: "A ti", toHim: "A él", understood: "Entendí", notUnderstood: "No entendí", iEat: "Como", iDontEat: "No como", iWillGo: "Voy a ir", youWillGo: "Vas a ir" },
      badges: { cafeLesson: "Completar la lección del café", taxi: "Manejar el petit taxi con éxito", souk: "Dominar el regateo", earnXp: "Gana 500 XP"},
      roleplay: { addedToSrs: "¡Frase añadida a tu mazo SRS!", saveToSrs: "Guardar en mi mazo (SRS)", listeningSpeak: "Escuchando (habla)...", inputPlaceholder: "Tu mensaje en Darija o Francés...", missionComplete: "¡Misión cumplida! Mantuviste la conversación.", claimXp: "Reclamar mis +25 XP y salir"},
      scenario: { subtitle: "Practica con personajes marroquíes inmersivos", dialoguesTitle: "Diálogos guionizados (Situaciones reales)", dialoguesDesc: "Practica situaciones reales con corrección automática", exploreMore: "Explorar más", fullPath: "Ruta completa (7 módulos)", pronunciation: "Entrenamiento de pronunciación", revisions: "Repasos y mazos de cartas", internetRequired: "Conexión a Internet requerida", internetDesc: "Las conversaciones libres con IA requieren conexión de red. Mientras tanto, tus módulos sin conexión siguen disponibles.", launchSrs: "Iniciar un repaso SRS", modalTitle: "Situaciones con IA", grammar: "Gramática y Conjugación", back: "Atrás"},
      paywall: { errorInit: "Error al inicializar el pago", upgradeSuccess: "¡Cuenta actualizada a Kenza Pro (Modo Demo)!", errorRetry: "No se pudo inicializar el pago. Inténtalo de nuevo.", closeLabel: "Cerrar ventana", advancedPath: "RUTA AVANZADA", unlockB1B2: "Desbloquea los Módulos B1 y B2", advancedDesc: "Continúa tu viaje hacia Tánger y profundiza en las sutilezas del dialecto marroquí.", aiImmersion: "INMERSIÓN IA SIN LÍMITE", unlimitedAi: "Conversaciones IA Ilimitadas", aiSubtitle: "Has agotado tu sesión de IA gratuita de hoy. Pasa a Kenza Pro para conversar libremente con todos los personajes.", culturalKicker: "PASAPORTE CULTURAL", masterDarija: "Domina la Darija sin límites", culturalSubtitle: "Libera todo el potencial de tu aprendizaje de Darija con acceso completo al ecosistema Kenza.", benefit1: "Acceso total a los Módulos 3, 4 y 5 (Niveles B1 y B2)", benefit2: "Roleplay IA ilimitado (Todos los personajes y escenarios sin cuota)", benefit3: "Voz sintetizada (TTS) natural y modo 100% sin conexión", benefit4: "Visados oficiales del Pasaporte Cultural y seguimiento de dominio", certified: "Aprendizaje certificado — Garantizado sin compromiso", plansTitle: "Planes Kenza Pro", chooseCadence: "Elige tu ritmo", cadenceDesc: "Invierte en tu fluidez oral. Modificable en cualquier momento.", bestOffer: "-40% · Mejor oferta", yearly: "Plan Anual", billed: "Facturado {total}", perMonth: "/ mes", monthly: "Plan Mensual", monthlyDesc: "Libertad total, sin compromiso", preparing: "Preparando el pago...", unlockCta: "Desbloquear Kenza Pro", securePayment: "Pago cifrado y seguro · Cancela en 1 clic cuando quieras." },
      install: { title: "Instalar KENZA", iosHintA: "Toca el icono de compartir", iosHintB: "y luego «Añadir a pantalla de inicio» para un acceso rápido.", androidHint: "Añade la app a tu pantalla de inicio para una experiencia óptima.", button: "Instalar la aplicación" },
      passport: { title: "Mi Pasaporte Darija", guest: "INVITADO(A)", copied: "¡Copiado!", shareText: "¡Aprobé mi {level} de Darija marroquí en KENZA con una puntuación del {score}%!", passportTitle: "PASAPORTE DARIJA", holder: "Titular", levelValidated: "Nivel Aprobado", score: "PUNTOS", validated: "VALIDADO", save: "Guardar", share: "Compartir" },
      ui: { navReview: "Repasar", offlineActive: "Modo Sin Conexión activo — Módulos y repasos SRS disponibles sin conexión", onlineRestored: "Conexión restablecida", voiceRetry: "Por mejorar, escucha de nuevo a Jamal.", voiceUnderstandable: "Comprensible, trabaja los sonidos de abajo.", readingSpeed: "Velocidad de lectura", addNewWord: "Añadir una palabra nueva", notePlaceholder: "ej. Escuchado en el café, útil para despedirse.", addToReviews: "Añadir a mis repasos", excellentAnswer: "¡Excelente respuesta!", verify: "Comprobar", hideTranslation: "Ocultar la traducción", showTranslation: "Ver la traducción", listeningNow: "Escuchando...", holdToTalk: "Mantén o toca para hablar", accuracy: "Precisión", editWord: "Editar expresión", inDarijaArabizi: "En Darija (Arabizi)", translationLabel: "Traducción", inArabicLetters: "En letras árabes (opcional)", notesContext: "Notas / Contexto (opcional)", incorrect: "Incorrecto", correctAnswer: "Respuesta correcta:" },
      home: { seeAll: "Ver todo", googleError: "No se pudo iniciar sesión con Google.", proActivated: "¡Felicidades! Tu suscripción a Kenza Pro está activa.", phrasesDesc: "Vocabulario cotidiano con audio natural.", audioPronAria: "Pronunciación en audio de la frase.", phraseCopied: "Frase copiada al portapapeles.", graded: "Valorado: {grade}", gradeAgain: "por repasar", gradeHard: "difícil", gradeGood: "bien", gradeEasy: "fácil", resetConfirm: "¿Borrar el progreso local en este dispositivo?", resetDone: "Progreso local restablecido.", dailyGoal: "Objetivo diario: 10 minutos de práctica cada día.", langSwitcher: "Selector de idioma", switchToFr: "Cambiar a francés", switchToEn: "Cambiar a inglés", switchToEs: "Cambiar a español", switchToAr: "Cambiar a árabe", openSpace: "Abrir mi espacio", closeLesson: "Cerrar la lección", explorePath: "Explorar la ruta", lessonLocked: "{title}, bloqueada", startLesson: "Empezar {title}", reviewLesson: "Repasar {title}", catEssentials: "LO ESENCIAL", catDaily: "A DIARIO", catLocate: "ORIENTARSE", catAdvanced: "INMERSIÓN AVANZADA", validated: "Aprobado ✓", removeFav: "Quitar de favoritos", addFav: "Añadir a favoritos", imgMedina: "Medina de Marruecos", imgMintTea: "Té con menta", inProgress: "En curso" },
    }
  },
  ar: {
    side: {
      today: "اليوم", path: "مساري", phrases: "دفتر العبارات", review: "مراجعة اليوم",
      learn: "تعلّم", oral: "التحدث والذكاء الاصطناعي", space: "مساحتك"
    },
    nav: {
      home: "الرئيسية", parcours: "المسار", phrasebook: "العبارات", review: "المراجعة",
      speech: "التحدث", profile: "الملف", learn: "تعلّم", grammar: "القواعد",
      speak: "تحدّث", revise: "راجع"
    },
    header: {
      guestMode: "وضع الضيف", logout: "تسجيل الخروج", arabizi: "عربيزي (3afak)", arabic: "عربي (عفاك)", duo: "مزدوج",
      menu: "القائمة", settings: "الإعدادات", profile: "عرض الملف", login: "تسجيل الدخول / إنشاء حساب",
      notation: "الكتابة:", dialect: "اللهجة:", uiLanguage: "لغة الواجهة:",
      sound: "الصوت", soundOn: "الصوت مفعّل", soundOff: "الصوت مكتوم", offline: "بدون اتصال", offlineReady: "جاهز دون اتصال",
      openMenu: "فتح قائمة التنقل", closeMenu: "إغلاق القائمة", preferences: "تفضيلات اللغة"
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
      grammarTitle: "القواعد النشطة", grammarDesc: "اكتشف آليات اللغة.",
      steps: "خطوات", level: "المستوى", locked: "مقفل", completed: "مكتمل",
      unavailable: "الدرس غير متاح",
      unavailableDesc: "لم يتم تحميل الدرس المطلوب أو أنه لا يحتوي على أي خطوات.",
      backToDashboard: "العودة إلى اللوحة", keepGoing: "واصل التقدم!",
      xpEarned: "نقاط مكتسبة", wellDone: "أحسنت!", tryAgain: "تقريباً — تذكّر هذا.",
      whyWrong: "لماذا أخطأت؟", whyWrongDefault: "هذه الإجابة غير صحيحة. انظر إلى الإجابة الصحيحة باللون الأخضر وقارن النطق.",
      finish: "إنهاء", nextStep: "الخطوة التالية"
    },
    srs: {
      flip: "اقلب البطاقة", again: "مجدداً", hard: "صعب", good: "جيد", easy: "سهل",
      dueToday: "بطاقات اليوم", tapToFlip: "انقر للقلب ->",
      answer: "الإجابة", translateArabizi: "ترجم إلى العَربي زي", translateArabic: "ترجم إلى العربية", translateDuo: "ترجم إلى الدارجة (ثنائي)",
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
    },
    common: {
      back: "رجوع", loading: "جاري التحميل...", close: "إغلاق", save: "حفظ", cancel: "إلغاء",
      continue: "استمر", retry: "حاول مجدداً", start: "ابدأ", check: "تحقق", next: "التالي",
      previous: "السابق", yes: "نعم", no: "لا", ok: "حسناً", error: "خطأ", success: "نجاح",
      language: "اللغة", interfaceLanguage: "لغة الواجهة", chooseLanguage: "اختر اللغة",
      offline: "بدون اتصال", offlineReady: "جاهز دون اتصال", online: "متصل", guest: "ضيف",
      premium: "مميز", free: "مجاني", locked: "مقفل", unlock: "فتح",
      days: "أيام", day: "يوم", minutes: "دقيقة", level: "المستوى", xp: "نقاط", streak: "السلسلة",
      module: "وحدة", lessons: "دروس", words: "كلمات", progress: "التقدم", seeAll: "عرض الكل",
      comingSoon: "قريباً", search: "بحث", all: "عرض الكل", menu: "القائمة",
      profile: "الملف", login: "تسجيل الدخول", signup: "إنشاء حساب", logout: "تسجيل الخروج",
      home: "الرئيسية", steps: "خطوات", rights: "جميع الحقوق محفوظة", madeWith: "صُنع بـ",
      unavailable: "الدرس غير متاح",
      unavailableDesc: "لم يتم تحميل الدرس المطلوب أو أنه لا يحتوي على أي خطوات.",
      backToDashboard: "العودة إلى اللوحة"
    },
    pages: {
      etudier: { badge: "المسار الكامل", title: "مسارك الكامل — 7 وحدات", module: "الوحدة", steps: "خطوات", level: "المستوى", premium: "Kenza Pro" },
      grammaire: { badge: "القواعد النشطة", title: "القواعد والتصريف", conjugationTable: "جدول التصريف", grammarLessons: "دروس القواعد (الوحدة 4)", steps: "خطوات" },
      parler: { badge: "التدريب الشفهي", title: "تدريب النطق" },
      revisions: {
        badge: "المراجعات والتقدم", title: "المراجعات وبطاقاتي",
        tabSrs: "المراجعة الذكية", tabDecks: "بطاقاتي", tabGamification: "التقدم والأوسمة",
        activityMap: "خريطة النشاط", myBadges: "أوسمتي", weeklyLeague: "الترتيب الأسبوعي"
      }
    },
    footer: { tagline: "تعلّم الدارجة المغربية خطوة بخطوة.", rights: "جميع الحقوق محفوظة." },
    modules: {
      srs: { spacedRepetition: "التكرار المتباعد", relisten: "إعادة الاستماع", revealHint: "انقر أو اضغط مسافة لكشف الإجابة" },
      decks: { title: "مدير المجموعات", cardsInCollection: "بطاقة في مجموعتك", newWord: "كلمة جديدة", searchPlaceholder: "ابحث عن كلمة أو ترجمة...", toReview: "للمراجعة", noCards: "لم يتم العثور على بطاقات", noCardsDesc: "جرّب كلمة مفتاحية أخرى أو غيّر عوامل التصفية.", all: "الكل", learning: "قيد التعلم", mastered: "مكتسب", roleplay: "محادثة", manual: "يدوي", module: "المنهج", deleteConfirm: "هل أنت متأكد أنك تريد حذف هذه البطاقة؟", audioOffline: "الصوت غير متوفر دون إنترنت"},
      speech: { listenModel: "استمع إلى النموذج", listening: "جارٍ الاستماع...", pressMic: "اضغط على الميكروفون للتحدث", keepPracticing: "واصل التدريب!", veryClear: "واضح جدًا، أحسنت!", excellent: "نطق ممتاز!", speechRecognition: "التعرف على الصوت:"},
      grammar: { positive: "إيجابي", negative: "سلبي", toMe: "لي", toYou: "لك", toHim: "له", understood: "فهمت", notUnderstood: "لم أفهم", iEat: "آكل", iDontEat: "لا آكل", iWillGo: "سأذهب", youWillGo: "ستذهب" },
      badges: { cafeLesson: "إكمال درس المقهى", taxi: "التعامل مع الطاكسي الصغير بنجاح", souk: "إتقان المساومة", earnXp: "اكسب 500 نقطة XP"},
      roleplay: { addedToSrs: "تمت إضافة العبارة إلى مجموعة SRS!", saveToSrs: "حفظ في مجموعتي (SRS)", listeningSpeak: "جارٍ الاستماع (تحدث)...", inputPlaceholder: "رسالتك بالدارجة أو الفرنسية...", missionComplete: "أُنجزت المهمة! لقد أدرت المحادثة.", claimXp: "احصل على +25 XP واخرج"},
      scenario: { subtitle: "تدرّب مع شخصيات مغربية غامرة", dialoguesTitle: "حوارات مُعدّة (مواقف واقعية)", dialoguesDesc: "تدرّب على مواقف واقعية مع تصحيح تلقائي", exploreMore: "استكشف المزيد", fullPath: "المسار الكامل (7 وحدات)", pronunciation: "تدريب النطق", revisions: "المراجعات ومجموعات البطاقات", internetRequired: "مطلوب اتصال بالإنترنت", internetDesc: "تتطلب المحادثات الحرة مع الذكاء الاصطناعي اتصالاً بالشبكة. في غضون ذلك، تبقى وحداتك دون اتصال متاحة.", launchSrs: "بدء مراجعة SRS", modalTitle: "مواقف ومحادثات مع الذكاء الاصطناعي", grammar: "القواعد والتصريف", back: "رجوع"},
      paywall: { errorInit: "خطأ في تهيئة الدفع", upgradeSuccess: "تمت ترقية الحساب بنجاح إلى كنزة برو (وضع تجريبي)!", errorRetry: "تعذّر تهيئة الدفع. يرجى المحاولة مرة أخرى.", closeLabel: "إغلاق النافذة", advancedPath: "المسار المتقدم", unlockB1B2: "افتح الوحدتين B1 و B2", advancedDesc: "واصل رحلتك نحو طنجة وتعمّق في دقائق اللهجة المغربية.", aiImmersion: "انغماس ذكاء اصطناعي بلا حدود", unlimitedAi: "محادثات ذكاء اصطناعي غير محدودة", aiSubtitle: "لقد أنهيت جلسة الذكاء الاصطناعي المجانية لهذا اليوم. انتقل إلى كنزة برو للتحاور بحرية مع جميع الشخصيات.", culturalKicker: "جواز السفر الثقافي", masterDarija: "أتقن الدارجة بلا حدود", culturalSubtitle: "أطلق كامل إمكانات تعلّمك للدارجة مع الوصول الكامل إلى منظومة كنزة.", benefit1: "وصول كامل إلى الوحدات 3 و4 و5 (المستويان B1 و B2)", benefit2: "لعب أدوار بالذكاء الاصطناعي بلا حدود (كل الشخصيات والمشاهد دون حصة)", benefit3: "تركيب صوتي طبيعي (TTS) ووضع يعمل 100% دون اتصال", benefit4: "تأشيرات رسمية لجواز السفر الثقافي وتتبّع الإتقان", certified: "تعلّم موثّق — مضمون دون التزام", plansTitle: "خطط كنزة برو", chooseCadence: "اختر وتيرتك", cadenceDesc: "استثمر في طلاقتك الشفهية. قابلة للتغيير في أي وقت.", bestOffer: "-40% · أفضل عرض", yearly: "اشتراك سنوي", billed: "يُفوتَر {total}", perMonth: "/ شهر", monthly: "اشتراك شهري", monthlyDesc: "حرية كاملة، دون التزام", preparing: "جارٍ تحضير الدفع...", unlockCta: "افتح كنزة برو", securePayment: "دفع مشفّر وآمن · إلغاء بنقرة واحدة في أي وقت." },
      install: { title: "ثبّت كَنزة", iosHintA: "اضغط على أيقونة المشاركة", iosHintB: "ثم «إضافة إلى الشاشة الرئيسية» للوصول السريع.", androidHint: "أضف التطبيق إلى شاشتك الرئيسية لتجربة مثالية.", button: "تثبيت التطبيق" },
      passport: { title: "جواز سفري للدارجة", guest: "ضيف", copied: "تم النسخ!", shareText: "اجتزت {level} في الدارجة المغربية على كَنزا بدرجة {score}%!", passportTitle: "جواز سفر الدارجة", holder: "الحامل", levelValidated: "المستوى المجتاز", score: "النقاط", validated: "مُصادَق", save: "حفظ", share: "مشاركة" },
      ui: { navReview: "راجع", offlineActive: "وضع عدم الاتصال مُفعّل — الوحدات ومراجعات SRS متاحة دون اتصال", onlineRestored: "تمت استعادة الاتصال", voiceRetry: "بحاجة إلى تحسين، استمع إلى جمال مرة أخرى.", voiceUnderstandable: "مفهوم، اعمل على الأصوات أدناه.", readingSpeed: "سرعة القراءة", addNewWord: "أضف كلمة جديدة", notePlaceholder: "مثال: سمعتها في المقهى، مفيدة للوداع.", addToReviews: "أضف إلى مراجعاتي", excellentAnswer: "إجابة ممتازة!", verify: "تحقّق", hideTranslation: "إخفاء الترجمة", showTranslation: "عرض الترجمة", listeningNow: "جارٍ الاستماع...", holdToTalk: "اضغط مطوّلاً أو انقر للتحدث", accuracy: "الدقة", editWord: "تعديل الكلمة", inDarijaArabizi: "بالدارجة (عربيزي)", translationLabel: "الترجمة", inArabicLetters: "بالحروف العربية (اختياري)", notesContext: "ملاحظات / سياق (اختياري)", incorrect: "غير صحيح", correctAnswer: "الإجابة الصحيحة:" },
      home: { seeAll: "عرض الكل", googleError: "تعذّر بدء تسجيل الدخول عبر Google.", proActivated: "تهانينا! اشتراكك في كنزة برو مُفعّل.", phrasesDesc: "مفردات يومية مع صوت طبيعي.", audioPronAria: "النطق الصوتي للعبارة.", phraseCopied: "تم نسخ العبارة إلى الحافظة.", graded: "التقييم: {grade}", gradeAgain: "للمراجعة", gradeHard: "صعب", gradeGood: "جيد", gradeEasy: "سهل", resetConfirm: "حذف التقدّم المحلي على هذا الجهاز؟", resetDone: "تمت إعادة تعيين التقدّم المحلي.", dailyGoal: "الهدف اليومي: 10 دقائق من التدريب كل يوم.", langSwitcher: "محدّد اللغة", switchToFr: "التبديل إلى الفرنسية", switchToEn: "التبديل إلى الإنجليزية", switchToEs: "التبديل إلى الإسبانية", switchToAr: "التبديل إلى العربية", openSpace: "افتح مساحتي", closeLesson: "إغلاق الدرس", explorePath: "استكشف المسار", lessonLocked: "{title}، مقفلة", startLesson: "ابدأ {title}", reviewLesson: "راجع {title}", catEssentials: "الأساسيات", catDaily: "في الحياة اليومية", catLocate: "التوجّه", catAdvanced: "انغماس متقدم", validated: "مجتاز ✓", removeFav: "إزالة من المفضلة", addFav: "إضافة إلى المفضلة", imgMedina: "مدينة مغربية", imgMintTea: "شاي بالنعناع", inProgress: "قيد التقدم" },
    }
  }
} as const;

export type Translations = typeof translations;
