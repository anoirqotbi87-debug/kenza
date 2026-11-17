import { taxiFesScenario } from './taxiFes';
import { TAXI_SCENARIO } from './taxiScenario';
import { cafeFesScenario } from './cafeFes';
import { soukFesScenario } from './soukFes';
import { loyerFes } from './loyerFes';
import { medecinFes } from './medecinFes';
import { SITUATION_SCENARIOS } from './situations';

export const ALL_SCENARIOS = [
  TAXI_SCENARIO,
  taxiFesScenario,
  cafeFesScenario,
  soukFesScenario,
  { ...loyerFes, tier: 'premium' as const },
  { ...medecinFes, tier: 'premium' as const }
];

export { TAXI_SCENARIO };

export { SITUATION_SCENARIOS };
export type {
  SituationScenario,
  SituationTurn,
  SituationToken,
  SituationReplyOption,
  SituationSpeaker,
} from './situations';
