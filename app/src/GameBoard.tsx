import React from 'react'
import type { Card as CardType } from "./deck"
import Card from './Card'
import "./GameBoard.css"

interface GameBoardProps {
    cards: Array<CardType>
}

const GameBoard: React.FC<GameBoardProps> = ({ cards }) => {
    return (
        <div className={`game-board ${cards.length === 0 ? 'empty': ''}`}>
            {cards.length === 0 ? (
                <p>Aucun carte sur le plateau</p>
            ) : cards.map(card => (
                <Card key={card.id} card={card} status="board" />
            ))}
        </div>
    );
}

export default GameBoard;