import React from "react";
import type { Card as CardType } from "./deck"
import "./Card.css";

export type CardStatus = "yours" | "opponent" | "available" | "not-available"

interface CardProps {
  card: CardType
  status: CardStatus
  onClick?: (card: CardType) => void
}

const Card: React.FC<CardProps> = ({ card, status, onClick }) => {
  return (
    <div className={`card-box ${status}`} onClick={() => onClick && onClick(card)}>
      <div className="card-name">{card.name}</div>
      <div className="card-stats">
        <div>Coût: {card.cost}</div>
        <div>Revenu: {card.income}</div>
        <div>Score: {card.score}</div>
        <div>Pollution: {card.pollution}</div>
      </div>
    </div>
  );
};

export default Card;
