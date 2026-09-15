import type { Monster } from './../backend/types'
import type { MonsterDetailProps } from './types';
import { useState, useEffect } from 'react'

export default  function MonsterContent () {

        const [monsters, setMonsters] = useState<Monster[]>([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(false);

        const [currentIndex, setCurrentIndex] = useState(0);
        const [showDetail, setShowDetail] = useState(false);

        const [loadedImageIndices, setLoadedImageIndices] = useState<Set<number>>(new Set());

        useEffect(() => {
                // borde göra en check här som kollar om monsterData finns samt cachea monsterData
                fetch('http://localhost:8888/monsters')
                        .then(r => r.json())
                        .then(monsterData => {
                                setMonsters(monsterData)
                                setIsLoading(false)
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

        function goToNextMonster() {
                setCurrentIndex(previous => (previous + 1) % monsters.length)
        }

        if (isLoading) return <p>Loading...</p>;
        if (error) return <p>There was an error...</p>;
        if (!monsters.length) return <p>No monsters found...</p>;
        
        const visibleAndPreloadedIndices = [0, 1, 2, 3].map(offset => (currentIndex + offset) % monsters.length);
        const [activeMonsterIndex,
                nextMonsterIndex,
                firstPreloadIndex,
                secondPreloadIndex
        ] = visibleAndPreloadedIndices; // deconstructs the visibleAndPreloadedIndices array and saves them as variables.
        
        const currentMonster = monsters[activeMonsterIndex];
        console.log(currentMonster);

        const currentMonsterType = (currentMonster.type.charAt(0).toUpperCase() + currentMonster.type.slice(1));
        
        const header = (
                <div className="monsterHeader">
                                <h2 className="monsterTitle">{currentMonster.name}</h2>
                                <h3 className="CR">CR: {currentMonster.challenge_rating}</h3>
                                <div className="monsterInfoBriefContainer">
                                        <p className="monsterInfoBrief">{currentMonsterType}</p>
                                        <p className="monsterInfoBriefSeparation"></p>
                                        <p className="monsterInfoBrief">{currentMonster.size}</p>
                                        <p className="monsterInfoBriefSeparation"></p>
                                        <p className="monsterInfoBrief">Hit-Points: {currentMonster.hp}</p>
                                </div>
                        </div>
        );

        if (showDetail) return (
                <div className="monsterContainer">
                        {header}
                        <MonsterDetail monster={currentMonster}/>
                </div>
        );
        
        return (
                <div className="monsterContainer">
                        {header}
                        <div className="monsterImageContainer">
                                <div className="monsterImageWrapper" id="monsterImage">
                                        {!loadedImageIndices.has(activeMonsterIndex) && <div className="spinner" />}
                                        <img
                                                className={`monsterImg ${loadedImageIndices.has(activeMonsterIndex) ? 'loaded' : ''}`}
                                                src={monsters[activeMonsterIndex].image} 
                                                onLoad={() => markImageAsLoaded(activeMonsterIndex)}
                                                onClick={() => setShowDetail(true)}
                                        />
                                </div>
                                <div className="monsterImageWrapper" id="monsterImageNext">
                                        <img
                                                className={`monsterImg ${loadedImageIndices.has(nextMonsterIndex) ? 'loaded' : ''}`}
                                                src={monsters[nextMonsterIndex].image}
                                                onLoad={() => markImageAsLoaded(nextMonsterIndex)}
                                                onClick={goToNextMonster}
                                        />
                                </div>
                        </div>

                        <img
                                className="preloadHidden"
                                src={monsters[firstPreloadIndex].image}
                                alt=""
                                onLoad={() => markImageAsLoaded(firstPreloadIndex)}
                        />
                        <img
                                className="preloadHidden"
                                src={monsters[secondPreloadIndex].image}
                                alt=""
                                onLoad={() => markImageAsLoaded(secondPreloadIndex)}
                        />
                </div>
        )
}

function MonsterDetail({ monster }: MonsterDetailProps) {
        return (
                <div className="monsterDetailContainer">
                        <div className="monsterDetailContainerTop">
                                <div className="basicInfoContainer">

                                </div>
                                <div className="statsContainer">

                                </div>
                                <div className="imageContainer">

                                </div>
                        </div>
                        <div className="monsterDetailContainerBottom">
                                <h2 className="actions">Actions:</h2>
                                <div className="actionsContainer">
                                        {monster.actions.map((action, index) => {return (
                                                <div className="actionContainer" key={index}>
                                                        <ul className="actionUl">
                                                                <li className="actionLi" key={index}>
                                                                        <div className="actionRow">
                                                                                <p className="actionName">
                                                                                        {action.name}
                                                                                </p>
                                                                                <span className="actionDesc">{action.desc}</span>
                                                                        </div>
                                                                </li>
                                                        </ul>
                                                </div>
                                        )})}
                                </div>
                                {monster.special_abilities && (
                                        <>
                                        <h2 className="specialAbilites">Special Abilities:</h2>
                                        <div className="specialAbilitiesContainer">
                                                {monster.special_abilities.map((ability, index) => {return (
                                                        <div className="specialAbilityContainer" key={index}>
                                                                <ul className="specialAbilityUl">
                                                                        <li className="specialAbilityLi" key={index}>
                                                                                <div className="specialAbilityRow">
                                                                                        <p className="specialAbilityName">
                                                                                                {ability.name}
                                                                                        </p>
                                                                                        <span className="specialAbilityDesc">{ability.desc}</span>
                                                                                </div>
                                                                        </li>
                                                                </ul>
                                                        </div>
                                                )})}
                                        </div>
                                        </>
                                )}
                                {monster.legendary_actions && (
                                        <>
                                        <h2 className="legendaryActions">Legendary Actions:</h2>
                                        <div className="legendaryActionsContainer">
                                                {monster.legendary_actions.map((legendary_action, index) => {return (
                                                        <div className="legendaryActionContainer" key={index}>
                                                                <ul className="legendaryActionUl">
                                                                        <li className="legendaryActionLi" key={index}>
                                                                                <div className="legendaryActionRow">
                                                                                        <p className="legendaryActionName">
                                                                                                {legendary_action.name}
                                                                                        </p>
                                                                                        <span className="legendaryActionDesc">{legendary_action.desc}</span>
                                                                                </div>
                                                                        </li>
                                                                </ul>
                                                        </div>
                                                )})}
                                        </div>
                                        </>
                                )}
                        </div>
                </div>
        )
}