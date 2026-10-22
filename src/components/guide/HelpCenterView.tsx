'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  Volume2,
  Mic,
  Languages,
  Brain,
  ChevronDown,
  X,
  Compass,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface HelpCenterViewProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenTour?: () => void;
  inline?: boolean;
}

export type HelpFaqItem = {
  id: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
  question: {
    fr: string;
    en: string;
    es: string;
    ar: string;
  };
  category: {
    fr: string;
    en: string;
    es: string;
    ar: string;
  };
  answer: {
    fr: string;
    en: string;
    es: string;
    ar: string;
  };
  tips?: {
    fr: string[];
    en: string[];
    es: string[];
    ar: string[];
  };
};

export const FAQ_ITEMS: HelpFaqItem[] = [
  {
    id: 'where-to-start',
    icon: Compass,
    iconBg: 'bg-blue-50 text-blue-600',
    iconColor: 'text-blue-600',
    category: {
      fr: 'Démarrage',
      en: 'Getting Started',
      es: 'Primeros Pasos',
      ar: 'البداية',
    },
    question: {
      fr: 'Où commencer ?',
      en: 'Where to start?',
      es: '¿Dónde empezar?',
      ar: 'من أين أبدأ؟',
    },
    answer: {
      fr: 'Rendez-vous dans l\'onglet « Mon parcours ». Commencez par le Module 1 (Premiers pas & Salutations). Chaque leçon propose des phrases authentiques avec prononciation audio, transcription en caractères arabes voyellés et phonétique latine (Arabizi). Écoutez, répétez à voix haute et validez les exercices pour progresser !',
      en: 'Go to the "My Journey" tab. Start with Module 1 (First Steps & Greetings). Each lesson provides authentic sentences with clear audio pronunciation, fully vocalized Arabic script, and Latin phonetics (Arabizi). Listen, repeat out loud, and complete exercises to level up!',
      es: 'Ve a la pestaña «Mi ruta». Comienza con el Módulo 1 (Primeros pasos y saludos). Cada lección ofrece frases auténticas con pronunciación de audio, escritura árabe vocalizada y fonética latina (Arabizi). ¡Escucha, repite en voz alta y completa los ejercicios!',
      ar: 'توجه إلى تبويب «مساري». ابدأ بالوحدة 1 (الخطوات الأولى والتحيات). يقدم كل درس عبارات مغربية أصيلة مع نطق صوتي واضح، وكتابة عربية مشكولة بالكامل، وكتابة صوتية بحروف لاتينية (عربيزي). استمع، كرر بصوت مسموع، وأكمل التمارين لتتقدم!',
    },
    tips: {
      fr: [
        'Commencez par 10 minutes par jour pour ancrer le vocabulaire.',
        'Les modules 1 et 2 sont accessibles gratuitement à tous.',
      ],
      en: [
        'Start with 10 minutes per day to build retention.',
        'Modules 1 and 2 are 100% free for everyone.',
      ],
      es: [
        'Empieza con 10 minutos al día para afianzar el vocabulario.',
        'Los módulos 1 y 2 son completamente gratuitos para todos.',
      ],
      ar: [
        'ابدأ بـ 10 دقائق يومياً لترسيخ المفردات.',
        'الوحدتان 1 و2 متاحتان مجاناً للجميع.',
      ],
    },
  },
  {
    id: 'sound-too-fast',
    icon: Volume2,
    iconBg: 'bg-amber-50 text-amber-600',
    iconColor: 'text-amber-600',
    category: {
      fr: 'Audio & Voix',
      en: 'Audio & Speech',
      es: 'Audio y Voz',
      ar: 'الصوت والنطق',
    },
    question: {
      fr: 'Le son va trop vite ?',
      en: 'Audio is too fast?',
      es: '¿El sonido va muy rápido?',
      ar: 'هل الصوت سريع جداً؟',
    },
    answer: {
      fr: 'Vous pouvez ralentir la vitesse de lecture à 0.75x directement lors de l\'écoute d\'une phrase ou ajuster la vitesse globale dans les paramètres. De plus, chaque lettre et voyelle est minutieusement préservée grâce à notre moteur neuronal marocain, sans avaler les consonnes finales.',
      en: 'You can slow down playback to 0.75x directly while listening to a sentence or adjust global playback speed in Settings. Furthermore, our Moroccan neural engine meticulously articulates every consonant and vocalization, ensuring no cutoffs.',
      es: 'Puedes ralentizar la velocidad de reproducción a 0.75x directamente al escuchar una frase o ajustar la velocidad global en ajustes. Además, nuestro motor neuronal marroquí articula con precisión cada letra sin cortar las consonantes finales.',
      ar: 'يمكنك إبطاء سرعة الاستماع إلى 0.75x مباشرة عند الاستماع إلى أي جملة، أو ضبط السرعة العامة في الإعدادات. علاوة على ذلك، يحافظ محركنا الصوتي العصبي المغربي على كل حرف وتشكيل دون ابتلاع الحروف الأخيرة.',
    },
    tips: {
      fr: [
        'Cliquez sur le bouton de vitesse (1.0x / 0.75x) sur le lecteur audio.',
        'Réécoutez autant de fois que nécessaire sans pénalité.',
      ],
      en: [
        'Click the speed button (1.0x / 0.75x) on the audio player.',
        'Replay as many times as needed with zero penalty.',
      ],
      es: [
        'Haz clic en el botón de velocidad (1.0x / 0.75x) en el reproductor.',
        'Escucha de nuevo tantas veces como quieras sin penalización.',
      ],
      ar: [
        'اضغط على زر السرعة (1.0x / 0.75x) في مشغل الصوت.',
        'أعد الاستماع كما تشاء دون أي قيود.',
      ],
    },
  },
  {
    id: 'talk-to-karim',
    icon: Mic,
    iconBg: 'bg-emerald-50 text-emerald-600',
    iconColor: 'text-emerald-600',
    category: {
      fr: 'Coach IA Conversationnel',
      en: 'AI Conversation Coach',
      es: 'Coach IA de Conversación',
      ar: 'المدرب الذكي للمحادثة',
    },
    question: {
      fr: 'Comment parler à Karim ?',
      en: 'How to talk to Karim?',
      es: '¿Cómo hablar con Karim?',
      ar: 'كيف أتحدث مع كريم؟',
    },
    answer: {
      fr: 'Dans l\'onglet « Aujourd\'hui » ou « Mon parcours », lancez le dialogue « Karim le chauffeur de taxi ». Vous pouvez saisir du texte en français, en arabe ou en Arabizi (ex: "Salam, bghit nmshi l-gare"). Vous pouvez aussi activer le microphone pour lui parler directement. Karim vous répondra vocalement en Darija avec la traduction française sous sa réponse.',
      en: 'In the "Today" or "My Journey" tab, launch the "Karim the Taxi Driver" scenario. You can type in English, French, Arabic or Arabizi (e.g., "Salam, bghit nmshi l-gare"). You can also activate the microphone to speak directly. Karim responds verbally in Darija with translations provided right beneath.',
      es: 'En la pestaña «Hoy» o «Mi ruta», abre el diálogo «Karim el taxista». Puedes escribir en español, francés, árabe o Arabizi (ej: "Salam, bghit nmshi l-gare"). También puedes activar el micrófono para hablarle directamente. Karim responderá oralmente en Darija con traducción bajo su mensaje.',
      ar: 'في تبويب «اليوم» أو «مساري»، ابدأ سيناريو «كريم سائق التاكسي». يمكنك الكتابة بالعربية، بالفرنسية، بالإنجليزية أو بالعربيزي (مثال: "Salam, bghit nmshi l-gare"). كما يمكنك تشغيل الميكروفون للتحدث إليه مباشرة. سيرد عليك كريم صوتياً بالدارجة مع ترجمة مرافقة.',
    },
    tips: {
      fr: [
        'Si vous hésitez, cliquez sur l\'une des suggestions rapides en bas du chat.',
        'Karim s\'adapte à votre niveau et reste toujours bienveillant.',
      ],
      en: [
        'If you hesitate, tap one of the quick suggestions below the chat.',
        'Karim adapts to your current level and keeps conversation encouraging.',
      ],
      es: [
        'Si dudas, pulsa una de las sugerencias rápidas abajo en el chat.',
        'Karim se adapta a tu nivel y siempre es comprensivo y paciente.',
      ],
      ar: [
        'إذا ترددت، اضغط على أحد الاقتراحات السريعة أسفل المحادثة.',
        'يتكيف كريم مع مستواك ويشجعك دائماً على التحدث بثقة.',
      ],
    },
  },
  {
    id: 'change-language',
    icon: Languages,
    iconBg: 'bg-purple-50 text-purple-600',
    iconColor: 'text-purple-600',
    category: {
      fr: 'Langues & Affichage',
      en: 'Languages & Display',
      es: 'Idiomas y Visualización',
      ar: 'اللغات والعرض',
    },
    question: {
      fr: 'Comment changer la langue ?',
      en: 'How to change the language?',
      es: '¿Cómo cambiar el idioma?',
      ar: 'كيف أغير لغة التطبيق؟',
    },
    answer: {
      fr: 'Cliquez sur le sélecteur de langue situé en haut à droite dans la barre de navigation (drapeaux FR / EN / ES / AR). L\'interface, les explications grammaticales, les traductions et l\'orientation de lecture (RTL pour l\'arabe) s\'adapteront instantanément selon votre préférence.',
      en: 'Click on the language selector in the top-right corner of the navigation bar (flags FR / EN / ES / AR). The UI, grammar explanations, translations, and layout direction (RTL for Arabic) will immediately adapt to your chosen language.',
      es: 'Haz clic en el selector de idioma en la esquina superior derecha de la barra de navegación (banderas FR / EN / ES / AR). La interfaz, explicaciones gramaticales, traducciones y orientación (RTL para árabe) cambiarán al instante.',
      ar: 'اضغط على محدد اللغة الموجود أعلى يمين شريط التنقل (أعلام FR / EN / ES / AR). ستتحول واجهة التطبيق، وشروحات القواعد، والترجمات، واتجاه الصفحة (RTL للعربية) فوراً حسب اختيارك.',
    },
    tips: {
      fr: [
        '4 langues complètes : Français, Anglais, Espagnol, Arabe standard.',
        'Le choix de langue est mémorisé sur votre appareil.',
      ],
      en: [
        '4 supported languages: French, English, Spanish, Modern Standard Arabic.',
        'Your language choice is automatically saved on your device.',
      ],
      es: [
        '4 idiomas compatibles: Francés, Inglés, Español, Árabe estándar.',
        'Tu elección de idioma se guarda automáticamente en tu dispositivo.',
      ],
      ar: [
        '4 لغات مدعومة بالكامل: الفرنسية، الإنجليزية، الإسبانية، العربية الفصحى.',
        'يتم حفظ لغتك المفضلة تلقائياً على جهازك.',
      ],
    },
  },
  {
    id: 'where-are-reviews',
    icon: Brain,
    iconBg: 'bg-rose-50 text-rose-600',
    iconColor: 'text-rose-600',
    category: {
      fr: 'Mémoire & SRS',
      en: 'Memory & SRS',
      es: 'Memoria y SRS',
      ar: 'الذاكرة والمراجعة',
    },
    question: {
      fr: 'Où sont mes révisions ?',
      en: 'Where are my reviews?',
      es: '¿Dónde están mis revisiones?',
      ar: 'أين أجد مراجعاتي اليومية؟',
    },
    answer: {
      fr: 'Cliquez sur l\'onglet « Révision du jour » (icône étincelles). Notre algorithme de répétition espacée (SRS) calcule le moment exact où un mot risque d\'être oublié pour vous le proposer. Touchez une carte pour voir son verso en 3D, écoutez le son et notez votre facilité.',
      en: 'Click on the "Today\'s review" tab (sparkles icon). Our Spaced Repetition System (SRS) calculates the exact moment you are about to forget a word and brings it up. Tap any flashcard to flip it in 3D, listen to the audio, and grade your recall.',
      es: 'Haz clic en la pestaña «Revisión del día» (icono de destellos). Nuestro sistema de repetición espaciada (SRS) calcula el momento óptimo antes de olvidar una palabra. Toca una tarjeta para voltearla en 3D, escucha su sonido y califica tu recuerdo.',
      ar: 'اضغط على تبويب «مراجعة اليوم» (أيقونة النجوم). يحسب خوارزم التكرار المتباعد (SRS) اللحظة المثالية لمراجعة كل كلمة قبل نسيانها. المس البطاقة لقلبها بشكل ثلاثي الأبعاد، استمع للنطق، وقيّم مستوى تذكرك.',
    },
    tips: {
      fr: [
        '5 minutes chaque matin suffisent pour garder 90% des mots en mémoire vive.',
        'Ajoutez n\'importe quel mot à vos révisions depuis le carnet de phrases.',
      ],
      en: [
        '5 minutes each morning keeps 90% of words in active long-term memory.',
        'Add any word to your review deck directly from the phrasebook.',
      ],
      es: [
        '5 minutos cada mañana son suficientes para retener el 90% de las palabras.',
        'Añade cualquier palabra a tus revisiones desde el cuaderno de frases.',
      ],
      ar: [
        '5 دقائق كل صباح كافية للحفاظ على 90% من الكلمات في ذاكرتك النشطة.',
        'أضف أي كلمة إلى قائمة المراجعة مباشرة من دفتر العبارات.',
      ],
    },
  },
];

