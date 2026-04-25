import { SkillDef } from "../models/skill.model";
import { ProfessionKey, PROFESSIONS } from "./professions.config";

export const BASE_SKILLS = {
    // INTELLIGENCE 
    Awareness: {
        stat: 'INT',
        label: 'Awareness',
        description: 'Noticing things or spotting abnormalities in your environment',
        weight: 1
    },
    Business: {
        stat: 'INT',
        label: 'Business',
        description: 'Starting and operating a business',
        weight: 1
    },
    Deduction: {
        stat: 'INT',
        label: 'Deduction',
        description: 'The skill of deducing a conclusion from clues given to you',
        weight: 1
    },
    Education: {
        stat: 'INT',
        label: 'Education',
        description: 'The level of formal education you have received',
        weight: 1
    },
    Language: {
        stat: 'INT',
        label: 'Language',
        description: 'Skill in speaking the specified language',
        weight: 2
    },
    MonsterLore: {
        stat: 'INT',
        label: 'Monster Lore',
        description: 'Skill in discerning information about monsters',
        weight: 2
    },
    SocialEtiquette: {
        stat: 'INT',
        label: 'Social Etiquette',
        description: 'Blending in at social functions and not making a fool of yourself in polite company',
        weight: 1
    },
    Streetwise: {
        stat: 'INT',
        label: 'Streetwise',
        description: 'Knowing the streets and how certain areas operate',
        weight: 1
    },
    Tactics: {
        stat: 'INT',
        label: 'Tactics',
        description: 'Anticipating enemy movements and planning accordingly',
        weight: 2
    },
    Teaching: {
        stat: 'INT',
        label: 'Teaching',
        description: 'The skill of explaining to others',
        weight: 1
    },
    WildernessSurival: {
        stat: 'INT',
        label: 'Wilderness Survival',
        description: 'Surviving outdoors and tracking a prey',
        weight: 1
    },

    // REFLEX
    Brawling: {
        stat: 'REF',
        label: 'Brawling',
        description: 'The skill of fighting hand to hand with fists, feet and the like',
        weight: 1
    },
    DodgeEscape: {
        stat: 'REF',
        label: 'Dodge/Escape',
        description: 'Dodging attacks and missiles and escaping from holds and grapples',
        weight: 1
    },
    Melee: {
        stat: 'REF',
        label: 'Melee',
        description: 'Using weapons such as whips, bludgeons and axes',
        weight: 1
    },
    SmallBlades: {
        stat: 'REF',
        label: 'SmallBlades',
        description: 'Using light weapons such as daggers and cleavers',
        weight: 1
    },
    StaffSpear: {
        stat: 'REF',
        label: 'Staff/Spear',
        description: 'Using long weapons such as staves, pole axes and spears',
        weight: 1
    },
    Swordsmanship: {
        stat: 'REF',
        label: 'Swordsmanship',
        description: 'Using swords',
        weight: 1
    },
    Riding: {
        stat: 'REF',
        label: 'Riding',
        description: 'Riding horses, and in some cases other animals or even monsters',
        weight: 1
    },
    Sailing: {
        stat: 'REF',
        label: 'Sailing',
        description: 'Sailing ships and controlling maritime vessels',
        weight: 1
    },

    // DEXTERITY
    Athletics: {
        stat: 'DEX',
        label: 'Athletics',
        description: 'The skill required for climbing, balancing, throwing weapons and such',
        weight: 1
    },
    Archery: {
        stat: 'DEX',
        label: 'Archery',
        description: 'Firing a bow and arrow',
        weight: 1
    },
    Crossbow: {
        stat: 'DEX',
        label: 'Crossbow',
        description: 'Firing a crossbow',
        weight: 1
    },
    SleightOfHand: {
        stat: 'DEX',
        label: 'Sleight Of Hand',
        description: 'Performing stage magic tricks, making small things disappear or appear, pickpocketing and slipping things into people\'s pockets',
        weight: 1
    },
    Stealth: {
        stat: 'DEX',
        label: 'Stealth',
        description: 'Moving silently through your surroundings and acting without being perceived',
        weight: 1
    },

    //BODY
    Physique: {
        stat: 'BODY',
        label: 'Physique',
        description: 'Lifting, tearing and bending heavy and tough objects',
        weight: 1
    },
    Endurance: {
        stat: 'BODY',
        label: 'Endurance',
        description: 'Enduring fatigue, or the pain of torture and drugs',
        weight: 1
    },

    // EMPATHY
    Charisma: {
        stat: 'EMP',
        label: 'Charisma',
        description: 'Getting along with people',
        weight: 1
    },
    Deceit: {
        stat: 'EMP',
        label: 'Deceit',
        description: 'Lying and conniving',
        weight: 1
    },
    Persuasion: {
        stat: 'EMP',
        label: 'Persuasion',
        description: '',
        weight: 1
    },
    Leadership: {
        stat: 'EMP',
        label: 'Leadership',
        description: '',
        weight: 1
    },
    Seduction: {
        stat: 'EMP',
        label: 'Seduction',
        description: '',
        weight: 1
    },
    FineArts: {
        stat: 'EMP',
        label: 'Fine Arts',
        description: 'Creating works of art, from painting to song writing to glass-working',
        weight: 1
    },
    Performance: {
        stat: 'EMP',
        label: 'Performance',
        description: '',
        weight: 1
    },
    Gambling: {
        stat: 'EMP',
        label: 'Gambling',
        description: '',
        weight: 1
    },
    GroomingStyle: {
        stat: 'EMP',
        label: 'Grooming & Style',
        description: '',
        weight: 1
    },
    HumanPerception: {
        stat: 'EMP',
        label: 'Human Perception',
        description: '',
        weight: 1
    },

    // CRAFT
    Alchemy: {
        stat: 'CRA',
        label: 'Alchemy',
        description: '',
        weight: 2
    },
    Forgery: {
        stat: 'CRA',
        label: 'Forgery',
        description: '',
        weight: 1
    },
    Crafting: {
        stat: 'CRA',
        label: 'Crafting',
        description: '',
        weight: 2
    },
    Disguise: {
        stat: 'CRA',
        label: 'Disguise',
        description: '',
        weight: 1
    },
    TrapCrafting: {
        stat: 'CRA',
        label: 'Trap Crafting',
        description: '',
        weight: 2
    },
    FirstAid: {
        stat: 'CRA',
        label: 'First Aid',
        description: '',
        weight: 1
    },
    PickLock: {
        stat: 'CRA',
        label: 'Pick Lock',
        description: '',
        weight: 1
    },

    // WILL
    Courage: {
        stat: 'WILL',
        label: 'Courage',
        description: '',
        weight: 1
    },
    HexWeaving: {
        stat: 'WILL',
        label: 'Hex Weaving',
        description: '',
        weight: 2
    },
    SpellCasting: {
        stat: 'WILL',
        label: 'Spell Casting',
        description: '',
        weight: 2
    },
    RitualCrafting: {
        stat: 'WILL',
        label: 'Ritual Crafting',
        description: '',
        weight: 2
    },
    ResistMagic: {
        stat: 'WILL',
        label: 'Resist Magic',
        description: '',
        weight: 2
    },
    ResistCoertion: {
        stat: 'WILL',
        label: 'Resist Coertion',
        description: '',
        weight: 1
    },
    Intimidation: {
        stat: 'WILL',
        label: 'Intimidation',
        description: '',
        weight: 1
    },
} as const satisfies Record<string, SkillDef>;
export type BaseSkillKey = keyof typeof BASE_SKILLS;

