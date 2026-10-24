import { taxiFesScenario } from './taxiFes';
import { cafeFesScenario } from './cafeFes';
import { soukFesScenario } from './soukFes';
import { loyerFes } from './loyerFes';
import { medecinFes } from './medecinFes';
import { SITUATION_SCENARIOS } from './situations';

export const ALL_SCENARIOS = [
  taxiFesScenario,
  cafeFesScenario,
  soukFesScenario,
  { ...loyerFes, tier: 'premium' as const },
  { ...medecinFes, tier: 'premium' as const }
];

export { SITUATION_SCENARIOS };
export type {
  SituationScenario,
  SituationTurn,
  SituationToken,
  SituationReplyOption,
  SituationSpeaker,
} from './situations';
