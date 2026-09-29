import fs from 'fs';
const report = {};
function apply(path, name, oldS, newS) {
  let c;
  try { c = fs.readFileSync(path, 'utf8'); } catch { report[name] = 'NOFILE'; return; }
  const n = c.split(oldS).length - 1;
  if (n === 0) { report[name] = c.includes(newS) ? 'OK (already)' : 'MISSING'; return; }
  if (n > 1) { report[name] = 'AMBIGUOUS (' + n + ')'; return; }
  fs.writeFileSync(path, c.split(oldS).join(newS));
  report[name] = 'OK';
}
function applyRx(path, name, rx, newS) {
  let c;
  try { c = fs.readFileSync(path, 'utf8'); } catch { report[name] = 'NOFILE'; return; }
  const m = c.match(rx);
  if (!m) { report[name] = c.includes(newS) ? 'OK (already)' : 'MISSING'; return; }
  if (m.length > 1) { report[name] = 'AMBIGUOUS (' + m.length + ')'; return; }
  fs.writeFileSync(path, c.split(m[0]).join(newS));
  report[name] = 'OK';
}

const OB = 'src/components/onboarding/OnboardingModal.tsx';
const PT = 'src/components/onboarding/PlacementTestModal.tsx';
const PV = 'src/components/profile/ProfileView.tsx';
const NS = 'src/components/profile/NotificationSettings.tsx';

// ---- OnboardingModal: JSX-delimited anchors (v34) ----
apply(OB, 'OB-welcome', '>Bienvenue sur KENZA 👋</h2>', '>{S.welcome}</h2>');
apply(OB, 'OB-goalQ', '>Quel est votre objectif principal avec la Darija ?</p>', '>{S.goalQuestion}</p>');
apply(OB, 'OB-tempoTitle', '>Votre rythme idéal ⏱️</h2>', '>{S.tempoTitle}</h2>');
apply(OB, 'OB-tempoQ', '>Combien de temps souhaitez-vous y consacrer par jour ?</p>', '>{S.tempoQuestion}</p>');
apply(OB, 'OB-levelQ', '>Quel est votre niveau ? 🇲🇦</h2>', '>{S.levelQuestion}</h2>');
apply(OB, 'OB-levelHint', '>Pour vous proposer le meilleur point de départ.</p>', '>{S.levelHint}</p>');
apply(OB, 'OB-beginner', 'Je débute complètement\n', '{S.beginner}\n');
apply(OB, 'OB-beginnerHint', '>Commencer depuis le Module 1</div>', '>{S.beginnerHint}</div>');
apply(OB, 'OB-notions', "J'ai déjà des notions\n", '{S.notions}\n');
apply(OB, 'OB-notionsHint', '>Test rapide de 2 min pour sauter des niveaux</div>', '>{S.notionsHint}</div>');
apply(OB, 'OB-done', 'Profil configuré !\n', '{S.done}\n');
apply(OB, 'OB-bravo', '? "Bravo ! Vous semblez avoir les bases. Vous pourrez commencer direct au Module 2."', '? S.bravo');
apply(OB, 'OB-parfait', ': "Parfait ! Nous allons commencer par les fondations doucement."}', ': S.parfait}');

// ---- PlacementTestModal: JSX-delimited anchors (v34) ----
apply(PT, 'PT-skip', '<span>Passer et commencer à zéro</span>', '<span>{S.skip}</span>');
apply(PT, 'PT-testDone', '>Test terminé !</h2>', '>{S.testDone}</h2>');
apply(PT, 'PT-xp', '} XP et visas officiels débloqués !', '} {S.xpUnlocked}');

// ---- ProfileView: JSX-delimited anchors (v34) ----
apply(PV, 'PV-placeHint', '>Réévaluez votre niveau pour ajuster votre parcours.</p>', '>{S.placementHint}</p>');
apply(PV, 'PV-retake', 'Re-passer le test\n', '{S.retakeTest}\n');
apply(PV, 'PV-offlineHint', '>Téléchargez les audios et fiches pour pratiquer sans connexion internet.</p>', '>{S.offlineHint}</p>');

// ---- NotificationSettings (v34) ----
apply(NS, 'NS-daily', ": 'Recevez un rappel quotidien pour préserver votre série 🔥 et réviser vos mots du jour avec le SRS.'}", ': S.dailyReminder}');
applyRx(NS, 'NS-blockedHint', /: 'Vous avez bloqué les notifications[^']*'}/, ': S.blockedHint}');

report['PATCHER'] = 'v35 (eslint warn-only no-explicit-any/no-unused-vars; idempotent v34 fixes)';
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/verify.json', JSON.stringify(report, null, 2) + '\n');
console.log(Object.entries(report).map(([k, v]) => k + ': ' + v).join('\n'));
