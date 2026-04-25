import { Modifier } from "./modifier.model";

/**
 * Defines a race Perk.
 * A Perk can both influence SKILLs and STATs through modifiers 
 * and define some special character abilities for narration purposes
 */
export type Perk = {
    label: string;
    description: string;
    modifiers: Modifier[];
}

/**
 * Defines a Race.
 * Each race has a unique set of perks.
 */
export interface RaceDef {
    label: string,
    description: string,
    perks: Perk[],
    hasMagic: boolean,
    hasFixedProfession: boolean,
}