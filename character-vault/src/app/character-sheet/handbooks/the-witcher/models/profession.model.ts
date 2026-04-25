import { ProfSkillKey } from "../config/skills.config";

/**
 * Defines a Profession.
 */
export interface ProfessionDef {
    label: string,
    description: string,
    skillset: ProfSkillKey[]
}