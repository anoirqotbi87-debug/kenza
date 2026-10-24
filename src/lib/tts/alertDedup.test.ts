import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const SCRIPT = resolve(__dirname, '../../../scripts/find-open-issue.sh');

/** Exécute le script de déduplication avec un listing JSON simulé. */
function findIssue(issues: { number: number; title: string }[], title: string): string {
  const stdout = execFileSync('bash', [SCRIPT, title], {
    input: JSON.stringify(issues),
    encoding: 'utf8',
  });
  return stdout.trim();
}

describe('find-open-issue.sh — déduplication de l’issue d’alerte TTS', () => {
  const issues = [
    { number: 69, title: 'TTS en production dégradé (sonde automatique)' },
    { number: 70, title: 'Un autre ticket' },
  ];

  it('retrouve une issue par correspondance exacte', () => {
    expect(findIssue(issues, 'TTS en production dégradé (sonde automatique)')).toBe('69');
  });

  it('retrouve une issue dont le titre contient des métacaractères de recherche', () => {
    // Cas qui cassait `--search` : `[` et `(` sont interprétés comme de la
    // syntaxe de requête, et la correspondance échouait.
    const withMeta = [{ number: 71, title: '[ALERTE] TTS dégradé (critique)' }];
    expect(findIssue(withMeta, '[ALERTE] TTS dégradé (critique)')).toBe('71');
  });

  it('ne renvoie rien quand aucune issue ne correspond', () => {
    expect(findIssue(issues, 'Titre absent')).toBe('');
  });

  it('ne confond pas un titre partiel avec le titre complet', () => {
    // Comportement voulu : une recherche floue matcherait ici.
    expect(findIssue(issues, 'TTS en production dégradé')).toBe('');
  });

  it('est stable sur des exécutions répétées (aucune dépendance à un index)', () => {
    const title = 'TTS en production dégradé (sonde automatique)';
    const results = Array.from({ length: 3 }, () => findIssue(issues, title));
    expect(new Set(results)).toEqual(new Set(['69']));
  });

  it('ne renvoie qu’un seul numéro', () => {
    const found = findIssue(issues, 'TTS en production dégradé (sonde automatique)');
    expect(found).not.toContain('\n');
  });
});
