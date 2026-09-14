import type { CardProps } from './types'

export function Card ({ children, onBack }: CardProps) {
        return (
                <div className="card">
                        <div id="cardHeader">
                                <img src="./src/assets/dragon.png" alt="icon of a dragon" id="mainIcon" />
                                {onBack && (
                                        <button className="cardButton" onClick={onBack}>←</button>
                                )}
                        </div>
                        <div className="cardContent">
                                {children}
                        </div>
                </div>
        )
}