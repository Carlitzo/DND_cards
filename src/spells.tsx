import { useState, useEffect } from 'react'
import type { SpellDetailProps } from './types';

export default function SpellsContent () {

        const [spells, setSpells] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(false);

        const [currentIndex, setCurrentIndex] = useState(0);
        const [showDetail, setShowDetail] = useState(false);

        const [loadedImageIndices, setLoadedImageIndices] = useState<Set<number>>(new Set());

        useEffect(() => {
                fetch('http://localhost:8888(spells')
                        .then(r => r.json())
                        .then(spellData => {
                                setSpells(spellData);
                                setIsLoading(false);
                        })
                        .catch(error => {
                                setError(true);
                                setIsLoading(false);
                                console.error(error);
                        })
        }, [])

        function markImageAsLoaded(index: number) {
                setLoadedImageIndices(previous => new Set(previous).add(index));
        }

        function goToNextSpell() {
                setCurrentIndex(previous => (previous + 1) % spells.length);
        }

        if (isLoading) return <p>Loading...</p>;
        if (error) return <p>There was an error...</p>;
        if (!spells.length) return <p>No spells found...</p>;

        const visibleAndPreloadedIndices = [0, 1, 2, 3].map(offset => (currentIndex + offset) % spells.length);
        const [activeSpellIndex,
                nextSpellindex,
                firstPreloadIndex,
                secondPreloadIndex
        ] = visibleAndPreloadedIndices;

        const currentSpell = spells[activeSpellIndex];
        console.log(currentSpell);

        const header = (
                <div className="spellHeader">
                        <h2 className="spellTitle">{currentSpell.name}</h2>
                        <h3 className="spellLevel">Spell level: {currentSpell.level}</h3>
                        <div className="spellInfoBriefContainer">
                                <p className="spellInfoBrief">{currentSpell.range}</p>
                                <p className="spellInfoBriefSeparation"></p>
                                <p className="spellInfoBrief">{currentSpell.school_of_magic}</p>
                                <p className="spellInfoBriefSeparation"></p>
                                <p className="spellInfoBrief">Casting time: {currentSpell.casting_time}</p>
                        </div>
                </div>
        )

        if (showDetail) return (
                <div className="spellContainer">
                        {header}
                        <SpellDetail spell={currentSpell}/>
                </div>
        );

        return (
                <div className="spellContainer">
                        {header}
                        <div className="spellImageContainer">
                                <div className="spellImageWrapper" id="spellImage">
                                        {!loadedImageIndices.has(activeSpellIndex) && <div className="spinner"/>}
                                        <img
                                                className={`spellImg ${loadedImageIndices.has(activeSpellIndex) ? 'loaded' : ''}`}
                                                src={}
                                        />
                                </div>
                        </div>
                </div>
        )
}

function SpellDetail({ spell }: SpellDetailProps) {
        return (
                <div></div>
        );
}