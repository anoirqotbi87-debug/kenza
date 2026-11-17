import { describe, it, expect } from 'vitest';
import { personas, getSystemPrompt } from '@/lib/ai/prompts';
import { parseAiMessage, extractTextFromAiStream } from '@/lib/ai/parseAiMessage';

describe('KenzBot & Chat IA Integration', () => {
  describe('Persona Configuration & System Prompt', () => {
    it('enregistre le persona kenzbot avec ses métadonnées', () => {
      const kenzbot = personas.kenzbot;
      expect(kenzbot).toBeDefined();
      expect(kenzbot.id).toBe('kenzbot');
      expect(kenzbot.name).toContain('KenzBot');
    });

    it('fournit un system prompt valide avec la charte linguistique et pédagogique', () => {
      const prompt = getSystemPrompt('kenzbot');
      expect(prompt).toBeTruthy();
      expect(prompt).toContain('KenzBot');
      expect(prompt!.toLowerCase()).toContain('chakl');
      expect(prompt!.toLowerCase()).toContain('tashkīl');
      expect(prompt).toContain('[AR]');
      expect(prompt).toContain('[ARZ]');
      expect(prompt).toContain('[FR]');
      expect(prompt).toContain('[TIP]');
      expect(prompt).toContain('[SUGG]');
    });
  });

  describe('extractTextFromAiStream & Data Stream Decoupling', () => {
    it('décode fidèlement un flux Vercel AI SDK data stream composé de chunks 0:"..."', () => {
      const rawStream =
        '0:"[AR] مَرْحْبَا "\n' +
        '0:"بِيكْ ! [/AR]\\n"\n' +
        '0:"[ARZ] Mre7ba bik ! [/ARZ]\\n"\n' +
        '0:"[FR] Bienvenue ! [/FR]"\n' +
        'e:{"finishReason":"stop","usage":{"promptTokens":10,"completionTokens":20}}\n' +
        'd:{"finishReason":"stop"}\n';

      const decoded = extractTextFromAiStream(rawStream);
      expect(decoded).toBe(
        '[AR] مَرْحْبَا بِيكْ ! [/AR]\n[ARZ] Mre7ba bik ! [/ARZ]\n[FR] Bienvenue ! [/FR]'
      );

      const parsed = parseAiMessage(rawStream);
      expect(parsed.ar).toBe('مَرْحْبَا بِيكْ !');
      expect(parsed.arz).toBe('Mre7ba bik !');
      expect(parsed.fr).toBe('Bienvenue !');
    });

    it('retourne le texte brut inchangé si le flux ne provient pas du protocole AI SDK', () => {
      const plain = '[AR] كِيدَايْرْ [/AR] [FR] Ça va ? [/FR]';
      expect(extractTextFromAiStream(plain)).toBe(plain);
    });
  });

  describe('parseAiMessage avec tags [TIP]', () => {
    it('extrait proprement le conseil pédagogique [TIP] avec les autres champs', () => {
      const sample =
        '[AR] مَرْحْبَا بِيكْ أَ خُويَا [/AR]\n' +
        '[ARZ] Mre7ba bik a khoya [/ARZ]\n' +
        '[FR] Bienvenue mon frère [/FR]\n' +
        '[TIP] "Khoya" signifie "mon frère", utilisé très couramment pour interpeller avec bienveillance. [/TIP]\n' +
        '[SUGG] Chokran bzzaf | Labas 3lik ? [/SUGG]';

      const parsed = parseAiMessage(sample);

      expect(parsed.ar).toBe('مَرْحْبَا بِيكْ أَ خُويَا');
      expect(parsed.arz).toBe('Mre7ba bik a khoya');
      expect(parsed.fr).toBe('Bienvenue mon frère');
      expect(parsed.tip).toBe(
        '"Khoya" signifie "mon frère", utilisé très couramment pour interpeller avec bienveillance.'
      );
      expect(parsed.suggestions).toEqual(['Chokran bzzaf', 'Labas 3lik ?']);
    });

    it('gère l absence de tag [TIP] sans erreur', () => {
      const sample =
        '[AR] كِيدَايْرْ ؟ [/AR]\n' +
        '[ARZ] Kidayer ? [/ARZ]\n' +
        '[FR] Comment vas-tu ? [/FR]';

      const parsed = parseAiMessage(sample);

      expect(parsed.ar).toBe('كِيدَايْرْ ؟');
      expect(parsed.arz).toBe('Kidayer ?');
      expect(parsed.fr).toBe('Comment vas-tu ?');
      expect(parsed.tip).toBeUndefined();
    });

    it('nettoie les balises fermantes [/TIP] résiduelles', () => {
      const sample =
        '[AR] صَبَاحْ الخِيرْ [/AR]\n' +
        '[ARZ] Sba7 l-khir [/ARZ]\n' +
        '[FR] Bonjour [/FR]\n' +
        '[TIP] On répond généralement par "Sba7 n-noor" [/TIP]';

      const parsed = parseAiMessage(sample);
      expect(parsed.tip).toBe('On répond généralement par "Sba7 n-noor"');
    });
  });
});
