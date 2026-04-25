/**
 * Defines a STAT. 
 * It can either be a Base Stat, which value is manually chosen by the player
 * Or a Derived Stat, which value is computed using starting from the Base Stats.
 * 
 * Each Stat has a weight (10) which defines how many PI the character needs to 
 * spend to level up the Stat
 */
export interface StatDef {
    label: string,
    description: string,
    weight: number,
}
