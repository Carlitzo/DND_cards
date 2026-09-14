import { useState } from 'react'
import { Card } from './card'
import type { MenuProps } from './types';

export function Menu({ onSelect }: MenuProps) {

        return (
                <>
                        <div className="menuItem" tabIndex={0} onClick={() => onSelect('monsters')}>Monsters</div>
                        <div className="menuItem" tabIndex={0} onClick={() => onSelect('items')}>Items</div>
                        <div className="menuItem" tabIndex={0} onClick={() => onSelect('spells')}>Spells</div>
                </>
        );
}