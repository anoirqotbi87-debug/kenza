import { readFileSync, writeFileSync } from 'node:fs';

// ---------- Patch 11: module-level tr() helper (fixes "Cannot find name 'tr'" in other components) ----------
const p = 'src/app/page.tsx';
let src = readFileSync(p, 'utf8');
const count = (s, sub) => s.split(sub).length - 1;

const HELPER_ANCHOR = '  const { t } = useTranslation();';
const LOCAL_TR = HELPER_ANCHOR + '\n  const tr = (fr: string, en: string, es: string, ar: string) =>\n    uiLanguage === "en" ? en : uiLanguage === "es" ? es : uiLanguage === "ar" ? ar : fr;';
// 1. remove the component-local helper if present
if (src.includes(LOCAL_TR)) {
  src = src.replace(LOCAL_TR, HELPER_ANCHOR);
  console.log('removed local tr() helper');
}
// 2. insert module-level helper after the store import
const IMPORT_ANCHOR = 'import { useAppStore, useTranslation } from "@/store/useAppStore";';
const MODULE_TR = IMPORT_ANCHOR + '\n\nconst tr = (fr: string, en: string, es: string, ar: string) => {\n  const lang = useAppStore.getState().uiLanguage;\n  return lang === "en" ? en : lang === "es" ? es : lang === "ar" ? ar : fr;\n};';
if (!src.includes('const lang = useAppStore.getState().uiLanguage')) {
  if (count(src, IMPORT_ANCHOR) === 1) {
    src = src.replace(IMPORT_ANCHOR, MODULE_TR);
    console.log('inserted module-level tr() helper');
  } else {
    console.log('ERROR: import anchor not unique (' + count(src, IMPORT_ANCHOR) + ')');
  }
}

