import { describe, it, expect } from 'vitest';
import { personas, getSystemPrompt, type PersonaId } from './prompts';

const ALL_PERSONAS = Object.keys(personas) as PersonaId[];

describe('System prompts Roleplay IA — charte linguistique', () => {
  it('chaque persona fournit un system prompt non vide', () => {
    for (const id of ALL_PERSONAS) {
      expect(getSystemPrompt(id), `persona ${id}`).toBeTruthy();
    }
  });

  it('exige le chakl / tashkīl obligatoire (vocalisation arabe) dans la charte de chaque persona', () => {
    for (const id of ALL_PERSONAS) {
      const prompt = getSystemPrompt(id)!;
      expect(prompt.toLowerCase(), `persona ${id}`).toContain('chakl');
      expect(prompt.toLowerCase(), `persona ${id}`).toContain('tashkīl');
      expect(prompt, `persona ${id}`).toContain('MUST be FULLY vocalized');
      expect(prompt, `persona ${id}`).toContain('NEVER output unvocalized Arabic text');
    }
  });

  it('impose le format tripartite [AR] / [ARZ] / [FR] partout', () => {
    for (const id of ALL_PERSONAS) {
      const prompt = getSystemPrompt(id)!;
      expect(prompt, `persona ${id}`).toContain('[AR]');
      expect(prompt, `persona ${id}`).toContain('[ARZ]');
      expect(prompt, `persona ${id}`).toContain('[FR]');
    }
  });

  it('fournit toujours une translittération Arabizi (lien son ↔ écriture)', () => {
    for (const id of ALL_PERSONAS) {
      expect(getSystemPrompt(id)!, `persona ${id}`).toContain('Arabizi');
    }
  });

  it('retourne undefined pour un persona inconnu', () => {
    expect(getSystemPrompt('inconnu' as PersonaId)).toBeUndefined();
  });
});