const UI_STRINGS = {
  fr: {
    title: 'Centre d\'Aide & FAQ',
    subtitle: 'Tout ce dont vous avez besoin pour maîtriser Kenza et apprendre la Darija en toute simplicité.',
    badge: 'Support & Assistance',
    searchPlaceholder: 'Rechercher une question...',
    allCategories: 'Toutes les catégories',
    quickGuideBtn: 'Revoir le guide de démarrage en 4 étapes',
    usefulTips: 'Conseils pratiques :',
    close: 'Fermer',
    needMoreHelp: 'Une autre question ?',
    needMoreHelpDesc: 'Activez le code VIPEIDER dans « Mon Espace » pour débloquer toutes les fonctionnalités et profiter d\'une expérience illimitée.',
  },
  en: {
    title: 'Help Center & FAQ',
    subtitle: 'Everything you need to master Kenza and learn Moroccan Darija with ease.',
    badge: 'Support & Assistance',
    searchPlaceholder: 'Search for a question...',
    allCategories: 'All Categories',
    quickGuideBtn: 'Reopen the 4-step Quick Start Guide',
    usefulTips: 'Helpful tips:',
    close: 'Close',
    needMoreHelp: 'Need more help?',
    needMoreHelpDesc: 'Activate the VIPEIDER promo code in "My Space" to unlock all premium features and enjoy unlimited learning.',
  },
  es: {
    title: 'Centro de Ayuda y Preguntas Frecuentes',
    subtitle: 'Todo lo que necesitas para dominar Kenza y aprender Darija marroquí con facilidad.',
    badge: 'Soporte y Asistencia',
    searchPlaceholder: 'Buscar una pregunta...',
    allCategories: 'Todas las categorías',
    quickGuideBtn: 'Reabrir la guía de inicio en 4 pasos',
    usefulTips: 'Consejos útiles:',
    close: 'Cerrar',
    needMoreHelp: '¿Tienes otra pregunta?',
    needMoreHelpDesc: 'Activa el código promocional VIPEIDER en «Mi espacio» para desbloquear todas las funciones sin coste.',
  },
  ar: {
    title: 'مركز المساعدة والأسئلة الشائعة',
    subtitle: 'كل ما تحتاجه لإتقان تطبيق كنزة وتعلم الدارجة المغربية بكل سهولة وثقة.',
    badge: 'الدعم والمساعدة',
    searchPlaceholder: 'ابحث عن سؤال...',
    allCategories: 'جميع الفئات',
    quickGuideBtn: 'إعادة فتح دليل البداية السريعة (4 خطوات)',
    usefulTips: 'نصائح عملية:',
    close: 'إغلاق',
    needMoreHelp: 'هل لديك سؤال آخر؟',
    needMoreHelpDesc: 'فعّل الرمز الترويجي VIPEIDER في «مساحتي» لفتح جميع الميزات المتقدمة وتجربة تعلم غير محدودة.',
  },
};

