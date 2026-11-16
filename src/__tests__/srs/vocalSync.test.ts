import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '@/store/useAppStore';
import type { SRSCard } from '@/types/srs';

describe('Vocal Failure Synchronization & SRS Smart Queue Priority', () => {
  beforeEach(() => {
    // Reset du store avant chaque test
    useAppStore.setState({
      srsDeck: {},
      xp: 0,
    });
  });

  it('incrémente vocalFailureCount et augmente le score d\'urgence sur une carte existante', () => {
    const initialCard: SRSCard = {
      id: 'srs_9hwa',
      wordId: 'srs_9hwa',
      interval: 6,
      repetition: 2,
      easeFactor: 2.5,
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // due dans 3 jours
      state: 'learning',
      vocalFailureCount: 0,
      urgencyScore: 0,
    };

    useAppStore.setState({
      srsDeck: {
        srs_9hwa: initialCard,
      },
    });

    // Déclencher l'échec vocal (ex: mauvaise articulation du qāf '9' dans /parler)
    useAppStore.getState().recordVocalFailure('srs_9hwa');

    const updatedDeck = useAppStore.getState().srsDeck;
    const card = updatedDeck['srs_9hwa'];

    expect(card).toBeDefined();
    expect(card.vocalFailureCount).toBe(1);
    expect(card.state).toBe('learning');
    // L'échéance a été avancée à aujourd'hui
    const todayStr = new Date().toISOString().split('T')[0];
    expect(card.dueDate.startsWith(todayStr)).toBe(true);
    // Le score d'urgence a augmenté (+0.5 par échec vocal)
    expect(card.urgencyScore).toBeGreaterThanOrEqual(0.5);
  });

  it('crée automatiquement une carte en apprentissage prioritaire si le mot n\'est pas encore dans le deck', () => {
    // Le mot 'srs_chhal' n'existe pas encore dans le deck
    useAppStore.getState().recordVocalFailure('srs_chhal');

    const deck = useAppStore.getState().srsDeck;
    const card = deck['srs_chhal'];

    expect(card).toBeDefined();
    expect(card.wordId).toBe('srs_chhal');
    expect(card.vocalFailureCount).toBe(1);
    expect(card.repetition).toBe(0);
    expect(card.state).toBe('learning');
    expect(card.urgencyScore).toBeGreaterThanOrEqual(0.5);
  });

  it('place immédiatement la carte avec échec vocal en tête de file dans getDueCards()', () => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const regularDueCard: SRSCard = {
      id: 'srs_salam',
      wordId: 'srs_salam',
      interval: 2,
      repetition: 1,
      easeFactor: 2.5,
      dueDate: today.toISOString(),
      state: 'learning',
      vocalFailureCount: 0,
      urgencyScore: 0,
    };

    useAppStore.setState({
      srsDeck: {
        srs_salam: regularDueCard,
      },
    });

    // Enregistrer un échec vocal sur un autre mot
    useAppStore.getState().recordVocalFailure('srs_9hwa');

    const dueCards = useAppStore.getState().getDueCards();

    expect(dueCards.length).toBe(2);
    // La carte 'srs_9hwa' ayant subi un échec vocal doit impérativement précéder la carte normale
    expect(dueCards[0].wordId).toBe('srs_9hwa');
    expect(dueCards[0].urgencyScore).toBeGreaterThan(dueCards[1].urgencyScore ?? 0);
  });

  it('gère la résolution résiliente des clés (avec ou sans préfixe srs_)', () => {
    const existing: SRSCard = {
      id: 'srs_khouya',
      wordId: 'srs_khouya',
      interval: 1,
      repetition: 1,
      easeFactor: 2.5,
      dueDate: new Date().toISOString(),
      state: 'learning',
      vocalFailureCount: 0,
    };

    useAppStore.setState({
      srsDeck: {
        srs_khouya: existing,
      },
    });

    // Appel sans préfixe 'khouya'
    useAppStore.getState().recordVocalFailure('khouya');

    const deck = useAppStore.getState().srsDeck;
    expect(deck['srs_khouya'].vocalFailureCount).toBe(1);
  });
});
