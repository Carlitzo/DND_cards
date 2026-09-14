import { useState } from 'react'
import type { SpellsContentProps } from './types';

export default function SpellsContent () {

        const [spells, setSpells] = useState([]);
        const [isLoading, setIsLoading] = useState(true);

        return <div></div>;
}