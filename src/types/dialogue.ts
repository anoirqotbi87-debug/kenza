export interface DialogueTurn {
  id: string;
  speaker: 'bot' | 'user';
  speakerRole: string; // Ex: "Chauffeur de Taxi"
  arabicText: string;
  arabiziText: string;
  translationFr: string;
  audioKey?: string;
  // Attendu pour le tour de l'utilisateur :
  expectedPhrases?: {
    primaryArabizi: string;
    primaryArabic: string;
    acceptedVariants: string[]; // Variantes acceptées (ex: "Bab Boujloud 3afak", "L-Bab Boujloud")
    hints: string[];            // Mots-clés d'aide (ex: ["Bab Boujloud", "3afak"])
  };
}

export interface DialogueScenario {
  id: string;
  title: string;
  titleFr?: string;
  titleI18n?: { fr: string; ar: string; en: string; es: string };
  categoryI18n?: { fr: string; ar: string; en: string; es: string };
  locationI18n?: { fr: string; ar: string; en: string; es: string };
  description?: string;
  descriptionI18n?: { fr: string; ar: string; en: string; es: string };
  category?: 'transport' | 'souk' | 'restaurant' | 'daily';
  location: string;
  level?: 'A1' | 'A2' | 'B1';
  npcName?: string;
  npcRole?: string;
  npcRoleI18n?: { fr: string; ar: string; en: string; es: string };
  npcAvatar?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  objectives?: string[];
  tier?: 'free' | 'premium';
  turns: DialogueTurn[];
}
