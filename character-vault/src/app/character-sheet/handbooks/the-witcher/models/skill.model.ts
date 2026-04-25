import { ProfessionKey } from "../config/professions.config";
import { ProfSkillKey } from "../config/skills.config";
import { BaseStatKey } from "../config/stats.config";

/**
 * Defines a basic SKILL by relating it to a basic STAT. 
 * 
 * Every character has the opportunity to learn a basic skill by spending IPs to increase it's level. 
 * Each Skill has a weight which defines how many PI the character needs to 
 * spend to level up the skill
 */
export interface SkillDef {
    stat: BaseStatKey | null;
    label: string;
    description: string;
    weight: number;
};

/** 
 * Defines a professional SKILL by relating it to a Profession.
 * 
 * Only characters matching said Profession can learn such skill by spending IPs to increase it's level.
 * The depth links to the previous skill in the skill tree
*/
export interface ProfSkillDef extends SkillDef {
    profession: ProfessionKey
    predecessor: ProfSkillKey | null;
    successor: ProfSkillKey[];
}

