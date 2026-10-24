# Audio pré-générée des scénarios de rôleplay (Darija)

Les répliques du bot des 5 scénarios de dialogue (`taxiFes`, `cafeFes`,
`soukFes`, `loyerFes`, `medecinFes`) sont pré-générées en MP3 statiques pour :

- **zéro consommation de quota TTS** à l'exécution (le MP3 est lu, pas synthétisé) ;
- **hors-ligne natif** : le service worker intercepte `/audio/*.mp3`
  (`isAudioAsset`, CacheFirst + RangeRequests) → aucune dépendance au réseau
  pour rejouer une réplique déjà chargée ;
- **latence nulle** au premier affichage (pas de round-trip `/api/tts`).

## Emplacement

```
public/audio/roleplay/<scenarioId>/<turnId>.mp3
```

Chaque tour `speaker === 'bot'` référence son fichier via `audioKey` dans
`/audio/roleplay/<scenarioId>/<turnId>.mp3`. Les tours `user` n'ont jamais de
MP3 : c'est l'apprenant qui parle.

## Génération

Le script `scripts/generate-roleplay-audio.ts` réplique exactement le pipeline
de la route `/api/tts` (prepareDarijaForTts → normalizeDarija → buildSsml →
synthesizeEdgeTts) avec la voix propre à chaque scénario
(`scenario.voice` : male `ar-MA-JamalNeural` pour taxi/café/souk/médecin,
female `ar-MA-MounaNeural` pour le loyer).

```bash
npm install                       # s'assure que tsx (devDep) est présent
npm run gen:audio:roleplay        # génère seulement les fichiers manquants
npm run gen:audio:roleplay -- --force   # régénère tout (écrase)
```

Sortie : 15 MP3 (3 répliques bot × 5 scénarios), encodés
`audio-24khz-48kbitrate-mono-mp3`, débit SSML `normal` (-8 %).

> L'endpoint Edge TTS (`api.msedgeservices.com`) doit être joignable depuis le
> réseau d'exécution. Depuis un environnement sandbox/CI bridé, la synthèse
> échoue avec `Unexpected server response: 200` : exécuter la commande en
> local, puis committer les MP3 générés.

## Câblage

`useDialogueRunner` joue en priorité le MP3 statique :

```ts
await playAudio(arabizi || arabe, turn.audioKey || arabe, soundEnabled, 1.0,
  { voice: scenario.voice || 'female' });
```

Si le fichier est absent (réseau bridé, fichier non commité), `playAudio`
bascule silencieusement sur le TTS Edge (mêmes voix) : **aucune régression**.

## Garde-fou

Le test `src/data/dialogues/index.test.ts` (`chaque replique bot a une
audioKey statique bien formee`) verrouille le format
`/audio/roleplay/<scenarioId>/<turnId>.mp3` sur chaque tour bot : un MP3
généré est donc toujours au bon endroit pour être lu.