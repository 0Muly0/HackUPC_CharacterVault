import { BaseSkillKey } from "../config/skills.config";
import { BaseStatKey } from "../config/stats.config";

/**
 * Defines a generic modifier applied during roll calculations.
 * It Represents any temporary or contextual effect that changes the outcome of a stat or ability check.
 *
 * In our model:
 * - Social standing (equal, tolerated, feared, hated)
 * - Equipment bonuses or penalties 
 *
 * Only one target type is active per modifier instance (either a skill or a stat).
 * Multiple modifiers can be attached to the same object.
 */
export type Modifier =
  | { type: 'skill'; target: BaseSkillKey; value: number }
  | { type: 'stat'; target: BaseStatKey; value: number };

export interface SocialStandingDef {
  label: string,
  description: string,
  modifiers: Modifier[]
}
