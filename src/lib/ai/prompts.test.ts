import { describe, it, expect } from 'vitest';
import { personas, getSystemPrompt, KENZBOT_SYSTEM_PROMPT, BASE_ROLEPLAY_SYSTEM_PROMPT, type PersonaId } from './prompts';

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

  it('impose le format quadri-partite [AR] / [ARZ] / [FR] / [SUGG] partout', () => {
    for (const id of ALL_PERSONAS) {
      const prompt = getSystemPrompt(id)!;
      expect(prompt, `persona ${id}`).toContain('[AR]');
      expect(prompt, `persona ${id}`).toContain('[ARZ]');
      expect(prompt, `persona ${id}`).toContain('[FR]');
      expect(prompt, `persona ${id}`).toContain('[SUGG]');
    }
  });

  it('fournit toujours une translittération Arabizi (lien son ↔ écriture) avec chiffres phonétiques', () => {
    for (const id of ALL_PERSONAS) {
      const prompt = getSystemPrompt(id)!;
      expect(prompt, `persona ${id}`).toContain('Arabizi');
      expect(prompt, `persona ${id}`).toContain('3 = ع');
      expect(prompt, `persona ${id}`).toContain('7 = ح');
      expect(prompt, `persona ${id}`).toContain('9 = ق');
    }
  });

  it('vérifie le prompt anti-hallucination et le Darija authentique pour kenzbot', () => {
    const kenzbotPrompt = getSystemPrompt('kenzbot')!;
    expect(kenzbotPrompt).toContain('tuteur et coach virtuel expert en Darija marocain');
    expect(kenzbotPrompt).toContain('nsiddouk');
    expect(kenzbotPrompt).toContain('Bchhal');
    expect(kenzbotPrompt).toContain('INTERDICTION ABSOLUE');
    expect(kenzbotPrompt).toContain('ka-');
    expect(kenzbotPrompt).toContain('ma-...-ch');
    expect(kenzbotPrompt).toContain('ghadi');
    expect(kenzbotPrompt).toContain('chnou');
    expect(kenzbotPrompt).toContain('bzzaf');
    expect(kenzbotPrompt).toContain('daba');
  });

  it('interdit formellement le Fusha scolaire et les dialectes orientaux', () => {
    expect(BASE_ROLEPLAY_SYSTEM_PROMPT).toContain('Fusha');
    expect(BASE_ROLEPLAY_SYSTEM_PROMPT).toContain('chami');
    expect(BASE_ROLEPLAY_SYSTEM_PROMPT).toContain('égyptien');
    expect(KENZBOT_SYSTEM_PROMPT).toContain('Fusha');
    expect(KENZBOT_SYSTEM_PROMPT).toContain('levantin');
  });

  it('retourne undefined pour un persona inconnu', () => {
    expect(getSystemPrompt('inconnu' as PersonaId)).toBeUndefined();
  });
});
