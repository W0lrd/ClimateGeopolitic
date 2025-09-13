import React from 'react'
import type { Card as CardType } from "./deck"
import Card, { CardStatus } from './Card'
import "./GameBoard.css"

interface GameBoardProps {
    cards: Array<CardType>
    status: CardStatus
}

const GameBoard: React.FC<GameBoardProps> = ({ cards, status }) => {
    return (
        <div className="game-board">
            {cards.map(card => (
                <Card key={card.id} card={card} status={status} />
            ))}
        </div>
    );
}

export default GameBoard;