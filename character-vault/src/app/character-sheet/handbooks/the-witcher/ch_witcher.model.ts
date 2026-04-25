import { ProfessionKey } from "./config/professions.config";
import { RaceKey } from "./config/races.config";
import { BaseSkillKey, getEmptyBaseSkills, getEmptyProfessionSkills, ProfSkillKey } from "./config/skills.config";
import { BaseStatKey, DerivedStatKey, getEmptyDerivStats } from "./config/stats.config";

import { getEmptyBaseStats } from "./config/stats.config";
import { Character } from "../character.model";

/**
 * TODO: add shields and armor
 * TODO: add magic system
 * TODO: turn simple string background into life events system
 */
export interface ChWitcherDef {
    id: string,
    notes: string,
    img: string,
    name: string,
    gender: string,
    age: number,
    race: RaceKey | null,

    background: string,

    appearance: string,
    personality: string,
    life: string,

    encumberance: number,
    crowns: number,
    
    reputation: number,
    ip: number,

    baseStatSet: Record<BaseStatKey, number>;
    derivStatSet: Record<DerivedStatKey, number>;
    
    profession: ProfessionKey | null,
    baseSkillSet: Record<BaseSkillKey, number>;
    profSkillSet: Partial<Record<ProfSkillKey, number>> | null,
}

export class ChWitcher extends Character implements ChWitcherDef {
    public gender: string = 'X';
    public age: number = 0;
    public race: RaceKey | null = null;

    public background: string = '';

    public appearance: string = '';
    public personality: string = '';
    public life: string = '';

    public encumberance: number = 0;
    public crowns: number = 0;

    public reputation: number = 0;
    public ip: number = 0;

    public baseStatSet: Record<BaseStatKey, number> = getEmptyBaseStats();
    public derivStatSet: Record<DerivedStatKey, number> = getEmptyDerivStats();

    public profession: ProfessionKey | null = null;
    public baseSkillSet: Record<BaseSkillKey, number> = getEmptyBaseSkills();
    public profSkillSet: Partial<Record<ProfSkillKey, number>> | null = this.profession ? getEmptyProfessionSkills(this.profession) : null;

    constructor(c?: ChWitcherDef) {
        super('Witcher');
        if(c) {
            Object.assign(this, c);
        }
    }
}
