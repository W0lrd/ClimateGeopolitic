import React from 'react'
import type { Card as CardType } from "./deck"
import Card from './Card'
import "./GameBoard.css"
import Background from './Background'
import { useAppSelector } from './app/hooks'
import { selectGlobalPollution } from './app/gameSlice'
import { MAX_GLOBAL_POLLUTION } from './app/settings'

interface GameBoardProps {
    cards: Array<CardType>
    isVisible?: boolean
}

const GameBoard: React.FC<GameBoardProps> = ({ cards, isVisible }) => {
    const globalPollution = useAppSelector(selectGlobalPollution)
    const pollutionRate = Math.min(Math.log(globalPollution + 1) / Math.log(MAX_GLOBAL_POLLUTION + 1), 1.0)
    return (
        <div className={`game-board ${cards.length === 0 ? 'empty': ''} ${isVisible ? 'visible' : 'hidden'}`}>
            <Background pollutionRate={pollutionRate} />
            {cards.map(card => (
                <Card key={card.id} card={card} status="board" />
            ))}
        </div>
    );
}

export default GameBoard;