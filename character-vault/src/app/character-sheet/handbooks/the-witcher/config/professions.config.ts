import { ProfessionDef } from "../models/profession.model";

export const PROFESSIONS = {
    Bard: {
        label: 'Bard',
        description: '',
        skillset: ['Busking', 'ReturnAct', 'RaiseACrowd', 'GoodFriend', 'Fade', 'SpreadTheWord', 'Acclimatize', 'PoisonTheWell', 'Needling', 'EtTuBrute']
    },
    Craftsman: {
        label: 'Craftsman',
        description: '',
        skillset: []
    },
    Criminal: {
        label: 'Criminal',
        description: '',
        skillset: []
    },
    Doctor: {
        label: 'Doctor',
        description: '',
        skillset: []
    },
    Mage: {
        label: 'Mage',
        description: '',
        skillset: []
    },
    ManAtArms: {
        label: 'Man At Arms',
        description: '',
        skillset: []
    },
    Merchant: {
        label: 'Merchant',
        description: '',
        skillset: []
    },
    Priest: {
        label: 'Priest',
        description: '',
        skillset: []
    },
    Witcher: {
        label: 'Witcher',
        description: '',
        skillset: ['WitcherTraining', 'Meditation', 'MagicalSource', 'Heliotrope', 'IronStomach', 'Frenzy', 'Transmutation', 'ParryArrows', 'QuickStrike', 'Whirl']
    },
} as const satisfies Record<string, ProfessionDef>;
export type ProfessionKey = keyof typeof PROFESSIONS;