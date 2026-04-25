import { StatDef } from "../models/stat.model";

export const BASE_STATS = {
    INT: {
        label: 'Intelligence',
        description: '',
        weight: 10,
    },
    REF: {
        label: 'Reflex',
        description: '',
        weight: 10,
    },
    DEX: {
        label: 'Dexterity',
        description: '',
        weight: 10,
    },
    BODY: {
        label: 'Body',
        description: '',
        weight: 10,
    },
    SPD: {
        label: 'Speed',
        description: '',
        weight: 10,
    },
    EMP: {
        label: 'Empathy',
        description: '',
        weight: 10,
    },
    CRA: {
        label: 'Craft',
        description: '',
        weight: 10,
    },
    WILL: {
        label: 'Will',
        description: '',
        weight: 10,
    },
    LUCK: {
        label: 'Luck',
        description: '',
        weight: 10,
    }
} as const satisfies Record<string, StatDef>;
export type BaseStatKey = keyof typeof BASE_STATS;

export const DERIVED_STATS = {
    VIGOR: {
        label: 'Vigor',
        description: '',
        weight: 10,
    },
    STUN: {
        label: 'Stun',
        description: '',
        weight: 10,
    },
    RUN: {
        label: 'Run',
        description: '',
        weight: 10,
    },
    LEAP: {
        label: 'Leap',
        description: '',
        weight: 10,
    },
    HP: {
        label: 'Health Points',
        description: '',
        weight: 10,
    },
    STA: {
        label: 'Stamina',
        description: '',
        weight: 10,
    },
    ENC: {
        label: 'Encumberance',
        description: '',
        weight: 10,
    },
    REC: {
        label: 'Recover',
        description: '',
        weight: 10,
    },
    PUNCH: {
        label: 'Punch',
        description: '',
        weight: 10,
    },
    KICK: {
        label: 'Kick',
        description: '',
        weight: 10,
    }
} as const satisfies Record<string, StatDef>;
export type DerivedStatKey = keyof typeof DERIVED_STATS;


export function getEmptyBaseStats(): Record<BaseStatKey, number> {
    // Extracts all base stat keys  
    const baseKeys = Object.keys(BASE_STATS) as BaseStatKey[];

    // Returns an arrays in which each element is a [key, 0] pair. 
    // Object.fromEntries turns this nested array into an object where each [key, 0] pair becomes a field -> key: 0
    return Object.fromEntries(baseKeys.map((key: BaseStatKey) => [key, 0])) as Record<BaseStatKey, number>;;
}

export function getEmptyDerivStats(): Record<DerivedStatKey, number> {
    // Extracts all derived stat keys  
    const derivedKeys = Object.keys(DERIVED_STATS) as DerivedStatKey[];

    // Returns an arrays in which each element is a [key, 0] pair. 
    // Object.fromEntries turns this nested array into an object where each [key, 0] pair becomes a field -> key: 0
    return Object.fromEntries(derivedKeys.map((key: DerivedStatKey) => [key, 0])) as Record<DerivedStatKey, number>;;
}