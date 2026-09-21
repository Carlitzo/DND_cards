import { useState, useEffect } from 'react'
import type { ItemDetailProps } from "./types";


export default function ItemsContent () {

        const [items, setItems] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        const [error, setError] = useState(false);

        const [currentIndex, setCurrentIndex] = useState(0);
        const [showDetail, setShowDetail] = useState(false);

        const [loadedImageIndices, setLoadedImageIndices] = useState<Set<number>>(new Set());

        useEffect(() => {
                fetch('http://localhost:8888/items')
                        .then(r => r.json())
                        .then(itemData => {
                                setItems(itemData)
                                setIsLoading(false)
                                console.log(itemData);
                        })
                        .catch(error => {
                                setError(true);
                                setIsLoading(false);
                                console.error(error);
                        })
        }, []);

        function markImageAsLoaded(index: number) {
                setLoadedImageIndices(previous => new Set(previous).add(index));
        }

        function goToNextItem() {
                setCurrentIndex(previous => (previous + 1) % items.length)
        }

        if (isLoading) return <p>Loading...</p>;
        if (error) return <p>There was an error...</p>;
        if (!items.length) return <p>No items found...</p>;
        
        const visibleAndPreloadedIndices = [0, 1, 2, 3].map(offset => (currentIndex + offset) % items.length);
        const [activeItemIndex,
                nextItemIndex,
                firstPreloadIndex,
                secondPreloadIndex
        ] = visibleAndPreloadedIndices; // deconstructs the visibleAndPreloadedIndices array and saves them as variables.
        
        const currentItem = items[activeItemIndex];
        console.log(currentItem);

        const header = (
                <div className="itemHeader">
                        <h2 className="itemTitle">{currentItem.name}</h2>
                        <div className="itemInfoBriefContainer">
                                <p className="itemInfoBrief">{currentItem.category}</p>
                                <p className="itemInfoBriefSeparation"></p>
                                <p className="itemInfoBrief">{currentItem.attunement}</p>
                                <p className="itemInfoBriefSeparation"></p>
                                <p className="itemInfoBrief">Rarity: {currentItem.rarity}</p>
                        </div>
                </div>
        );

        console.log(showDetail);

        if (showDetail) return (
                <div className="itemContainer">
                        {header}
                        <ItemDetail item={currentItem}/>
                </div>
        );

        return (
                <div className="itemContainer"> 
                        {header}
                        <div className="itemImageContainer">
                                <div className="itemImageWrapper" id="itemImage">
                                        {!loadedImageIndices.has(activeItemIndex) && <div className="spinner"/>}
                                        <img
                                                className={`itemImg ${loadedImageIndices.has(activeItemIndex) ? 'loaded' : ''}`}  
                                                src={items[activeItemIndex].image}
                                                onLoad={() => markImageAsLoaded(activeItemIndex)}
                                                onClick={() => setShowDetail(true)}
                                        />
                                </div>
                                <div className="itemImageWrapper" id="itemImageNext">
                                        <img
                                                className={`itemImg ${loadedImageIndices.has(nextItemIndex) ? 'loaded' : ''}`}
                                                src={items[nextItemIndex].image}
                                                onLoad={() => markImageAsLoaded(nextItemIndex)}
                                                onClick={goToNextItem}
                                        />
                                </div>
                        </div>

                        <img
                                className="preloadHidden"
                                src={items[firstPreloadIndex].image}
                                alt=""
                                onLoad={() => markImageAsLoaded(firstPreloadIndex)}
                        />
                        <img
                                className="preloadHidden"
                                src={items[secondPreloadIndex].image}
                                alt=""
                                onLoad={() => markImageAsLoaded(secondPreloadIndex)}
                        />
                </div>

                
        )
}

function ItemDetail({item }: ItemDetailProps) {
        return (
                <div className="itemDetailContainer">

                </div>
        )
}