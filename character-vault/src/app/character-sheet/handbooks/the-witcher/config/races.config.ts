import { RaceDef } from "../models/race.model";

export const RACES = {
    Witcher: {
        label: 'Witcher',
        description: 'The one that kills monsters',
        perks: [
            {
                label: 'Enhanced Senses',
                description: 'No penalties from areas of dim light; \n Can track things by scent alone; \n Awareness +1; \n',
                modifiers: [
                    { type: 'skill', target: 'Awareness', value: 1 }
                ]
            },
            {
                label: 'Resilient Mutation',
                description: 'Immunity to diseases; \n Able to use mutagens;',
                modifiers: []
            },
            {
                label: 'Dulled Emotions',
                description: 'No courage checks against Intimidation; \n EMP -4; \n minimum EMP 1, maximum EMP 6;',
                modifiers: [
                    { type: 'stat', target: 'EMP', value: -4 }
                ]
            },
            {
                label: 'Lightning Reflexes',
                description: 'REF +4; \n DEX +1;',
                modifiers: [
                    { type: 'stat', target: 'REF', value: 1 },
                    { type: 'stat', target: 'DEX', value: 1 }
                ]
            },
        ],
        hasMagic: true,
        hasFixedProfession: true,
    },
    Human: {
        label: 'Human',
        description: 'The one without pointy ears',
        perks: [
            {
                label: 'Thrustworthy',
                description: 'Against humans: \n Charisma +1; \n Seduction +1 \n Persuasion +1;',
                modifiers: [
                    { type: 'skill', target: 'Charisma', value: 1 },
                    { type: 'skill', target: 'Seduction', value: 1 },
                    { type: 'skill', target: 'Persuasion', value: 1 }
                ]
            },
            {
                label: 'Ingenuity',
                description: 'Deduction +1;',
                modifiers: [
                    { type: 'skill', target: 'Deduction', value: 1 },
                ]
            },
            {
                label: 'Blindly Stubborn',
                description: '3 times per game session, once per dice roll, you can reroll a failed Resist Coertion or Courage roll. Take the highest value;',
                modifiers: []
            }
        ],
        hasMagic: true,
        hasFixedProfession: false
    },
    Elf: {
        label: 'Elf',
        description: 'The one with pointy ears',
        perks: [
            {
                label: 'Artistic',
                description: 'Fine Arts +1;',
                modifiers: [
                    { type: 'skill', target: 'FineArts', value: 1 }
                ]
            },
            {
                label: 'Marksman',
                description: 'Draw and string a bow without using an action; \n Archery +2;',
                modifiers: [
                    { type: 'skill', target: 'Archery', value: 2 }
                ]
            },
            {
                label: 'Natural Attunement',
                description: 'Any beast encountered is considered friendly and will not attacked unless provoked; \n Automatically find plants rated as commonly available (or lower), as long as on the right terrain;',
                modifiers: []
            }
        ],
        hasMagic: true,
        hasFixedProfession: false,
    },
    Dwarf: {
        label: 'Dwarf',
        description: 'The short one',
        perks: [
            {
                label: 'Tough',
                description: 'Base stopping power (SP): 2;',
                modifiers: [

                ]
            },
            {
                label: 'Strong',
                description: 'Physique +1; \n Encumberance +25;',
                modifiers: [
                    { type: 'skill', target: 'Physique', value: 1}
                ]
            },
            {
                label: 'Crafter\'s Eye',
                description: 'Business +1;',
                modifiers: [
                    { type: 'skill', target: 'Business', value: 1}
                ]
            }
        ],
        hasMagic: false,
        hasFixedProfession: false,
    }
} as const satisfies Record<string, RaceDef>;
export type RaceKey = keyof typeof RACES;