const TABLE = [{"mode":"node","old":"la darija, en chemin","en":"darija, one step at a time","es":"la darija, paso a paso","ar":"الدارجة، على الطريق"},{"mode":"node","old":"Grammaire active","en":"Active grammar","es":"Gramática activa","ar":"القواعد النشطة"},{"mode":"node","old":"Pratique orale","en":"Speaking practice","es":"Práctica oral","ar":"تدريب النطق"},{"mode":"node","old":"Révisions SRS","en":"SRS review","es":"Repaso SRS","ar":"مراجعة SRS"},{"mode":"node","old":"Roleplay IA","en":"AI roleplay","es":"Roleplay IA","ar":"حوار مع الذكاء الاصطناعي"},{"mode":"node","old":"Mon Passeport","en":"My passport","es":"Mi pasaporte","ar":"جوازي"},{"mode":"node","old":"TON RYTHME","en":"YOUR PACE","es":"TU RITMO","ar":"إيقاعك"},{"mode":"node","old":"10 minutes par jour","en":"10 minutes a day","es":"10 minutos al día","ar":"10 دقائق يومياً"},{"mode":"node","old":"Se connecter","en":"Sign in","es":"Iniciar sesión","ar":"تسجيل الدخول"},{"mode":"node","old":"TA PROCHAINE ÉTAPE","en":"YOUR NEXT STEP","es":"TU PRÓXIMO PASO","ar":"خطوتك التالية"},{"mode":"node","old":"leçons terminées","en":"lessons completed","es":"lecciones completadas","ar":"دروس مكتملة"},{"mode":"node","old":"points de pratique","en":"practice points","es":"puntos de práctica","ar":"نقاط التدريب"},{"mode":"node","old":"À toi de choisir ton pas.","en":"Your pace, your choice.","es":"Tú eliges tu paso.","ar":"اختر خطوتك."},{"mode":"node","old":"UN MOT À EMPORTER","en":"A WORD TO GO","es":"UNA PALABRA PARA LLEVAR","ar":"كلمة معك"},{"mode":"node","old":"5 MINUTES, PAS PLUS","en":"5 MINUTES, NO MORE","es":"5 MINUTOS, NO MÁS","ar":"5 دقائق فقط"},{"mode":"node","old":"IMMERSION IA","en":"AI IMMERSION","es":"INMERSIÓN IA","ar":"انغماس مع الذكاء"},{"mode":"node","old":"UNE LANGUE, DES RENCONTRES","en":"A LANGUAGE, ENCOUNTERS","es":"UN IDIOMA, ENCUENTROS","ar":"لغةٌ ولقاءات"},{"mode":"node","old":"Il suffit de commencer.","en":"Just start.","es":"Solo empieza.","ar":"ابدأ فقط."},{"mode":"node","old":"Trois escales pour oser dire les premiers mots.","en":"Three stops to dare your first words.","es":"Tres paradas para atreverte a hablar.","ar":"ثلاث محطات لتبدأ كلماتك الأولى."},{"mode":"node","old":"TON AVANCÉE","en":"YOUR PROGRESS","es":"TU AVANCE","ar":"تقدّمك"},{"mode":"node","old":"À SUIVRE","en":"TO CONTINUE","es":"A CONTINUAR","ar":"للمتابعة"},{"mode":"node","old":"PETIT CONSEIL","en":"QUICK TIP","es":"PEQUEÑO CONSEJO","ar":"نصيحة صغيرة"},{"mode":"node","old":"La régularité avant la perfection.","en":"Consistency beats perfection.","es":"La constancia antes que la perfección.","ar":"الاستمرارية قبل الإتقان."},{"mode":"node","old":"Palier A1 (Fondations)","en":"Level A1 (Foundations)","es":"Nivel A1 (Fundamentos)","ar":"المستوى A1 (الأساسيات)"},{"mode":"node","old":"À PORTÉE DE MAIN","en":"AT HAND","es":"A MANO","ar":"في متناول اليد"},{"mode":"node","old":"Aucune phrase trouvée","en":"No phrase found","es":"Ninguna frase encontrada","ar":"لا توجد عبارات"},{"mode":"node","old":"Essaie un autre mot ou change de catégorie.","en":"Try another word or category.","es":"Prueba otra palabra o categoría.","ar":"جرّب كلمة أو فئة أخرى."},{"mode":"node","old":"Réponds dans ta tête, puis retourne la carte pour vérifier.","en":"Answer in your head, then flip the card.","es":"Responde en tu mente y gira la tarjeta.","ar":"أجب في ذهنك ثم اقلب البطاقة."},{"mode":"node","old":"Encore","en":"Again","es":"Otra vez","ar":"مرة أخرى"},{"mode":"node","old":"Difficile","en":"Hard","es":"Difícil","ar":"صعب"},{"mode":"node","old":"Bien","en":"Good","es":"Bien","ar":"جيد"},{"mode":"node","old":"Facile","en":"Easy","es":"Fácil","ar":"سهل"},{"mode":"node","old":"SANS PRESSION","en":"NO PRESSURE","es":"SIN PRESIÓN","ar":"بدون ضغط"},{"mode":"node","old":"Le bon rythme, c’est le tien.","en":"The right pace is yours.","es":"El buen ritmo es el tuyo.","ar":"الإيقاع المناسب هو إيقاعك."},{"mode":"node","old":"Petit conseil","en":"Quick tip","es":"Pequeño consejo","ar":"نصيحة"},{"mode":"node","old":"MON COIN KENZA","en":"MY KENZA CORNER","es":"MI RINCÓN KENZA","ar":"ركني في كنزة"},{"mode":"node","old":"LEÇONS","en":"LESSONS","es":"LECCIONES","ar":"الدروس"},{"mode":"node","old":"Chaque pas compte.","en":"Every step counts.","es":"Cada paso cuenta.","ar":"كل خطوة تُحسب."},{"mode":"node","old":"POINTS","en":"POINTS","es":"PUNTOS","ar":"النقاط"},{"mode":"node","old":"Gagnés en pratiquant.","en":"Earned by practicing.","es":"Ganados practicando.","ar":"تُكتسب بالتدريب."},{"mode":"node","old":"RYTHME","en":"PACE","es":"RITMO","ar":"الإيقاع"},{"mode":"node","old":"La régularité avant tout.","en":"Consistency above all.","es":"La constancia ante todo.","ar":"الاستمرارية أولاً."},{"mode":"node","old":"TES DONNÉES","en":"YOUR DATA","es":"TUS DATOS","ar":"بياناتك"},{"mode":"node","old":"Progression & Confidentialité","en":"Progress & Privacy","es":"Progreso y privacidad","ar":"التقدم والخصوصية"},{"mode":"node","old":"CERTIFICATS","en":"CERTIFICATES","es":"CERTIFICADOS","ar":"الشهادات"},{"mode":"node","old":"Passeport Culturel","en":"Cultural passport","es":"Pasaporte cultural","ar":"الجواز الثقافي"},{"mode":"node","old":"GESTION DU COMPTE","en":"ACCOUNT","es":"GESTIÓN DE CUENTA","ar":"إدارة الحساب"},{"mode":"node","old":"Repartir de zéro","en":"Start over","es":"Empezar de cero","ar":"البدء من جديد"},{"mode":"node","old":"Réinitialise les leçons, points et favoris sur cet appareil.","en":"Reset lessons, points and favorites on this device.","es":"Reinicia lecciones, puntos y favoritos en este dispositivo.","ar":"صفّر الدروس والنقاط والمفضلة على هذا الجهاز."},{"mode":"node","old":"Apprendre une langue, c’est rencontrer des gens.","en":"Learning a language is meeting people.","es":"Aprender un idioma es conocer gente.","ar":"تعلم اللغة لقاءٌ بالناس."},{"mode":"node","old":"Une phrase, une rencontre, une autre façon de voir le Maroc.","en":"A phrase, an encounter, another way to see Morocco.","es":"Una frase, un encuentro, otra forma de ver Marruecos.","ar":"عبارة، لقاء، وطريقة أخرى لرؤية المغرب."},{"mode":"node","old":"Cartes du jour","en":"Cards of the day","es":"Cartas del día","ar":"بطاقات اليوم"},{"mode":"node","old":"Au café, en taxi","en":"At the café, in a taxi","es":"En el café, en taxi","ar":"في المقهى وفي التاكسي"},{"mode":"node","old":"Pas besoin d’être parfait·e.","en":"No need to be perfect.","es":"No hace falta ser perfecto.","ar":"لا داعي للكمال."},{"mode":"node","old":"Les premiers pas","en":"The first steps","es":"Los primeros pasos","ar":"الخطوات الأولى"},{"mode":"node","old":"Débloquer avec Pro","en":"Unlock with Pro","es":"Desbloquear con Pro","ar":"افتح مع برو"},{"mode":"node","old":"Passer le Checkpoint A1","en":"Skip Checkpoint A1","es":"Pasar el Checkpoint A1","ar":"تجاوز نقطة A1"},{"mode":"node","old":"Effacer les filtres","en":"Clear filters","es":"Borrar filtros","ar":"مسح المرشحات"},{"mode":"node","old":"Passer à Kenza Pro","en":"Go Kenza Pro","es":"Pasar a Kenza Pro","ar":"انتقل إلى كنزة برو"},{"mode":"node","old":"Effacer ma progression locale","en":"Clear my local progress","es":"Borrar mi progreso local","ar":"امسح تقدمي المحلي"},{"mode":"node","old":"Ton carnet","en":"Your book","es":"Tu cuaderno","ar":"دفترك"},{"mode":"node","old":"Vocabulaire essentiel","en":"Essential vocabulary","es":"Vocabulario esencial","ar":"مفردات أساسية"},{"mode":"node","old":"POUR AUJOURD’HUI","en":"FOR TODAY","es":"PARA HOY","ar":"لهذا اليوم"},{"mode":"node","old":"EXPLORER","en":"EXPLORE","es":"EXPLORAR","ar":"استكشف"},{"mode":"icon","old":"Ajuster l’objectif","en":"Adjust goal","es":"Ajustar objetivo","ar":"عدّل الهدف"},{"mode":"icon","old":"Continuer à apprendre","en":"Keep learning","es":"Seguir aprendiendo","ar":"واصل التعلم"},{"mode":"icon","old":"C’est parti","en":"Let’s go","es":"¡Vamos!","ar":"هيا بنا"},{"mode":"icon","old":"Voir mon espace","en":"See my space","es":"Ver mi espacio","ar":"فضائي"},{"mode":"icon","old":"Voir le parcours","en":"View journey","es":"Ver la ruta","ar":"المسار"},{"mode":"icon","old":"Passeport Culturel & Données","en":"Cultural passport & data","es":"Pasaporte cultural y datos","ar":"الجواز الثقافي والبيانات"}];

let applied = 0, missing = 0, already = 0;
for (const r of TABLE) {
  let oldS, newS;
  if (r.mode === 'icon') {
    oldS = '>' + r.old + ' <';
    newS = '>{tr("' + r.old + '", "' + r.en + '", "' + r.es + '", "' + r.ar + '")} <';
  } else {
    oldS = '>' + r.old + '<';
    newS = '>{tr("' + r.old + '", "' + r.en + '", "' + r.es + '", "' + r.ar + '")}<';
  }
  if (src.includes(newS)) { already++; continue; }
  const n = count(src, oldS);
  if (n === 0) { missing++; console.log('MISSING: ' + r.old); continue; }
  src = src.split(oldS).join(newS);
  applied++;
}
console.log('translated ' + applied + ' strings, already ' + already + ', missing ' + missing);
if (applied > 0) writeFileSync(p, src);

// dump tr() line numbers for verification
{
  const lines = src.split('\n');
  const trLines = [];
  lines.forEach((l, i) => { if (l.includes('{tr("')) trLines.push(i + 1); });
  console.log('tr() usage lines: ' + trLines.join(','));
}
