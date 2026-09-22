const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/lib/i18n/translations.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log("Présence de caractères de remplacement (FFFD) :", content.includes('\uFFFD'));

const targetOld = /smartReviewsTitle:[\s\S]*?startSession:.*?(?:,|$)/;

const cleanArabicSRS = `smartReviewsTitle: "\\u0627\\u0644\\u0645\\u0631\\u0627\\u062c\\u0639\\u0629 \\u0627\\u0644\\u0630\\u0643\\u064a\\u0629",
      smartReviewsDesc: "\\u0627\\u062d\\u0641\\u0638 \\u0645\\u0641\\u0631\\u062f\\u0627\\u062a \\u0627\\u0644\\u062f\\u0627\\u0631\\u062c\\u0629 \\u0625\\u0644\\u0649 \\u0627\\u0644\\u0623\\u0628\\u062f \\u0628\\u0641\\u0636\\u0644 \\u0646\\u0638\\u0627\\u0645 \\u0627\\u0644\\u062a\\u0643\\u0631\\u0627\\u0631 \\u0627\\u0644\\u0645\\u062a\\u0628\\u0627\\u0639\\u062f.",
      cardsToReview: "\\u0628\\u0637\\u0627\\u0642\\u0627\\u062a \\u0644\\u0644\\u0645\\u0631\\u0627\\u062c\\u0639\\u0629",
      startSession: "\\u0627\\u0628\\u062f\\u0623 \\u0627\\u0644\\u062c\\u0644\\u0633\\u0629",`;

if (content.match(targetOld)) {
  content = content.replace(targetOld, cleanArabicSRS);
  fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  console.log("Bloc ar.srs remplacé avec succès par des codes Unicode valides.");
} else {
  console.log("Pattern non trouvé. Remplace manuellement ar.srs dans translations.ts par :");
  console.log(cleanArabicSRS);
}
