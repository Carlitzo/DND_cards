import type { ReactNode } from 'react'
import type { Monster, Item, Spell } from '../backend/types';

export type View = 'menu' | 'monsters' | 'items' | 'spells';

export interface CardProps {
        children: ReactNode;
        onBack?: () => void;
}

export interface MenuProps {
        onSelect: (menu: 'monsters' | 'items' | 'spells') => void;
}

export interface MonsterContentProps {
        onBack: () => void;
}

export interface ItemsContentProps {
        onBack: () => void;
}

export interface SpellsContentProps {
        onBack: () => void;
}

export interface MonsterDetailProps {
        monster: Monster;
}

export interface ItemDetailProps {
        item: Item;
}

export interface SpellDetailProps {
        spell: Spell;
}