export default function HelpCenterView({ isOpen, onClose, onOpenTour, inline = false }: HelpCenterViewProps) {
  const uiLanguage = useAppStore((s) => s.uiLanguage);

  const langKey = (uiLanguage === 'ar' ? 'ar' : uiLanguage === 'en' ? 'en' : uiLanguage === 'es' ? 'es' : 'fr') as 'fr' | 'en' | 'es' | 'ar';
  const isRtl = langKey === 'ar';
  const t = UI_STRINGS[langKey];

  const [openItem, setOpenItem] = useState<string>('where-to-start');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(
    new Set(FAQ_ITEMS.map((item) => item.category[langKey]))
  );

  const filteredItems = FAQ_ITEMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category[langKey] !== selectedCategory) {
      return false;
    }
    return true;
  });

  const toggleItem = (id: string) => {
    setOpenItem((prev) => (prev === id ? '' : id));
  };

  const handleOpenInteractiveGuide = () => {
    if (onClose) onClose();
    if (onOpenTour) onOpenTour();
  };

  const content = (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full max-w-3xl mx-auto space-y-6 text-[#142943]"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 mb-2">
            <HelpCircle size={14} />
            <span>{t.badge}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#142943]">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            {t.subtitle}
          </p>
        </div>

        {/* Bouton Guide interactif */}
        <button
          type="button"
          onClick={handleOpenInteractiveGuide}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#142943] bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 border border-amber-300 rounded-xl transition-all shadow-xs active:scale-95 shrink-0"
        >
          <BookOpen size={16} />
          <span>{t.quickGuideBtn}</span>
        </button>
      </div>

      {/* Onglets / Filtres par catégorie */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#142943] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          {t.allCategories}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#142943] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordéon FAQ */}
      <div className="space-y-3">
        {filteredItems.map((item) => {
          const isOpen = openItem === item.id;
          const Icon = item.icon;
          const questionText = item.question[langKey];
          const answerText = item.answer[langKey];
          const tips = item.tips ? item.tips[langKey] : [];

          return (
            <div
              key={item.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'border-amber-300 bg-white shadow-sm ring-1 ring-amber-200'
                  : 'border-slate-200/90 bg-[#FFFEFC] hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-start gap-4 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      {item.category[langKey]}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-[#142943]">
                      {questionText}
                    </h3>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 bg-amber-100 text-amber-900' : ''
                  }`}
                >
                  <ChevronDown size={16} />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 border-t border-slate-100 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in duration-150">
                  <p>{answerText}</p>

                  {tips && tips.length > 0 && (
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 space-y-1.5 mt-2">
                      <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-amber-700" />
                        {t.usefulTips}
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                        {tips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Aide supplémentaire */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-[#FFFDF7] to-amber-100/50 border border-amber-200/80 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-full bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
          <HelpCircle size={18} />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-[#142943]">
            {t.needMoreHelp}
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            {t.needMoreHelpDesc}
          </p>
        </div>
      </div>
    </div>
  );

  // Rendu en mode inline (dans la page) ou en mode modale popup
  if (inline) {
    return content;
  }

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-[#FFFEFA] border border-amber-200/80 rounded-3xl shadow-2xl overflow-y-auto p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {content}
      </div>
    </div>
  );
}
