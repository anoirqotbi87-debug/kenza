import { taxiFesScenario } from './taxiFes';
import { cafeFesScenario } from './cafeFes';
import { soukFesScenario } from './soukFes';
import { loyerFes } from './loyerFes';
import { medecinFes } from './medecinFes';

export const ALL_SCENARIOS = [
  taxiFesScenario,
  cafeFesScenario,
  soukFesScenario,
  { ...loyerFes, tier: 'premium' as const },
  { ...medecinFes, tier: 'premium' as const }
];
