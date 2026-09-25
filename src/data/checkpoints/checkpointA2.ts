export const checkpointA2 = {
  id: 'checkpoint_a2',
  title: 'Palier A2 — Autonomie, Riad & Santé',
  certificateCode: 'KNZ-A2-',
  questions: [
    {
      id: 'q1',
      prompt: 'Où est ma chambre ?',
      answerId: 'a1',
      arabizi: 'Fin jate l-bit dyali ?',
      arabic: 'فين جات البيت ديالي؟',
      options: [
        { id: 'a1', arabizi: 'Fin jate l-bit dyali ?', arabic: 'فين جات البيت ديالي؟', translation: 'Où est ma chambre ?' },
        { id: 'd1', arabizi: 'Bch7al hada ?', arabic: 'بشحال هادا؟', translation: 'Combien ça coûte ?' },
        { id: 'd2', arabizi: 'Fin kayna s-sbitar ?', arabic: 'فين كاين السبيطار؟', translation: 'Où est l\'hôpital ?' }
      ]
    },
    {
      id: 'q2',
      prompt: 'La clé',
      answerId: 'a1',
      arabizi: 'S-sarout',
      arabic: 'الساروت',
      options: [
        { id: 'a1', arabizi: 'S-sarout', arabic: 'الساروت', translation: 'La clé' },
        { id: 'd1', arabizi: 'L-ma', arabic: 'الما', translation: 'L\'eau' },
        { id: 'd2', arabizi: 'L-bit', arabic: 'البيت', translation: 'La chambre' }
      ]
    },
    {
      id: 'q3',
      prompt: 'L\'eau chaude ne marche pas',
      answerId: 'a1',
      arabizi: 'L-ma skhoun makhddamch',
      arabic: 'الما سخون ماخدامش',
      options: [
        { id: 'a1', arabizi: 'L-ma skhoun makhddamch', arabic: 'الما سخون ماخدامش', translation: 'L\'eau chaude ne marche pas' },
        { id: 'd1', arabizi: 'L-ma makhddamch', arabic: 'الما ماخدامش', translation: 'L\'eau ne marche pas' },
        { id: 'd2', arabizi: 'La clim makhddamch', arabic: 'لاكليم ماخدامش', translation: 'La clim ne marche pas' }
      ]
    },
    {
      id: 'q4',
      prompt: 'Il me faut une autre serviette s\'il vous plaît',
      answerId: 'a1',
      arabizi: 'Khesni fota okhra 3afak',
      arabic: 'خصني فوطة اخرى عفاك',
      options: [
        { id: 'a1', arabizi: 'Khesni fota okhra 3afak', arabic: 'خصني فوطة اخرى عفاك', translation: 'Il me faut une autre serviette s\'il vous plaît' },
        { id: 'd1', arabizi: 'Bghit n3ass 3afak', arabic: 'بغيت نعس عفاك', translation: 'Je veux dormir s\'il vous plaît' },
        { id: 'd2', arabizi: 'Khesni ma skhoun', arabic: 'خصني ما سخون', translation: 'Il me faut de l\'eau chaude' }
      ]
    },
    {
      id: 'q5',
      prompt: 'J\'ai très mal à la tête',
      answerId: 'a1',
      arabizi: 'Kayderrni rasi bezzaf',
      arabic: 'كيضرني راسي بزاف',
      options: [
        { id: 'a1', arabizi: 'Kayderrni rasi bezzaf', arabic: 'كيضرني راسي بزاف', translation: 'J\'ai très mal à la tête' },
        { id: 'd1', arabizi: 'Kayderrni l-kersh bezzaf', arabic: 'كيضرني الكرش بزاف', translation: 'J\'ai très mal au ventre' },
        { id: 'd2', arabizi: 'Ana mrid', arabic: 'انا مريض', translation: 'Je suis malade' }
      ]
    },
    {
      id: 'q6',
      prompt: 'Donne-moi un médicament',
      answerId: 'a1',
      arabizi: '3tini dwa',
      arabic: 'عطيني دوا',
      options: [
        { id: 'a1', arabizi: '3tini dwa', arabic: 'عطيني دوا', translation: 'Donne-moi un médicament' },
        { id: 'd1', arabizi: '3tini l-ma', arabic: 'عطيني الما', translation: 'Donne-moi de l\'eau' },
        { id: 'd2', arabizi: 'Fin kayna fermasian', arabic: 'فين كاينة فرمسيان', translation: 'Où est la pharmacie' }
      ]
    },
    {
      id: 'q7',
      prompt: 'Je suis perdu dans la médina',
      answerId: 'a1',
      arabizi: 'Tleft f-l-medina',
      arabic: 'تلفت فالمدينة',
      options: [
        { id: 'a1', arabizi: 'Tleft f-l-medina', arabic: 'تلفت فالمدينة', translation: 'Je suis perdu dans la médina' },
        { id: 'd1', arabizi: 'Bghit nemchi l-medina', arabic: 'بغيت نمشي للمدينة', translation: 'Je veux aller à la médina' },
        { id: 'd2', arabizi: 'Fin jat l-medina', arabic: 'فين جات المدينة', translation: 'Où est la médina' }
      ]
    },
    {
      id: 'q8',
      prompt: 'Laissez-moi tranquille',
      answerId: 'a1',
      arabizi: 'Khellini f t-ti9ar',
      arabic: 'خليني ف التيقار',
      options: [
        { id: 'a1', arabizi: 'Khellini f t-ti9ar', arabic: 'خليني ف التيقار', translation: 'Laissez-moi tranquille' },
        { id: 'd1', arabizi: '3awenni 3afak', arabic: 'عاوني عفاك', translation: 'Aide-moi s\'il te plaît' },
        { id: 'd2', arabizi: 'Sir f7alek', arabic: 'سير فحالك', translation: 'Va t\'en' }
      ]
    },
    {
      id: 'q9',
      prompt: 'Aide-moi s\'il te plaît',
      answerId: 'a1',
      arabizi: '3awenni 3afak',
      arabic: 'عاوني عفاك',
      options: [
        { id: 'a1', arabizi: '3awenni 3afak', arabic: 'عاوني عفاك', translation: 'Aide-moi s\'il te plaît' },
        { id: 'd1', arabizi: 'Khellini 3afak', arabic: 'خليني عفاك', translation: 'Laisse-moi s\'il te plaît' },
        { id: 'd2', arabizi: 'Shoukrane bezzaf', arabic: 'شكرا بزاف', translation: 'Merci beaucoup' }
      ]
    },
    {
      id: 'q10',
      prompt: 'En panne',
      answerId: 'a1',
      arabizi: 'Makhddamch',
      arabic: 'ماخدامش',
      options: [
        { id: 'a1', arabizi: 'Makhddamch', arabic: 'ماخدامش', translation: 'En panne' },
        { id: 'd1', arabizi: 'Skhoun', arabic: 'سخون', translation: 'Chaud' },
        { id: 'd2', arabizi: 'Mrid', arabic: 'مريض', translation: 'Malade' }
      ]
    },
    {
      id: 'q11',
      prompt: 'Pharmacie',
      answerId: 'a1',
      arabizi: 'Fermasian',
      arabic: 'فرمسيان',
      options: [
        { id: 'a1', arabizi: 'Fermasian', arabic: 'فرمسيان', translation: 'Pharmacie' },
        { id: 'd1', arabizi: 'Sbitar', arabic: 'سبيطار', translation: 'Hôpital' },
        { id: 'd2', arabizi: 'Tbib', arabic: 'طبيب', translation: 'Médecin' }
      ]
    },
    {
      id: 'q12',
      prompt: 'À quelle heure est le petit-déjeuner ?',
      answerId: 'a1',
      arabizi: 'F-ay weqt kaykoun l-ftour ?',
      arabic: 'فأشمن وقت كايكون الفطور؟',
      options: [
        { id: 'a1', arabizi: 'F-ay weqt kaykoun l-ftour ?', arabic: 'فأشمن وقت كايكون الفطور؟', translation: 'À quelle heure est le petit-déjeuner ?' },
        { id: 'd1', arabizi: 'Fin kaykoun l-ftour ?', arabic: 'فين كايكون الفطور؟', translation: 'Où est le petit-déjeuner ?' },
        { id: 'd2', arabizi: 'Bch7al l-ftour ?', arabic: 'بشحال الفطور؟', translation: 'Combien coûte le petit-déjeuner ?' }
      ]
    },
    {
      id: 'q13',
      prompt: 'Le ventre',
      answerId: 'a1',
      arabizi: 'L-kersh',
      arabic: 'الكرش',
      options: [
        { id: 'a1', arabizi: 'L-kersh', arabic: 'الكرش', translation: 'Le ventre' },
        { id: 'd1', arabizi: 'Ras', arabic: 'راس', translation: 'La tête' },
        { id: 'd2', arabizi: 'Yed', arabic: 'يد', translation: 'La main' }
      ]
    },
    {
      id: 'q14',
      prompt: 'La clim fait du bruit',
      answerId: 'a1',
      arabizi: 'La clim katdir s-sda3',
      arabic: 'لاكليم كادير الصداع',
      options: [
        { id: 'a1', arabizi: 'La clim katdir s-sda3', arabic: 'لاكليم كادير الصداع', translation: 'La clim fait du bruit' },
        { id: 'd1', arabizi: 'La clim makhddamch', arabic: 'لاكليم ماخدامش', translation: 'La clim ne marche pas' },
        { id: 'd2', arabizi: 'La clim mzyana', arabic: 'لاكليم مزيانة', translation: 'La clim est bien' }
      ]
    },
    {
      id: 'q15',
      prompt: 'Où est la pharmacie la plus proche ?',
      answerId: 'a1',
      arabizi: 'Fin kayna a9rab fermasian ?',
      arabic: 'فين كاينة اقرب فرمسيان؟',
      options: [
        { id: 'a1', arabizi: 'Fin kayna a9rab fermasian ?', arabic: 'فين كاينة اقرب فرمسيان؟', translation: 'Où est la pharmacie la plus proche ?' },
        { id: 'd1', arabizi: 'Fin jat l-medina ?', arabic: 'فين جات المدينة؟', translation: 'Où est la médina ?' },
        { id: 'd2', arabizi: 'Bghit nemchi l-fermasian', arabic: 'بغيت نمشي لفرمسيان', translation: 'Je veux aller à la pharmacie' }
      ]
    }
  ]
};