export const PROF_SKILLS = {
    //Bard
    Busking: {
        profession: 'Bard',
        stat: 'EMP',
        label: 'Busking',
        description: '',
        weight: 1,
        predecessor: null,
        successor: ['ReturnAct', 'Fade', 'PoisonTheWell']
    },
    ReturnAct: {
        profession: 'Bard',
        stat: 'EMP',
        label: 'Return Act',
        description: '',
        weight: 1,
        predecessor: 'Busking',
        successor: ['RaiseACrowd']
    },
    RaiseACrowd: {
        profession: 'Bard',
        stat: 'EMP',
        label: 'Raise A Crowd',
        description: '',
        weight: 1,
        predecessor: 'ReturnAct',
        successor: [],
    },
    GoodFriend: {
        profession: 'Bard',
        stat: 'EMP',
        label: 'Good Friend',
        description: '',
        weight: 1,
        predecessor: 'RaiseACrowd',
        successor: []
    },
    Fade: {
        profession: 'Bard',
        stat: 'INT',
        label: 'Fade',
        description: '',
        weight: 1,
        predecessor: 'Busking',
        successor: ['SpreadTheWord']
    },
    SpreadTheWord: {
        profession: 'Bard',
        stat: 'INT',
        label: 'Spread The Word',
        description: '',
        weight: 1,
        predecessor: 'Fade',
        successor: ['Acclimatize']
    },
    Acclimatize: {
        profession: 'Bard',
        stat: 'INT',
        label: 'Acclimatize',
        description: '',
        weight: 1,
        predecessor: 'SpreadTheWord',
        successor: []
    },
    PoisonTheWell: {
        profession: 'Bard',
        stat: 'EMP',
        label: 'Poison The Well',
        description: '',
        weight: 1,
        predecessor: 'Busking',
        successor: ['Needling']
    },
    Needling: {
        profession: 'Bard',
        stat: 'EMP',
        label: 'Needling',
        description: '',
        weight: 1,
        predecessor: 'PoisonTheWell',
        successor: ['EtTuBrute']
    },
    EtTuBrute: {
        profession: 'Bard',
        stat: 'EMP',
        label: 'Et Tu Brute',
        description: '',
        weight: 1,
        predecessor: 'Needling',
        successor: []
    },
    WitcherTraining: {
        profession: 'Witcher',
        stat: 'INT',
        label: 'Witcher Training',
        description: '',
        weight: 1,
        predecessor: null,
        successor: ['Mediation', 'IronStomach', 'ParryArrows']
    }, 
    Meditation: {
        profession: 'Witcher',
        stat: null,
        label: 'Meditation',
        description: '',
        weight: 1,
        predecessor: 'WitcherTraining',
        successor: ['MagicalSource']
    }, 
    MagicalSource: {
        profession: 'Witcher',
        stat: null,
        label: 'Magical Source',
        description: '',
        weight: 1,
        predecessor: 'Meditation',
        successor: ['Heliotrope']
    }, 
    Heliotrope: {
        profession: 'Witcher',
        stat: 'WILL',
        label: 'Heliotrope',
        description: '',
        weight: 1,
        predecessor: 'MagicalSource',
        successor: []
    }, 
    IronStomach: {
        profession: 'Witcher',
        stat: null,
        label: 'Iron Stomach',
        description: '',
        weight: 1,
        predecessor: 'WitcherTraining',
        successor: ['Frenzy']
    }, 
    Frenzy: {
        profession: 'Witcher',
        stat: null,
        label: 'Frenzy',
        description: '',
        weight: 1,
        predecessor: 'IronStomach',
        successor: ['Transmutation']
    },  
    Transmutation: {
        profession: 'Witcher',
        stat: 'BODY',
        label: 'Transmutation',
        description: '',
        weight: 1,
        predecessor: 'Frenzy',
        successor: []
    },
    ParryArrows: {
        profession: 'Witcher',
        stat: 'DEX',
        label: 'Parry Arrows',
        description: '',
        weight: 1,
        predecessor: 'WitcherTraining',
        successor: ['QuickStrike']
    },
    QuickStrike: {
        profession: 'Witcher',
        stat: 'REF',
        label: 'Quick Strike',
        description: '',
        weight: 1,
        predecessor: 'ParryArrows',
        successor: ['Whirl']
    }, 
    Whirl: {
        profession: 'Witcher',
        stat: 'REF',
        label: 'Whirl',
        description: '',
        weight: 1,
        predecessor: 'QuickStrike',
        successor: []
    }
} as const;
export type ProfSkillKey = keyof typeof PROF_SKILLS;

export const PK_MODIF: number[] = [-4, -2, 0, 2, 4, 6, 8];

export function getEmptyBaseSkills(): Record<BaseSkillKey, number> {
    // Extracts all base skills keys  
    const baseKeys = Object.keys(BASE_SKILLS) as BaseSkillKey[];

    // Returns an arrays in which each element is a [key, 0] pair. 
    // Object.fromEntries turns this nested array into an object where each [key, 0] pair becomes a field -> key: 0
    return Object.fromEntries(baseKeys.map((key: BaseSkillKey) => [key, 0])) as Record<BaseSkillKey, number>;
}

export function getEmptyProfessionSkills(profession: ProfessionKey): Record<ProfSkillKey, number> {
    // Extracts all skills from the profession
    const profKeys = PROFESSIONS[profession].skillset as ProfSkillKey[];

    // Returns an arrays in which each element is a [key, 0] pair. 
    // Object.fromEntries turns this nested array into an object where each [key, 0] pair becomes a field -> key: 0
    return Object.fromEntries(profKeys.map((key: ProfSkillKey) => [key, 0])) as Record<ProfSkillKey, number>;
}
