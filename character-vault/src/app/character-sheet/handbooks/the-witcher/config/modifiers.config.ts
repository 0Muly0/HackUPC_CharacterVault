import { SocialStandingDef } from "../models/modifier.model";

export const STANDING_MODS = {
    EQ: {
        label: 'Equal',
        description: '',
        modifiers: []
    },
    TOL: {
        label: 'Tolerated',
        description: '',
        modifiers: [
            {
                type: 'skill',
                target: 'Seduction',
                value: -1
            },
            {
                type: 'skill',
                target: 'Charisma',
                value: -1
            },
            {
                type: 'skill',
                target: 'Persuasion',
                value: -1
            },
            {
                type: 'skill',
                target: 'Leadership',
                value: -1
            },

        ]
    },
    FEAR: {
        label: 'Feared',
        description: '',
        modifiers: [
            {
                type: 'skill',
                target: 'Intimidation',
                value: 1
            },
            {
                type: 'skill',
                target: 'Charisma',
                value: -1
            },
        ]
    },
    HATE: {
        label: 'Hated',
        description: '',
        modifiers: [
            {
                type: 'skill',
                target: 'Seduction',
                value: -2
            },
            {
                type: 'skill',
                target: 'Charisma',
                value: -2
            },
            {
                type: 'skill',
                target: 'Persuasion',
                value: -2
            },
            {
                type: 'skill',
                target: 'Leadership',
                value: -2
            },

        ]
    },
} as const satisfies Record<string, SocialStandingDef>;