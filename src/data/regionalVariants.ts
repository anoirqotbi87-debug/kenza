export interface RegionalVariant {
  id: string;
  baseArabizi: string; // The standard Casablanca word
  variant: string;     // The regional replacement
  variantArabic: string;
  description: string;
  region: 'chamal' | 'fes';
}

export const regionalVariants: RegionalVariant[] = [
  { id: 'v1', baseArabizi: 'Nta', variant: 'Ntina', variantArabic: 'نْتِينَا', description: 'Toi (masc/fém)', region: 'chamal' },
  { id: 'v2', baseArabizi: 'Nti', variant: 'Ntina', variantArabic: 'نْتِينَا', description: 'Toi (masc/fém)', region: 'chamal' },
  { id: 'v3', baseArabizi: 'Shnu kat-dir', variant: 'Chni kat-3mel', variantArabic: 'شْنِي كَتْعْمَلْ', description: 'Que fais-tu ?', region: 'chamal' },
  { id: 'v4', baseArabizi: 'Weld', variant: '3ayel', variantArabic: 'عَايَلْ', description: 'Garçon', region: 'chamal' },
  { id: 'v5', baseArabizi: 'Bent', variant: '3ayla', variantArabic: 'عَايْلَة', description: 'Fille', region: 'chamal' },
  { id: 'v6', baseArabizi: 'Fin ghadi', variant: 'Fayn machi', variantArabic: 'فَايْن مَاشِي', description: 'Où vas-tu ?', region: 'chamal' },
  { id: 'v7', baseArabizi: 'Zwin bzzaf', variant: 'Hayel', variantArabic: 'هَايَلْ', description: 'Très bien / Magnifique', region: 'chamal' },
  
  { id: 'v8', baseArabizi: 'Gal', variant: 'Aal', variantArabic: 'آلْ', description: 'Il a dit (Hamza au lieu du Qaf)', region: 'fes' },
  { id: 'v9', baseArabizi: 'Dyali', variant: 'Di-ali', variantArabic: 'دِيَالِي', description: 'À moi / Le mien', region: 'fes' },
  { id: 'v10', baseArabizi: 'Sba7', variant: 'S-sba7iyat', variantArabic: 'الصْبَاحِيَّاتْ', description: 'La matinée', region: 'fes' },
  { id: 'v11', baseArabizi: '9hwa', variant: 'L-qhwa l-7lowa', variantArabic: 'القَهْوَة الحْلْوَة', description: 'Café (traditionnel)', region: 'fes' },
];

export const getVariantForWord = (wordArabizi: string, region: 'chamal' | 'casablanca' | 'fes'): RegionalVariant | undefined => {
  if (region === 'casablanca') return undefined;
  return regionalVariants.find(v => v.baseArabizi.toLowerCase() === wordArabizi.toLowerCase() && v.region === region);
};
