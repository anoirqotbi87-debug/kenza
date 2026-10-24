/**
 * Génère les MP3 statiques des répliques « bot » des scénarios de dialogue
 * (public/audio/roleplay/<scenarioId>/<turnId>.mp3), répliquant EXACTEMENT le
 * pipeline de la route /api/tts (prepareDarijaForTts → normalizeDarija →
 * buildSsml → synthesizeEdgeTts), avec la voix propre à chaque scénario
 * (scenario.voice : ar-MA-JamalNeural male / ar-MA-MounaNeural female),
 * identique à celle utilisée par useDialogueRunner.
 *
 * Usage :
 *   npm run gen:audio:roleplay            # génère uniquement les manquants
 *   npm run gen:audio:roleplay -- --force # regénère tout (écrase les existants)
 *   npm run gen:audio:roleplay -- --check # liste les fichiers manquants sans synthèse
 */
import { mkdir, writeFile, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_SCENARIOS } from '../src/data/scenarios';
import { prepareDarijaForTts } from '../src/lib/tts/darijaPhonetic';
import { normalizeDarija } from '../src/lib/tts/darijaPhonetics';
import { buildSsml } from '../src/lib/tts/ssml';
import { synthesizeEdgeTts } from '../src/lib/tts/synthesizeEdgeTts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'audio', 'roleplay');
const FORCE = process.argv.includes('--force');
const CHECK_ONLY = process.argv.includes('--check');

interface PendingFile {
  scenarioId: string;
  voice: 'male' | 'female';
  turnId: string;
  path: string;
  arabicText: string;
}

function collect(): PendingFile[] {
  const pending: PendingFile[] = [];
  for (const scenario of ALL_SCENARIOS) {
    for (const turn of scenario.turns) {
      if (turn.speaker !== 'bot' || !turn.arabicText?.trim()) continue;
      const filePath = join(OUT_DIR, scenario.id, `${turn.id}.mp3`);
      if (existsSync(filePath) && !FORCE) {
        console.log(`  · skip ${scenario.id}/${turn.id}.mp3 (existant)`);
        continue;
      }
      pending.push({
        scenarioId: scenario.id,
        voice: scenario.voice || 'female',
        turnId: turn.id,
        path: filePath,
        arabicText: turn.arabicText,
      });
    }
  }
  return pending;
}

async function synthesizeOne(file: PendingFile): Promise<void> {
  const normalizedPhonetic = prepareDarijaForTts(file.arabicText);
  // Même appel que la route /api/tts : le 2e argument est le texte normalisé
  // lui-même pour déclencher l'assimilation solaire (sanitizeArabicForDarijaTts).
  const textToSpeak = normalizeDarija(normalizedPhonetic, normalizedPhonetic);
  const { ssml } = buildSsml(textToSpeak, file.voice, 'normal');
  const buffer = await synthesizeEdgeTts(ssml, { timeoutMs: 20000 });
  await mkdir(dirname(file.path), { recursive: true });
  await writeFile(file.path, buffer);
  console.log(`  + ${file.scenarioId}/${file.turnId}.mp3 (${buffer.length} octets, voix ${file.voice})`);
}

async function main() {
  const pending = collect();
  if (pending.length === 0) {
    console.log('Aucun MP3 à générer (tous présents). Passez --force pour régénérer.');
    return;
  }

  if (CHECK_ONLY) {
    console.log(`${pending.length} fichier(s) manquant(s) :`);
    for (const file of pending) {
      console.log(`  - /audio/roleplay/${file.scenarioId}/${file.turnId}.mp3`);
    }
    console.log(`\nLancez \`npm run gen:audio:roleplay\` depuis un réseau joignable par\nEdge TTS pour les générer.`);
    process.exitCode = 1;
    return;
  }

  console.log(`Synthèse de ${pending.length} réplique(s) bot (voix ar-MA-MounaNeural / ar-MA-JamalNeural, rate -8%)…`);
  let ok = 0;
  const failures: string[] = [];
  for (const file of pending) {
    try {
      await synthesizeOne(file);
      ok += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ✗ ECHEC ${file.scenarioId}/${file.turnId}.mp3 — ${message}`);
      failures.push(`${file.scenarioId}/${file.turnId}`);
    }
  }

  console.log(`\nTerminé : ${ok}/${pending.length} générés${failures.length ? `, ${failures.length} en échec (${failures.join(', ')})` : ''}.`);
  if (failures.length > 0) process.exitCode = 1;
}

main();