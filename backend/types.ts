interface named_describable {
        name: string
        desc: string
}

interface armor_class {
        type: string
        value: number
}

interface stats {
        str: number
        dex: number
        con: number
        int: number
        wis: number
        cha: number
}

interface damage {
        damage_dice: string
        damage_type: {
                index: string
        }
}

interface actions extends named_describable {
        multiattack_type?: string
        actions?: action[]
        damage?: damage[]
}

interface action {
        action_name: string
        count: number
        type: string
}

interface speed {
        walk?: string
        fly?: string
        hover?: string
        swim?: string
        climbing?: string
}

type spell = {
        name: string
        level: number
}

interface special_ability extends named_describable {
        spellcasting?: spell[]
}

interface reaction extends named_describable {}

interface legendary_action extends named_describable {}

export type Monster = {
        name: string
        size: string
        type: string
        alignment: string
        armor_class: armor_class[]
        hp: number
        speed: speed
        stats: stats
        damage_vulnerabilities?: string[],
        damage_resistances?: string[],
        damage_immunities?: string[],
        condition_immunities?: string[],
        darkvision: boolean,
        languages: string | string[],
        challenge_rating: number,
        special_abilities?: special_ability[],
        actions: actions[],
        image: string,
        url: string,
        legendary_actions?: legendary_action[]
        reactions?: reaction[]
}

export type Item = {
        name: string
        category: string
        image: string
        url: string
        rarity: string
        desc: string[]
        attunement?: string
}

export type Spell = {
        name: string
        desc: string[]
        range: string
        components: string[]
        ritual: boolean
        duration: string
        concentration: boolean
        casting_time: string
        level: number
        dc: string
        dc_success: string
        school_of_magic: string
        classes: string[]
        subclasses: string[]
}