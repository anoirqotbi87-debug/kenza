import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SCRIPT = resolve(__dirname, '../../../scripts/report-tts-health.sh');

/**
 * Faux `gh` : journalise ses appels dans un fichier au lieu de parler à GitHub.
 * C'est ce qui rend le chemin d'alerte testable — il n'était auparavant
 * exerçable qu'en cas de panne réelle, donc jamais exercé.
 */
function makeFakeGh(dir: string, openIssues: { number: number; title: string }[]) {
  const log = join(dir, 'gh-calls.log');
  const fake = join(dir, 'gh');
  writeFileSync(
    fake,
    `#!/usr/bin/env bash
echo "$*" >> ${JSON.stringify(log)}
if [ "$1" = "issue" ] && [ "$2" = "list" ]; then
  cat ${JSON.stringify(join(dir, 'issues.json'))}
  exit 0
fi
exit 0
`
  );
  chmodSync(fake, 0o755);
  writeFileSync(join(dir, 'issues.json'), JSON.stringify(openIssues));
  return log;
}

function run(dir: string, args: string[]) {
  const bodyFile = join(dir, 'body.md');
  writeFileSync(bodyFile, 'Corps de l’alerte');
  return execFileSync('bash', [SCRIPT, '--title', 'TTS en production dégradé (sonde automatique)', '--body-file', bodyFile, ...args], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${dir}:${process.env.PATH}` },
  });
}

describe('report-tts-health.sh — chemin d’alerte', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'tts-alert-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('crée une issue quand aucune n’est ouverte', () => {
    const log = makeFakeGh(dir, []);
    const out = run(dir, []);

    expect(out).toContain('création');
    expect(readFileSync(log, 'utf8')).toContain('issue create');
  });

  it('commente l’issue existante au lieu d’en créer une seconde', () => {
    const log = makeFakeGh(dir, [{ number: 42, title: 'TTS en production dégradé (sonde automatique)' }]);
    const out = run(dir, []);

    expect(out).toContain('#42');
    const calls = readFileSync(log, 'utf8');
    expect(calls).toContain('issue comment 42');
    expect(calls).not.toContain('issue create');
  });

  it('retrouve l’issue malgré les métacaractères du titre', () => {
    // `(` et `)` cassaient la recherche `--search` ; la comparaison exacte résiste.
    const log = makeFakeGh(dir, [{ number: 7, title: 'TTS en production dégradé (sonde automatique)' }]);
    run(dir, []);

    expect(readFileSync(log, 'utf8')).not.toContain('issue create');
  });

  it('ne crée pas de doublon sur exécutions répétées', () => {
    const log = makeFakeGh(dir, []);
    // La 1re exécution crée ; les suivantes voient l'issue (simulée ci-dessous).
    run(dir, []);
    writeFileSync(
      join(dir, 'issues.json'),
      JSON.stringify([{ number: 1, title: 'TTS en production dégradé (sonde automatique)' }])
    );
    run(dir, []);
    run(dir, []);

    const creates = readFileSync(log, 'utf8').split('\n').filter((l) => l.includes('issue create'));
    expect(creates).toHaveLength(1);
  });

  it('--dry-run n’écrit rien sur GitHub', () => {
    const log = makeFakeGh(dir, []);
    const out = run(dir, ['--dry-run']);

    expect(out).toContain('créerait');
    const calls = readFileSync(log, 'utf8');
    expect(calls).not.toContain('issue create');
    expect(calls).not.toContain('issue comment');
  });

  it('refuse un --body-file absent', () => {
    makeFakeGh(dir, []);
    expect(() =>
      execFileSync('bash', [SCRIPT, '--title', 'x', '--body-file', join(dir, 'inexistant.md')], {
        encoding: 'utf8',
        stdio: 'pipe',
      })
    ).toThrow();
  });
});
